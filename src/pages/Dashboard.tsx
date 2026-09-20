import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { History as HistoryIcon, Activity, Trophy, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.username}!</h1>
        <p className="text-slate-400">Here is a summary of your recent typing activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Activity className="text-yellow-500" />} title="Average WPM" value="85" />
        <StatCard icon={<Trophy className="text-green-500" />} title="Highest WPM" value="112" />
        <StatCard icon={<Clock className="text-blue-500" />} title="Time Typed" value="4h 12m" />
        <StatCard icon={<HistoryIcon className="text-purple-500" />} title="Tests Taken" value="142" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Tests</h2>
              <Link to="/history" className="text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-lg text-white">
                      {90 - i * 5}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-300">Practice Mode • 30s</div>
                      <div className="text-xs text-slate-500">2 hours ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-500">98% Acc</div>
                    <div className="text-xs text-slate-500">{320 - i * 15} chars</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/practice" className="w-full flex items-center justify-between p-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-xl transition-colors">
                <span className="font-bold">Start Practice</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/exam" className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors">
                <span className="font-bold">Take Exam</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/passages" className="w-full flex items-center justify-between p-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl transition-colors">
                <span className="font-bold">Add Passage</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
      <div className="mb-3">{icon}</div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400 font-medium">{title}</div>
    </div>
  );
}
