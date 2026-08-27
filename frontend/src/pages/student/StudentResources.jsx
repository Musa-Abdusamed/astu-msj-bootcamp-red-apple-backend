import React, { useState, useEffect } from 'react';
import { studentService } from '../../api/studentService';
import {
  BookOpen,
  Calendar,
  Layers,
  ExternalLink,
  Search,
  Tag,
  Sparkles,
  Link2,
  FileText,
  User,
  Clock,
  Compass,
} from 'lucide-react';

export default function StudentResources() {
  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus' | 'resources'
  const [schedules, setSchedules] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schRes, resRes] = await Promise.allSettled([
        studentService.getSchedules(),
        studentService.getResources(),
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

  // Extract unique topics for filter pills
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-1">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bootcamp Roadmap & Study Center</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Curriculum & Resources</h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore your weekly syllabus topics, lecture agendas, and faculty reference materials.
          </p>
        </div>
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
          <span className="text-xs font-semibold">Loading curriculum schedule...</span>
        </div>
      ) : activeTab === 'syllabus' ? (
        /* TAB 1: WEEKLY SYLLABUS & AGENDAS */
        <div className="space-y-4">
          {filteredSchedules.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Curriculum Schedules Published Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Faculty will publish weekly lecture topics and daily structured agendas here.
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
                    Official Syllabus
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
        /* TAB 2: LEARNING RESOURCES & GUIDES */
        <div className="space-y-4">
          {/* Topic Filter Pills */}
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
                No study materials matching your current filter. Faculty links will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((resource) => {
                const author = resource.mentor?.fullName || 'Faculty Mentor';

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
                        <span className="text-[11px] text-slate-400">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
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
    </div>
  );
}
