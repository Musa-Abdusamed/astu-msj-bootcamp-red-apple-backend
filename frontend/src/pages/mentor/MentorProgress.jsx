import React, { useState, useEffect } from 'react';
import { mentorService } from '../../api/mentorService';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Users,
  MessageSquare,
  X,
  Send,
  Sparkles,
} from 'lucide-react';

export default function MentorProgress() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    score: 85,
    status: 'completed',
    feedback: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        console.error('Failed to load batches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    const fetchStudents = async () => {
      try {
        const usersRes = await mentorService.getStudents('student');
        const allStudents = usersRes.data || [];
        const batchStudents = allStudents.filter(
          (s) => (s.batchId?._id || s.batchId) === selectedBatchId
        );
        setStudents(batchStudents);
        if (batchStudents.length > 0) {
          setSelectedStudentId(batchStudents[0]._id);
        } else {
          setSelectedStudentId('');
          setProgressList([]);
        }
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    };
    fetchStudents();
  }, [selectedBatchId]);

  const loadStudentProgress = async () => {
    if (!selectedStudentId) {
      setProgressList([]);
      return;
    }
    try {
      const res = await mentorService.getStudentProgress(selectedStudentId);
      const list = res.data?.progress || res.data?.data?.progress || res.data || [];
      setProgressList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load student progress:', err);
      setProgressList([]);
    }
  };

  useEffect(() => {
    loadStudentProgress();
  }, [selectedStudentId]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      score: 85,
      status: 'completed',
      feedback: '',
    });
    setErrorMsg('');
    setModalMode('create');
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      score: item.score ?? 85,
      status: item.status || 'completed',
      feedback: item.feedback || '',
    });
    setErrorMsg('');
    setModalMode('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    setIsSaving(true);
    setErrorMsg('');

    try {
      if (modalMode === 'create') {
        await mentorService.createProgress({
          studentId: selectedStudentId,
          title: formData.title.trim(),
          description: formData.description.trim(),
          score: Number(formData.score),
          status: formData.status,
          feedback: formData.feedback.trim(),
        });
        showToast('Progress milestone added successfully!');
      } else if (modalMode === 'edit' && editingItem) {
        await mentorService.updateProgress(editingItem._id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          score: Number(formData.score),
          status: formData.status,
          feedback: formData.feedback.trim(),
        });
        showToast('Progress milestone updated successfully!');
      }
      setModalMode(null);
      loadStudentProgress();
    } catch (err) {
      console.error('Save progress error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save progress.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this progress record?')) return;
    try {
      await mentorService.deleteProgress(id);
      showToast('Progress record deleted.');
      loadStudentProgress();
    } catch (err) {
      console.error('Delete progress error:', err);
      showToast('Failed to delete record.');
    }
  };

  const selectedStudent = students.find((s) => s._id === selectedStudentId);

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
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Progress Tracking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Student Progress & Evaluation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review student mastery roadmaps, record technical milestone scores, and write feedback.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={!selectedStudentId}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add Progress Milestone</span>
        </button>
      </div>

      {/* Selector Toolbar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cohort Batch Selector */}
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

        {/* Student Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            disabled={students.length === 0}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          >
            {students.length === 0 ? (
              <option value="">No students enrolled in this batch</option>
            ) : (
              students.map((st) => (
                <option key={st._id} value={st._id}>
                  {st.fullName} ({st.userId || st.email})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Progress Cards for Selected Student */}
      {selectedStudent && (
        <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              {selectedStudent.fullName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">{selectedStudent.fullName}</div>
              <div className="text-xs text-slate-500">{selectedStudent.email} • ID: {selectedStudent.userId || 'N/A'}</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-indigo-700">{progressList.length} Milestones Recorded</span>
          </div>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-4">
        {progressList.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Milestones Recorded</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click "Add Progress Milestone" above to score and review this student's coursework progress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {progressList.map((item) => {
              const isCompleted = item.status === 'completed';
              const isInProgress = item.status === 'in-progress';

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isInProgress
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                          {isInProgress && <Clock className="w-3 h-3" />}
                          <span>{(item.status || 'in-progress').toUpperCase()}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Recorded on {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {typeof item.score === 'number' && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100">
                          <span className="text-[11px] font-bold text-indigo-600 uppercase">Score</span>
                          <span className="text-base font-extrabold text-slate-900">{item.score}/100</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Edit milestone"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  )}

                  {item.feedback && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Feedback Given to Student</span>
                      </div>
                      <p className="text-slate-600 italic leading-relaxed">{item.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Progress Milestone Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>{modalMode === 'create' ? 'New Milestone' : 'Edit Milestone'}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {modalMode === 'create' ? 'Record Progress Entry' : 'Update Progress Entry'}
              </h3>
              <p className="text-xs text-slate-500">
                Evaluating student: <span className="font-semibold text-slate-700">{selectedStudent?.fullName}</span>
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Milestone / Assessment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Week 3: React Router & Component Architecture"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mastery Score (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="not-started">Not Started</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Demonstrated strong understanding of props drilling and custom hooks"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Written Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Provide recommendations, positive feedback, and areas of improvement..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Milestone'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
