import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  Tag,
  AlertCircle,
  X,
  Send,
  CheckCircle2,
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterAudience, setFilterAudience] = useState('all');
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    targetAudience: 'all',
    batchId: '',
    urgent: false,
    content: '',
  });

  const fetchData = async () => {
    const [annRes, batchesRes] = await Promise.all([
      adminService.getAnnouncements(),
      adminService.getBatches(),
    ]);
    setAnnouncements(annRes.data?.announcements || annRes.data?.data?.announcements || annRes.data || []);
    setBatches(batchesRes.data?.data || batchesRes.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    await adminService.createAnnouncement(formData);
    showToast('Announcement broadcasted to cohort members!');
    setFormData({
      title: '',
      targetAudience: 'all',
      batchId: '',
      urgent: false,
      content: '',
    });
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await adminService.deleteAnnouncement(id);
      showToast('Announcement removed.');
      fetchData();
    }
  };

  const filtered = announcements.filter((a) => {
    if (filterAudience === 'all') return true;
    return a.targetAudience === filterAudience;
  });

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-1">
            <Megaphone className="w-3.5 h-3.5 text-rose-600" />
            <span>Cohort Broadcasts & Alerts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Broadcast Announcements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish notifications, exam schedules, and urgent alerts to students, mentors, or specific batches
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
        {[
          { id: 'all', label: 'All Notices' },
          { id: 'students', label: 'Students Only' },
          { id: 'mentors', label: 'Mentors Only' },
          { id: 'batch', label: 'Cohort Batches' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterAudience(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterAudience === tab.id
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200/80 text-center text-xs text-slate-400">
            No announcements found in this category.
          </div>
        ) : (
          filtered.map((item) => {
            const batchObj = batches.find((b) => b._id === item.batchId);
            return (
              <div
                key={item._id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition ${
                  item.urgent ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.urgent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Urgent Notice
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                        <Tag className="w-3 h-3 text-slate-400" />
                        Target: {item.targetAudience}
                        {batchObj && ` (${batchObj.name})`}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.publishDate} • by {item.author || 'Admin Office'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 pt-1.5">{item.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create Announcement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative text-xs">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Broadcast Announcement</h3>
                <p className="text-slate-500">Send an update to cohort members and mentors</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Lab Exam Schedule"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  >
                    <option value="all">Everyone (All Bootcamp)</option>
                    <option value="students">All Students</option>
                    <option value="mentors">Mentors Only</option>
                    <option value="batch">Specific Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={formData.urgent}
                      onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="urgent" className="text-slate-700 font-semibold cursor-pointer">
                      Mark as Urgent
                    </label>
                  </div>
                </div>
              </div>

              {formData.targetAudience === 'batch' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Cohort Batch</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  >
                    <option value="">-- Choose Batch --</option>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Broadcast Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write the full announcement description here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Announcement</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
