import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTypingTest } from '../hooks/useTypingTest';
import { SplitTypingArea } from '../components/typing/SplitTypingArea';
import { Results } from "../components/typing/Results";
import { usePassages } from '../contexts/PassagesContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

import {
  ArrowLeft,
  Keyboard,
  Target,
  BookOpen,
  Zap,
  Shuffle,
  Trophy,
  BarChart3,
  Lightbulb,
  Globe,
  CheckCircle2,
} from 'lucide-react';

type Language = 'english' | 'marathi';
type TestMode = 'practice' | 'quick';

const FREE_TEST_LIMIT = 3;
const FREE_TEST_COUNT_KEY = 'type-master-plus-free-test-count';

type HistoryRow = {
  wpm: number | null;
  accuracy: number | null;
};

export function Practice() {
  const navigate = useNavigate();

  const {
    passages,
    currentPassageId,
    setCurrentPassageId,
  } = usePassages();

  const { user } = useAuth();

  // -----------------------------------------
  // FREE TEST LIMIT
  // -----------------------------------------

  const [freeTestsCompleted, setFreeTestsCompleted] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;

    const saved = Number(
      localStorage.getItem(FREE_TEST_COUNT_KEY) || '0'
    );

    return Number.isFinite(saved)
      ? Math.min(Math.max(saved, 0), FREE_TEST_LIMIT)
      : 0;
  });

  // Prevent the same finished test from being counted more than once.
  const countedFinishedTest = useRef(false);

  const hasFreeTestsLeft =
    Boolean(user) || freeTestsCompleted < FREE_TEST_LIMIT;

  const requireSignUp = () => {
    if (user) return true;

    if (freeTestsCompleted >= FREE_TEST_LIMIT) {
      navigate('/register', {
        state: {
          from: '/practice',
          message:
            'You have completed your 3 free tests. Please sign up and sign in to continue.'
        }
      });
      return false;
    }

    return true;
  };

  // -----------------------------------------
  // LANGUAGE
  // -----------------------------------------

  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>('english');

  const filteredPassages = useMemo(() => {
    return passages.filter(
      (p: any) =>
        (p.language || 'english') === selectedLanguage
    );
  }, [passages, selectedLanguage]);

  // -----------------------------------------
  // INITIAL PASSAGE
  // -----------------------------------------

  const getInitialPassageForLang = (
    lang: Language
  ) => {
    const languagePassages = passages.filter(
      (p: any) =>
        (p.language || 'english') === lang
    );

    return (
      languagePassages[0] ||
      passages[0] ||
      null
    );
  };

  const initialPassage =
    getInitialPassageForLang(selectedLanguage);

  const [currentText, setCurrentText] = useState(
    initialPassage?.text || ''
  );

  // -----------------------------------------
  // SETTINGS
  // -----------------------------------------

  const [targetWpm, setTargetWpm] =
    useState<number>(30);

  const [isSetup, setIsSetup] =
    useState<boolean>(true);

  const [quickTestMinutes, setQuickTestMinutes] =
    useState<number>(1);

  const [testMode, setTestMode] =
    useState<TestMode>('practice');

  const testDuration =
    testMode === 'quick'
      ? quickTestMinutes * 60
      : 420;

  // -----------------------------------------
  // REAL HISTORY STATS
  // -----------------------------------------

  const [bestWpm, setBestWpm] =
    useState<number>(0);

  const [bestAccuracy, setBestAccuracy] =
    useState<number>(0);

  const [testsCompleted, setTestsCompleted] =
    useState<number>(0);

  const [historyLoading, setHistoryLoading] =
    useState<boolean>(true);

  // -----------------------------------------
  // LOAD USER HISTORY
  // -----------------------------------------

  const loadHistoryStats = async () => {
    if (!user?.id) {
      setBestWpm(0);
      setBestAccuracy(0);
      setTestsCompleted(0);
      setHistoryLoading(false);
      return;
    }

    setHistoryLoading(true);

    const { data, error } = await supabase
      .from('typing_history')
      .select('wpm, accuracy')
      .eq('user_id', user.id);

    if (error) {
      console.error(
        'PRACTICE HISTORY LOAD ERROR:',
        error
      );

      setHistoryLoading(false);
      return;
    }

    const rows = (data || []) as HistoryRow[];

    const wpms = rows
      .map((row) => Number(row.wpm || 0))
      .filter((value) => value > 0);

    const accuracies = rows
      .map((row) => Number(row.accuracy || 0))
      .filter((value) => value >= 0);

    setBestWpm(
      wpms.length > 0
        ? Math.max(...wpms)
        : 0
    );

    setBestAccuracy(
      accuracies.length > 0
        ? Math.max(...accuracies)
        : 0
    );

    setTestsCompleted(rows.length);

    setHistoryLoading(false);
  };

  useEffect(() => {
    loadHistoryStats();
  }, [user?.id]);

  // -----------------------------------------
  // CURRENT PASSAGE TITLE
  // -----------------------------------------

  const currentPassageTitle =
    filteredPassages.find(
      (p) => p.id === currentPassageId
    )?.title || '';

  // -----------------------------------------
  // TYPING TEST HOOK
  // -----------------------------------------

  const {
    input,
    status,
    timeLeft,
    stats,
    handleInput,
    reset,
    finishTest,
  } = useTypingTest(
    currentText,
    testDuration,
    testMode,
    currentPassageTitle
  );

  // -----------------------------------------
  // REFRESH HISTORY AFTER TEST
  // -----------------------------------------

  useEffect(() => {
    if (status !== 'finished') {
      return;
    }

    loadHistoryStats();

    // Logged-in users have no free-test restriction.
    if (user) {
      countedFinishedTest.current = false;
      return;
    }

    // Count each completed guest test exactly once.
    if (countedFinishedTest.current) {
      return;
    }

    countedFinishedTest.current = true;

    setFreeTestsCompleted((current) => {
      const next = Math.min(
        current + 1,
        FREE_TEST_LIMIT
      );

      localStorage.setItem(
        FREE_TEST_COUNT_KEY,
        String(next)
      );

      return next;
    });
  }, [status, user]);

  // -----------------------------------------
  // LANGUAGE CHANGE
  // -----------------------------------------

  const handleLanguageChange = (
    language: Language
  ) => {
    setSelectedLanguage(language);

    const languagePassages =
      passages.filter(
        (p: any) =>
          (p.language || 'english') ===
          language
      );

    const firstPassage =
      languagePassages[0];

    if (firstPassage) {
      setCurrentPassageId(
        firstPassage.id
      );

      setCurrentText(
        firstPassage.text
      );
    }
  };

  // -----------------------------------------
  // INITIAL PASSAGE EFFECT
  // -----------------------------------------

  useEffect(() => {
    if (
      !currentPassageId &&
      initialPassage
    ) {
      setCurrentPassageId(
        initialPassage.id
      );

      setCurrentText(
        initialPassage.text
      );
    }
  }, [
    currentPassageId,
    initialPassage,
    setCurrentPassageId,
  ]);

  // -----------------------------------------
  // PASSAGE CHANGE
  // -----------------------------------------

  const handlePassageChange = (
    id: string
  ) => {
    const passage = passages.find(
      (p) => p.id === id
    );

    if (!passage) {
      return;
    }

    setCurrentPassageId(id);
    setCurrentText(passage.text);
  };

  // -----------------------------------------
  // RANDOM PASSAGE
  // -----------------------------------------

  const handleRandomPassage = () => {
    if (
      filteredPassages.length === 0
    ) {
      return;
    }

    const randomIndex =
      Math.floor(
        Math.random() *
          filteredPassages.length
      );

    const randomPassage =
      filteredPassages[randomIndex];

    if (randomPassage) {
      setCurrentPassageId(
        randomPassage.id
      );

      setCurrentText(
        randomPassage.text
      );
    }
  };

  // -----------------------------------------
  // START PRACTICE
  // -----------------------------------------

  const handleStartPractice = () => {
    if (!requireSignUp()) {
      return;
    }

    countedFinishedTest.current = false;
    setTestMode('practice');
    reset();
    setIsSetup(false);
  };

  // -----------------------------------------
  // START QUICK TEST
  // -----------------------------------------

  const handleStartQuickTest = () => {
    if (!requireSignUp()) {
      return;
    }

    if (
      filteredPassages.length === 0
    ) {
      return;
    }

    const randomIndex =
      Math.floor(
        Math.random() *
          filteredPassages.length
      );

    const randomPassage =
      filteredPassages[randomIndex];

    if (randomPassage) {
      setCurrentPassageId(
        randomPassage.id
      );

      setCurrentText(
        randomPassage.text
      );
    }

    countedFinishedTest.current = false;
    setTestMode('quick');
    reset();
    setIsSetup(false);
  };

  // -----------------------------------------
  // BACK
  // -----------------------------------------

  const handleBack = () => {
    if (status === 'running') {
      const confirmed =
        window.confirm(
          'Are you sure you want to leave this test?'
        );

      if (!confirmed) {
        return;
      }

      reset();
    }

    if (
      document.fullscreenElement
    ) {
      document
        .exitFullscreen()
        .catch(() => {});
    }

    navigate('/');
  };

  // -----------------------------------------
  // RESTART
  // -----------------------------------------

  const handleRestart = () => {
    reset();
    setIsSetup(true);
  };

  // -----------------------------------------
  // FULLSCREEN + BEFORE UNLOAD
  // -----------------------------------------

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

      if (
        !document.fullscreenElement
      ) {
        document.documentElement
          .requestFullscreen()
          .catch(() => {});
      }
    }

    if (
      status === 'finished' ||
      status === 'idle'
    ) {
      if (
        document.fullscreenElement
      ) {
        document
          .exitFullscreen()
          .catch(() => {});
      }
    }

    return () => {
      window.removeEventListener(
        'beforeunload',
        handleBeforeUnload
      );
    };
  }, [status]);

  // =========================================
  // RESULTS SCREEN
  // =========================================

  if (status === 'finished') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col pt-16 px-4 md:px-8 overflow-y-auto items-center justify-center">

        <div className="w-full max-w-6xl">

          <Results
            stats={stats}
            timeElapsed={
              testDuration - timeLeft
            }
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

  // =========================================
  // SETUP SCREEN
  // =========================================

  if (isSetup) {
    return (
      <div className="min-h-screen bg-slate-900 text-white px-4 py-8 md:py-12 overflow-y-auto">

        <div className="max-w-5xl mx-auto">

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate('/')
            }
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />

            <span>
              Back to Home
            </span>
          </button>

          {/* HEADER */}

          <div className="text-center mb-8">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4">

              <Keyboard className="w-8 h-8 text-yellow-500" />

            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white">
              Typing Practice
            </h1>

            <p className="text-slate-400 mt-2">
              Improve your typing speed
              and accuracy in English
              or Marathi
            </p>

          </div>

          {/* LANGUAGE */}

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">

                <Globe className="w-5 h-5 text-yellow-500" />

              </div>

              <div>

                <h3 className="font-bold text-white text-base">
                  Select Typing Language
                </h3>

                <p className="text-xs text-slate-400">
                  Choose English or Marathi
                  practice mode
                </p>

              </div>

            </div>

            <div className="flex gap-2 w-full sm:w-auto">

              <button
                type="button"
                onClick={() =>
                  handleLanguageChange(
                    'english'
                  )
                }
                className={
                  selectedLanguage ===
                  'english'
                    ? 'flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold transition-all text-sm bg-yellow-500 text-slate-900 shadow-md'
                    : 'flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold transition-all text-sm bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }
              >
                English
              </button>

              <button
                type="button"
                onClick={() =>
                  handleLanguageChange(
                    'marathi'
                  )
                }
                className={
                  selectedLanguage ===
                  'marathi'
                    ? 'flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold transition-all text-sm font-devanagari bg-yellow-500 text-slate-900 shadow-md'
                    : 'flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold transition-all text-sm font-devanagari bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }
              >
                मराठी (Marathi)
              </button>

            </div>

          </div>

          {/* FREE TEST LIMIT */}

          {!user && (
            <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-bold text-yellow-400">
                    Free Practice
                  </p>
                  <p className="text-sm text-slate-300 mt-1">
                    {freeTestsCompleted < FREE_TEST_LIMIT
                      ? `${freeTestsCompleted} of ${FREE_TEST_LIMIT} free tests completed`
                      : 'Your 3 free tests are completed. Sign up and sign in to continue.'}
                  </p>
                </div>

                <div className="text-sm font-bold text-white whitespace-nowrap">
                  {freeTestsCompleted}/{FREE_TEST_LIMIT}
                </div>
              </div>
            </div>
          )}

          {/* QUICK TEST */}

          <div className="bg-slate-800/70 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl mb-8">

            <div className="flex items-center gap-3 mb-2">

              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center">

                <Zap className="w-6 h-6 text-yellow-500" />

              </div>

              <div>

                <h2 className="text-xl md:text-2xl font-bold text-white">

                  Quick Test (
                  {selectedLanguage ===
                  'english'
                    ? 'English'
                    : 'मराठी'}
                  )

                </h2>

                <p className="text-sm text-slate-400">
                  Start typing instantly
                  with a random passage
                </p>

              </div>

            </div>

            <div className="mt-6">

              <p className="text-sm font-bold text-slate-300 mb-3">
                Test Duration
              </p>

              <div className="grid grid-cols-3 gap-3">

                {[1, 3, 5].map(
                  (minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() =>
                        setQuickTestMinutes(
                          minutes
                        )
                      }
                      className={
                        quickTestMinutes ===
                        minutes
                          ? 'py-3 rounded-xl border font-bold transition-all bg-yellow-500 text-slate-900 border-yellow-500 shadow-lg'
                          : 'py-3 rounded-xl border font-bold transition-all bg-slate-900 text-slate-300 border-slate-700 hover:border-yellow-500/60'
                      }
                    >
                      {minutes} Minute
                      {minutes > 1
                        ? 's'
                        : ''}
                    </button>
                  )
                )}

              </div>

            </div>

            <button
              type="button"
              onClick={
                handleStartQuickTest
              }
              disabled={
                filteredPassages.length === 0 ||
                !hasFreeTestsLeft
              }
              className="w-full mt-5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />

              {user
                ? 'Start Quick Test'
                : freeTestsCompleted >= FREE_TEST_LIMIT
                ? 'Sign Up to Continue'
                : 'Start Quick Test'}
            </button>

          </div>

          {/* PASSAGE PRACTICE */}

          <div className="bg-slate-800/70 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center">

                <BookOpen className="w-6 h-6 text-yellow-500" />

              </div>

              <div>

                <h2 className="text-xl md:text-2xl font-bold text-white">

                  Passage Practice (
                  {selectedLanguage ===
                  'english'
                    ? 'English'
                    : 'मराठी'}
                  )

                </h2>

                <p className="text-sm text-slate-400">
                  Choose a passage and
                  practice for 7 minutes
                </p>

              </div>

            </div>

            {/* TARGET WPM */}

            <div className="mb-6">

              <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">

                <Target className="w-4 h-4 text-yellow-500" />

                Target Speed (WPM)

              </label>

              <div className="grid grid-cols-3 gap-3">

                {[30, 40, 50].map(
                  (wpm) => (
                    <button
                      key={wpm}
                      type="button"
                      onClick={() =>
                        setTargetWpm(
                          wpm
                        )
                      }
                      className={
                        targetWpm ===
                        wpm
                          ? 'py-3 rounded-xl border font-bold transition-all bg-yellow-500 text-slate-900 border-yellow-500 shadow-lg'
                          : 'py-3 rounded-xl border font-bold transition-all bg-slate-900 text-slate-300 border-slate-700 hover:border-yellow-500/60'
                      }
                    >
                      {wpm} WPM
                    </button>
                  )
                )}

              </div>

            </div>

            {/* PASSAGE */}

            <div className="mb-6">

              <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3">

                <BookOpen className="w-4 h-4 text-yellow-500" />

                Select Passage

              </label>

              <select
                value={
                  currentPassageId ||
                  filteredPassages[0]
                    ?.id ||
                  ''
                }
                onChange={(event) =>
                  handlePassageChange(
                    event.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 outline-none focus:border-yellow-500"
              >

                {filteredPassages.length ===
                0 ? (
                  <option value="">
                    No passages found
                  </option>
                ) : (
                  filteredPassages.map(
                    (passage) => (
                      <option
                        key={
                          passage.id
                        }
                        value={
                          passage.id
                        }
                      >
                        {
                          passage.title
                        }
                      </option>
                    )
                  )
                )}

              </select>

            </div>

            {/* RANDOM */}

            <button
              type="button"
              onClick={
                handleRandomPassage
              }
              disabled={
                filteredPassages.length ===
                0
              }
              className="w-full mb-5 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >

              <Shuffle className="w-4 h-4" />

              Random Passage

            </button>

            {/* INFO */}

            <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 text-sm text-slate-400 mb-5">

              <span className="text-slate-200 font-semibold">
                {targetWpm} WPM
              </span>

              <span className="mx-2">
                •
              </span>

              <span>
                {filteredPassages.find(
                  (p) =>
                    p.id ===
                    currentPassageId
                )?.title ||
                  filteredPassages[0]
                    ?.title ||
                  'Selected Passage'}
              </span>

              <span className="mx-2">
                •
              </span>

              <span>
                7:00 minutes
              </span>

            </div>

            {/* START */}

            <button
              type="button"
              onClick={
                handleStartPractice
              }
              disabled={
                filteredPassages.length === 0 ||
                !hasFreeTestsLeft
              }
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
            >
              {user
                ? 'Start Passage Practice'
                : freeTestsCompleted >= FREE_TEST_LIMIT
                ? 'Sign Up to Continue'
                : 'Start Passage Practice'}
            </button>

          </div>

          {/* ================================= */}
          {/* REAL STATS */}
          {/* ================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

            {/* BEST WPM */}

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 hover:border-yellow-500/30 transition-all">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">

                  <Trophy className="w-5 h-5 text-yellow-500" />

                </div>

                <span className="text-slate-400 text-sm">
                  Best WPM
                </span>

              </div>

              <p className="text-2xl font-black text-white mt-3">

                {historyLoading
                  ? '...'
                  : bestWpm > 0
                  ? formatNumber(
                      bestWpm
                    )
                  : '—'}

                {bestWpm > 0 && (
                  <span className="text-sm font-semibold text-slate-500 ml-1">
                    WPM
                  </span>
                )}

              </p>

            </div>

            {/* BEST ACCURACY */}

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                  <Target className="w-5 h-5 text-emerald-400" />

                </div>

                <span className="text-slate-400 text-sm">
                  Best Accuracy
                </span>

              </div>

              <p className="text-2xl font-black text-white mt-3">

                {historyLoading
                  ? '...'
                  : bestAccuracy > 0
                  ? formatNumber(
                      bestAccuracy
                    )
                  : '—'}

                {bestAccuracy > 0 && (
                  <span className="text-sm font-semibold text-slate-500 ml-1">
                    %
                  </span>
                )}

              </p>

            </div>

            {/* TESTS */}

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 hover:border-blue-500/30 transition-all">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">

                  <CheckCircle2 className="w-5 h-5 text-blue-400" />

                </div>

                <span className="text-slate-400 text-sm">
                  Tests Completed
                </span>

              </div>

              <p className="text-2xl font-black text-white mt-3">

                {historyLoading
                  ? '...'
                  : testsCompleted}

              </p>

            </div>

          </div>

          {/* TIPS */}

          <div className="mt-8 bg-slate-800/40 border border-slate-700 rounded-2xl p-6">

            <div className="flex items-center gap-2 mb-4">

              <Lightbulb className="w-5 h-5 text-yellow-500" />

              <h3 className="font-bold text-white">
                Typing Tips
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-400">

              <p>
                • Focus on accuracy
                before speed.
              </p>

              <p>
                • Keep your fingers
                on the correct keys.
              </p>

              <p>
                • Maintain a steady
                typing rhythm.
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================================
  // TYPING SCREEN
  // =========================================

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">

      <button
        type="button"
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700 backdrop-blur"
      >

        <ArrowLeft className="w-4 h-4" />

        <span>
          Back to Home
        </span>

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
        passages={filteredPassages}
        currentPassageId={
          currentPassageId
        }
        onPassageChange={
          handlePassageChange
        }
        onSubmit={finishTest}
      />

    </div>
  );
}

// =========================================
// HELPERS
// =========================================

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

export default Practice;