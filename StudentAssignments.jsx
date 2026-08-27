import React, { useState, useEffect } from 'react';
import { studentService } from '../../api/studentService';
import { useAuth } from '../../context/AuthContext';
import {
  FileCode2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Github,
  Globe,
  MessageSquare,
  Send,
  X,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    githubUrl: '',
    liveDemoUrl: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { user } = useAuth();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const batchId = user?.batchId?._id || user?.batchId || user?.batch;

      const subsRes = await studentService.getMySubmissions().catch(() => ({ data: [] }));
      const subs = subsRes.data || (Array.isArray(subsRes) ? subsRes : []);

      let assigns = [];
      if (batchId) {
        const batchRes = await studentService.getBatchAssignments(batchId).catch(() => ({ data: [] }));
        assigns = batchRes.data || (Array.isArray(batchRes) ? batchRes : []);
      }

      // If no assignments found for specific batch or student has no batch assigned yet, fallback to all assignments
      if (!assigns || assigns.length === 0) {
        const allRes = await studentService.getAllAssignments().catch(() => ({ data: [] }));
        assigns = allRes.data || (Array.isArray(allRes) ? allRes : []);
      }

      setMySubmissions(Array.isArray(subs) ? subs : []);
      setAssignments(Array.isArray(assigns) ? assigns : []);
    } catch (err) {
      console.error('Failed to load assignments data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const getSubmissionForAssignment = (assignmentId) => {
    return mySubmissions.find((s) => {
      const aId = s.assignmentId?._id || s.assignmentId;
      return aId === assignmentId;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submittingAssignment) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await studentService.submitAssignment({
        assignmentId: submittingAssignment._id,
        githubUrl: formData.githubUrl.trim(),
        liveDemoUrl: formData.liveDemoUrl.trim(),
        notes: formData.notes.trim(),
      });

      showToast('Assignment submitted successfully!');
      setSubmittingAssignment(null);
      setFormData({ githubUrl: '', liveDemoUrl: '', notes: '' });
      loadData();
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold">Loading assignments & submissions...</p>
      </div>
    );
  }

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
            <Layers className="w-3.5 h-3.5" />
            <span>Coursework & Milestones</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Assignments & Submissions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Build and submit your coding projects, track deadlines, and receive mentor reviews.
          </p>
        </div>
      </div>

      {/* Assignments Grid */}
      {assignments.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-12 text-center">
          <FileCode2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Assignments Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {user?.batchId || user?.batch
              ? 'No active assignments have been posted for your cohort batch yet.'
              : 'You have not been assigned to a cohort batch yet. Contact an administrator.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignments.map((assignment) => {
            const submission = getSubmissionForAssignment(assignment._id);
            const isGraded = submission?.status === 'graded';
            const isResubmit = submission?.status === 'resubmission_requested';
            const isSubmitted = submission?.status === 'submitted' || isGraded || isResubmit;
            const isOverdue = new Date(assignment.deadline) < new Date() && !isSubmitted;

            return (
              <div
                key={assignment._id}
                className="bg-white rounded-3xl shadow-xs border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Header & Status Chip */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          <Award className="w-3 h-3" />
                          <span>{assignment.maxScore} Max Points</span>
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {isGraded ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Score: {submission.score}/{assignment.maxScore}</span>
                      </span>
                    ) : isResubmit ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Resubmission Req.</span>
                      </span>
                    ) : isSubmitted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Under Review</span>
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Past Due</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        <span>Not Submitted</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {assignment.description || 'No description provided.'}
                  </p>

                  {/* Instructions snippet */}
                  {assignment.instructions && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                        Instructions
                      </div>
                      <p className="line-clamp-2 italic">{assignment.instructions}</p>
                    </div>
                  )}

                  {/* Submission Links Preview if Submitted */}
                  {submission && (
                    <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Your Submission</div>
                      <div className="flex flex-wrap gap-2">
                        {submission.githubUrl && (
                          <a
                            href={submission.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:text-indigo-600 hover:border-indigo-500 transition text-[11px]"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Repository</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                          </a>
                        )}
                        {submission.liveDemoUrl && (
                          <a
                            href={submission.liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:text-emerald-600 hover:border-emerald-500 transition text-[11px]"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Live App</span>
                            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  {submission?.feedback ? (
                    <button
                      onClick={() => setViewingFeedback({ assignment, submission })}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Mentor Feedback</span>
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-400 font-medium">
                      {isSubmitted ? 'Submitted on ' + new Date(submission.createdAt).toLocaleDateString() : 'Ready to submit'}
                    </div>
                  )}

                  {!isSubmitted ? (
                    <button
                      onClick={() => {
                        setSubmittingAssignment(assignment);
                        setErrorMsg('');
                        setFormData({ githubUrl: '', liveDemoUrl: '', notes: '' });
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSubmittingAssignment(assignment);
                        setErrorMsg('');
                        setFormData({
                          githubUrl: submission.githubUrl || '',
                          liveDemoUrl: submission.liveDemoUrl || '',
                          notes: submission.notes || '',
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer"
                    >
                      <span>Update Submission</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Assignment Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSubmittingAssignment(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Submit Assignment</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{submittingAssignment.title}</h3>
              <p className="text-xs text-slate-500">Provide your repository and deployment URLs for mentor review.</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/repository"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Live Demo URL <span className="text-slate-400 font-normal">(Optional, Vercel/Netlify)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://your-project.vercel.app"
                  value={formData.liveDemoUrl}
                  onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notes or Questions for Mentors <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention any challenges you faced or specific components you would like feedback on..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Assignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Mentor Feedback Modal */}
      {viewingFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewingFeedback(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Mentor Evaluation & Feedback</h3>
              <p className="text-xs text-slate-500">{viewingFeedback.assignment.title}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-indigo-600 uppercase">Awarded Score</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {viewingFeedback.submission.score ?? 'N/A'}{' '}
                    <span className="text-sm font-semibold text-slate-500">
                      / {viewingFeedback.assignment.maxScore}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-indigo-700 shadow-xs">
                  {viewingFeedback.submission.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-slate-700">Mentor Feedback & Review</div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed italic">
                  {viewingFeedback.submission.feedback || 'No written feedback provided.'}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewingFeedback(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
