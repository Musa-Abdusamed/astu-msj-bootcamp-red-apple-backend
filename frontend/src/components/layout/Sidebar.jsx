import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Layers,
  CalendarCheck,
  FileCode2,
  Megaphone,
  BookOpen,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase() || 'admin';

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Applications', path: '/admin/applications', icon: UserCheck },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Batches & Cohorts', path: '/admin/batches', icon: Layers },
    { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Assignments & Grades', path: '/admin/assignments', icon: FileCode2 },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Curriculum & Resources', path: '/admin/curriculum', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-4 border-r border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center font-mono font-extrabold text-sm text-white shadow-md shadow-indigo-500/20">
            &gt;_
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>ASTU MSJ</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                Admin
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Control Panel</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Management Modules
        </div>
        <nav className="space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="truncate">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Sign Out */}
      <div className="pt-4 mt-6 border-t border-slate-800 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{user?.name || user?.fullName || 'Nafyad (Lead Admin)'}</div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@astu.edu.et'}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
