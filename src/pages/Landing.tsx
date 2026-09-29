import React from 'react';
import { Link } from 'react-router-dom';
import {
  Keyboard,
  Activity,
  Target,
  Zap,
  ChevronRight,
  BarChart3,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Gauge,
  Clock3,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Landing() {
  const { user } = useAuth();

  return (
    <div className="w-full">

      {/* ================================
          HERO SECTION
      ================================= */}

      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-28">

        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl sm:h-96 sm:w-96" />

          <div className="absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl text-center">

          {/* Badge */}
          <div className="page-enter mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs font-semibold text-yellow-400 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Professional Typing Practice Platform</span>
          </div>

          {/* Heading */}
          <h1 className="page-enter text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">

            Type Faster.

            <br />

            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Type Smarter.
            </span>

          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg md:text-xl">
            Build your typing speed, improve accuracy and track your
            progress with professional practice, exams, analytics and
            personalized settings.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">

            <Link
              to="/practice"
              className="pro-btn pro-btn-primary group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base shadow-lg shadow-yellow-500/10 sm:px-7"
            >
              <Keyboard className="h-5 w-5" />

              <span>Start Typing</span>

              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {!user && (
              <Link
                to="/register"
                className="pro-btn pro-btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base sm:px-7"
              >
                Create Free Account
              </Link>
            )}

            {user && (
              <Link
                to="/dashboard"
                className="pro-btn pro-btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base sm:px-7"
              >
                <Gauge className="h-5 w-5" />
                Go to Dashboard
              </Link>
            )}

          </div>

          {/* Small benefits */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-slate-500 sm:text-sm">

            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              Practice Mode
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              Performance Tracking
            </span>

            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              Custom Settings
            </span>

          </div>

        </div>
      </section>


      {/* ================================
          QUICK STATS
      ================================= */}

      <section className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">

        <MiniStat
          icon={<Gauge className="h-5 w-5" />}
          value="WPM"
          label="Speed Tracking"
        />

        <MiniStat
          icon={<Target className="h-5 w-5" />}
          value="99%"
          label="Accuracy Focus"
        />

        <MiniStat
          icon={<Clock3 className="h-5 w-5" />}
          value="7 Min"
          label="Exam Mode"
        />

        <MiniStat
          icon={<Activity className="h-5 w-5" />}
          value="Live"
          label="Performance Stats"
        />

      </section>


      {/* ================================
          MODES
      ================================= */}

      <section className="border-t border-slate-800/70 py-12 sm:py-16">

        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <span className="pro-badge mb-3 inline-flex">
              Training Modes
            </span>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Choose how you want to practice
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Practice freely or challenge yourself with a structured typing exam.
            </p>
          </div>

        </div>


        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* Practice Card */}
          <div className="pro-card group relative overflow-hidden p-6 sm:p-8">

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-500/5 blur-2xl transition-all duration-300 group-hover:bg-yellow-500/10" />

            <div className="relative">

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/10 transition-transform duration-300 group-hover:scale-105">
                <Activity className="h-7 w-7" />
              </div>

              <div className="mb-2 flex items-center gap-3">
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Practice Mode
                </h3>

                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-400">
                  Flexible
                </span>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Practice at your own pace with selectable passages,
                target WPM, quick tests, language options and detailed results.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">

                <FeaturePoint text="English & Marathi" />
                <FeaturePoint text="Quick Tests" />
                <FeaturePoint text="Target WPM" />
                <FeaturePoint text="Performance Results" />

              </div>

              <Link
                to="/practice"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 transition-colors hover:text-yellow-300"
              >
                <span>Start Practice</span>

                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

            </div>
          </div>


          {/* Exam Card */}
          <div className="pro-card group relative overflow-hidden p-6 sm:p-8">

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/5 blur-2xl transition-all duration-300 group-hover:bg-red-500/10" />

            <div className="relative">

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/10 transition-transform duration-300 group-hover:scale-105">
                <Target className="h-7 w-7" />
              </div>

              <div className="mb-2 flex items-center gap-3">
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Exam Mode
                </h3>

                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                  Strict
                </span>
              </div>

              <p className="max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Take a structured 7-minute typing exam with strict
                typing rules and professional performance evaluation.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">

                <FeaturePoint text="7-Minute Exam" />
                <FeaturePoint text="Strict Typing" />
                <FeaturePoint text="Target WPM" />
                <FeaturePoint text="Detailed Results" />

              </div>

              <Link
                to="/exam"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition-colors hover:text-red-300"
              >
                <span>Take Exam</span>

                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

            </div>
          </div>

        </div>
      </section>


      {/* ================================
          FEATURES
      ================================= */}

      <section className="border-t border-slate-800/70 py-12 sm:py-16">

        <div className="mx-auto mb-10 max-w-2xl text-center">

          <span className="pro-badge mb-3 inline-flex">
            Built for Improvement
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Everything you need to improve
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            TypeMasterPlus gives you the tools to understand your
            performance and continuously improve your typing skills.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <FeatureCard
            icon={<BarChart3 />}
            title="Advanced Analytics"
            desc="Track WPM, accuracy, tests and improvement over time with your personal history."
          />

          <FeatureCard
            icon={<Trophy />}
            title="Achievements"
            desc="Build your typing streak, earn XP and unlock achievements as your performance improves."
          />

          <FeatureCard
            icon={<Keyboard />}
            title="Typing Practice"
            desc="Practice with different passages, durations, target speeds and typing modes."
          />

          <FeatureCard
            icon={<Target />}
            title="Performance Goals"
            desc="Set daily goals and keep yourself consistent with measurable typing progress."
          />

          <FeatureCard
            icon={<Users />}
            title="Personalized Settings"
            desc="Customize themes, font sizes, cursor style, sounds and typing preferences."
          />

          <FeatureCard
            icon={<Zap />}
            title="Fast & Focused"
            desc="A clean distraction-free interface designed to help you focus on every keystroke."
          />

        </div>
      </section>


      {/* ================================
          FINAL CTA
      ================================= */}

      <section className="relative overflow-hidden py-12 sm:py-16">

        <div className="pro-card relative overflow-hidden p-7 text-center sm:p-10">

          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <Keyboard className="h-6 w-6" />
            </div>

            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to improve your typing?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Start a typing test today and see how fast and accurate
              you can become.
            </p>

            <Link
              to="/practice"
              className="pro-btn pro-btn-primary mt-6 inline-flex items-center gap-2 px-6 py-3"
            >
              <Keyboard className="h-5 w-5" />
              Start Typing
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


/* ========================================
   FEATURE POINT
======================================== */

function FeaturePoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-yellow-400" />
      <span>{text}</span>
    </div>
  );
}


/* ========================================
   MINI STAT
======================================== */

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="pro-card flex items-center gap-3 p-4 sm:p-5">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-yellow-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-200 sm:text-base">
          {value}
        </p>

        <p className="truncate text-[11px] text-slate-500 sm:text-xs">
          {label}
        </p>
      </div>

    </div>
  );
}


/* ========================================
   FEATURE CARD
======================================== */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="pro-card group p-5 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/20 sm:p-6">

      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition-colors duration-300 group-hover:bg-yellow-500/10 group-hover:text-yellow-400">
        {icon}
      </div>

      <h3 className="text-base font-bold text-white sm:text-lg">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {desc}
      </p>

    </div>
  );
}