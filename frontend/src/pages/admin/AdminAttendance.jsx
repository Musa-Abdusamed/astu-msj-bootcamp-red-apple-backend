import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  X,
  Check,
  Filter,
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function AdminAttendance() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-08-18');
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    status: 'present',
    note: '',
  });

  const fetchData = async () => {
    const [batchesRes, usersRes] = await Promise.all([
      adminService.getBatches(),
      adminService.getUsers({ role: 'student' }),
    ]);
    const bList = batchesRes.data || [];
    setBatches(bList);
    setUsers(usersRes.data || []);
    if (bList.length > 0 && !selectedBatchId) {
      setSelectedBatchId(bList[0]._id);
    }
  };

  const fetchRecords = async () => {
    if (!selectedBatchId) return;
    const res = await adminService.getAttendanceRecords(selectedBatchId, selectedDate);
    setRecords(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [selectedBatchId, selectedDate]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleMarkIndividual = async (e) => {
    e.preventDefault();
    if (!formData.studentId) return;

    const studentObj = users.find((u) => u._id === formData.studentId);
    await adminService.markAttendance({
      studentId: formData.studentId,
      studentName: studentObj ? studentObj.fullName : 'Student',
      batchId: selectedBatchId,
      date: selectedDate,
      status: formData.status,
      note: formData.note,
    });
    showToast('Attendance recorded!');
    setIsModalOpen(false);
    setFormData({ studentId: '', status: 'present', note: '' });
    fetchRecords();
  };

  const handleMarkAllPresent = async () => {
    await adminService.markBulkAttendance(selectedBatchId, selectedDate, 'present');
    showToast('Marked all cohort students as Present!');
    fetchRecords();
  };

  const handleQuickStatusUpdate = async (record, newStatus) => {
    await adminService.markAttendance({
      studentId: record.studentId,
      studentName: record.studentName,
      batchId: record.batchId,
      date: record.date,
      status: newStatus,
      note: record.note,
    });
    showToast(`Updated ${record.studentName} to ${newStatus}`);
    fetchRecords();
  };

  // Stats calculation for the selected session
  const total = records.length;
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const late = records.filter((r) => r.status === 'late').length;
  const excused = records.filter((r) => r.status === 'excused').length;
  const attendanceRate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100;

  // Students in selected batch
  const batchStudents = users.filter((u) => u.batchId === selectedBatchId);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-1">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Attendance & Session Telemetry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Attendance Oversight</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily lab sessions, log attendance statuses, and calculate cohort attendance percentages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleMarkAllPresent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 shadow-xs transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Single Record</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Batch Selector & Date Picker */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Attendance Rate Meter */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Present: {present}</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Absent: {absent}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Late: {late}</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
            Rate: {attendanceRate}%
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Custom ID</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Session Note</th>
                <th className="px-6 py-3.5 text-right">Quick Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No attendance records logged for this batch on {selectedDate}. Click "Mark All Present" or "Log Single Record".
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{rec.studentName}</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-indigo-600">
                      {rec.studentId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{rec.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          rec.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rec.status === 'absent'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : rec.status === 'late'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {rec.status === 'present' && <CheckCircle2 className="w-3 h-3" />}
                        {rec.status === 'absent' && <XCircle className="w-3 h-3" />}
                        {rec.status === 'late' && <Clock className="w-3 h-3" />}
                        <span>{rec.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic max-w-xs truncate">
                      {rec.note || '—'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      {['present', 'absent', 'late', 'excused'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleQuickStatusUpdate(rec, st)}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition cursor-pointer ${
                            rec.status === st
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st.charAt(0)}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Single Attendance Record */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative text-xs">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Log Attendance Record</h3>
            <p className="text-slate-500 mb-4">Record session attendance for {selectedDate}</p>

            <form onSubmit={handleMarkIndividual} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                >
                  <option value="">-- Choose Student --</option>
                  {batchStudents.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.fullName} ({s.userId || s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attendance Status</label>
                <div className="grid grid-cols-4 gap-2">
                  {['present', 'absent', 'late', 'excused'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: st })}
                      className={`py-2 rounded-xl font-bold text-center capitalize transition cursor-pointer ${
                        formData.status === st
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session Note / Excuse Reason</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Arrived 15 mins late due to transportation..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Save Attendance Log</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
