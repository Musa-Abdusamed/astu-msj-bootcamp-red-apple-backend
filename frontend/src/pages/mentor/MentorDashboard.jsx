import React from "react";
import {
  Users,
  ClipboardCheck,
  FileText,
  Megaphone,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

export default function MentorDashboard() {
  const stats = [
    {
      title: "My Students",
      value: "24",
      icon: Users,
      description: "Students in your batch",
    },
    {
      title: "Attendance",
      value: "87%",
      icon: ClipboardCheck,
      description: "Average attendance",
    },
    {
      title: "Assignments",
      value: "12",
      icon: FileText,
      description: "Active assignments",
    },
    {
      title: "Announcements",
      value: "5",
      icon: Megaphone,
      description: "Recent announcements",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Mentor Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your students, attendance, assignments, and progress.
        </p>
      </div>

      {/* Batch Information */}
      <div className="rounded-2xl bg-indigo-600 p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-200">
              Assigned Batch
            </p>

            <h2 className="mt-1 text-xl font-bold">
              ASTU MSJ Summer Bootcamp 2026
            </h2>

            <p className="mt-2 text-sm text-indigo-100">
              You are assigned as a mentor for this batch.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-3">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>

                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">Recent Activity</h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest activity from your students
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <ClipboardCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Attendance recorded
                </p>

                <p className="text-xs text-slate-500">
                  Today's attendance has been recorded.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <FileText className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Assignment activity
                </p>

                <p className="text-xs text-slate-500">
                  Students have submitted recent assignments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Megaphone className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  New announcement
                </p>

                <p className="text-xs text-slate-500">
                  A new announcement was posted for your batch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">Upcoming Schedule</h2>

            <p className="mt-1 text-xs text-slate-500">
              Your upcoming bootcamp activities
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
              <div className="rounded-xl bg-white p-3 text-indigo-600 shadow-sm">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Web Development Session
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Tomorrow · 9:00 AM
                </p>

                <p className="mt-2 text-xs font-medium text-indigo-600">
                  ASTU MSJ Bootcamp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
