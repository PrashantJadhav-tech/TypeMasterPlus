import React from 'react';
import { Link } from 'react-router-dom';
import {
  Keyboard,
  ArrowUp,
  Github,
  Mail,
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative w-full border-t border-slate-800/80 bg-slate-950 text-slate-400">

      {/* Top gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">

            <Link
              to="/"
              className="inline-flex items-center gap-3 group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500 text-slate-950 shadow-lg shadow-yellow-500/20 transition-transform duration-200 group-hover:scale-105">
                <Keyboard size={24} strokeWidth={2.5} />
              </div>

              <div>
                <div className="text-lg font-bold tracking-tight text-slate-100">
                  TypeMaster<span className="text-yellow-400">Plus</span>
                </div>

                <div className="text-xs text-slate-500">
                  Practice. Improve. Master.
                </div>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-500">
              Improve your typing speed, accuracy and confidence
              with structured practice, exams and performance tracking.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">

              <Link
                to="/practice"
                className="pro-btn pro-btn-primary inline-flex items-center justify-center px-4 py-2 text-sm"
              >
                Start Practicing
              </Link>

              <Link
                to="/learn"
                className="pro-btn pro-btn-secondary inline-flex items-center justify-center px-4 py-2 text-sm"
              >
                Learn Typing
              </Link>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-200">
              Quick Links
            </h3>

            <div className="space-y-3 text-sm">

              <Link
                to="/"
                className="block transition-colors hover:text-yellow-400"
              >
                Home
              </Link>

              <Link
                to="/practice"
                className="block transition-colors hover:text-yellow-400"
              >
                Practice
              </Link>

              <Link
                to="/exam"
                className="block transition-colors hover:text-yellow-400"
              >
                Exam
              </Link>

              <Link
                to="/learn"
                className="block transition-colors hover:text-yellow-400"
              >
                Learn
              </Link>

            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-200">
              Platform
            </h3>

            <div className="space-y-3 text-sm">

              <Link
                to="/history"
                className="block transition-colors hover:text-yellow-400"
              >
                My History
              </Link>

              <Link
                to="/typing-game"
                className="block transition-colors hover:text-yellow-400"
              >
                Typing Games
              </Link>

              <Link
                to="/settings"
                className="block transition-colors hover:text-yellow-400"
              >
                Settings
              </Link>

              <Link
                to="/profile"
                className="block transition-colors hover:text-yellow-400"
              >
                Profile
              </Link>

            </div>
          </div>

        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-4 border-t border-slate-800/80 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="text-xs leading-5 text-slate-600">
            <p>
              © {currentYear} TypeMasterPlus. All rights reserved.
            </p>

            <p className="mt-1">
              Designed for speed and accuracy.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-200 hover:border-yellow-500/40 hover:bg-slate-800 hover:text-yellow-400"
            >
              <ArrowUp size={17} />
            </button>

            <a
              href="mailto:support@typemasterplus.com"
              aria-label="Contact TypeMasterPlus"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-200 hover:border-yellow-500/40 hover:bg-slate-800 hover:text-yellow-400"
            >
              <Mail size={17} />
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-200 hover:border-yellow-500/40 hover:bg-slate-800 hover:text-yellow-400"
            >
              <Github size={17} />
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}