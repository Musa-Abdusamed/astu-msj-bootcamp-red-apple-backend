import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What are the admissions criteria?',
      answer:
        'Admissions are open to motivated university students and aspiring tech builders. We evaluate basic programming aptitude, problem-solving mindset, and your commitment to completing the intensive 3-month (12-week) program and capstone project.',
    },
    {
      question: 'How does the 1:5 mentorship model work?',
      answer:
        'Every student is assigned to a dedicated mentor cohort where 1 experienced faculty mentor oversees a group of 5 students. This ensures personalized weekly code reviews, 1-on-1 milestone evaluations, and direct technical mentorship throughout the 3 months.',
    },
    {
      question: 'How much time do I need to commit each week?',
      answer:
        'The bootcamp is an intensive summer program. You should expect to commit approximately 20-25 hours per week across live mentor sessions, structured 5-day weekly syllabus labs, and hands-on project deliverables.',
    },
    {
      question: 'Are there any prerequisites?',
      answer:
        'Basic familiarity with programming logic (variables, loops, functions) is recommended. For the Frontend track, basic HTML/CSS knowledge is helpful. For Backend and Full-Stack, prior experience with JavaScript is beneficial.',
    },
    {
      question: 'Will I receive a certificate upon completion?',
      answer:
        'Yes! Students who maintain at least 80% attendance, successfully complete all module assignments, and deliver a reviewed capstone project will receive an official ASTU MSJ Bootcamp Certificate of Completion.',
    },
    {
      question: 'Is there a cost to attend?',
      answer:
        'No! The ASTU MSJ Summer Bootcamp is completely free for accepted students, organized and supported by the Adama Science and Technology University Muslim Students Jemea (ASTU MSJ).',
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600">
            Everything you need to know about the 3-month ASTU MSJ Bootcamp.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded-full text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
