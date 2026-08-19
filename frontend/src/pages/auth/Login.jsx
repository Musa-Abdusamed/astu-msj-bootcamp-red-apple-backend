import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password, role);
    if (res.success) {
      navigate(`/${role}`);
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-100 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
            <Shield className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Sign In to ASTU MSJ
          </h2>
          <p className="text-xs text-slate-500">
            Select your role to access your dedicated dashboard
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100">
          {['student', 'mentor', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                role === r
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@astu.edu.et"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : `Log In as ${role.toUpperCase()}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Register
          </Link>
          <span className="mx-2">•</span>
          <Link to="/" className="text-slate-400 hover:text-slate-600">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
