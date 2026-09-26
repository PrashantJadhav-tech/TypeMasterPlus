import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingTest } from '../hooks/useTypingTest';
import { SplitTypingArea } from '../components/typing/SplitTypingArea';
import { Results } from '../components/typing/Results';
import { useSettings } from '../contexts/SettingsContext';
import { usePassages } from '../contexts/PassagesContext';
import {
  ArrowLeft,
  Keyboard,
  Target,
  BookOpen,
  Zap,
  Shuffle,
  Trophy,
  BarChart3,
  Lightbulb
} from 'lucide-react';

export function Practice() {
  const navigate = useNavigate();
  const { passages, getRandomPassage, currentPassageId, setCurrentPassageId } =
    usePassages();

  const initialPassage =
    (currentPassageId &&
      passages.find((p) => p.id === currentPassageId)) ||
    passages[0] ||
    getRandomPassage();

  const [currentText, setCurrentText] = useState(
    initialPassage?.text || ''
  );

  const [targetWpm, setTargetWpm] = useState<number>(30);

  const [isSetup, setIsSetup] = useState(true);

  // Quick Test settings
  const [quickTestMinutes, setQuickTestMinutes] = useState<number>(1);
  const [testMode, setTestMode] = useState<'practice' | 'quick'>('practice');

  // Test duration in seconds
  const testDuration = testMode === 'quick' ? quickTestMinutes * 60 : 420;

  const {
    input,
    status,
    timeLeft,
    stats,
    handleInput,
    reset,
    submitTest
  } = useTypingTest(currentText, testDuration);

  useEffect(() => {
    if (!currentPassageId && initialPassage) {
      setCurrentPassageId(initialPassage.id);
    }
  }, [currentPassageId, initialPassage, setCurrentPassageId]);

  const handlePassageChange = (id: string) => {
    const passage = passages.find((p) => p.id === id);

    if (!passage) return;

    setCurrentPassageId(id);
    setCurrentText(passage.text);
  };

  // Random passage
  const handleRandomPassage = () => {
    const randomPassage = getRandomPassage();

    if (!randomPassage) return;

    setCurrentPassageId(randomPassage.id);
    setCurrentText(randomPassage.text);
  };

  // Start normal 7-minute practice
  const handleStartPractice = () => {
    setTestMode('practice');
    reset();
    setIsSetup(false);
  };

  // Start Quick Test
  const handleStartQuickTest = () => {
    const randomPassage = getRandomPassage();

    if (randomPassage) {
      setCurrentPassageId(randomPassage.id);
      setCurrentText(randomPassage.text);
    }

    setTestMode('quick');
    reset();
    setIsSetup(false);
  };

  const handleBack = () => {
    if (status === 'running') {
      if (!window.confirm('Are you sure you want to leave this test?')) {
        return;
      }

      reset();
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    navigate('/');
  };

  const handleRestart = () => {
    reset();
    setIsSetup(true);
  };

  // Fullscreen & beforeunload logic
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'running') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (status === 'running') {
      window.addEventListener('beforeunload', handleBeforeUnload);

      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else if (status === 'finished' || status === 'idle') {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [status]);

  // Results
  if (status === 'finished') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col pt-16 px-4 md:px-8 overflow-y-auto items-center justify-center">
        <div className="w-full">
          <Results
            stats={stats}
            timeElapsed={testDuration - timeLeft}
            onRestart={handleRestart}
            onHome={() => {
              reset();
              navigate('/');
            }}
          />
        </div>
      </div>
    );
  }

  // Setup page
  if (isSetup) {
    return (
      <div className="min-h-screen bg-slate-900 text-white px-4 py-8 md:py-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4">
              <Keyboard className="w-8 h-8 text-yellow-500" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white">
              Typing Practice
            </h1>

            <p className="text-slate-400 mt-2">
              Improve your typing speed and accuracy
            </p>
          </div>

          {/* Quick Test */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl mb-8">

            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Quick Test
                </h2>

                <p className="text-sm text-slate-400">
                  Start typing instantly with a random passage
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="mt-6">
              <p className="text-sm font-bold text-slate-300 mb-3">
                Test Duration
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[1, 3, 5].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => setQuickTestMinutes(minutes)}
                    className={`py-3 rounded-xl border font-bold transition-all ${
                      quickTestMinutes === minutes
                        ? 'bg-yellow-500 text-slate-900 border-yellow-500 shadow-lg'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-yellow-500/60'
                    }`}
                  >
                    {minutes} Minute{minutes > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartQuickTest}
              className="w-full mt-5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Quick Test
            </button>
          </div>

          {/* Passage Practice */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-500" />
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Passage Practice
                </h2>

                <p className="text-sm text-slate-400">
                  Choose a passage and practice for 7 minutes
                </p>
              </div>
            </div>

            {/* Target Speed */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                <Target className="w-4 h-4 text-yellow-500" />
                Target Speed (WPM)
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[30, 40, 50].map((wpm) => (
                  <button
                    key={wpm}
                    type="button"
                    onClick={() => setTargetWpm(wpm)}
                    className={`py-3 rounded-xl border font-bold transition-all ${
                      targetWpm === wpm
                        ? 'bg-yellow-500 text-slate-900 border-yellow-500 shadow-lg'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-yellow-500/60'
                    }`}
                  >
                    {wpm} WPM
                  </button>
                ))}
              </div>
            </div>

            {/* Passage */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">
                <BookOpen className="w-4 h-4 text-yellow-500" />
                Select Passage
              </label>

              <select
                value={currentPassageId || initialPassage?.id || ''}
                onChange={(e) => handlePassageChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 outline-none focus:border-yellow-500"
              >
                {passages.map((passage) => (
                  <option key={passage.id} value={passage.id}>
                    {passage.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Random Passage */}
            <button
              type="button"
              onClick={handleRandomPassage}
              className="w-full mb-5 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Random Passage
            </button>

            {/* Info */}
            <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 text-sm text-slate-400 mb-5">
              <span className="text-slate-200 font-semibold">
                {targetWpm} WPM
              </span>

              <span className="mx-2">•</span>

              <span>
                {passages.find((p) => p.id === currentPassageId)?.title ||
                  initialPassage?.title ||
                  'Selected Passage'}
              </span>

              <span className="mx-2">•</span>

              <span>7:00 minutes</span>
            </div>

            {/* Start */}
            <button
              type="button"
              onClick={handleStartPractice}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
            >
              Start Passage Practice
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-slate-400 text-sm">
                  Best WPM
                </span>
              </div>

              <p className="text-2xl font-black text-white mt-2">
                —
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-yellow-500" />
                <span className="text-slate-400 text-sm">
                  Best Accuracy
                </span>
              </div>

              <p className="text-2xl font-black text-white mt-2">
                —
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Keyboard className="w-5 h-5 text-yellow-500" />
                <span className="text-slate-400 text-sm">
                  Tests Completed
                </span>
              </div>

              <p className="text-2xl font-black text-white mt-2">
                —
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />

              <h3 className="font-bold text-white">
                Typing Tips
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-400">
              <p>• Focus on accuracy before speed.</p>
              <p>• Keep your fingers on the correct keys.</p>
              <p>• Maintain a steady typing rhythm.</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Actual typing screen
  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">

      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700 backdrop-blur"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <SplitTypingArea
        text={currentText}
        input={input}
        status={status}
        onInput={handleInput}
        onReset={handleRestart}
        onCancel={reset}
        stats={stats}
        timeLeft={timeLeft}
        passages={passages}
        currentPassageId={currentPassageId}
        onPassageChange={handlePassageChange}
        onSubmit={submitTest}
      />
    </div>
  );
}