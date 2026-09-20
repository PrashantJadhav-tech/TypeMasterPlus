import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useSettings } from '../../contexts/SettingsContext';

const themeColors: Record<string, { main: string, hover: string }> = {
  yellow: { main: '#eab308', hover: '#facc15' },
  blue: { main: '#3b82f6', hover: '#60a5fa' },
  green: { main: '#22c55e', hover: '#4ade80' },
  purple: { main: '#a855f7', hover: '#c084fc' },
  rose: { main: '#f43f5e', hover: '#fb7185' },
};

export function Layout() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const colors = themeColors[settings.theme] || themeColors.yellow;
    
    let styleEl = document.getElementById('theme-override');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'theme-override';
      document.head.appendChild(styleEl);
    }
    
    // In light mode, we invert the slate colors.
    const lightModeOverrides = settings.colorMode === 'light' ? `
      :root {
        --color-slate-950: #f8fafc; /* slate-50 */
        --color-slate-900: #f1f5f9; /* slate-100 */
        --color-slate-800: #ffffff; /* white */
        --color-slate-700: #e2e8f0; /* slate-200 */
        --color-slate-600: #cbd5e1; /* slate-300 */
        --color-slate-500: #64748b; /* slate-500 */
        --color-slate-400: #475569; /* slate-600 */
        --color-slate-300: #334155; /* slate-700 */
        --color-slate-200: #1e293b; /* slate-800 */
        --color-slate-100: #0f172a; /* slate-900 */
        --color-slate-50:  #020617; /* slate-950 */
        --color-white: #0f172a;     /* slate-900 */
      }
    ` : '';
    
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-50 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
