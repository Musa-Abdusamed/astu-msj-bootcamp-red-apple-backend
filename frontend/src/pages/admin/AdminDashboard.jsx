import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Layers,
  CalendarCheck,
  FileCheck2,
  UserCheck,
  ArrowUpRight,
  Plus,
  Megaphone,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [statsRes, batchesRes, appsRes, subsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getBatches(),
        adminService.getApplications(),
        adminService.getSubmissions(),
      ]);
      setStats(statsRes.data);
      setBatches(batchesRes.data || []);
      setApplications(appsRes.data || []);
      setSubmissions(subsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const cards = [
    {
      title: 'Total Enrolled Students',
      value: stats?.totalStudents || 0,
      sub: 'Across 3 cohorts',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Active Mentors',
      value: stats?.totalMentors || 0,
      sub: 'Assigned to cohorts',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Active Batches',
      value: stats?.totalBatches || 0,
      sub: 'Summer 2026 Cohort',
      icon: Layers,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-100',
    },
    {
      title: 'Average Attendance',
      value: stats?.avgAttendance || '92.4%',
      sub: 'Cohort-wide telemetry',
      icon: CalendarCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Pending Applications',
      value: stats?.pendingApplications || 0,
      sub: 'Awaiting admissions triage',
      icon: UserCheck,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      highlight: true,
    },
    {
      title: 'Assignments Completion',
      value: stats?.assignmentCompletion || '88%',
      sub: `${stats?.totalSubmissions || 0} submissions submitted`,
      icon: FileCheck2,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-100',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASTU MSJ Summer Bootcamp 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics, student intake, and cohort management telemetry
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 shadow-xs transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Review Applications</span>
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex items-start justify-between relative overflow-hidden"
            >
              <div>
                <div className="text-xs font-semibold text-slate-500">{card.title}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {loading ? '...' : card.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-slate-400" />
                  <span>{card.sub}</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} border flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cohorts / Batches Overview & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Batches (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Current Cohort Batches</h3>
              <p className="text-xs text-slate-500">Active learning tracks in Summer 2026</p>
            </div>
            <Link
              to="/admin/batches"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage Batches</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {batches.map((batch) => (
              <div key={batch._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-900">{batch.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{batch.description}</p>
                  <div className="text-[11px] text-slate-400">
                    Schedule: <span className="font-semibold text-slate-600">{batch.startDate}</span> to{' '}
                    <span className="font-semibold text-slate-600">{batch.endDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {batch.studentCount || 40} Students
                  </span>
                  <Link
                    to="/admin/batches"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Recent Submissions & Actions (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {submissions.slice(0, 3).map((sub) => (
              <div key={sub._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      sub.status === 'graded'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {sub.status === 'graded' ? `Score: ${sub.score}` : 'Needs Review'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 truncate">{sub.assignmentTitle}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Submitted recently</span>
                </div>
              </div>
            ))}

            {applications.slice(0, 2).map((app) => (
              <div key={app._id} className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950">{app.fullName}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700">
                    {app.status}
                  </span>
                </div>
                <div className="text-[11px] text-indigo-900/80 truncate">
                  Applied for: {app.trackPreference || 'Bootcamp Track'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
