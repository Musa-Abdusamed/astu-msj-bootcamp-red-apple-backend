import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Code2,
  GraduationCap,
  Sparkles,
  X,
  Mail,
  Send,
  UserPlus,
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [toast, setToast] = useState(null);
  const [enrollBatchId, setEnrollBatchId] = useState('');

  const fetchApps = async () => {
    const [appsRes, batchesRes] = await Promise.all([
      adminService.getApplications(),
      adminService.getBatches(),
    ]);
    setApplications(appsRes.data || []);
    setBatches(batchesRes.data || []);
    if (batchesRes.data?.length > 0) {
      setEnrollBatchId(batchesRes.data[0]._id);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleStatusChange = async (id, newStatus) => {
    await adminService.updateApplicationStatus(id, newStatus);
    showToast(`Application marked as ${newStatus}`);
    fetchApps();
    if (selectedApp?._id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleEnrollAccepted = async () => {
    if (!selectedApp) return;
    // Create new student user from application
    await adminService.createUser({
      fullName: selectedApp.fullName,
      email: selectedApp.email,
      role: 'student',
      phone: selectedApp.phone,
      batchId: enrollBatchId,
    });
    await adminService.updateApplicationStatus(selectedApp._id, 'Accepted');
    showToast(`Enrolled ${selectedApp.fullName} into cohort and created student account!`);
    setSelectedApp(null);
    fetchApps();
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.university.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Admissions & Intake Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Bootcamp Applications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review incoming public candidate applications, inspect profiles, and approve admissions
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          {['All', 'Pending', 'Accepted', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by candidate name, dept, university..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Candidate</th>
                <th className="px-6 py-3.5">Department & Year</th>
                <th className="px-6 py-3.5">Track Preference</th>
                <th className="px-6 py-3.5">Coding Profiles</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{app.fullName}</div>
                      <div className="text-[11px] text-slate-400">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{app.department}</div>
                      <div className="text-[11px] text-slate-400">
                        {app.year} • {app.university}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {app.trackPreference || 'Frontend Track'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {app.githubUrl && (
                          <a
                            href={app.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            title="GitHub"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {app.leetcodeUrl && (
                          <a
                            href={app.leetcodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                            title="LeetCode"
                          >
                            LC
                          </a>
                        )}
                        {app.codeforcesUrl && (
                          <a
                            href={app.codeforcesUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200"
                            title="Codeforces"
                          >
                            CF
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {app.status === 'Accepted' && <CheckCircle2 className="w-3 h-3" />}
                        {app.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {app.status === 'Pending' && <Clock className="w-3 h-3" />}
                        <span>{app.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-semibold transition cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Inspection & Triage Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                {selectedApp.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedApp.fullName}</h3>
                <p className="text-xs text-slate-500">
                  {selectedApp.email} • Phone: {selectedApp.phone} • Telegram: {selectedApp.telegramHandle}
                </p>
              </div>
            </div>

            {/* Application Information Grid */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Department</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedApp.department}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Academic Year</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedApp.year}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">University</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedApp.university}</div>
                </div>
              </div>

              {/* Profiles */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="font-bold text-slate-700">Coding Profiles & Portfolios</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedApp.githubUrl ? (
                    <a
                      href={selectedApp.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:border-indigo-500 hover:text-indigo-600 transition"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>GitHub Profile</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No GitHub provided</span>
                  )}
                  {selectedApp.leetcodeUrl && (
                    <a
                      href={selectedApp.leetcodeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-amber-700 font-semibold hover:border-amber-500 transition"
                    >
                      <span>LeetCode</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {selectedApp.codeforcesUrl && (
                    <a
                      href={selectedApp.codeforcesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sky-700 font-semibold hover:border-sky-500 transition"
                    >
                      <span>Codeforces</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>

              {/* Motivation Essay */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-700">Statement of Purpose & Motivation</div>
                <p className="text-slate-600 leading-relaxed italic">{selectedApp.motivation}</p>
              </div>

              {/* Triage Decision Controls */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800">Direct Cohort Enrollment:</div>
                  <select
                    value={enrollBatchId}
                    onChange={(e) => setEnrollBatchId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                  <button
                    onClick={() => handleStatusChange(selectedApp._id, 'Rejected')}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition cursor-pointer"
                  >
                    Reject Candidate
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApp._id, 'Accepted')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                  >
                    Mark as Accepted
                  </button>
                  <button
                    onClick={handleEnrollAccepted}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Approve & Create Student Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
