import React from 'react';
import { Clock, Zap, Users } from 'lucide-react';

export default function About() {
  const stats = [
    {
      icon: Clock,
      value: '3 Months',
      label: 'Intensive Program (12 Wks)',
    },
    {
      icon: Zap,
      value: '100%',
      label: 'Hands-On Labs & Capstones',
    },
    {
      icon: Users,
      value: '1:5',
      label: 'Mentor-to-Student Ratio',
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
              Empowering the Next Generation of <br className="hidden sm:inline" />
              Ethiopian Software Engineers
            </h2>

            <div className="space-y-4 text-base text-slate-600 leading-relaxed">
              <p>
                The <strong>ASTU MSJ Summer Bootcamp</strong> is a student driven engineering initiative organized by the <strong>Adama Science and Technology University Muslim Students Jemea (ASTU MSJ)</strong>. Our mission is to accelerate technical excellence through project-driven software development, industry-level mentorship, and collaborative problem-solving.
              </p>
              <p>
                With our dedicated <strong>1:5 mentor-to-student ratio</strong>, every participant receives individualized code reviews, weekly 1-on-1 milestone evaluations, and guidance to build production-grade web applications.
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
