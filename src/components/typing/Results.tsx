import React from 'react';
import { TypingStats } from '../../hooks/useTypingTest';
import {
  Activity,
  Target,
  Zap,
  RotateCcw,
  Clock,
  Type,
  CheckCircle,
  XCircle,
  Home,
  TrendingUp,
  Award,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResultsProps {
  stats: TypingStats;
  timeElapsed: number;
  onRestart: () => void;
  onHome?: () => void;
}

export function Results({
  stats,
  timeElapsed,
  onRestart,
  onHome,
}: ResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformance = () => {
    if (stats.wpm >= 80) {
      return {
        title: 'Excellent Performance!',
        message: 'Outstanding typing speed. Keep pushing your limits.',
      };
    }

    if (stats.wpm >= 60) {
      return {
        title: 'Great Performance!',
        message: 'You are building strong typing speed and accuracy.',
      };
    }

    if (stats.wpm >= 40) {
      return {
        title: 'Good Job!',
        message: 'Nice work. Keep practicing to improve your speed.',
      };
    }

    return {
      title: 'Test Completed!',
      message: 'Keep practicing regularly to build your typing speed.',
    };
  };

  const performance = getPerformance();

  const accuracyProgress = Math.min(
    100,
    Math.max(0, Number(stats.accuracy))
  );

  const speedProgress = Math.min(
    100,
    Math.max(0, (Number(stats.wpm) / 120) * 100)
  );

  return (
    <div className="w-full max-w-6xl mx-auto page-enter">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-5">
          <Award className="w-8 h-8 text-yellow-400" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Test Complete
        </h2>

        <p className="text-slate-400 mt-2">
          Here&apos;s your typing performance
        </p>
      </div>

      {/* Main Result */}
      <div className="pro-card p-6 md:p-8 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* WPM */}
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-400 mb-3">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Typing Speed
              </span>
            </div>

            <div className="text-6xl md:text-7xl font-black text-white tracking-tight">
              {Number(stats.wpm).toFixed(1)}
            </div>

            <div className="text-slate-400 font-medium mt-1">
              Words Per Minute
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Speed</span>
                <span>120 WPM</span>
              </div>

              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${speedProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-400 mb-3">
              <Target className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Accuracy
              </span>
            </div>

            <div className="text-6xl md:text-7xl font-black text-white tracking-tight">
              {Number(stats.accuracy).toFixed(1)}%
            </div>

            <div className="text-slate-400 font-medium mt-1">
              Typing Accuracy
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Accuracy</span>
                <span>100%</span>
              </div>

              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-700"
                  style={{ width: `${accuracyProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Message */}
      <div className="pro-card p-5 md:p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">
              {performance.title}
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              {performance.message}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-green-400" />}
          label="Correct Words"
          value={stats.correctWords.toString()}
        />

        <StatCard
          icon={<XCircle className="w-5 h-5 text-red-400" />}
          label="Wrong Words"
          value={stats.wrongWords.toString()}
        />

        <StatCard
          icon={<Type className="w-5 h-5 text-purple-400" />}
          label="Correct Characters"
          value={stats.correctChars.toString()}
        />

        <StatCard
          icon={<Activity className="w-5 h-5 text-orange-400" />}
          label="Mistakes"
          value={stats.incorrectChars.toString()}
        />
      </div>

      {/* Extra Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <MiniStat
          icon={<Clock className="w-5 h-5" />}
          label="Time"
          value={formatTime(timeElapsed)}
        />

        <MiniStat
          icon={<Type className="w-5 h-5" />}
          label="Keystrokes"
          value={stats.totalKeystrokes.toString()}
        />

        <MiniStat
          icon={<Target className="w-5 h-5" />}
          label="Accuracy"
          value={`${Number(stats.accuracy).toFixed(1)}%`}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {onHome && (
          <button
            onClick={onHome}
            className="pro-btn pro-btn-secondary flex items-center justify-center gap-2 px-6 py-3"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        )}

        <button
          onClick={onRestart}
          className="pro-btn pro-btn-primary flex items-center justify-center gap-2 px-6 py-3"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Practice Again</span>
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="pro-card p-5 text-center">
      <div className="flex justify-center mb-3">{icon}</div>

      <div className="text-2xl md:text-3xl font-black text-white">
        {value}
      </div>

      <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700/70 bg-slate-800/40 p-4">
      <div className="flex items-center gap-3">
        <div className="text-slate-400">{icon}</div>

        <div className="min-w-0">
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            {label}
          </div>

          <div className="text-lg font-bold text-white truncate">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}