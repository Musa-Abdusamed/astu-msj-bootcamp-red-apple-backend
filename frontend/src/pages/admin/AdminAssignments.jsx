import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  Plus,
  Calendar,
  ExternalLink,
  Code2,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  X,
  Send,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [gradingSub, setGradingSub] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State for new assignment
  const [formData, setFormData] = useState({
    title: '',
    batchId: '',
    deadline: '2026-08-25T23:59',
    maxScore: 100,
    description: '',
    instructions: '',
  });

  // Grading form state
  const [gradeForm, setGradeForm] = useState({
    score: 100,
    feedback: '',
    status: 'graded',
  });

  const fetchData = async () => {
    const [asgRes, batchesRes] = await Promise.all([
      adminService.getAssignments(),
      adminService.getBatches(),
    ]);
    const asgList = asgRes.data || [];
    setAssignments(asgList);
    setBatches(batchesRes.data || []);
    if (asgList.length > 0 && !selectedAssignment) {
      setSelectedAssignment(asgList[0]);
    }
  };

  const fetchSubmissions = async () => {
    if (!selectedAssignment) return;
    const res = await adminService.getSubmissions(selectedAssignment._id);
    setSubmissions(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [selectedAssignment]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.batchId) return;

    await adminService.createAssignment(formData);
    showToast('Assignment published to cohort!');
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      batchId: '',
      deadline: '2026-08-25T23:59',
      maxScore: 100,
      description: '',
      instructions: '',
    });
    fetchData();
  };

  const handleOpenGrade = (sub) => {
    setGradingSub(sub);
    setGradeForm({
      score: sub.score !== null ? sub.score : selectedAssignment?.maxScore || 100,
      feedback: sub.feedback || '',
      status: sub.status === 'submitted' ? 'graded' : sub.status,
    });
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!gradingSub) return;

    await adminService.gradeSubmission(gradingSub._id, gradeForm);
    const sName = gradingSub.studentId?.fullName || gradingSub.studentName || 'Student';
    showToast(`Graded submission for ${sName}!`);
    setGradingSub(null);
    fetchSubmissions();
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold mb-1">
            <FileCode2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Assignments & Assessment Oversight</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Assignments & Submissions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create cohort assignments, inspect student code repositories, and grade project deliverables
          </p>
        </div>
        <button
          onClick={() => {
            if (batches.length > 0) setFormData((f) => ({ ...f, batchId: batches[0]._id }));
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Grid: Assignments List & Submissions Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments Selector Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Active Assignments ({assignments.length})
          </h3>
          {assignments.map((asg) => {
            const isSelected = selectedAssignment?._id === asg._id;
            return (
              <div
                key={asg._id}
                onClick={() => setSelectedAssignment(asg)}
                className={`p-5 rounded-2xl border transition cursor-pointer text-xs space-y-2.5 ${
                  isSelected
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {asg.batchName || 'Cohort'}
                  </span>
                  <span className="font-bold text-slate-900">{asg.maxScore} pts</span>
                </div>
                <div className="font-bold text-slate-900 text-sm leading-snug">{asg.title}</div>
                <p className="text-slate-500 line-clamp-2">{asg.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {new Date(asg.deadline).toLocaleDateString()}</span>
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

        {/* Submissions Roster */}
        {selectedAssignment && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                  {selectedAssignment.batchName}
                </span>
                <h2 className="text-lg font-bold text-slate-900">{selectedAssignment.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedAssignment.instructions}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400">Max Score</div>
                <div className="text-xl font-extrabold text-slate-900">{selectedAssignment.maxScore} pts</div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Student Submissions ({submissions.length})</span>
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Repository & Live</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                          No student submissions for this assignment yet.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub) => (
                        <tr key={sub._id} className="hover:bg-slate-50/60 transition">
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900">
                              {sub.studentId?.fullName || sub.studentName || 'Student'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {sub.studentId?.email || sub.studentEmail || (sub.studentId?.userId ? `ID: ${sub.studentId.userId}` : '—')}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              {sub.githubUrl && (
                                <a
                                  href={sub.githubUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-semibold transition"
                                >
                                  <Code2 className="w-3 h-3" />
                                  <span>Repo</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                                </a>
                              )}
                              {sub.liveDemoUrl && (
                                <a
                                  href={sub.liveDemoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition"
                                >
                                  <span>Live Demo</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {sub.score !== null ? (
                              <span className="font-bold text-emerald-600">
                                {sub.score} / {selectedAssignment.maxScore}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Ungraded</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                sub.status === 'graded'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : sub.status === 'resubmission_requested'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => handleOpenGrade(sub)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                            >
                              Grade / Review
                            </button>
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

      {/* Modal: Create Assignment */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative text-xs">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Assignment</h3>
            <p className="text-slate-500 mb-4">Publish a new lab or milestone task for a cohort</p>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MERN Full-Stack E-Commerce API"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Cohort Batch</label>
                  <select
                    required
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  >
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="1000"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Submission Deadline</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Objective</label>
                <textarea
                  rows={2}
                  placeholder="Summary of project requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Step-by-Step Instructions</label>
                <textarea
                  rows={3}
                  placeholder="1. Setup Git repo&#10;2. Implement endpoints..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Publish Assignment</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grade Submission */}
      {gradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative text-xs">
            <button
              onClick={() => setGradingSub(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Grade Student Deliverable</h3>
                <p className="text-slate-500">
                  {gradingSub.studentId?.fullName || gradingSub.studentName || 'Student'}
                  {gradingSub.studentId?.userId ? ` (${gradingSub.studentId.userId})` : ''} • {selectedAssignment?.title}
                </p>
              </div>
            </div>

            {/* Submission Links & Notes */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 mb-4">
              <div className="flex items-center gap-2">
                {gradingSub.githubUrl && (
                  <a
                    href={gradingSub.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold hover:text-indigo-600"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Open Code Repo</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                  </a>
                )}
                {gradingSub.liveDemoUrl && (
                  <a
                    href={gradingSub.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-emerald-700 font-semibold hover:text-emerald-800"
                  >
                    <span>View Live Demo</span>
                    <ExternalLink className="w-2.5 h-2.5 text-emerald-600" />
                  </a>
                )}
              </div>
              {gradingSub.notes && (
                <div className="text-[11px] text-slate-600 italic">
                  Student note: "{gradingSub.notes}"
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitGrade} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Score (Max {selectedAssignment?.maxScore || 100})
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max={selectedAssignment?.maxScore || 100}
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={gradeForm.status}
                    onChange={(e) => setGradeForm({ ...gradeForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  >
                    <option value="graded">Graded / Approved</option>
                    <option value="resubmission_requested">Request Resubmission</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mentor Feedback & Code Review Comments</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed feedback on code architecture, bugs, and praise..."
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grade & Feedback</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
