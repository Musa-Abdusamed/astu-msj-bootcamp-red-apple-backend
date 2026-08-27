import React, { useState, useEffect } from 'react';
import { studentService } from '../../api/studentService';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    percentage: 0,
    presentSessions: 0,
    totalSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const studentId = user?._id || user?.id;

  const fetchAttendanceData = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [percentRes, recordsRes] = await Promise.allSettled([
        studentService.getMyAttendancePercentage(studentId),
        studentService.getMyAttendance(studentId),
      ]);

      if (percentRes.status === 'fulfilled') {
        const p = percentRes.value.data || {};
        setStats({
          percentage: p.percentage || 0,
          presentSessions: p.presentSessions || 0,
          totalSessions: p.totalSessions || 0,
        });
      }

      if (recordsRes.status === 'fulfilled') {
        const list =
          recordsRes.value.data?.attendance ||
          recordsRes.value.data?.data?.attendance ||
          recordsRes.value.data ||
          [];
        setAttendance(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error('Attendance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold">Loading attendance records...</p>
      </div>
    );
  }

  const absentSessions = attendance.filter((a) => a.status === 'absent').length;
  const lateSessions = attendance.filter((a) => a.status === 'late').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-1">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Attendance Oversight</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Attendance Record</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your lecture presence, lab participation, and overall attendance rate.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Percentage Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-xl">
            {stats.percentage}%
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Overall Attendance</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              {stats.percentage >= 80 ? (
                <span className="text-emerald-600 font-bold">Good Standing</span>
              ) : (
                <span className="text-rose-600 font-bold">Needs Attention</span>
              )}
            </div>
          </div>
        </div>

        {/* Present Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Present Sessions</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{stats.presentSessions}</div>
          </div>
        </div>

        {/* Late Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Late Check-ins</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{lateSessions}</div>
          </div>
        </div>

        {/* Total Sessions Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Total Sessions</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{stats.totalSessions}</div>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Session History</h3>
          <span className="text-xs text-slate-400 font-semibold">{attendance.length} Total Records</span>
        </div>

        {attendance.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Attendance Logged Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your mentors will mark attendance for daily lectures and lab sessions. Check back soon!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Session Date</th>
                  <th className="px-6 py-3.5">Cohort Batch</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Marked By</th>
                  <th className="px-6 py-3.5">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((record) => {
                  const isPresent = record.status === 'present';
                  const isAbsent = record.status === 'absent';
                  const isLate = record.status === 'late';
                  const isExcused = record.status === 'excused';

                  return (
                    <tr key={record._id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {new Date(record.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {record.batchId?.name || 'General Bootcamp'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isPresent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isAbsent
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isLate
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {isPresent && <CheckCircle2 className="w-3 h-3" />}
                          {isAbsent && <XCircle className="w-3 h-3" />}
                          {isLate && <Clock className="w-3 h-3" />}
                          <span>{record.status.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {record.markedBy?.fullName || 'Mentor'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 italic">
                        {record.note || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
