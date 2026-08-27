import React, { useState, useEffect } from 'react';
import { studentService } from '../../api/studentService';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Sparkles,
  Layers,
  MessageSquare,
} from 'lucide-react';

export default function StudentProgress() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const studentId = user?._id || user?.id;

  useEffect(() => {
    const fetchProgress = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await studentService.getMyProgress(studentId);
        const list = res.data?.progress || res.data?.data?.progress || res.data || [];
        setProgressList(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Progress fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold">Loading your learning progress...</p>
      </div>
    );
  }

  const completedCount = progressList.filter((p) => p.status === 'completed').length;
  const scoredItems = progressList.filter((p) => typeof p.score === 'number');
  const averageScore =
    scoredItems.length > 0
      ? Math.round(scoredItems.reduce((acc, curr) => acc + curr.score, 0) / scoredItems.length)
      : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Academic Performance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Progress & Milestones</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your weekly mastery scores, roadmap progression, and mentor feedback.
          </p>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Average Score Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-xl">
            {averageScore}%
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Average Mastery</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              {averageScore >= 80 ? 'Distinction' : averageScore >= 60 ? 'Satisfactory' : 'In Progress'}
            </div>
          </div>
        </div>

        {/* Milestones Completed */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Completed Milestones</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {completedCount} <span className="text-xs text-slate-400 font-normal">/ {progressList.length}</span>
            </div>
          </div>
        </div>

        {/* Evaluation Reviews */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Evaluations Logged</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{progressList.length}</div>
          </div>
        </div>
      </div>

      {/* Progress Timeline / Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Roadmap Milestones & Evaluations</h3>

        {progressList.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-12 text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Progress Entries Logged Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your mentors will publish weekly milestone reviews, technical assessments, and project feedback here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {progressList.map((item) => {
              const isCompleted = item.status === 'completed';
              const isInProgress = item.status === 'in-progress';

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isInProgress
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                          {isInProgress && <Clock className="w-3 h-3" />}
                          <span>{(item.status || 'in-progress').toUpperCase()}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Recorded on {new Date(item.createdAt).toLocaleDateString()} by{' '}
                        <span className="font-semibold text-slate-600">{item.recordedBy?.fullName || 'Mentor'}</span>
                      </div>
                    </div>

                    {typeof item.score === 'number' && (
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 shrink-0">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase">Score</span>
                        <span className="text-lg font-extrabold text-slate-900">{item.score}/100</span>
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  )}

                  {item.feedback && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Mentor Feedback</span>
                      </div>
                      <p className="text-slate-600 italic leading-relaxed">{item.feedback}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
