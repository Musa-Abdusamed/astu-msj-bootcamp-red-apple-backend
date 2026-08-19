import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  X,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function AdminBatches() {
  const [batches, setBatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    track: 'Frontend Development',
    description: '',
    startDate: '2026-07-01',
    endDate: '2026-08-30',
    isActive: true,
  });

  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const fetchBatches = async () => {
    const [batchesRes, usersRes] = await Promise.all([
      adminService.getBatches(),
      adminService.getUsers(),
    ]);
    const bList = batchesRes.data || [];
    setBatches(bList);
    setUsers(usersRes.data || []);
    if (bList.length > 0 && !selectedBatch) {
      setSelectedBatch(bList[0]);
    } else if (selectedBatch) {
      const refreshed = bList.find((b) => b._id === selectedBatch._id);
      if (refreshed) setSelectedBatch(refreshed);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    await adminService.createBatch(formData);
    showToast(`Batch "${formData.name}" created successfully!`);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      track: 'Frontend Development',
      description: '',
      startDate: '2026-07-01',
      endDate: '2026-08-30',
      isActive: true,
    });
    fetchBatches();
  };

  const handleAssignMentor = async (e) => {
    e.preventDefault();
    if (!selectedBatch || !selectedMentorId) return;

    await adminService.assignMentorToBatch(selectedBatch._id, selectedMentorId);
    showToast('Mentor assigned to cohort!');
    setIsMentorModalOpen(false);
    fetchBatches();
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!selectedBatch || !selectedStudentId) return;

    await adminService.enrollStudentToBatch(selectedBatch._id, selectedStudentId);
    showToast('Student successfully enrolled into batch!');
    setIsEnrollModalOpen(false);
    fetchBatches();
  };

  // Get enrolled students & mentors for selected batch
  const enrolledStudents = users.filter(
    (u) => u.role === 'student' && u.batchId === selectedBatch?._id
  );
  const assignedMentors = users.filter(
    (u) => u.role === 'mentor' && (u.batchId === selectedBatch?._id || selectedBatch?.mentorIds?.includes(u._id))
  );

  const availableMentors = users.filter((u) => u.role === 'mentor');
  const availableStudents = users.filter(
    (u) => u.role === 'student' && u.batchId !== selectedBatch?._id
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold mb-1">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Cohort & Track Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Batches & Cohorts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure learning tracks, assign mentors, and manage student batch rosters
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Batches Grid & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches Cards List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Active Cohorts ({batches.length})
          </h3>
          {batches.map((batch) => {
            const isSelected = selectedBatch?._id === batch._id;
            return (
              <div
                key={batch._id}
                onClick={() => setSelectedBatch(batch)}
                className={`p-5 rounded-2xl border transition cursor-pointer text-xs space-y-2.5 ${
                  isSelected
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{batch.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      batch.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {batch.isActive ? 'Active' : 'Archived'}
                  </span>
                </div>
                <p className="text-slate-500 line-clamp-2 leading-relaxed">{batch.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 font-semibold text-slate-600">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{batch.startDate} — {batch.endDate}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-300'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Batch Details & Roster */}
        {selectedBatch && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            {/* Cohort Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                  Selected Cohort
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedBatch.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedBatch.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMentorModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Assign Mentor</span>
                </button>
                <button
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Enroll Student</span>
                </button>
              </div>
            </div>

            {/* Assigned Mentors Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Assigned Mentors ({assignedMentors.length})</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignedMentors.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-400 italic col-span-2">
                    No mentors currently assigned to this batch.
                  </div>
                ) : (
                  assignedMentors.map((mentor) => (
                    <div
                      key={mentor._id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                        {mentor.fullName.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-900 truncate">{mentor.fullName}</div>
                        <div className="text-[11px] text-slate-400 truncate">{mentor.email}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Enrolled Students Roster */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Enrolled Students ({enrolledStudents.length})</span>
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Student</th>
                      <th className="px-4 py-2.5">Custom ID</th>
                      <th className="px-4 py-2.5">Attendance</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrolledStudents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                          No students enrolled in this batch yet.
                        </td>
                      </tr>
                    ) : (
                      enrolledStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{student.fullName}</div>
                            <div className="text-[10px] text-slate-400">{student.email}</div>
                          </td>
                          <td className="px-4 py-3 font-mono text-[10px] text-indigo-600">
                            {student.userId || 'N/A'}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-700">
                            {student.attendance || 95}%
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Batch */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Cohort Batch</h3>
            <p className="text-xs text-slate-500 mb-4">Set up a new track curriculum and date duration</p>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch / Cohort Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & Machine Learning Track"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Curriculum Track</label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, Scikit-learn"
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  placeholder="Summary of topics and prerequisites..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Create Batch</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Mentor */}
      {isMentorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative text-xs">
            <button
              onClick={() => setIsMentorModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Assign Mentor to Batch</h3>
            <p className="text-slate-500 mb-4">{selectedBatch?.name}</p>

            <form onSubmit={handleAssignMentor} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Mentor</label>
                <select
                  required
                  value={selectedMentorId}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                >
                  <option value="">-- Choose a Mentor --</option>
                  {availableMentors.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.fullName} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition cursor-pointer"
              >
                Confirm Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Enroll Student */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative text-xs">
            <button
              onClick={() => setIsEnrollModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Enroll Student</h3>
            <p className="text-slate-500 mb-4">Enroll student into {selectedBatch?.name}</p>

            <form onSubmit={handleEnrollStudent} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                >
                  <option value="">-- Choose a Student --</option>
                  {availableStudents.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.fullName} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition cursor-pointer"
              >
                Enroll Student
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
