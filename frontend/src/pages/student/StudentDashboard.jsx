import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../api/studentService';
import {
  FileCode2,
  CalendarCheck,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sparkles,
  Megaphone,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    totalAssignments: 0,
    submittedAssignments: 0,
    progressScore: 0,
    announcementsCount: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = user?._id || user?.id;
  const batchId = user?.batchId?._id || user?.batchId || user?.batch;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [percentRes, assignRes, subsRes, progRes, annRes] = await Promise.allSettled([
          studentId ? studentService.getMyAttendancePercentage(studentId) : Promise.resolve({ data: {} }),
          batchId ? studentService.getBatchAssignments(batchId) : Promise.resolve({ data: [] }),
          studentService.getMySubmissions(),
          studentId ? studentService.getMyProgress(studentId) : Promise.resolve({ data: [] }),
          studentService.getAnnouncements(),
        ]);

        let assigns = (assignRes.status === 'fulfilled' ? assignRes.value.data || assignRes.value : []) || [];
        if (!Array.isArray(assigns) || assigns.length === 0) {
          const allRes = await studentService.getAllAssignments().catch(() => ({ data: [] }));
          assigns = allRes.data || (Array.isArray(allRes) ? allRes : []);
        }

        const subs = (subsRes.status === 'fulfilled' ? subsRes.value.data || subsRes.value : []) || [];
        const prog = (progRes.status === 'fulfilled' ? progRes.value.data?.progress || progRes.value.data || progRes.value : []) || [];

        const annVal = annRes.status === 'fulfilled' ? annRes.value : {};
        const rawAnn =
          annVal.announcements ||
          annVal.data?.announcements ||
          annVal.data ||
          (Array.isArray(annVal) ? annVal : []);

        const scoredItems = Array.isArray(prog) ? prog.filter((p) => typeof p.score === 'number') : [];
        const avgScore =
          scoredItems.length > 0
            ? Math.round(scoredItems.reduce((a, b) => a + b.score, 0) / scoredItems.length)
            : 0;

        setStats({
          attendancePercentage: attendanceData.percentage || 0,
          totalAssignments: (Array.isArray(assigns) ? assigns : []).length,
          submittedAssignments: (Array.isArray(subs) ? subs : []).length,
          progressScore: avgScore,
          announcementsCount: (Array.isArray(rawAnn) ? rawAnn : []).length,
        });

        setRecentAssignments((Array.isArray(assigns) ? assigns : []).slice(0, 3));
      } catch (err) {
        console.error('Student dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [studentId, batchId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-xs border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASTU MSJ Summer 2026 Cohort</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Track your weekly roadmap progress, submit coding assignments, and stay ahead of your milestones.
          </p>
        </div>
      </div>

      {/* Module Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Attendance Rate */}
        <Link
          to="/student/attendance"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">{stats.attendancePercentage}%</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>View Sessions</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Assignments Submitted */}
        <Link
          to="/student/assignments"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Assignments</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">
              {stats.submittedAssignments}{' '}
              <span className="text-xs font-normal text-slate-400">/ {stats.totalAssignments}</span>
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
              <span>Submit Work</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Progress Score */}
        <Link
          to="/student/progress"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Progress</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">{stats.progressScore}%</div>
            <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <span>Inspect Roadmap</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Announcements Section Link */}
        <Link
          to="/student/announcements"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Notices</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">{stats.announcementsCount}</div>
            <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
              <span>Read Bulletins</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Curriculum & Resources */}
        <Link
          to="/student/resources"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Resources</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">Guides</div>
            <div className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
              <span>Explore Materials</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Active Coursework Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Assignments</h3>
            <p className="text-xs text-slate-500">Active coursework for your cohort</p>
          </div>
          <Link
            to="/student/assignments"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAssignments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No assignments currently active. Check back after your next lecture!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAssignments.map((asg) => (
              <div
                key={asg._id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{asg.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{asg.description}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500">Due: {new Date(asg.deadline).toLocaleDateString()}</span>
                  <span className="font-bold text-indigo-600">{asg.maxScore} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
