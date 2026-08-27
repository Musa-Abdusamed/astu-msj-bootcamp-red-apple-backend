import React from 'react';

// Standalone SVG Icons (100% reliable)
const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Mentors() {
  const mentors = [
    {
      name: 'Nuria Jemal',
      role: 'Senior Frontend Engineer',
      company: 'Safaricom',
      avatar: '/mentors/nuria_jemal.jpg',
      tags: ['React', 'TypeScript', 'Next.js'],
      socials: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Nebat Kedir',
      role: 'Full-Stack Developer',
      company: 'Ethiojobs Tech',
      avatar: '/mentors/nebat_kedir.jpg',
      tags: ['MERN', 'GraphQL', 'AWS'],
      socials: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Abdi Tola',
      role: 'Backend Architect',
      company: 'Kifiya Financial',
      avatar: '/mentors/abdi_tola.jpg',
      tags: ['Node.js', 'MongoDB', 'Docker'],
      socials: {
        linkedin: '#',
        github: '#',
        twitter: '#',
      },
    },
    {
      name: 'Ebise Cala',
      role: 'Software Engineer',
      company: 'iCog Labs',
      avatar: '/mentors/ebise_cala.jpg',
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor, index) => (
            <div
              key={index}
              className="bg-[#121929]/90 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 hover:bg-[#151f33] transition-all duration-300 group"
            >
              <div>
                <div className="mb-4 overflow-hidden rounded-xl w-14 h-14 bg-slate-800 border border-slate-700">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="text-lg font-bold text-white mb-0.5">
                  {mentor.name}
                </h3>
                <div className="text-xs text-slate-400 mb-0.5">
                  {mentor.role}
                </div>
                <div className="text-xs font-semibold text-indigo-400 mb-5">
                  {mentor.company}
                </div>

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

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3.5 text-slate-500">
                <a href={mentor.socials.linkedin} className="hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a href={mentor.socials.github} className="hover:text-indigo-400 transition-colors" aria-label="GitHub">
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a href={mentor.socials.twitter} className="hover:text-indigo-400 transition-colors" aria-label="Twitter">
                  <TwitterIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
