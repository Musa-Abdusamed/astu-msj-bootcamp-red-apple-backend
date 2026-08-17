import React from 'react';
import { Clock, Zap, Users } from 'lucide-react';

export default function About() {
  const stats = [
    {
      icon: Clock,
      value: '3 weeks',
      label: 'Intensive Program',
    },
    {
      icon: Zap,
      value: '100%',
      label: 'Hands-On Projects',
    },
    {
      icon: Users,
      value: '1:8',
      label: 'Mentor-Student Ratio',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Tag */}
        <div className="text-left mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            ABOUT THE PROGRAM
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Paragraphs */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Built for the next generation of <br className="hidden sm:inline" />
              Ethiopian tech talent
            </h2>

            <div className="space-y-4 text-base text-slate-600 leading-relaxed">
              <p>
                The ASTU MSJ Summer Bootcamp is a flagship initiative of the Microsoft Student Group at Adama Science & Technology University. Our mission: accelerate technical skills through real-world project experience, guided by industry professionals who have shipped production software.
              </p>
              <p>
                Participants don't just learn — they build. Every track culminates in a portfolio-ready capstone project reviewed by mentors with hiring experience at leading tech companies.
              </p>
            </div>
          </div>

          {/* Right Column: 3 Stat Highlight Cards */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3.5 sm:gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-100"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-[11px] sm:text-xs font-medium text-slate-500 leading-tight">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
