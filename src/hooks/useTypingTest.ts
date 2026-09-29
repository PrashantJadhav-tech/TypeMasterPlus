import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';

export type TestStatus = 'idle' | 'running' | 'finished';

export type TypingStats = {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  correctWords: number;
  wrongWords: number;
  timeElapsed: number;
};

export function useTypingTest(
  text: string,
  duration: number,
  testType: string = 'practice',
  passageTitle: string = ''
) {
  const { settings } = useSettings();

  const [input, setInput] = useState('');
  const [status, setStatus] = useState<TestStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(duration);

  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    totalKeystrokes: 0,
    correctWords: 0,
    wrongWords: 0,
    timeElapsed: 0,
  });

  const timerRef = useRef<number | null>(null);
  const savedRef = useRef(false);

  // --------------------------------------------------
  // RESET TEST
  // --------------------------------------------------

  const reset = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    savedRef.current = false;

    setInput('');
    setStatus('idle');
    setTimeLeft(duration);

    setStats({
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalKeystrokes: 0,
      correctWords: 0,
      wrongWords: 0,
      timeElapsed: 0,
    });
  }, [duration]);

  useEffect(() => {
    reset();
  }, [text, duration, reset]);

  // --------------------------------------------------
  // FINISH TEST
  // --------------------------------------------------

  const finishTest = useCallback(() => {
    setStatus('finished');

    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // --------------------------------------------------
  // SAVE RESULT TO SUPABASE
  // --------------------------------------------------

  useEffect(() => {
    if (status !== 'finished') return;
    if (savedRef.current) return;

    const saveResult = async () => {
      savedRef.current = true;

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error('ERROR GETTING USER:', userError);
          savedRef.current = false;
          return;
        }

        if (!user) {
          console.error('NO LOGGED-IN USER. RESULT NOT SAVED.');
          savedRef.current = false;
          return;
        }

        console.log('Logged-in user:', user.id);

        const resultData = {
          user_id: user.id,

          wpm: Number(stats.wpm),
          accuracy: Number(stats.accuracy),

          correct_chars: Number(stats.correctChars),
          incorrect_chars: Number(stats.incorrectChars),
          total_keystrokes: Number(stats.totalKeystrokes),

          correct_words: Number(stats.correctWords),
          wrong_words: Number(stats.wrongWords),

          time_elapsed: Number(stats.timeElapsed),
          test_duration: Number(duration),

          test_type: testType || 'practice',

          passage_title:
            passageTitle && passageTitle.trim() !== ''
              ? passageTitle
              : null,
        };

        console.log('SENDING HISTORY DATA:', resultData);

        const { data, error } = await supabase
          .from('typing_history')
          .insert(resultData)
          .select()
          .single();

        if (error) {
          console.error('FAILED TO SAVE TYPING HISTORY');
          console.error('MESSAGE:', error.message);
          console.error('DETAILS:', error.details);
          console.error('HINT:', error.hint);
          console.error('CODE:', error.code);
          console.error('FULL ERROR:', error);

          savedRef.current = false;
          return;
        }

        console.log('TYPING HISTORY SAVED SUCCESSFULLY:', data);
      } catch (error) {
        console.error(
          'UNEXPECTED ERROR WHILE SAVING HISTORY:',
          error
        );

        savedRef.current = false;
      }
    };

    saveResult();
  }, [
    status,
    stats,
    duration,
    testType,
    passageTitle,
  ]);

  // --------------------------------------------------
  // START TIMER
  // --------------------------------------------------

  const startTimer = useCallback(() => {
    if (timerRef.current !== null) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          setStatus('finished');
          return 0;
        }

        return prev - 1;
      });

      setStats((prev) => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
      }));
    }, 1000);
  }, []);

  // --------------------------------------------------
  // HANDLE TYPING
  // --------------------------------------------------

  const handleInput = useCallback(
    (value: string) => {
      if (status === 'finished') return;

      if (status === 'idle') {
        setStatus('running');
        startTimer();
      }

      let val = value;

      // Backspace disabled
      if (!settings.backspaceEnabled && val.length < input.length) {
        return;
      }

      // Strict spacebar mode
      if (settings.strictSpacebarErrors) {
        const currentIndex = val.length - 1;

        if (
          currentIndex >= 0 &&
          currentIndex < text.length &&
          val[currentIndex] === ' ' &&
          text[currentIndex] !== ' '
        ) {
          val =
            val.substring(0, currentIndex) +
            text[currentIndex];
        }
      }

      setInput(val);

      // ----------------------------------------------
      // Calculate statistics
      // ----------------------------------------------

      const typedChars = Array.from(val);
      const targetChars = Array.from(text);

      let correctChars = 0;
      let incorrectChars = 0;

      typedChars.forEach((char, index) => {
        if (char === targetChars[index]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      });

      const totalKeystrokes =
        correctChars + incorrectChars;

      const accuracy =
        totalKeystrokes > 0
          ? (correctChars / totalKeystrokes) * 100
          : 100;

      const elapsedSeconds =
        duration - timeLeft;

      const elapsedMinutes =
        elapsedSeconds > 0
          ? elapsedSeconds / 60
          : 0;

      const wpm =
        elapsedMinutes > 0
          ? (correctChars / 5) / elapsedMinutes
          : 0;

      // ----------------------------------------------
      // Word statistics
      // ----------------------------------------------

      const typedWords = val.trim()
        ? val.trim().split(/\s+/)
        : [];

      const targetWords = text.trim()
        ? text.trim().split(/\s+/)
        : [];

      let correctWords = 0;
      let wrongWords = 0;

      typedWords.forEach((word, index) => {
        if (word === targetWords[index]) {
          correctWords++;
        } else {
          wrongWords++;
        }
      });

      setStats({
        wpm: Math.round(wpm * 100) / 100,
        accuracy:
          Math.round(accuracy * 100) / 100,
        correctChars,
        incorrectChars,
        totalKeystrokes,
        correctWords,
        wrongWords,
        timeElapsed: elapsedSeconds,
      });

      // ----------------------------------------------
      // Typing sound
      // ----------------------------------------------

      if (settings.typingSound) {
        try {
          const audio = new Audio(
            '/sounds/typing.mp3'
          );

          audio.volume = 0.2;
          audio.play().catch(() => {});
        } catch {
          // Ignore audio errors
        }
      }

      // ----------------------------------------------
      // Finish when passage completed
      // ----------------------------------------------

      if (val === text) {
        setStatus('finished');

        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    },
    [
      status,
      startTimer,
      settings,
      input,
      text,
      duration,
      timeLeft,
    ]
  );

  // --------------------------------------------------
  // CLEANUP TIMER
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

  return {
    input,
    setInput,
    status,
    setStatus,
    timeLeft,
    stats,
    handleInput,
    reset,
    finishTest,
  };
}