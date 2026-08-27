import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Calendar,
  Tag,
  AlertCircle,
  Search,
  Users,
  Sparkles,
} from 'lucide-react';
import { mentorService } from '../../api/mentorService';

export default function MentorAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await mentorService.getAnnouncements();
      const raw = res.announcements || res.data?.announcements || res.data || (Array.isArray(res) ? res : []);
      
      const relevant = (Array.isArray(raw) ? raw : []).filter((a) => {
        return a.targetAudience === 'all' || a.targetAudience === 'mentors';
      });

      setAnnouncements(relevant);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'urgent') return item.urgent;
    return true;
  });

  const urgentCount = announcements.filter((a) => a.urgent).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-1">
            <Megaphone className="w-3.5 h-3.5 text-rose-600" />
            <span>Faculty Bulletins</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Faculty & Mentor Announcements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Notices, scheduling updates, and administrative memos for faculty mentors.
          </p>
        </div>

        {urgentCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{urgentCount} Urgent Notice{urgentCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
          {[
            { id: 'all', label: 'All Notices' },
            { id: 'urgent', label: 'Urgent Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === tab.id
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search bulletins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-xs font-semibold">Loading notices...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-2">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Faculty Bulletins Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Administrative bulletins and cohort memos will appear here when published.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const author = item.createdBy?.fullName || item.author || 'Admin Office';
            const formattedDate = new Date(item.publishDate || item.createdAt).toLocaleDateString();

            return (
              <div
                key={item._id}
                className={`bg-white rounded-3xl border p-6 shadow-xs hover:shadow-md transition-all space-y-3 ${
                  item.urgent ? 'border-amber-300 bg-amber-50/15' : 'border-slate-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
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
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formattedDate} • by {author}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
