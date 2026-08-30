import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, ArrowRight, Menu, X } from 'lucide-react';

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isSettingsPage = location.pathname === '/settings';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Controlled by state on mobile, always visible on large screens */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-300 ease-in-out`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full object-contain" />
            <span className="font-bold text-slate-800 text-sm">ASTU MSJ Bootcamp</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {user?.role !== 'admin' && user?.mustChangeCredentials && !isSettingsPage && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-semibold shadow-xs border-b border-amber-600/20 gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
              <span>You are signed in with a temporary One-Time Password. Please change your password to secure your account.</span>
            </div>
            <Link
              to="/settings"
              state={{ firstLogin: true }}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition shrink-0 w-full sm:w-auto"
            >
              <span>Change Password</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
