import { useState, useEffect, useCallback, useRef } from 'react';
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

export function useTypingTest(text: string, duration: number) {
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

  // Reset test
  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

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

  // Finish test
  const finishTest = useCallback(() => {
    setStatus('finished');

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Force start
  const forceStart = useCallback(() => {
    if (status === 'idle') {
      setStatus('running');
    }
  }, [status]);

  // Timer
  useEffect(() => {
    if (status !== 'running') return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, finishTest]);

  // Handle typing
  const handleInput = useCallback(
    (val: string) => {
      if (status === 'finished') return;

      const isBackspace = val.length < input.length;

      // Backspace setting
      if (isBackspace && !settings.backspaceEnabled) {
        return;
      }

      /*
       * IMPORTANT:
       * Do NOT block Unicode / Marathi typing.
       *
       * Marathi keyboards and IME can produce Unicode
       * characters and intermediate composition values.
       */

      // Allow typing even when autoStart setting is OFF.
      // First character automatically starts the timer.
      if (status === 'idle' && val.length > 0) {
        setStatus('running');
      }

      // Spacebar error setting
      if (!isBackspace && !settings.spacebarError) {
        const charTyped = val[val.length - 1];
        const charExpected = text[val.length - 1];

        if (charTyped === ' ' && charExpected !== ' ') {
          return;
        }
      }

      // Audio
      if (!isBackspace && val.length > 0) {
        const charTyped = val[val.length - 1];
        const charExpected = text[val.length - 1];

        if (charTyped === charExpected && settings.typingSound) {
          playSound('correct');
        } else if (
          charTyped !== charExpected &&
          settings.errorSound
        ) {
          playSound('error');
        }
      }

      setInput(val);

      // Character statistics
      let correct = 0;
      let incorrect = 0;

      /*
       * Array.from() is used instead of split('')
       * so Unicode / Marathi characters are handled better.
       */
      const typedChars = Array.from(val);
      const targetChars = Array.from(text);

      for (let i = 0; i < typedChars.length; i++) {
        if (typedChars[i] === targetChars[i]) {
          correct++;
        } else {
          incorrect++;
        }
      }

      const totalTyped = typedChars.length;

      const accuracy =
        totalTyped > 0
          ? Math.round((correct / totalTyped) * 100)
          : 100;

      // WPM
      const timeElapsed = duration - timeLeft;
      const minutes =
        timeElapsed > 0 ? timeElapsed / 60 : 1 / 60;

      const wpm = Math.round((correct / 5) / minutes);

      // Words
      const typedWords = val.split(' ');
      const targetWords = text.split(' ');

      let correctWordsCount = 0;
      let wrongWordsCount = 0;

      typedWords.forEach((word, index) => {
        if (
          index < typedWords.length - 1 ||
          val.length === text.length
        ) {
          if (word === targetWords[index]) {
            correctWordsCount++;
          } else if (word.length > 0) {
            wrongWordsCount++;
          }
        }
      });

      setStats((prev) => ({
        ...prev,
        correctChars: correct,
        incorrectChars: incorrect,
        accuracy,
        wpm: wpm > 0 ? wpm : 0,
        totalKeystrokes:
          prev.totalKeystrokes + (isBackspace ? 0 : 1),
        correctWords: correctWordsCount,
        wrongWords: wrongWordsCount,
        timeElapsed,
      }));

      // Automatically finish when passage is completed
      if (val === text) {
        finishTest();
      }
    },
    [
      input,
      status,
      text,
      duration,
      timeLeft,
      finishTest,
      settings,
    ]
  );

  return {
    input,
    status,
    timeLeft,
    stats,
    handleInput,
    reset,
    forceStart,
    submitTest: finishTest,
  };
}


// Audio player
const audioCtx = new (window.AudioContext ||
  (window as any).webkitAudioContext)();

function playSound(type: 'correct' | 'error') {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (type === 'correct') {
    oscillator.type = 'sine';

    oscillator.frequency.setValueAtTime(
      600,
      audioCtx.currentTime
    );

    gainNode.gain.setValueAtTime(
      0.1,
      audioCtx.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.1
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } else {
    oscillator.type = 'square';

    oscillator.frequency.setValueAtTime(
      150,
      audioCtx.currentTime
    );

    gainNode.gain.setValueAtTime(
      0.1,
      audioCtx.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.2
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  }
}