import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-900 text-slate-500 py-6 text-center text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} TypeMasterPlus. Designed for speed and accuracy.</p>
      </div>
    </footer>
  );
}
