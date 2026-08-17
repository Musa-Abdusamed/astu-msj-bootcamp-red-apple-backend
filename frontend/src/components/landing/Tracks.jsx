import React from 'react';
import { Code2, Server, Layers, Award, FolderGit2 } from 'lucide-react';

export default function Tracks({ onSelectTrack }) {
  const tracks = [
    {
      id: 'frontend',
      title: 'Frontend Track',
      duration: '3 Weeks',
      icon: Code2,
      accentColor: 'border-indigo-600',
      iconBg: 'bg-indigo-600',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
      description: 'Master the visual layer of the web. Build responsive, accessible, interactive UIs entirely from scratch.',
      tags: ['HTML & CSS', 'JavaScript (ES6+)', 'React', 'Tailwind CSS'],
      capstones: '5 capstone projects',
      certificate: 'Certificate included',
    },
    {
      id: 'backend',
      title: 'Backend Engineering',
      duration: '3 Weeks',
      icon: Server,
      accentColor: 'border-blue-600',
      iconBg: 'bg-blue-600',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
      description: 'Build scalable APIs and server-side applications that power modern web products used daily.',
      tags: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
      capstones: '4 capstone projects',
      certificate: 'Certificate included',
    },
    {
      id: 'fullstack',
      title: 'Full-Stack MERN',
      duration: '3 Weeks',
      icon: Layers,
      accentColor: 'border-cyan-500',
      iconBg: 'bg-cyan-500',
      buttonBg: 'bg-sky-500 hover:bg-sky-600 shadow-sky-200',
      description: 'End-to-end web architecture. Build, connect, and deploy complete production-ready applications.',
      tags: ['MongoDB', 'Express.js', 'React', 'Node.js'],
      capstones: '6 capstone projects',
      certificate: 'Certificate included',
    },
  ];

  return (
    <section id="tracks" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            LEARNING PATHS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Choose your track
          </h2>
          <p className="text-base text-slate-600">
            Three focused learning paths, each built around an industry-grade curriculum and real project delivery.
          </p>
        </div>

        {/* Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.id}
                className={`bg-white rounded-2xl border-t-[5px] ${track.accentColor} border-x border-b border-slate-200/80 shadow-md shadow-slate-100 p-7 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div>
                  {/* Top Bar: Icon & Duration Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl ${track.iconBg} flex items-center justify-center text-white shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      {track.duration}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {track.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 min-h-[50px]">
                    {track.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {track.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100/80 text-slate-600 border border-slate-200/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer / Meta & Apply Button */}
                <div className="space-y-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                      {track.capstones}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      {track.certificate}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTrack && onSelectTrack(track.title)}
                    className={`w-full py-3 rounded-xl text-sm font-semibold text-white ${track.buttonBg} transition-all duration-200 shadow-sm active:scale-[0.98]`}
                  >
                    Apply for Track
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
