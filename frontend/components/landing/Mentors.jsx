import React from 'react';
import { Linkedin, Github, Twitter } from 'lucide-react';

export default function Mentors() {
  const mentors = [
    {
      name: 'Dawit Tesfaye',
      role: 'Senior Frontend Engineer',
      company: 'Safaricom',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      tags: ['React', 'TypeScript', 'Next.js'],
      socials: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Meron Alemu',
      role: 'Full-Stack Developer',
      company: 'Ethiojobs Tech',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      tags: ['MERN', 'GraphQL', 'AWS'],
      socials: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Yonas Bekele',
      role: 'Backend Architect',
      company: 'Kifiya Financial',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      tags: ['Node.js', 'MongoDB', 'Docker'],
      socials: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Hana Girma',
      role: 'Software Engineer',
      company: 'iCog Labs',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      tags: ['React', 'Python', 'REST APIs'],
      socials: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
  ];

  return (
    <section id="mentors" className="py-24 bg-[#0a0f1d] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            MENTORS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Learn from industry practitioners
          </h2>
          <p className="text-base text-slate-400">
            Our mentors have built products used by thousands. They bring real-world perspective and direct feedback to every session.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, index) => (
            <div
              key={index}
              className="bg-[#121929]/90 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#151f33] transition-all duration-300 group"
            >
              <div>
                {/* Mentor Avatar */}
                <div className="mb-4 overflow-hidden rounded-xl w-14 h-14 bg-slate-800 border border-slate-700">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Name & Role */}
                <h3 className="text-lg font-bold text-white mb-0.5">
                  {mentor.name}
                </h3>
                <div className="text-xs text-slate-400 mb-0.5">
                  {mentor.role}
                </div>
                <div className="text-xs font-semibold text-indigo-400 mb-5">
                  {mentor.company}
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {mentor.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#1e293b] text-slate-300 border border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3.5 text-slate-500">
                <a href={mentor.socials.linkedin} className="hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={mentor.socials.github} className="hover:text-indigo-400 transition-colors" aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </a>
                <a href={mentor.socials.twitter} className="hover:text-indigo-400 transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
