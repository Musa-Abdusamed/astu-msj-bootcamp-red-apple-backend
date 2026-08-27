import React, { useState, useEffect } from 'react';
import { mentorService } from '../../api/mentorService';
import {
  FileCode2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
  Github,
  Globe,
  Award,
  Users,
  X,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function MentorAssignments() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submissions Modal State
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Create Assignment Modal
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    instructions: '',
    deadline: '',
    maxScore: 100,
  });

  // Grade Submission Modal
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({
    score: 90,
    feedback: '',
    status: 'graded',
  });
  const [isGrading, setIsGrading] = useState(false);

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
        const list = bRes.data || [];
        setBatches(list);
        if (list.length > 0) {
          setSelectedBatchId(list[0]._id);
        }
      } catch (err) {
        console.error('Failed to load batches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const loadAssignments = async (batchId) => {
    if (!batchId) return;
    try {
      setLoading(true);
      const res = await mentorService.getBatchAssignments(batchId);
      setAssignments(res.data || []);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBatchId) {
      loadAssignments(selectedBatchId);
    }
  }, [selectedBatchId]);

  const handleOpenSubmissions = async (assignment) => {
    setActiveAssignment(assignment);
    setLoadingSubmissions(true);
    try {
      const res = await mentorService.getAssignmentSubmissions(assignment._id);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error('Failed to load submissions:', err);
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!selectedBatchId) return;
    try {
      await mentorService.createAssignment({
        ...newAssignment,
        batchId: selectedBatchId,
        maxScore: Number(newAssignment.maxScore),
      });
      showToast('Assignment published successfully!');
      setIsCreatingAssignment(false);
      setNewAssignment({
        title: '',
        description: '',
        instructions: '',
        deadline: '',
        maxScore: 100,
      });
      loadAssignments(selectedBatchId);
    } catch (err) {
      console.error('Create assignment error:', err);
      showToast(err.response?.data?.message || 'Failed to create assignment.');
    }
  };

  const handleOpenGrade = (sub) => {
    setGradingSubmission(sub);
    setGradeData({
      score: sub.score ?? (activeAssignment?.maxScore || 100),
      feedback: sub.feedback || '',
      status: sub.status === 'resubmission_requested' ? 'resubmission_requested' : 'graded',
    });
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    setIsGrading(true);

    try {
      await mentorService.gradeSubmission(gradingSubmission._id, {
        score: Number(gradeData.score),
        feedback: gradeData.feedback.trim(),
        status: gradeData.status,
      });
      showToast(`Grade recorded for ${gradingSubmission.studentId?.fullName || 'student'}!`);
      setGradingSubmission(null);
      // Reload submissions
      if (activeAssignment) {
        handleOpenSubmissions(activeAssignment);
      }
    } catch (err) {
      console.error('Grading error:', err);
      showToast(err.response?.data?.message || 'Failed to save grade.');
    } finally {
      setIsGrading(false);
    }
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Coursework & Grading</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Assignments & Evaluation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish coursework projects, review student repositories, and grade submissions.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingAssignment(true)}
          disabled={!selectedBatchId}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Batch Selector Bar */}
      {batches.length > 0 && (
        <div className="flex gap-2 pb-2 overflow-x-auto">
          {batches.map((b) => (
            <button
              key={b._id}
              onClick={() => setSelectedBatchId(b._id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedBatchId === b._id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}

      {/* Assignments List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <span className="text-xs font-semibold">Loading assignments...</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-12 text-center space-y-2">
          <FileCode2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">No Assignments Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Create Assignment" above to assign coursework to this cohort batch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 shrink-0">
                    Max: {assignment.maxScore} pts
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {assignment.description || 'No description provided.'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Posted by {assignment.createdBy?.fullName || 'Mentor'}
                </div>
                <button
                  onClick={() => handleOpenSubmissions(assignment)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Submissions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submissions Inspection Modal */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveAssignment(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                <Users className="w-3 h-3" />
                <span>Student Submissions</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{activeAssignment.title}</h3>
              <p className="text-xs text-slate-500">
                Max Score: {activeAssignment.maxScore} pts • Due:{' '}
                {new Date(activeAssignment.deadline).toLocaleDateString()}
              </p>
            </div>

            {loadingSubmissions ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <span className="text-xs font-semibold">Loading submissions...</span>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl">
                <FileCode2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No Submissions Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Students enrolled in this cohort will have their submitted GitHub repositories displayed here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => {
                  const isGraded = sub.status === 'graded';
                  const isResubmit = sub.status === 'resubmission_requested';

                  return (
                    <div
                      key={sub._id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {sub.studentId?.fullName || 'Student'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {sub.studentId?.email} • Submitted on{' '}
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isGraded
                                ? 'bg-emerald-100 text-emerald-800'
                                : isResubmit
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {isGraded ? `Graded (${sub.score}/${activeAssignment.maxScore})` : sub.status}
                          </span>

                          <button
                            onClick={() => handleOpenGrade(sub)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer shadow-xs"
                          >
                            {isGraded ? 'Update Grade' : 'Grade Work'}
                          </button>
                        </div>
                      </div>

                      {/* Repositories & Demo Links */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {sub.githubUrl && (
                          <a
                            href={sub.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-indigo-500 hover:text-indigo-600 transition"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>GitHub Code</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )}
                        {sub.liveDemoUrl && (
                          <a
                            href={sub.liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-emerald-700 font-semibold hover:border-emerald-500 transition"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Live Application</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )}
                      </div>

                      {/* Notes from student */}
                      {sub.notes && (
                        <div className="p-3 bg-white rounded-xl border border-slate-100 text-slate-600 italic">
                          <span className="font-semibold text-slate-700 not-italic">Student note:</span>{' '}
                          {sub.notes}
                        </div>
                      )}

                      {/* Existing feedback if graded */}
                      {sub.feedback && (
                        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-900">
                          <span className="font-bold text-indigo-700">Mentor feedback:</span> {sub.feedback}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setGradingSubmission(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Grade Student Submission</h3>
              <p className="text-xs text-slate-500">
                Student: <span className="font-semibold text-slate-700">{gradingSubmission.studentId?.fullName}</span>
              </p>
            </div>

            <form onSubmit={handleSubmitGrade} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Score (Max {activeAssignment?.maxScore || 100}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={activeAssignment?.maxScore || 100}
                    required
                    value={gradeData.score}
                    onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Submission Status</label>
                  <select
                    value={gradeData.status}
                    onChange={(e) => setGradeData({ ...gradeData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  >
                    <option value="graded">Graded (Accepted)</option>
                    <option value="resubmission_requested">Request Resubmission</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Written Feedback & Code Review</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide constructive feedback on code structure, architecture, and edge cases..."
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGrading}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isGrading ? 'Submitting Grade...' : 'Save Grade'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreatingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreatingAssignment(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>New Coursework</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Publish New Assignment</h3>
              <p className="text-xs text-slate-500">Create and assign a project task to the selected cohort batch.</p>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project 1: Responsive E-Commerce Dashboard"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deadline Date *</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.deadline}
                    onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    required
                    value={newAssignment.maxScore}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overview / Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="High-level description of what students are expected to build..."
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technical Instructions & Criteria</label>
                <textarea
                  rows={3}
                  placeholder="Specific requirements, packages to use, API endpoints to mock or integrate..."
                  value={newAssignment.instructions}
                  onChange={(e) => setNewAssignment({ ...newAssignment, instructions: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingAssignment(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
