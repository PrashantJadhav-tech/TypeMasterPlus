import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingTest } from '../hooks/useTypingTest';
import { SplitTypingArea } from '../components/typing/SplitTypingArea';
import { Results } from '../components/typing/Results';
import { usePassages } from '../contexts/PassagesContext';
import { useSettings } from '../contexts/SettingsContext';

import {
  ArrowLeft,
  Keyboard,
  Target,
  BookOpen,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Trophy,
} from 'lucide-react';

export default function Exam() {
  const navigate = useNavigate();

  const { settings } = useSettings();

  const {
    passages,
    getRandomPassage,
    currentPassageId,
    setCurrentPassageId,
  } = usePassages();

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

  useEffect(() => {
    if (!currentPassageId && initialPassage) {
      setCurrentPassageId(initialPassage.id);
    }
  }, [
    currentPassageId,
    initialPassage,
    setCurrentPassageId,
  ]);

  /*
   * 7 minutes = 420 seconds
   *
   * IMPORTANT:
   * forceStart() intentionally removed.
   * Timer should start when user begins typing,
   * according to useTypingTest behavior.
   */
  const {
    input,
    status,
    timeLeft,
    stats,
    handleInput,
    reset,
    submitTest,
  } = useTypingTest(currentText, 420);

  const currentPassage =
    passages.find((p) => p.id === currentPassageId) ||
    passages.find((p) => p.text === currentText) ||
    initialPassage;

  const handlePassageChange = (id: string) => {
    const passage = passages.find((p) => p.id === id);

    if (!passage) return;

    setCurrentPassageId(id);
    setCurrentText(passage.text);
    reset();
  };

  const handleStartExam = () => {
    reset();
    setIsSetup(false);
  };

  const handleBack = () => {
    if (status === 'running') {
      const confirmed = window.confirm(
        'Are you sure you want to leave this exam?'
      );

      if (!confirmed) return;

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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (status === 'running') {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    if (status === 'running') {
      window.addEventListener(
        'beforeunload',
        handleBeforeUnload
      );

      if (!document.fullscreenElement) {
        document.documentElement
          .requestFullscreen()
          .catch(() => {});
      }
    }

    if (status === 'finished' || status === 'idle') {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }

    return () => {
      window.removeEventListener(
        'beforeunload',
        handleBeforeUnload
      );
    };
  }, [status]);

  /*
   * =========================================================
   * THEME
   * =========================================================
   *
   * These classes follow the site's selected theme.
   */

  const themeClasses = {
    yellow: {
      text: 'text-yellow-400',
      bg: 'bg-yellow-500',
      hover: 'hover:bg-yellow-400',
      softBg: 'bg-yellow-500/10',
      softBorder: 'border-yellow-500/30',
      border: 'border-yellow-500',
      shadow: 'shadow-yellow-500/20',
      gradient:
        'from-yellow-500/10 to-yellow-500/5',
    },

    blue: {
      text: 'text-blue-400',
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-500',
      softBg: 'bg-blue-500/10',
      softBorder: 'border-blue-500/30',
      border: 'border-blue-500',
      shadow: 'shadow-blue-500/20',
      gradient:
        'from-blue-500/10 to-blue-500/5',
    },

    green: {
      text: 'text-green-400',
      bg: 'bg-green-600',
      hover: 'hover:bg-green-500',
      softBg: 'bg-green-500/10',
      softBorder: 'border-green-500/30',
      border: 'border-green-500',
      shadow: 'shadow-green-500/20',
      gradient:
        'from-green-500/10 to-green-500/5',
    },

    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-500',
      softBg: 'bg-purple-500/10',
      softBorder: 'border-purple-500/30',
      border: 'border-purple-500',
      shadow: 'shadow-purple-500/20',
      gradient:
        'from-purple-500/10 to-purple-500/5',
    },

    rose: {
      text: 'text-rose-400',
      bg: 'bg-rose-600',
      hover: 'hover:bg-rose-500',
      softBg: 'bg-rose-500/10',
      softBorder: 'border-rose-500/30',
      border: 'border-rose-500',
      shadow: 'shadow-rose-500/20',
      gradient:
        'from-rose-500/10 to-rose-500/5',
    },
  };

  const activeTheme =
    themeClasses[
      settings?.theme as keyof typeof themeClasses
    ] || themeClasses.yellow;

  /*
   * =========================================================
   * RESULT SCREEN
   * =========================================================
   */

  if (status === 'finished') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col pt-16 px-4 md:px-8 overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto">

          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeTheme.softBg} ${activeTheme.softBorder} ${activeTheme.text} mb-4`}
            >
              <Trophy className="w-5 h-5" />

              <span className="font-semibold">
                Exam Completed
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              Typing Exam Result
            </h1>

            <p className="text-slate-400 mt-2">
              Your Type Master Plus examination summary
            </p>
          </div>

          <Results
            stats={stats}
            timeElapsed={420 - timeLeft}
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

  /*
   * =========================================================
   * EXAM SETUP
   * =========================================================
   */

  if (isSetup) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        {/* HEADER */}

        <header className="border-b border-slate-800 bg-slate-950/95">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <Keyboard
                className={`w-6 h-6 ${activeTheme.text}`}
              />

              <span className="font-bold text-lg">
                TYPE MASTER PLUS
              </span>
            </div>

            <div className="w-16" />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">

          {/* OFFICIAL EXAM BADGE */}

          <div className="flex justify-center mb-6">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${activeTheme.softBg} ${activeTheme.softBorder} ${activeTheme.text}`}
            >
              <ShieldCheck className="w-5 h-5" />

              <span className="font-semibold">
                Official Exam Mode
              </span>
            </div>
          </div>

          {/* TITLE */}

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              Typing Examination
            </h1>

            <p className="text-slate-400 mt-2">
              Complete the typing test with speed and accuracy.
            </p>
          </div>

          {/* EXISTING PASSAGE + TARGET WPM */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">

            <div className="flex items-center gap-3 mb-6">

              <BookOpen
                className={`w-6 h-6 ${activeTheme.text}`}
              />

              <div>
                <h2 className="text-xl font-bold">
                  Exam Setup
                </h2>

                <p className="text-sm text-slate-400">
                  Select your target speed and passage
                </p>
              </div>

            </div>

            {/* TARGET WPM */}

            <div className="mb-7">

              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Target Speed
              </label>

              <div className="grid grid-cols-3 gap-3">

                {[30, 40, 50].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setTargetWpm(speed)}
                    className={`p-4 rounded-xl border transition ${
                      targetWpm === speed
                        ? `${activeTheme.border} ${activeTheme.softBg} ${activeTheme.text}`
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xl font-bold">
                      {speed}
                    </div>

                    <div className="text-xs mt-1">
                      WPM
                    </div>
                  </button>
                ))}

              </div>
            </div>

            {/* PASSAGE */}

            <div className="mb-7">

              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Select Passage
              </label>

              <select
                value={currentPassageId || ''}
                onChange={(e) =>
                  handlePassageChange(e.target.value)
                }
                className={`w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:${activeTheme.border}`}
              >
                {passages.map((passage) => (
                  <option
                    key={passage.id}
                    value={passage.id}
                  >
                    {passage.title}
                  </option>
                ))}
              </select>

            </div>

            {/* INFO */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">

                <Clock
                  className={`w-5 h-5 ${activeTheme.text} mb-2`}
                />

                <p className="text-xs text-slate-400">
                  Duration
                </p>

                <p className="font-bold">
                  7 Minutes
                </p>

              </div>

              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">

                <Target
                  className={`w-5 h-5 ${activeTheme.text} mb-2`}
                />

                <p className="text-xs text-slate-400">
                  Target Speed
                </p>

                <p className="font-bold">
                  {targetWpm} WPM
                </p>

              </div>

              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">

                <BookOpen
                  className={`w-5 h-5 ${activeTheme.text} mb-2`}
                />

                <p className="text-xs text-slate-400">
                  Passage
                </p>

                <p className="font-bold truncate">
                  {currentPassage?.title ||
                    'Selected Passage'}
                </p>

              </div>

            </div>

          </div>

          {/* INSTRUCTIONS + RULES */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

            {/* INSTRUCTIONS */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-4">

                <CheckCircle2
                  className={`w-6 h-6 ${activeTheme.text}`}
                />

                <h3 className="text-lg font-bold">
                  Exam Instructions
                </h3>

              </div>

              <div className="space-y-3 text-sm text-slate-300">

                <div className="flex gap-3">
                  <span
                    className={`${activeTheme.text} font-bold`}
                  >
                    01
                  </span>

                  <span>
                    Type the passage exactly as displayed.
                  </span>
                </div>

                <div className="flex gap-3">
                  <span
                    className={`${activeTheme.text} font-bold`}
                  >
                    02
                  </span>

                  <span>
                    The exam duration is 7 minutes.
                  </span>
                </div>

                <div className="flex gap-3">
                  <span
                    className={`${activeTheme.text} font-bold`}
                  >
                    03
                  </span>

                  <span>
                    Focus on both speed and accuracy.
                  </span>
                </div>

                <div className="flex gap-3">
                  <span
                    className={`${activeTheme.text} font-bold`}
                  >
                    04
                  </span>

                  <span>
                    Complete the passage before the timer ends.
                  </span>
                </div>

              </div>

            </div>

            {/* RULES */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-4">

                <AlertCircle className="w-6 h-6 text-amber-400" />

                <h3 className="text-lg font-bold">
                  Exam Rules
                </h3>

              </div>

              <div className="space-y-3 text-sm text-slate-300">

                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Time Limit</span>

                  <span className="font-semibold text-white">
                    7 Minutes
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Target Speed</span>

                  <span className="font-semibold text-white">
                    {targetWpm} WPM
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Selected Passage</span>

                  <span className="font-semibold text-white max-w-[180px] truncate">
                    {currentPassage?.title || 'Passage'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Exam Mode</span>

                  <span
                    className={`font-semibold ${activeTheme.text}`}
                  >
                    Official
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* TARGET PERFORMANCE */}

          <div
            className={`mt-6 bg-gradient-to-r ${activeTheme.gradient} border ${activeTheme.softBorder} rounded-2xl p-6`}
          >

            <div className="flex items-center gap-3 mb-4">

              <Target
                className={`w-6 h-6 ${activeTheme.text}`}
              />

              <div>
                <h3 className="font-bold text-lg">
                  Target Performance
                </h3>

                <p className="text-sm text-slate-400">
                  Keep these targets in mind during your exam.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div>
                <p className="text-xs text-slate-400">
                  Target WPM
                </p>

                <p
                  className={`text-xl font-bold ${activeTheme.text}`}
                >
                  {targetWpm}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Duration
                </p>

                <p className="text-xl font-bold">
                  7 min
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Accuracy Goal
                </p>

                <p className="text-xl font-bold text-emerald-400">
                  90%+
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Test Type
                </p>

                <p className="text-xl font-bold">
                  Exam
                </p>
              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">

            <button
              onClick={handleStartExam}
              className={`px-8 py-4 rounded-xl ${activeTheme.bg} ${activeTheme.hover} text-white font-bold text-lg transition shadow-lg ${activeTheme.shadow}`}
            >
              Start Exam
            </button>

            <button
              onClick={handleBack}
              className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition"
            >
              Back
            </button>

          </div>

          <p className="text-center text-xs text-slate-500 mt-5">
            Make sure you are ready before starting the examination.
          </p>

        </main>
      </div>
    );
  }

  /*
   * =========================================================
   * ACTIVE EXAM
   * =========================================================
   */

  return (
    <div className="fixed inset-0 bg-slate-950">

      {/* BACK TO EXAM SETUP */}

      <button
        onClick={() => {
          const confirmed = window.confirm(
            'Are you sure you want to leave the current exam? Your current progress will be lost.'
          );

          if (!confirmed) return;

          reset();

          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }

          setIsSetup(true);
        }}
        className="
          fixed
          top-4
          left-4
          z-[100]
          flex
          items-center
          gap-2
          px-4
          py-2
          rounded-lg
          bg-slate-800/90
          hover:bg-slate-700
          border
          border-slate-600
          text-slate-200
          hover:text-white
          text-sm
          font-semibold
          shadow-lg
          backdrop-blur-sm
          transition
        "
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Exam
      </button>

      <SplitTypingArea
        text={currentText}
        input={input}
        status={status}
        onInput={handleInput}
        onReset={handleRestart}
        onCancel={handleBack}
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