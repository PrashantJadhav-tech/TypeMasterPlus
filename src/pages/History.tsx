import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { date: '1', wpm: 45, accuracy: 92 },
  { date: '2', wpm: 52, accuracy: 95 },
  { date: '3', wpm: 50, accuracy: 94 },
  { date: '4', wpm: 60, accuracy: 96 },
  { date: '5', wpm: 65, accuracy: 98 },
  { date: '6', wpm: 63, accuracy: 97 },
  { date: '7', wpm: 72, accuracy: 98 },
];

export function History() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Track Your Progress</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          Sign in to view your typing history, see your WPM trends over time, and analyze your performance.
        </p>
        <Link to="/login" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-3 rounded-full font-bold transition-all">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
        <p className="text-slate-400">Keep up the great work, {user.username}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Average WPM</p>
          <p className="text-4xl font-black text-white">58</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Top Speed</p>
          <p className="text-4xl font-black text-yellow-500">72</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Tests Completed</p>
          <p className="text-4xl font-black text-white">124</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 p-6 md:p-8 rounded-2xl h-[400px]">
        <h3 className="text-lg font-bold text-white mb-6">WPM Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dummyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickMargin={10} axisLine={false} />
            <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickMargin={10} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#eab308' }}
            />
            <Line type="monotone" dataKey="wpm" stroke="#eab308" strokeWidth={3} dot={{r: 4, fill: '#eab308', strokeWidth: 0}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
