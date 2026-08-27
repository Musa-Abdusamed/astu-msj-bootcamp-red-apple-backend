import React, { useState, useEffect } from 'react';
import { mentorService } from '../../api/mentorService';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Save,
  Users,
  Search,
  Check,
  Sparkles,
} from 'lucide-react';

export default function MentorAttendance() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { [studentId]: { status: 'present', note: '', recordId?: '' } }
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const bRes = await mentorService.getBatches();
        const bList = bRes.data || [];
        setBatches(bList);
        if (bList.length > 0) {
          setSelectedBatchId(bList[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch batches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const loadBatchRosterAndRecords = async () => {
    if (!selectedBatchId) return;

    try {
      setLoading(true);
      const [usersRes, attRes] = await Promise.allSettled([
        mentorService.getStudents('student'),
        mentorService.getBatchAttendance(selectedBatchId, selectedDate),
      ]);

      const allStudents = (usersRes.status === 'fulfilled' ? usersRes.value.data : []) || [];
      const batchStudents = allStudents.filter(
        (s) => (s.batchId?._id || s.batchId) === selectedBatchId
      );
      setStudents(batchStudents);

      const existingRecords = (attRes.status === 'fulfilled' ? attRes.value.data : []) || [];

      // Map existing records by student ID
      const recordByStudent = {};
      if (Array.isArray(existingRecords)) {
        existingRecords.forEach((r) => {
          const sId = r.studentId?._id || r.studentId;
          if (sId) {
            recordByStudent[sId] = {
              status: r.status,
              note: r.note || '',
              recordId: r._id,
            };
          }
        });
      }

      // Populate attendance map for each student in batch
      const updatedMap = {};
      batchStudents.forEach((st) => {
        if (recordByStudent[st._id]) {
          updatedMap[st._id] = recordByStudent[st._id];
        } else {
          updatedMap[st._id] = { status: 'absent', note: '' };
        }
      });

      setAttendanceMap(updatedMap);
    } catch (err) {
      console.error('Failed to load roster and records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatchRosterAndRecords();
  }, [selectedBatchId, selectedDate]);

  const handleStatusToggle = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId, note) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  const handleMarkAll = (status) => {
    setAttendanceMap((prev) => {
      const updated = { ...prev };
      students.forEach((st) => {
        updated[st._id] = {
          ...updated[st._id],
          status,
        };
      });
      return updated;
    });
    showToast(`Set all students to ${status.toUpperCase()}`);
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) return;
    setIsSaving(true);

    try {
      let savedCount = 0;

      for (const st of students) {
        const record = attendanceMap[st._id] || { status: 'absent', note: '' };
        
        if (record.recordId) {
          await mentorService.updateAttendance(record.recordId, {
            status: record.status,
            date: selectedDate,
            note: record.note,
          });
        } else {
          await mentorService.markAttendance({
            studentId: st._id,
            date: selectedDate,
            status: record.status,
            note: record.note,
          });
        }
        savedCount++;
      }

      showToast(`Saved attendance for all ${savedCount} students on ${selectedDate}!`);
      loadBatchRosterAndRecords();
    } catch (err) {
      console.error('Save attendance error:', err);
      showToast('Error saving attendance records.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = students.filter(
    (st) =>
      st.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (st.userId && st.userId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Status tally
  const presentCount = students.filter((s) => attendanceMap[s._id]?.status === 'present').length;
  const absentCount = students.filter((s) => (attendanceMap[s._id]?.status || 'absent') === 'absent').length;
  const lateCount = students.filter((s) => attendanceMap[s._id]?.status === 'late').length;
  const excusedCount = students.filter((s) => attendanceMap[s._id]?.status === 'excused').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-1">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Cohort Attendance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Student Attendance Roster</h1>
          <p className="text-xs text-slate-500 mt-1">
            Click any status on a student row to toggle between Present, Absent, Late, and Excused.
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={isSaving || students.length === 0}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Records...' : 'Save Attendance'}</span>
        </button>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Batch Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Cohort Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Bulk Action Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Quick Bulk Actions</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="flex-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>All Present</span>
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="flex-1 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>All Absent</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Breakdown Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search students in this batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Present: {presentCount}
            </span>
            <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              Absent: {absentCount}
            </span>
            <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Late: {lateCount}
            </span>
            <span className="text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              Excused: {excusedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Student Roster Table with Direct Toggles */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Roster & Attendance Toggles</h3>
          <span className="text-xs text-slate-400 font-semibold">{filteredStudents.length} Students</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-xs font-semibold">Loading batch roster...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Students Enrolled in this Batch</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Students enrolled in this cohort batch will appear here for daily attendance tracking.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Student Information</th>
                  <th className="px-6 py-3.5">Student ID</th>
                  <th className="px-6 py-3.5">Status Toggle (Click to Mark)</th>
                  <th className="px-6 py-3.5">Session Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const currentStatus = attendanceMap[st._id]?.status || 'absent';
                  const currentNote = attendanceMap[st._id]?.note || '';

                  return (
                    <tr key={st._id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{st.fullName}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-slate-600">
                        {st.userId || '—'}
                      </td>

                      {/* Clickable Status Toggles */}
                      <td className="px-6 py-4">
                        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 border border-slate-200/60">
                          {[
                            { key: 'present', label: 'Present', activeBg: 'bg-emerald-600 text-white' },
                            { key: 'late', label: 'Late', activeBg: 'bg-amber-500 text-white' },
                            { key: 'absent', label: 'Absent', activeBg: 'bg-rose-600 text-white' },
                            { key: 'excused', label: 'Excused', activeBg: 'bg-indigo-600 text-white' },
                          ].map((opt) => {
                            const isSelected = currentStatus === opt.key;
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => handleStatusToggle(st._id, opt.key)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                                  isSelected
                                    ? `${opt.activeBg} shadow-xs`
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Session Note */}
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="Add note (e.g. arrived late, excused)..."
                          value={currentNote}
                          onChange={(e) => handleNoteChange(st._id, e.target.value)}
                          className="w-full max-w-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                        />
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
