import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-indigo-400" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-slideUp">
      {icons[type] || icons.success}
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
