import React, { useEffect, useMemo, useState } from 'react';
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
  Timer,
  Gauge,
  BarChart3,
  Lock,
  Maximize,
  FileText,
  Zap,
} from 'lucide-react';

const EXAM_DURATION = 420; // 7 minutes

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  useEffect(() => {
    if (!currentPassageId && initialPassage) {
      setCurrentPassageId(initialPassage.id);
    }
  }, [
    currentPassageId,
    initialPassage,
    setCurrentPassageId,
  ]);

  const currentPassage =
    passages.find((p) => p.id === currentPassageId) ||
    passages.find((p) => p.text === currentText) ||
    initialPassage;

  /*
   * IMPORTANT
   * Exam is saved as "exam" in typing_history.
   * Duration remains 7 minutes = 420 seconds.
   */
  const {
    input,
    status,
    timeLeft,
    stats,
    handleInput,
    reset,
    submitTest,
  } = useTypingTest(
    currentText,
    EXAM_DURATION,
    'exam',
    currentPassage?.title || ''
  );

  const elapsedTime = Math.max(
    0,
    EXAM_DURATION - timeLeft
  );

  const progress = useMemo(() => {
    if (!currentText.length) return 0;

    return Math.min(
      100,
      Math.round(
        (input.length / currentText.length) * 100
      )
    );
  }, [input.length, currentText.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handlePassageChange = (id: string) => {
    const passage = passages.find(
      (p) => p.id === id
    );

    if (!passage) return;

    setCurrentPassageId(id);
    setCurrentText(passage.text);
    reset();
  };

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      setIsFullscreen(true);
    } catch {
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen exit errors
    }

    setIsFullscreen(false);
  };

  const handleStartExam = async () => {
    reset();
    setIsSetup(false);

    await enterFullscreen();
  };

  const handleBack = () => {
    if (status === 'running') {
      setShowExitWarning(true);
      return;
    }

    exitFullscreen();
    navigate('/');
  };

  const confirmExitExam = () => {
    reset();
    setShowExitWarning(false);
    exitFullscreen();
    setIsSetup(true);
  };

  const cancelExitExam = () => {
    setShowExitWarning(false);
  };

  const handleRestart = () => {
    reset();
    setShowExitWarning(false);
    setIsSetup(true);
    exitFullscreen();
  };

  /*
   * Prevent accidental browser/tab closing.
   */
  useEffect(() => {
    const handleBeforeUnload = (
      event: BeforeUnloadEvent
    ) => {
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
    }

    return () => {
      window.removeEventListener(
        'beforeunload',
        handleBeforeUnload
      );
    };
  }, [status]);

  /*
   * Fullscreen state tracking.
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    };

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  /*
   * Exit fullscreen automatically after exam.
   */
  useEffect(() => {
    if (status === 'finished') {
      exitFullscreen();
    }
  }, [status]);

  /*
   * Theme
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
   * =====================================================
   * RESULT
   * =====================================================
   */

  if (status === 'finished') {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:py-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-8">

            <div
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${activeTheme.softBg} ${activeTheme.softBorder} ${activeTheme.text} border mb-5`}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-bold">
                EXAM COMPLETED
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black">
              Typing Exam Result
            </h1>

            <p className="text-slate-400 mt-3">
              Your 7-minute examination summary
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="pro-card text-center p-5">
              <Zap
                className={`w-6 h-6 mx-auto mb-2 ${activeTheme.text}`}
              />
              <p className="text-xs text-slate-400">
                WPM
              </p>
              <p
                className={`text-3xl font-black ${activeTheme.text}`}
              >
                {stats.wpm}
              </p>
            </div>

            <div className="pro-card text-center p-5">
              <Target className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              <p className="text-xs text-slate-400">
                Accuracy
              </p>
              <p className="text-3xl font-black text-emerald-400">
                {stats.accuracy}%
              </p>
            </div>

            <div className="pro-card text-center p-5">
              <Timer className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-xs text-slate-400">
                Time
              </p>
              <p className="text-3xl font-black">
                {formatTime(elapsedTime)}
              </p>
            </div>

            <div className="pro-card text-center p-5">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <p className="text-xs text-slate-400">
                Target
              </p>
              <p className="text-3xl font-black">
                {targetWpm}
              </p>
            </div>

          </div>

          <Results
            stats={stats}
            timeElapsed={elapsedTime}
            onRestart={handleRestart}
            onHome={() => {
              reset();
              exitFullscreen();
              navigate('/');
            }}
          />

        </div>
      </div>
    );
  }

  /*
   * =====================================================
   * SETUP
   * =====================================================
   */

  if (isSetup) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-20">
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

              <span className="font-black tracking-wide">
                TYPE MASTER PLUS
              </span>
            </div>

            <div className="w-16" />

          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">

          <div className="text-center mb-8">

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${activeTheme.softBg} ${activeTheme.softBorder} ${activeTheme.text} mb-5`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold">
                OFFICIAL EXAM MODE
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black">
              Typing Examination
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
              Complete a professional 7-minute typing
              examination with speed and accuracy.
            </p>

          </div>

          {/* Main setup card */}

          <div className="pro-card p-6 md:p-8">

            <div className="flex items-center gap-3 mb-7">

              <div
                className={`p-3 rounded-xl ${activeTheme.softBg}`}
              >
                <BookOpen
                  className={`w-6 h-6 ${activeTheme.text}`}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Exam Setup
                </h2>

                <p className="text-sm text-slate-400">
                  Configure your examination
                </p>
              </div>

            </div>

            {/* Target WPM */}

            <div className="mb-7">

              <label className="block text-sm font-bold text-slate-300 mb-3">
                Target Speed
              </label>

              <div className="grid grid-cols-3 gap-3">

                {[30, 40, 50].map((speed) => (
                  <button
                    key={speed}
                    onClick={() =>
                      setTargetWpm(speed)
                    }
                    className={`p-4 rounded-xl border transition-all ${
                      targetWpm === speed
                        ? `${activeTheme.border} ${activeTheme.softBg} ${activeTheme.text} scale-[1.02]`
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl font-black">
                      {speed}
                    </div>

                    <div className="text-xs mt-1">
                      WPM
                    </div>
                  </button>
                ))}

              </div>
            </div>

            {/* Passage */}

            <div className="mb-7">

              <label className="block text-sm font-bold text-slate-300 mb-3">
                Select Passage
              </label>

              <select
                value={currentPassageId || ''}
                onChange={(e) =>
                  handlePassageChange(
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-slate-500"
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

            {/* Exam information */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

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
                  Target
                </p>
                <p className="font-bold">
                  {targetWpm} WPM
                </p>
              </div>

              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
                <FileText
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

              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4">
                <Lock className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-xs text-slate-400">
                  Mode
                </p>
                <p className="font-bold">
                  Official
                </p>
              </div>

            </div>

          </div>

          {/* Instructions */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

            <div className="pro-card p-6">

              <div className="flex items-center gap-3 mb-5">
                <CheckCircle2
                  className={`w-6 h-6 ${activeTheme.text}`}
                />

                <h3 className="text-lg font-bold">
                  Exam Instructions
                </h3>
              </div>

              <div className="space-y-4 text-sm text-slate-300">

                <div className="flex gap-3">
                  <span className={`${activeTheme.text} font-black`}>
                    01
                  </span>
                  <span>
                    Type the passage exactly as displayed.
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className={`${activeTheme.text} font-black`}>
                    02
                  </span>
                  <span>
                    The examination duration is 7 minutes.
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className={`${activeTheme.text} font-black`}>
                    03
                  </span>
                  <span>
                    Focus on both speed and accuracy.
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className={`${activeTheme.text} font-black`}>
                    04
                  </span>
                  <span>
                    The timer starts when you begin typing.
                  </span>
                </div>

              </div>

            </div>

            {/* Rules */}

            <div className="pro-card p-6">

              <div className="flex items-center gap-3 mb-5">
                <AlertCircle className="w-6 h-6 text-amber-400" />

                <h3 className="text-lg font-bold">
                  Exam Rules
                </h3>
              </div>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">
                    Time Limit
                  </span>

                  <span className="font-bold">
                    7 Minutes
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">
                    Target Speed
                  </span>

                  <span className="font-bold">
                    {targetWpm} WPM
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">
                    Accuracy Goal
                  </span>

                  <span className="font-bold text-emerald-400">
                    90%+
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Test Type
                  </span>

                  <span
                    className={`font-bold ${activeTheme.text}`}
                  >
                    Exam
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Performance target */}

          <div
            className={`mt-6 bg-gradient-to-r ${activeTheme.gradient} border ${activeTheme.softBorder} rounded-2xl p-6`}
          >

            <div className="flex items-center gap-3 mb-5">

              <Gauge
                className={`w-6 h-6 ${activeTheme.text}`}
              />

              <div>
                <h3 className="font-bold text-lg">
                  Target Performance
                </h3>

                <p className="text-sm text-slate-400">
                  Keep your target in mind during the exam.
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

              <div>
                <p className="text-xs text-slate-400">
                  Target WPM
                </p>
                <p
                  className={`text-2xl font-black ${activeTheme.text}`}
                >
                  {targetWpm}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Duration
                </p>
                <p className="text-2xl font-black">
                  7 min
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Accuracy
                </p>
                <p className="text-2xl font-black text-emerald-400">
                  90%+
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Exam Type
                </p>
                <p className="text-2xl font-black">
                  Official
                </p>
              </div>

            </div>

          </div>

          {/* Start */}

          <div className="flex justify-center mt-8">

            <button
              onClick={handleStartExam}
              className={`w-full sm:w-auto px-10 py-4 rounded-xl ${activeTheme.bg} ${activeTheme.hover} text-white font-black text-lg transition shadow-xl ${activeTheme.shadow} flex items-center justify-center gap-3`}
            >
              <Keyboard className="w-5 h-5" />
              Start 7-Minute Exam
            </button>

          </div>

          <p className="text-center text-xs text-slate-500 mt-4">
            Fullscreen mode will start automatically when the exam begins.
          </p>

        </main>
      </div>
    );
  }

  /*
   * =====================================================
   * ACTIVE EXAM
   * =====================================================
   */

  return (
    <div className="fixed inset-0 bg-slate-950 text-white overflow-hidden">

      {/* Live exam top bar */}

      <div className="absolute top-0 left-0 right-0 z-[90] bg-slate-950/95 backdrop-blur-md border-b border-slate-800">

        <div className="px-4 md:px-6 py-3">

          <div className="flex items-center justify-between gap-3">

            {/* Brand */}

            <div className="hidden md:flex items-center gap-2 min-w-[180px]">
              <Keyboard
                className={`w-5 h-5 ${activeTheme.text}`}
              />

              <span className="font-black text-sm">
                TYPE MASTER PLUS
              </span>
            </div>

            {/* Stats */}

            <div className="flex items-center justify-center gap-2 md:gap-4 flex-1">

              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[72px]">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase">
                  <Timer className="w-3 h-3" />
                  Time
                </div>

                <div
                  className={`font-black text-sm md:text-base ${
                    timeLeft <= 60
                      ? 'text-red-400'
                      : activeTheme.text
                  }`}
                >
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[65px]">
                <div className="text-[10px] text-slate-400 uppercase">
                  WPM
                </div>

                <div className="font-black text-sm md:text-base">
                  {stats.wpm}
                </div>
              </div>

              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[65px]">
                <div className="text-[10px] text-slate-400 uppercase">
                  Accuracy
                </div>

                <div
                  className={`font-black text-sm md:text-base ${
                    stats.accuracy >= 90
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {stats.accuracy}%
                </div>
              </div>

              <div className="hidden sm:block px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[65px]">
                <div className="text-[10px] text-slate-400 uppercase">
                  Errors
                </div>

                <div className="font-black text-sm md:text-base text-red-400">
                  {stats.incorrectChars}
                </div>
              </div>

              <div className="hidden md:block px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[75px]">
                <div className="text-[10px] text-slate-400 uppercase">
                  Progress
                </div>

                <div className="font-black text-sm">
                  {progress}%
                </div>
              </div>

            </div>

            {/* Exit */}

            <button
              onClick={() =>
                setShowExitWarning(true)
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                Exit
              </span>
            </button>

          </div>

          {/* Progress */}

          <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">

            <div
              className={`h-full ${activeTheme.bg} transition-all duration-200`}
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* Exam content */}

      <div className="absolute inset-0 pt-[78px]">

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

      {/* Exit confirmation */}

      {showExitWarning && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">

            <div className="flex items-center gap-3 mb-4">

              <div className="p-3 rounded-xl bg-red-500/10">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Leave Exam?
                </h2>

                <p className="text-sm text-slate-400">
                  Your current progress will be lost.
                </p>
              </div>

            </div>

            <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4 mb-5">

              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">
                  Time Remaining
                </span>

                <span className="font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Progress
                </span>

                <span className="font-bold">
                  {progress}%
                </span>
              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={cancelExitExam}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold transition"
              >
                Continue Exam
              </button>

              <button
                onClick={confirmExitExam}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition"
              >
                Leave Exam
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Fullscreen indicator */}

      {!isFullscreen && status === 'running' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[150]">

          <button
            onClick={enterFullscreen}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${activeTheme.bg} text-white text-sm font-bold shadow-xl`}
          >
            <Maximize className="w-4 h-4" />
            Enter Fullscreen
          </button>

        </div>
      )}

    </div>
  );
}