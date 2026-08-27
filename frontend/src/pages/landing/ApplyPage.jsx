import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  User,
  AlertTriangle,
  Code2,
  GraduationCap,
  FileText,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { adminService } from '../../api/adminService';

export default function ApplyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialTrack = location.state?.track || 'Frontend Track';

  const [track, setTrack] = useState(initialTrack);
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
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
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
      setSubmitted(true);
    } catch (err) {
      console.error('Application submission error:', err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.map((e) => e.msg || e.message).join(', ')
          : 'Failed to submit application. Please check your information and try again.');
      setErrorMsg(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Simple Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-600" />
            <span>ASTU MSJ</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-xl border border-slate-100">
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">Application Received!</h3>
              <p className="text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for applying to the{' '}
                <span className="font-bold text-indigo-600">{track}</span> for Summer 2026.
                Our admissions team will review your application profile and reach out via Telegram and email.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 px-8 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {/* Header */}
              <div className="mb-8 space-y-2 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Summer 2026 Cohort Application</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Join the Bootcamp</h1>
                <p className="text-sm text-slate-500 max-w-lg mx-auto">
                  Please complete all required fields according to your academic & coding profile.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold block">Submission Error</span>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                {/* Section 1: Learning Track & Role */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <span>Bootcamp Track & Application Role</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Select Track</label>
                      <select
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      >
                        <option value="Frontend Track">Frontend Track (HTML/CSS, JS, React, Tailwind)</option>
                        <option value="Backend Engineering">Backend Engineering (Node.js, Express, MongoDB, REST)</option>
                        <option value="Full-Stack MERN">Full-Stack MERN (MongoDB, Express, React, Node.js)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Applying As</label>
                      <select
                        value={formData.roleAtApplication}
                        onChange={(e) => setFormData({ ...formData, roleAtApplication: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      >
                        <option value="student">Student Trainee</option>
                        <option value="mentor">Peer Mentor / TA</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Personal & Contact Information */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    <span>Personal & Contact Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Abebe Bikila"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@astu.edu.et"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+251 91 100 0000"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Telegram Handle *</label>
                      <input
                        type="text"
                        required
                        value={formData.telegramHandle}
                        onChange={(e) => setFormData({ ...formData, telegramHandle: e.target.value })}
                        placeholder="@yourhandle"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Gender *</label>
                      <select
                        required
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic Background */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>Academic Background</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">University *</label>
                      <input
                        type="text"
                        required
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        placeholder="ASTU"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Department *</label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. Software Engineering"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">Academic Year *</label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
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
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                    <Code2 className="w-5 h-5 text-indigo-600" />
                    <span>Coding Profiles & Repositories</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 text-xs">GitHub Profile URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/yourusername"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                        LeetCode URL * <span className="text-slate-400 font-normal">(or "N/A")</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.leetcodeUrl}
                        onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                        placeholder="https://leetcode.com/u/yourhandle or N/A"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                        Codeforces URL * <span className="text-slate-400 font-normal">(or "N/A")</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.codeforcesUrl}
                        onChange={(e) => setFormData({ ...formData, codeforcesUrl: e.target.value })}
                        placeholder="https://codeforces.com/profile/yourhandle or N/A"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5: Statement of Purpose & Motivation */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span>Motivation & Statement of Purpose *</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder="Explain why you want to join this bootcamp, your learning goals, and any relevant project experience..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 resize-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-4 rounded-xl text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
