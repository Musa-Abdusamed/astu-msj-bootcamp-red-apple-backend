import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Users } from 'lucide-react';

export default function Hero({ onOpenApply }) {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-white">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-indigo-200/25 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-100 text-indigo-600 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>ASTU MSJ Summer 2026 • 3-Month Intensive</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              ASTU MSJ <br />
              <span className="text-indigo-600">Summer Bootcamp</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              An intensive, hands-on 3-month full-stack engineering program organized by <strong>Adama Science and Technology University Muslim Students Jemea (ASTU MSJ)</strong>. Learn with a dedicated <strong>1:5 mentor-to-student ratio</strong>, build production-grade web applications, and launch your tech career.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenApply && onOpenApply()}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-400/25 hover:shadow-indigo-400/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#tracks"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all duration-200"
              >
                Explore Curriculum
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Code Graphic */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0 flex justify-center lg:justify-end">
            
            {/* Top Floating Badge: 1:5 Mentor Support */}
            <div className="absolute -top-6 left-6 sm:left-12 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-slate-200/70 border border-slate-100 min-w-[200px] animate-float-slow">
              <div className="text-[11px] font-semibold text-slate-400 tracking-wide mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mentorship Ratio</span>
              </div>
              <div className="text-sm font-extrabold text-indigo-600">
                1 Mentor : 5 Students
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Close individualized guidance
              </div>
            </div>

            {/* Code Window Container */}
            <div className="w-full max-w-lg bg-[#0d131f] rounded-2xl shadow-2xl shadow-indigo-950/20 border border-slate-800/80 overflow-hidden font-mono text-xs">
              
              {/* Window Header */}
              <div className="px-5 py-3.5 bg-[#0a0f19] border-b border-slate-800/70 flex items-center justify-between">
                <div className="text-slate-400 font-mono text-[11px] tracking-wide">
                  ASTU MSJ Capstone Architecture
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
                </div>
              </div>

              {/* Code Body */}
              <div className="p-5 sm:p-6 space-y-1.5 leading-relaxed overflow-x-auto text-[13px]">
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">1</span>
                  <span><span className="text-[#f472b6]">import</span> <span className="text-[#60a5fa]">React</span>, &#123; <span className="text-[#38bdf8]">useState</span>, <span className="text-[#38bdf8]">useEffect</span> &#125; <span className="text-[#f472b6]">from</span> <span className="text-[#34d399]">"react"</span>;</span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">2</span>
                  <span><span className="text-[#f472b6]">import</span> &#123; <span className="text-[#38bdf8]">connectDB</span> &#125; <span className="text-[#f472b6]">from</span> <span className="text-[#34d399]">"./config/db"</span>;</span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">3</span>
                  <span className="text-slate-500"></span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">4</span>
                  <span className="text-slate-500 italic">// ASTU MSJ 3-Month Fullstack Roadmap</span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">5</span>
                  <span><span className="text-[#f472b6]">const</span> <span className="text-[#fbbf24]">Cohort2026</span> = () =&gt; &#123;</span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">6</span>
                  <span className="pl-4"><span className="text-[#f472b6]">const</span> duration = <span className="text-[#34d399]">"3 Months (12 Weeks)"</span>;</span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">7</span>
                  <span className="pl-4"><span className="text-[#f472b6]">const</span> mentorRatio = <span className="text-[#34d399]">"1:5"</span>;</span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">8</span>
                  <span className="text-slate-500"></span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">9</span>
                  <span className="pl-4"><span className="text-[#f472b6]">return</span> &lt;<span className="text-[#f87171]">FullStackEngineer</span> <span className="text-[#fbbf24]">status</span>=<span className="text-[#34d399]">"JobReady"</span> /&gt;;</span>
                </div>
                <div className="flex">
                  <span className="w-7 text-slate-600 select-none text-right pr-4">10</span>
                  <span>&#125;;</span>
                </div>
              </div>

              {/* Status Bar */}
              <div className="px-5 py-2.5 bg-indigo-600/90 text-white flex items-center justify-between text-[11px] font-medium font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">ASTU MSJ Summer 2026</span>
                  <span>•</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>MERN Stack</span>
                  <span>•</span>
                  <span>12 Weeks</span>
                </div>
              </div>

            </div>

            {/* Bottom Floating Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 px-4 shadow-xl shadow-slate-200/70 border border-slate-100 flex items-center gap-3.5 animate-float-delayed">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-medium text-slate-400">
                  Curriculum Format
                </div>
                <div className="text-xs font-bold text-slate-900">
                  3 Months Intensive Labs
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
