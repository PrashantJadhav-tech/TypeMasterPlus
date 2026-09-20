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

  // Initialize or reset
  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
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

  // Calculate final stats
  const finishTest = useCallback(() => {
    setStatus('finished');
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const forceStart = useCallback(() => {
    if (status === 'idle') {
      setStatus('running');
    }
  }, [status]);

  // Timer effect
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, finishTest]);

  const handleInput = useCallback((val: string) => {
    if (status === 'finished') return;
    
    // Check if backspace was used by comparing lengths
    const isBackspace = val.length < input.length;
    
    // Handle backspace setting
    if (isBackspace && !settings.backspaceEnabled) return;
    
    // Limit input length to text length
    if (val.length > text.length) return;

    if (status === 'idle') {
      if (settings.autoStart && val.length > 0) {
        setStatus('running');
      } else {
        // If autoStart is false, prevent typing until it's running
        return;
      }
    }

    // Spacebar Error Detection: if settings.spacebarError is TRUE,
    // and they type a space where there isn't one, we process it normally (so it highlights red).
    // If settings.spacebarError is FALSE, and they type a space where there isn't one, we ignore the space!
    // Let's implement that:
    if (!isBackspace && !settings.spacebarError) {
      const charTyped = val[val.length - 1];
      const charExpected = text[val.length - 1];
      if (charTyped === ' ' && charExpected !== ' ') {
        return; // ignore the space
      }
    }

    // Audio cues
    if (!isBackspace) {
      const charTyped = val[val.length - 1];
      const charExpected = text[val.length - 1];
      if (charTyped === charExpected && settings.typingSound) {
        playSound('correct');
      } else if (charTyped !== charExpected && settings.errorSound) {
        playSound('error');
      }
    }

    setInput(val);

    // Calculate current stats
    let correct = 0;
    let incorrect = 0;
    
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const totalTyped = val.length;
    const accuracy = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;
    
    // WPM: (correct chars / 5) / time elapsed in minutes
    const timeElapsed = duration - timeLeft;
    const minutes = timeElapsed > 0 ? timeElapsed / 60 : 1 / 60; // Avoid infinity on first keystroke
    const wpm = Math.round((correct / 5) / minutes);

    // Words calculation
    const typedWords = val.split(' ');
    const targetWords = text.split(' ');
    
    let correctWordsCount = 0;
    let wrongWordsCount = 0;
    
    typedWords.forEach((word, index) => {
      // Only count completed words or the last word if it's the end of text
      if (index < typedWords.length - 1 || val.length === text.length) {
        if (word === targetWords[index]) {
          correctWordsCount++;
        } else if (word.length > 0) { // Avoid counting empty strings as wrong words
          wrongWordsCount++;
        }
      }
    });

    setStats(prev => ({
      ...prev,
      correctChars: correct,
      incorrectChars: incorrect,
      accuracy,
      wpm: wpm > 0 ? wpm : 0,
      totalKeystrokes: prev.totalKeystrokes + (isBackspace ? 0 : 1),
      correctWords: correctWordsCount,
      wrongWords: wrongWordsCount,
      timeElapsed: timeElapsed,
    }));

  }, [input, status, text, duration, timeLeft, finishTest, settings]);

  return {
    input,
    status,
    timeLeft,
    stats,
    handleInput,
    reset,
    forceStart,
    submitTest: finishTest
  };
}

// Simple audio player for beeps
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } else {
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  }
}
