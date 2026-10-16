import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, MapPin, ChevronRight, MessageSquare, Sun, Moon } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Our Teachers', path: '/faculty' },
    { label: 'Results', path: '/results' },
    { label: 'Campus & Classrooms', path: '/facilities' },
    { label: 'Timetable', path: '/timetable' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#111827] shadow-sm dark:shadow-xl border-b border-slate-200 dark:border-[#344054] transition-colors duration-200">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-300 dark:bg-[#0E1420] dark:text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 hidden md:block border-b border-slate-800 dark:border-[#243042]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B] shrink-0" />
              <span>{ACADEMY_CONFIG.address.street}, {ACADEMY_CONFIG.address.city} (PIN: 760001)</span>
            </span>
            <span className="text-slate-700 dark:text-[#344054]">|</span>
            <span className="text-[#FDE68A] dark:text-[#F4C76B] font-semibold hidden lg:inline">
              Admissions Open 2026–27: +2 Science, JEE Main/Adv, NEET-UG & NDA
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 hidden xl:inline">
              Center Hours: 7:00 AM – 7:30 PM
            </span>
            <span className="text-slate-700 dark:text-[#344054] hidden xl:inline">|</span>
            <Link
              to="/contact"
              className="text-[#F4C76B] hover:text-[#FDE68A] font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
            >
              <Phone className="w-3 h-3 shrink-0 text-[#F4C76B]" />
              <span>Request Callback</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="w-full bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md py-2.5 sm:py-3 transition-colors duration-200" aria-label="Main Navigation">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 lg:gap-4">
          
          {/* Logo with official Antariksh Academy graphic */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] rounded-lg shrink-0"
          >
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-100 dark:bg-[#202B3D] p-1 flex items-center justify-center border-2 border-[#C6922E]/40 dark:border-[#F4C76B]/40 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo_transparent.png"
                alt="Antariksh Academy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left shrink-0">
              <span className="font-display font-black text-[15px] sm:text-2xl tracking-tight text-[#17365D] dark:text-white group-hover:text-[#C6922E] dark:group-hover:text-[#F4C76B] transition-colors leading-none whitespace-nowrap">
                ANTARIKSH <span className="gold-gradient-text">ACADEMY</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-300 tracking-wider uppercase font-semibold mt-1 hidden sm:block whitespace-nowrap">
                Bijipur, Brahmapur • +2 Science & Entrances
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`px-2 2xl:px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#17365D] dark:text-white bg-slate-100 dark:bg-[#202B3D] border border-[#C6922E]/40 dark:border-[#F4C76B]/40 font-extrabold shadow-xs'
                      : 'text-slate-600 hover:text-[#17365D] hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#172033]'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Action Buttons + Theme Toggle */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:text-[#17365D] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#202B3D] border border-slate-200 dark:border-[#344054] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F4C76B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#17365D]" />
              )}
            </button>

            {/* Option B: Manual callback */}
            <Link
              to="/contact"
              className="px-3 py-1.5 2xl:px-3.5 2xl:py-2 text-xs font-bold text-slate-700 hover:text-[#17365D] bg-white hover:bg-slate-50 dark:text-slate-200 dark:hover:text-white dark:bg-[#202B3D] dark:hover:bg-[#26334A] border border-slate-300 dark:border-[#344054] hover:border-[#17365D]/40 dark:hover:border-[#F4C76B]/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
              <span>Request Callback</span>
            </Link>

            {/* Option A: 30-min Google Meet Booking */}
            <Link
              to="/consultation"
              className="px-3.5 py-1.5 2xl:px-4 2xl:py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#17365D] via-[#1E4273] to-[#17365D] hover:brightness-105 border border-[#17365D] shadow-sm dark:text-[#0F172A] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:border-[#F4C76B]/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FDE68A] dark:text-[#0F172A] shrink-0" />
              <span>Book Free Consultation</span>
            </Link>
          </div>

          {/* Mobile / Tablet Controls (< xl) */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202B3D] border border-slate-200 dark:border-[#344054] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] cursor-pointer shrink-0"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F4C76B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#17365D]" />
              )}
            </button>

            <Link
              to="/consultation"
              className="px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-extrabold text-white bg-gradient-to-r from-[#17365D] to-[#102A43] dark:text-[#0F172A] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] rounded-lg shadow-xs transition-colors flex items-center gap-1 shrink-0"
              aria-label="Book Consultation"
            >
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-[#FDE68A] dark:text-[#0F172A]" />
              <span>Consult</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 sm:p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202B3D] focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] cursor-pointer shrink-0"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#C6922E] dark:text-[#F4C76B]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile / Tablet Dropdown Menu Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-[#344054] shadow-2xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs font-bold transition-colors ${
                    isActive
                      ? 'text-[#17365D] dark:text-white bg-slate-100 dark:bg-[#202B3D] border border-[#C6922E]/40 dark:border-[#F4C76B]/40 font-extrabold'
                      : 'text-slate-700 hover:text-[#17365D] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#172033]'
                  }`}
                >
                  <span className="truncate">{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-[#243042] flex flex-col sm:flex-row gap-2">
            <Link
              to="/consultation"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#17365D] via-[#1E4273] to-[#17365D] dark:text-[#0F172A] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] hover:brightness-105 rounded-xl shadow-sm flex items-center justify-center gap-1.5 text-center min-h-[44px]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FDE68A] dark:text-[#0F172A]" />
              <span>Book Free Consultation (Google Meet)</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-xs font-bold text-slate-700 hover:text-[#17365D] bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-[#202B3D] dark:hover:bg-[#26334A] border border-slate-300 dark:border-[#344054] rounded-xl flex items-center justify-center gap-1.5 text-center min-h-[44px]"
            >
              <Phone className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" />
              <span>Request Callback / Meeting</span>
            </Link>
          </div>

          <div className="mt-3 text-center flex items-center justify-center gap-4">
            <a
              href={ACADEMY_CONFIG.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline py-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp: {ACADEMY_CONFIG.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
