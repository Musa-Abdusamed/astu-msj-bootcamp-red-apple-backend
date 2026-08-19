import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ onOpenLogin, onOpenApply }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Tracks', href: '#tracks' },
    { name: 'Mentors', href: '#mentors' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <span className="font-mono font-bold text-sm tracking-tight">&gt;_</span>
            </div>
            <div className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
              <span className="text-slate-900 font-extrabold">ASTU MSJ</span>
              <span className="text-indigo-600 font-bold">Bootcamp</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[15px] font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 active:scale-95 text-center cursor-pointer"
            >
              Log In
            </Link>
            <button
              onClick={() => (onOpenApply ? onOpenApply() : null)}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-300/40 transition-all duration-200 active:scale-95 hover:shadow cursor-pointer"
            >
              Apply Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 text-center transition"
            >
              Log In
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApply && onOpenApply();
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 text-center shadow-sm shadow-indigo-300 cursor-pointer"
            >
              Apply Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
