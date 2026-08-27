import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isSettingsPage = location.pathname === '/settings';

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {user?.role !== 'admin' && user?.mustChangeCredentials && !isSettingsPage && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2.5 flex items-center justify-between text-xs font-semibold shadow-xs border-b border-amber-600/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
              <span>You are signed in with a temporary One-Time Password. Please change your password to secure your account.</span>
            </div>
            <Link
              to="/settings"
              state={{ firstLogin: true }}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition shrink-0 ml-3"
            >
              <span>Change Password</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
