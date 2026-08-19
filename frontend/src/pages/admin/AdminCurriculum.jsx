import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  ExternalLink,
  Calendar,
  Layers,
  Trash2,
  CheckCircle2,
  X,
  FileText,
  Link2,
  Sparkles,
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function AdminCurriculum() {
  const [schedules, setSchedules] = useState([]);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('schedule');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Schedule form state
  const [scheduleForm, setScheduleForm] = useState({
    weekNumber: 4,
    title: '',
    day1: '',
    day2: '',
    day3: '',
    day4: '',
    day5: '',
  });

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    title: '',
    link: '',
    topic: 'Full-Stack MERN',
    description: '',
  });

  const fetchData = async () => {
    const [schRes, resRes] = await Promise.all([
      adminService.getCurriculumSchedules(),
      adminService.getResources(),
    ]);
    setSchedules(schRes.data || []);
    setResources(resRes.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleForm.title) return;

    const topics = [
      { day: 'Day 1', topicName: scheduleForm.day1 || 'Core Architecture Concepts' },
      { day: 'Day 2', topicName: scheduleForm.day2 || 'Hands-on Implementation Lab' },
      { day: 'Day 3', topicName: scheduleForm.day3 || 'Advanced Patterns & Security' },
      { day: 'Day 4', topicName: scheduleForm.day4 || 'Integration & Testing' },
      { day: 'Day 5', topicName: scheduleForm.day5 || 'Weekly Milestone Evaluation' },
    ];

    await adminService.createCurriculumSchedule({
      weekNumber: scheduleForm.weekNumber,
      title: scheduleForm.title,
      topics,
    });
    showToast(`Week ${scheduleForm.weekNumber} schedule published!`);
    setIsScheduleModalOpen(false);
    setScheduleForm({
      weekNumber: schedules.length + 2,
      title: '',
      day1: '',
      day2: '',
      day3: '',
      day4: '',
      day5: '',
    });
    fetchData();
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!resourceForm.title || !resourceForm.link) return;

    await adminService.createResource(resourceForm);
    showToast('Learning resource added to repository!');
    setIsResourceModalOpen(false);
    setResourceForm({ title: '', link: '', topic: 'Full-Stack MERN', description: '' });
    fetchData();
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Remove this resource?')) {
      await adminService.deleteResource(id);
      showToast('Resource removed.');
      fetchData();
    }
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Curriculum Roadmap & Resources</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Curriculum & Resources</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage week-by-week syllabus topics, daily agendas, and shared learning materials
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'schedule' ? (
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Weekly Schedule</span>
            </button>
          ) : (
            <button
              onClick={() => setIsResourceModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource Link</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Weekly Roadmap ({schedules.length} Weeks)
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'resources'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Resource Library ({resources.length} Items)
        </button>
      </div>

      {/* Tab 1: Weekly Roadmap */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {schedules.map((week) => (
            <div
              key={week._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-sm border border-indigo-100">
                    W{week.weekNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Week {week.weekNumber}: {week.title}
                    </h3>
                    <p className="text-xs text-slate-400">5-Day Structured Lab Curriculum</p>
                  </div>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                {week.topics?.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs"
                  >
                    <div className="text-[10px] font-bold text-indigo-600 uppercase">{t.day}</div>
                    <div className="font-semibold text-slate-800 leading-snug">{t.topicName}</div>
                    {t.date && <div className="text-[10px] text-slate-400">{t.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Resource Library */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res) => (
            <div
              key={res._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {res.topic}
                  </span>
                  <button
                    onClick={() => handleDeleteResource(res._id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{res.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{res.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">By {res.mentorName || 'Admin'}</span>
                <a
                  href={res.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Weekly Schedule */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative text-xs max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsScheduleModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Weekly Syllabus</h3>
            <p className="text-slate-500 mb-4">Define weekly learning modules and daily topics</p>

            <form onSubmit={handleCreateSchedule} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Week Number</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    required
                    value={scheduleForm.weekNumber}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, weekNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Theme / Module Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advanced State Management"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-700">Daily Agenda Topics</div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Day 1</label>
                  <input
                    type="text"
                    placeholder="Topic..."
                    value={scheduleForm.day1}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, day1: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Day 2</label>
                  <input
                    type="text"
                    placeholder="Topic..."
                    value={scheduleForm.day2}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, day2: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Day 3</label>
                  <input
                    type="text"
                    placeholder="Topic..."
                    value={scheduleForm.day3}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, day3: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Day 4</label>
                  <input
                    type="text"
                    placeholder="Topic..."
                    value={scheduleForm.day4}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, day4: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Day 5</label>
                  <input
                    type="text"
                    placeholder="Topic..."
                    value={scheduleForm.day5}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, day5: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer mt-3"
              >
                <span>Publish Weekly Schedule</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Resource */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative text-xs">
            <button
              onClick={() => setIsResourceModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Learning Resource</h3>
            <p className="text-slate-500 mb-4">Share documentation or starter code repository link</p>

            <form onSubmit={handleCreateResource} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Architecture in Node.js"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={resourceForm.link}
                  onChange={(e) => setResourceForm({ ...resourceForm, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Backend Engineering"
                  value={resourceForm.topic}
                  onChange={(e) => setResourceForm({ ...resourceForm, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of what this link contains..."
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Save Resource</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
