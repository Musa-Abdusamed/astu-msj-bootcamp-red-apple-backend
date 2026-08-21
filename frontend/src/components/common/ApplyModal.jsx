import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  User,
  Mail,
  Phone,
  Send,
  Code2,
  GraduationCap,
  Building2,
  FileText,
  Layers,
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function ApplyModal({ isOpen, onClose, initialTrack, onShowToast }) {
  const [track, setTrack] = useState('Frontend Track');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    telegramHandle: '',
    gender: 'Male',
    department: 'Software Engineering',
    year: '3rd Year',
    university: 'ASTU',
    githubUrl: '',
    codeforcesUrl: '',
    leetcodeUrl: '',
    motivation: '',
    roleAtApplication: 'student',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTrack) {
      setTrack(initialTrack);
    }
  }, [initialTrack]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      telegramHandle: formData.telegramHandle.trim().startsWith('@')
        ? formData.telegramHandle.trim()
        : `@${formData.telegramHandle.trim()}`,
      gender: formData.gender,
      department: formData.department.trim(),
      year: formData.year,
      university: formData.university.trim() || 'ASTU',
      githubUrl: formData.githubUrl.trim(),
      codeforcesUrl: formData.codeforcesUrl.trim() || 'N/A',
      leetcodeUrl: formData.leetcodeUrl.trim() || 'N/A',
      motivation: formData.motivation.trim(),
      roleAtApplication: formData.roleAtApplication,
      trackPreference: track,
    };

    await adminService.submitApplication(payload);
    setIsSubmitting(false);
    setSubmitted(true);
    if (onShowToast) {
      onShowToast(`Application submitted for ${track}! Check your email for confirmation.`);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Application Received!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you for applying to the{' '}
              <span className="font-bold text-indigo-600">{track}</span> for Summer 2026.
              Our admissions team will review your application profile and reach out via Telegram and email.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Summer 2026 Cohort Application</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Apply for ASTU MSJ Bootcamp</h3>
              <p className="text-xs text-slate-500">
                Please complete all required fields according to your academic & coding profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Section 1: Learning Track & Role */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Bootcamp Track & Application Role</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Track</label>
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    >
                      <option value="Frontend Track">Frontend Track (HTML/CSS, JS, React, Tailwind)</option>
                      <option value="Backend Engineering">Backend Engineering (Node.js, Express, MongoDB, REST)</option>
                      <option value="Full-Stack MERN">Full-Stack MERN (MongoDB, Express, React, Node.js)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Applying As</label>
                    <select
                      value={formData.roleAtApplication}
                      onChange={(e) => setFormData({ ...formData, roleAtApplication: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    >
                      <option value="student">Student Trainee</option>
                      <option value="mentor">Peer Mentor / TA</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Personal & Contact Information */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Personal & Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Abebe Bikila"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@astu.edu.et"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+251 91 100 0000"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Telegram Handle *</label>
                    <input
                      type="text"
                      required
                      value={formData.telegramHandle}
                      onChange={(e) => setFormData({ ...formData, telegramHandle: e.target.value })}
                      placeholder="@yourhandle"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Academic Background */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Academic Background</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">University *</label>
                    <input
                      type="text"
                      required
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      placeholder="ASTU"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g. Software Engineering"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Academic Year *</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year / Grad">5th Year / Graduating</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Coding Profiles & Portfolio */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <Code2 className="w-4 h-4 text-indigo-600" />
                  <span>Coding Profiles & Repositories</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub Profile URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      LeetCode Profile URL * <span className="text-slate-400 font-normal">(or "N/A")</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.leetcodeUrl}
                      onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                      placeholder="https://leetcode.com/u/yourhandle or N/A"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Codeforces Profile URL * <span className="text-slate-400 font-normal">(or "N/A")</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.codeforcesUrl}
                      onChange={(e) => setFormData({ ...formData, codeforcesUrl: e.target.value })}
                      placeholder="https://codeforces.com/profile/yourhandle or N/A"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Statement of Purpose & Motivation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Motivation & Statement of Purpose *</span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Explain why you want to join this bootcamp, your learning goals, and any relevant project experience..."
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 text-slate-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

