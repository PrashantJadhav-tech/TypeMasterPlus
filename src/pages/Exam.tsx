import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingTest } from '../hooks/useTypingTest';
import { SplitTypingArea } from '../components/typing/SplitTypingArea';
import { Results } from '../components/typing/Results';
import { usePassages } from '../contexts/PassagesContext';
import { ArrowLeft, Keyboard, Target, BookOpen } from 'lucide-react';

export function Exam() {
  const navigate = useNavigate();
  const { passages, getRandomPassage, currentPassageId, setCurrentPassageId } = usePassages();

  const initialPassage =
    (currentPassageId && passages.find(p => p.id === currentPassageId)) ||
    passages[0] ||
    getRandomPassage();

  const [currentText, setCurrentText] = useState(initialPassage?.text || '');
  const [targetWpm, setTargetWpm] = useState<number>(30);
  const [isSetup, setIsSetup] = useState(true);

  useEffect(() => {
    if (!currentPassageId && initialPassage) {
      setCurrentPassageId(initialPassage.id);
    }
  }, [currentPassageId, initialPassage, setCurrentPassageId]);

  const {
    input,
    status,
    timeLeft,
    stats,
    handleInput,
    reset,
    forceStart,
    submitTest
  } = useTypingTest(currentText, 420);

  const handlePassageChange = (id: string) => {
    const passage = passages.find(p => p.id === id);
    if (!passage) return;

    setCurrentPassageId(id);
    setCurrentText(passage.text);
  };

  const handleStartExam = () => {
    reset();
    setIsSetup(false);

    setTimeout(() => forceStart(), 0);
  };

  const handleBack = () => {
    if (status === 'running') {
      if (!window.confirm("Are you sure you want to leave this test?")) return;
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

  if (status === 'finished') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col pt-16 px-4 md:px-8 overflow-y-auto items-center justify-center">
        <div className="w-full">
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

  if (isSetup) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4">
                <Keyboard className="w-8 h-8 text-yellow-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">Exam Setup</h1>
              <p className="text-slate-400 mt-2">Choose your target speed and passage before starting.</p>
            </div>

            <div className="space-y-6">
              <div>
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

              <div>
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

              <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 text-sm text-slate-400">
                <span className="text-slate-200 font-semibold">{targetWpm} WPM</span>
                <span className="mx-2">•</span>
                <span>{passages.find(p => p.id === currentPassageId)?.title || initialPassage?.title || 'Selected Passage'}</span>
                <span className="mx-2">•</span>
                <span>7:00 minutes</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartExam}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
                >
                  Start Exam
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 sm:flex-none sm:min-w-32 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white font-bold py-3 px-6 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
