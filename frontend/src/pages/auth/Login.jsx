import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, Sparkles, KeyRound, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('student');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const getPlaceholder = () => {
    if (role === 'student') return 'msjst/00001/26';
    if (role === 'mentor') return 'mentor@astu.edu.et';
    return 'admin@astu.edu.et';
  };

  const getIdentifierLabel = () => {
    if (role === 'student') return 'Unique Student ID';
    return 'Email Address';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(userId.trim(), password, role);
    if (res.success) {
      // Only students with one-time password / first login are redirected to settings
      if (role === 'student' && (res.mustChangeCredentials || res.user?.mustChangeCredentials)) {
        navigate('/settings', { state: { firstLogin: true, forcedPasswordChange: true } });
      } else {
        navigate(`/${role}`);
      }
    } else {
      setError(res.error || 'Invalid credentials, password, or role selection');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-100 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-1">
            <Shield className="w-6 h-6" />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
            <Sparkles className="w-3 h-3" />
            <span>ASTU MSJ Summer 2026</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Sign In to Portal
          </h2>
          <p className="text-xs text-slate-500">
            Select your role to access your dashboard
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100">
          {['student', 'mentor', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                role === r
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Informational tip for students */}
        {role === 'student' && (
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-800">
            <KeyRound className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Accepted students: Use the <strong>Unique ID</strong> and <strong>One-Time Password</strong> sent to your email.
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {getIdentifierLabel()}
            </label>
            <div className="relative">
              {role === 'student' ? (
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              ) : (
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              )}
              <input
                type={role === 'student' ? 'text' : 'email'}
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-sans"
              />
            </div>
            {role === 'student' && (
              <p className="text-[11px] text-slate-400 mt-1">
                Format: {getPlaceholder()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {role === 'student' ? 'One-Time Password / Password' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              />
            </div>
            <div className="flex justify-end mt-1.5">
              <Link to="/forgot-password" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : `Log In as ${role.toUpperCase()}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 space-y-1">
          <div>
            Not enrolled yet?{' '}
            <Link to="/" className="font-bold text-indigo-600 hover:underline">
              Apply for Admission
            </Link>
          </div>
          <div>
            <Link to="/" className="text-slate-400 hover:text-slate-600 text-[11px]">
              ← Back to Main Website
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
