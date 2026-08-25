import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileCode2,
  TrendingUp,
  Megaphone,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function MentorSidebar() {
  const { user, logout } = useAuth();

  const mentorLinks = [
    {
      name: "Overview",
      path: "/mentor",
      icon: LayoutDashboard,
    },
    {
      name: "My Students",
      path: "/mentor/students",
      icon: Users,
    },
    {
      name: "Attendance",
      path: "/mentor/attendance",
      icon: CalendarCheck,
    },
    {
      name: "Assignments",
      path: "/mentor/assignments",
      icon: FileCode2,
    },
    {
      name: "Student Progress",
      path: "/mentor/progress",
      icon: TrendingUp,
    },
    {
      name: "Announcements",
      path: "/mentor/announcements",
      icon: Megaphone,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-4 border-r border-slate-800 shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center font-bold text-sm">
            <GraduationCap className="w-5 h-5" />
          </div>

          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>ASTU MSJ</span>

              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase">
                Mentor
              </span>
            </div>

            <div className="text-[11px] text-slate-400">Mentor Portal</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Mentor Modules
        </div>

        <nav className="space-y-1">
          {mentorLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === "/mentor"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
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
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "M"}
          </div>

          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">
              {user?.fullName || "Mentor"}
            </div>

            <div className="text-[10px] text-slate-400 truncate">
              {user?.email || "mentor@astu.edu.et"}
            </div>
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
