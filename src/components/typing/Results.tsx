import React from 'react';
import { TypingStats } from '../../hooks/useTypingTest';
import { Activity, Target, Zap, RotateCcw, Clock, Type, CheckCircle, XCircle, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResultsProps {
  stats: TypingStats;
  timeElapsed: number;
  onRestart: () => void;
  onHome?: () => void;
}

export function Results({ stats, timeElapsed, onRestart, onHome }: ResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 md:p-12 animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Test Complete</h2>
        <p className="text-slate-400">Here's how you performed</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
        <StatCard 
          icon={<Zap className="w-6 h-6 text-yellow-500" />} 
          label="WPM" 
          value={stats.wpm.toString()} 
          highlight 
        />
        <StatCard 
          icon={<Target className="w-6 h-6 text-blue-500" />} 
          label="Accuracy" 
          value={`${stats.accuracy}%`} 
        />
        <StatCard 
          icon={<CheckCircle className="w-6 h-6 text-green-500" />} 
          label="Correct Words" 
          value={stats.correctWords.toString()} 
        />
        <StatCard 
          icon={<XCircle className="w-6 h-6 text-red-500" />} 
          label="Wrong Words" 
          value={stats.wrongWords.toString()} 
        />
        <StatCard 
          icon={<Type className="w-6 h-6 text-purple-500" />} 
          label="Characters" 
          value={stats.correctChars.toString()} 
        />
        <StatCard 
          icon={<span className="text-red-500 font-bold text-xl leading-none px-1">✕</span>} 
          label="Mistakes" 
          value={stats.incorrectChars.toString()} 
        />
        <StatCard 
          icon={<Clock className="w-6 h-6 text-orange-500" />} 
          label="Time" 
          value={formatTime(timeElapsed)} 
        />
      </div>

      <div className="flex justify-center items-center space-x-4">
        {onHome && (
          <button
            onClick={onHome}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        )}
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Practice Again</span>
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, highlight = false }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "p-6 rounded-xl border flex flex-col items-center justify-center text-center space-y-2",
      highlight ? "border-yellow-500/30 bg-yellow-500/5" : "border-slate-700 bg-slate-800/50"
    )}>
      <div className="mb-2">{icon}</div>
      <div className={cn(
        "text-3xl font-black tracking-tighter",
        highlight ? "text-yellow-500" : "text-white"
      )}>
        {value}
      </div>
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}
