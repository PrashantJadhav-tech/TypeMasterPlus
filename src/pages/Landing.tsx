import React from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, Activity, Target, Zap, ChevronRight, BarChart3, Trophy, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full font-medium text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Zap className="w-4 h-4" />
          <span>The Ultimate Typing Experience</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          Type Faster. <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Type Smarter.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Master your keyboard with advanced analytics, customizable tests, and professional training modes designed to push your limits.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
          <Link to="/practice" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-full transition-transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)]">
            <Keyboard className="w-5 h-5" />
            <span>Start Typing</span>
          </Link>
          {!user && (
            <Link to="/register" className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg px-8 py-4 rounded-full transition-colors flex items-center justify-center border border-slate-700 hover:border-slate-500">
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Modes Section */}
      <section className="w-full py-20 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
            <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Practice Mode</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Casual typing test with full control. Choose your duration, use backspace, enable blind mode, and practice at your own pace.
            </p>
            <Link to="/practice" className="inline-flex items-center space-x-2 text-yellow-500 font-semibold hover:text-yellow-400 group/link">
              <span>Try Practice Mode</span>
              <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-red-500/50 transition-colors group">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Exam Mode</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Strict 60-second test. No backspace allowed. Perfect for serious typists preparing for professional data entry certifications.
            </p>
            <Link to="/exam" className="inline-flex items-center space-x-2 text-red-400 font-semibold hover:text-red-300 group/link">
              <span>Take the Exam</span>
              <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Features Highlights */}
      <section className="w-full py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to improve</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">TypeMasterPlus is packed with features designed to analyze your weaknesses and boost your raw typing speed.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <FeatureCard 
            icon={<BarChart3 />}
            title="Advanced Analytics"
            desc="Track WPM, Accuracy, and error rates over time with detailed charts."
          />
          <FeatureCard 
            icon={<Trophy />}
            title="Custom Library"
            desc="Add your own text passages to practice material relevant to your work."
          />
          <FeatureCard 
            icon={<Users />}
            title="Personalized Settings"
            desc="Fine-tune audio cues, visual highlights, colors, and font sizes."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-slate-900 border border-slate-800 rounded-2xl">
      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
