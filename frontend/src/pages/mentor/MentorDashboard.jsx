import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mentorService } from '../../api/mentorService';
import {
  Layers,
  FileCode2,
  CalendarCheck,
  Users,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Megaphone,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalStudents: 0,
    totalAssignments: 0,
    activeBatches: [],
  });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorStats = async () => {
      try {
        setLoading(true);
        const [batchesRes, studentsRes, annRes] = await Promise.allSettled([
          mentorService.getBatches(),
          mentorService.getStudents('student'),
          mentorService.getAnnouncements(),
        ]);

        const batches = (batchesRes.status === 'fulfilled' ? batchesRes.value.data || batchesRes.value : []) || [];
        const students = (studentsRes.status === 'fulfilled' ? studentsRes.value.data || studentsRes.value : []) || [];
        
        const annVal = annRes.status === 'fulfilled' ? annRes.value : {};
        const rawAnn =
          annVal.announcements ||
          annVal.data?.announcements ||
          annVal.data ||
          (Array.isArray(annVal) ? annVal : []);

        let totalAsgCount = 0;
        if (batches.length > 0) {
          const asgRes = await mentorService.getBatchAssignments(batches[0]._id).catch(() => ({ data: [] }));
          totalAsgCount = (asgRes.data || []).length;
        }

        setStats({
          totalBatches: batches.length,
          totalStudents: students.length,
          totalAssignments: totalAsgCount,
          activeBatches: batches.slice(0, 3),
        });

        // Filter relevant announcements for mentors
        const relevant = (Array.isArray(rawAnn) ? rawAnn : []).filter(
          (a) => a.targetAudience === 'all' || a.targetAudience === 'mentors'
        );
        setAnnouncements(relevant.slice(0, 4));
      } catch (err) {
        console.error('Mentor dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorStats();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-xs border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mentor & Faculty Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.fullName || 'Mentor'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your cohort batches, review student project submissions, and track daily attendance telemetry.
          </p>
        </div>
      </div>

      {/* Announcements & Broadcasts */}
      {announcements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Faculty Notices & Broadcasts</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className={`p-4 sm:p-5 rounded-3xl border transition shadow-xs ${
                  ann.urgent ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200/80 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {ann.urgent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <AlertCircle className="w-3 h-3" />
                        Urgent
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(ann.publishDate || ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                    {ann.targetAudience}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-xs mb-1">{ann.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 whitespace-pre-line">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Batches */}
        <Link
          to="/mentor/batches"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Assigned Cohorts</div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalBatches}</div>
            <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
              <span>View Cohorts</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </Link>

        {/* Students */}
        <Link
          to="/mentor/progress"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Total Students</div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalStudents}</div>
            <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <span>Track Progress</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </Link>

        {/* Assignments & Grading */}
        <Link
          to="/mentor/assignments"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Coursework</div>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalAssignments}</div>
            <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
              <span>Grade Work</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <FileCode2 className="w-6 h-6" />
          </div>
        </Link>

        {/* Attendance */}
        <Link
          to="/mentor/attendance"
          className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Attendance</div>
            <div className="text-2xl font-extrabold text-slate-900">Mark</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>Log Session</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Cohorts Overview List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assigned Cohort Batches</h3>
            <p className="text-xs text-slate-500">Batches currently under your mentorship</p>
          </div>
          <Link
            to="/mentor/batches"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.activeBatches.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No batches assigned to your account yet. An administrator will assign you to an active cohort.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.activeBatches.map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs">{b.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{b.description || 'Bootcamp cohort'}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500">
                    {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-emerald-600">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
