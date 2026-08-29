import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Search,
  Tag,
  X,
  Send,
  User,
  Sparkles,
  Calendar,
  Clock,
  Compass,
} from 'lucide-react';
import { mentorService } from '../../api/mentorService';
import { useAuth } from '../../context/AuthContext';

export default function MentorResources() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus' | 'resources'
  const [schedules, setSchedules] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    link: '',
    topic: 'Full-Stack MERN',
    description: '',
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schRes, resRes] = await Promise.allSettled([
        mentorService.getSchedules(),
        mentorService.getResources(),
      ]);

      const schVal = schRes.status === 'fulfilled' ? schRes.value : {};
      const resVal = resRes.status === 'fulfilled' ? resRes.value : {};

      const schList =
        schVal.data?.schedules ||
        schVal.schedules ||
        schVal.data ||
        (Array.isArray(schVal) ? schVal : []);
      const resList =
        resVal.data?.resources ||
        resVal.resources ||
        resVal.data ||
        (Array.isArray(resVal) ? resVal : []);

      setSchedules(Array.isArray(schList) ? schList : []);
      setResources(Array.isArray(resList) ? resList : []);
    } catch (err) {
      console.error('Failed to load curriculum & resources:', err);
      setSchedules([]);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateResource = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.link) return;
    setIsSubmitting(true);

    try {
      await mentorService.createResource({
        title: formData.title.trim(),
        link: formData.link.trim(),
        topic: formData.topic.trim(),
        description: formData.description.trim(),
      });
      showToast('Learning resource published to students!');
      setIsModalOpen(false);
      setFormData({
        title: '',
        link: '',
        topic: 'Full-Stack MERN',
        description: '',
      });
      fetchData();
    } catch (err) {
      console.error('Failed to create resource:', err);
      showToast(err.response?.data?.message || 'Failed to publish resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteResource = async (id) => {
    try {
      await mentorService.deleteResource(id);
      showToast('Resource removed.');
      fetchData();
    } catch (err) {
      console.error('Failed to delete resource:', err);
      showToast(err.response?.data?.message || 'Failed to delete resource.');
    } finally {
      setResourceToDelete(null);
    }
  };

  const topics = ['all', ...new Set(resources.map((r) => r.topic).filter(Boolean))];

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.topic?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTopic = selectedTopic === 'all' || r.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const filteredSchedules = schedules.filter((s) => {
    if (!searchTerm) return true;
    const matchTitle = s.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTopic = s.topics?.some((t) =>
      t.topicName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchTitle || matchTopic;
  });

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-1">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Curriculum & Documentation Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Curriculum & Resources</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review the faculty weekly syllabus roadmap and publish reference guides for cohort students.
          </p>
        </div>

        {activeTab === 'resources' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource</span>
          </button>
        )}
      </div>

      {/* Main Tab Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => {
              setActiveTab('syllabus');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'syllabus'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Syllabus ({schedules.length} Weeks)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('resources');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Resource Library ({resources.length} Guides)</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              activeTab === 'syllabus' ? 'Search weekly topics...' : 'Search study guides...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-xs font-semibold">Loading curriculum data...</span>
        </div>
      ) : activeTab === 'syllabus' ? (
        /* TAB 1: WEEKLY SYLLABUS */
        <div className="space-y-4">
          {filteredSchedules.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Curriculum Schedules Published Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Admin schedules and 5-day structured agendas will appear here when published.
              </p>
            </div>
          ) : (
            filteredSchedules.map((week) => (
              <div
                key={week._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-sm border border-indigo-100 shadow-xs">
                      W{week.weekNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Week {week.weekNumber}: {week.title}
                      </h3>
                      <p className="text-xs text-slate-400">5-Day Structured Lecture & Lab Agenda</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    Cohort Syllabus
                  </span>
                </div>

                {/* 5-Day Topics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                  {week.topics?.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                          {t.day}
                        </div>
                        <div className="font-bold text-slate-800 leading-snug mt-1">
                          {t.topicName}
                        </div>
                      </div>
                      {t.date && (
                        <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(t.date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* TAB 2: RESOURCE LIBRARY */
        <div className="space-y-4">
          {topics.length > 1 && (
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                    selectedTopic === t
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t === 'all' ? 'All Topics' : t}
                </button>
              ))}
            </div>
          )}

          {filteredResources.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Resources Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "Add Resource" above to publish your first learning guide or documentation link.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((resource) => {
                const author = resource.mentor?.fullName || 'Faculty Mentor';
                const isOwner =
                  user?.role === 'admin' ||
                  (resource.mentor?._id || resource.mentor) === (user?._id || user?.id);

                return (
                  <div
                    key={resource._id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {resource.topic || 'General Guide'}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => setResourceToDelete(resource._id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {resource.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {resource.description || 'Curated learning material and documentation.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>By {author}</span>
                      </div>

                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition"
                      >
                        <span>Open Material</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Resource */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative text-xs">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4 space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Add Learning Resource</h3>
              <p className="text-slate-500">Share documentation or starter code repository link</p>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Architecture in Node.js"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Backend Engineering"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of what this link contains..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  <span>{isSubmitting ? 'Saving...' : 'Save Resource'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {resourceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Remove Resource?</h3>
              <p className="text-xs text-slate-500 mt-1">This will permanently remove the learning resource for all students.</p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setResourceToDelete(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer">Cancel</button>
              <button onClick={() => confirmDeleteResource(resourceToDelete)} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
