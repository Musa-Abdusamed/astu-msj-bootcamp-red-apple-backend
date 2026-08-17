import React from 'react';

export default function Footer() {
  return (
    <footer className="py-8 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs">
              &gt;_
            </div>
            <div className="text-sm font-bold text-slate-900">
              ASTU MSJ <span className="text-indigo-600">Bootcamp</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-400">
            © 2026 ASTU Microsoft Student Group. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
}
