import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useSettings } from '../../contexts/SettingsContext';

const themeColors: Record<
  string,
  { main: string; hover: string }
> = {
  yellow: { main: '#eab308', hover: '#facc15' },
  blue: { main: '#3b82f6', hover: '#60a5fa' },
  green: { main: '#22c55e', hover: '#4ade80' },
  purple: { main: '#a855f7', hover: '#c084fc' },
  rose: { main: '#f43f5e', hover: '#fb7185' },
};

export function Layout() {
  const { settings } = useSettings();
  const location = useLocation();

  // Exam page वर Navbar आणि Footer hide
  const isExamPage = location.pathname === '/exam';

  useEffect(() => {
    const colors =
      themeColors[settings.theme] || themeColors.yellow;

    let styleEl = document.getElementById('theme-override');

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'theme-override';
      document.head.appendChild(styleEl);
    }

    const lightModeOverrides =
      settings.colorMode === 'light'
        ? `
          :root {
            --color-slate-950: #f8fafc;
            --color-slate-900: #f1f5f9;
            --color-slate-800: #ffffff;
            --color-slate-700: #e2e8f0;
            --color-slate-600: #cbd5e1;
            --color-slate-500: #64748b;
            --color-slate-400: #475569;
            --color-slate-300: #334155;
            --color-slate-200: #1e293b;
            --color-slate-100: #0f172a;
            --color-slate-50: #020617;
            --color-white: #0f172a;
          }
        `
        : '';

    styleEl.innerHTML = `
      :root {
        --color-yellow-400: ${colors.hover};
        --color-yellow-500: ${colors.main};
      }

      ${lightModeOverrides}
    `;

    if (settings.colorMode === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings.theme, settings.colorMode]);

  /*
   * ================================
   * EXAM PAGE
   * ================================
   */

  if (isExamPage) {
    return (
      <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-slate-950 text-slate-50 transition-colors duration-300">
        <div className="min-h-full w-full">
          <Outlet />
        </div>
      </div>
    );
  }

  /*
   * ================================
   * NORMAL PAGES
   * ================================
   */

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-50 transition-colors duration-300">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="relative flex-1 w-full">

        {/* Subtle background glow */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl" />

          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="absolute -bottom-32 left-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="w-full max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">

          <Outlet />

        </div>

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}