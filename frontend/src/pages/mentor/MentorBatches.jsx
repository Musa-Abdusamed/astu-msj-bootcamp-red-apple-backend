import React, { useState, useEffect } from 'react';
import { mentorService } from '../../api/mentorService';
import { Layers, Users, Calendar, AlertCircle } from 'lucide-react';

export default function MentorBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await mentorService.getBatches();
      setBatches(data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch batches');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading batches...</div>;
  if (error) return <div className="p-8 text-center text-rose-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Batches</h1>
          <p className="text-sm text-slate-500">View your assigned batches and students</p>
        </div>
      </div>

      {batches.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Batches Assigned</h3>
          <p className="text-slate-500 mt-2">You are not currently assigned as a mentor to any active batches.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div key={batch._id} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${batch.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                    {batch.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {batch.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{batch.description}</p>
              </div>
              <div className="p-4 bg-slate-50/50 flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(batch.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
