import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, MapPin, ChevronRight, MessageSquare, Sun, Moon, GraduationCap, ShieldCheck, BookOpen } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SoundToggle } from './common/SoundToggle';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, role } = useAuth();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on resize to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
              Admissions Open 2026–27: +2 Science, JEE Main/Adv, NEET-UG, OUAT & ICAR
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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 lg:gap-4">
          
          {/* Logo with official Antariksh Academy graphic */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] rounded-lg shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-[#202B3D] p-1 flex items-center justify-center border-2 border-[#C6922E]/40 dark:border-[#F4C76B]/40 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo_transparent.png"
                alt="Antariksh Academy Logo"
                width="40"
                height="40"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left shrink-0">
              <span className="font-display font-black text-sm xs:text-base sm:text-xl lg:text-2xl tracking-tight text-[#17365D] dark:text-white group-hover:text-[#854D0E] dark:group-hover:text-[#F4C76B] transition-colors leading-none whitespace-nowrap">
                ANTARIKSH <span className="gold-gradient-text">ACADEMY</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-300 tracking-wider uppercase font-semibold mt-1 hidden 2xl:block whitespace-nowrap">
                Bijipur, Brahmapur • +2 Science & Entrances
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1 shrink-0">
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
          <div className="hidden xl:flex items-center gap-1.5 2xl:gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-600 hover:text-[#17365D] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#202B3D] border border-slate-200 dark:border-[#344054] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] cursor-pointer flex items-center justify-center"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F4C76B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#17365D]" />
              )}
            </button>

            {/* Sound Toggle Button (Kobra Systems UI Audio) */}
            <SoundToggle />

            {/* Dynamic Portal CTA based on role */}
            {isAuthenticated && user ? (
              <Link
                to={
                  role === 'superadmin'
                    ? '/superadmin/dashboard'
                    : role === 'teacher'
                    ? '/teacher/dashboard'
                    : '/student/dashboard'
                }
                className="px-2.5 py-1.5 2xl:px-3 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 dark:text-[#0B1120] dark:bg-[#F4C76B] dark:hover:bg-[#E5B555] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                title={`${role === 'superadmin' ? 'Superadmin Console' : role === 'teacher' ? 'Teacher Desk' : 'Student Portal'}: ${user.name}`}
              >
                {role === 'superadmin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                ) : role === 'teacher' ? (
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>
                  {role === 'superadmin'
                    ? 'Superadmin'
                    : role === 'teacher'
                    ? `Teacher (${user.name.split(' ')[0]})`
                    : `Portal (${user.name.split(' ')[0]})`}
                </span>
              </Link>
            ) : (
              <Link
                to="/student/login"
                className="px-2.5 py-1.5 2xl:px-3 text-xs font-bold text-slate-700 hover:text-[#17365D] bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-[#1E293B] dark:hover:bg-[#2A374D] border border-slate-300 dark:border-slate-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Portal Login"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#F4C76B] shrink-0" />
                <span>Portal Login</span>
              </Link>
            )}

            {/* Option B: Manual callback - shown on large desktop (2xl:), while top bar already provides callback for 1280-1440px laptops */}
            <Link
              to="/contact"
              className="hidden 2xl:flex px-3 py-1.5 2xl:px-3.5 2xl:py-2 text-xs font-bold text-slate-700 hover:text-[#17365D] bg-white hover:bg-slate-50 dark:text-slate-200 dark:hover:text-white dark:bg-[#202B3D] dark:hover:bg-[#26334A] border border-slate-300 dark:border-[#344054] hover:border-[#17365D]/40 dark:hover:border-[#F4C76B]/40 rounded-xl transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
              <span>Request Callback</span>
            </Link>

            {/* Option A: 30-min Google Meet Booking */}
            <Link
              to="/consultation"
              className="px-3 py-1.5 2xl:px-4 2xl:py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#17365D] via-[#1E4273] to-[#17365D] hover:brightness-105 border border-[#17365D] shadow-sm dark:text-[#0F172A] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:border-[#F4C76B]/40 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FDE68A] dark:text-[#0F172A] shrink-0" />
              <span>Book Free Consultation</span>
            </Link>
          </div>

          {/* Mobile / Tablet Controls (< xl) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 xl:hidden shrink-0">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202B3D] border border-slate-200 dark:border-[#344054] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] cursor-pointer shrink-0 flex items-center justify-center"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F4C76B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#17365D]" />
              )}
            </button>

            {/* Sound Toggle Button (Kobra Systems UI Audio) */}
            <SoundToggle />

            {/* Quick Consultation CTA - shown on tablets and wider mobile, hidden on compact phones to prevent navbar cramming */}
            <Link
              to="/consultation"
              className="hidden sm:inline-flex px-3 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#17365D] to-[#102A43] dark:text-[#0F172A] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] rounded-xl shadow-xs transition-colors items-center gap-1.5 shrink-0 min-h-[44px]"
              aria-label="Book Consultation"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0 text-[#FDE68A] dark:text-[#0F172A]" />
              <span>Consult</span>
            </Link>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202B3D] border border-slate-200 dark:border-[#344054] focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] cursor-pointer shrink-0 flex items-center justify-center"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-[#854D0E] dark:text-[#F4C76B]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile / Tablet Dropdown Menu Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-[#344054] shadow-2xl px-4 pt-3 pb-6 max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-[#17365D] dark:text-white bg-slate-100 dark:bg-[#202B3D] border border-[#C6922E]/40 dark:border-[#F4C76B]/40 font-extrabold shadow-xs'
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
          <div className="pt-3 border-t border-slate-200 dark:border-[#243042] flex flex-col gap-2">
            {/* Dynamic Portal Mobile Button */}
            <Link
              to={
                isAuthenticated && user
                  ? role === 'superadmin'
                    ? '/superadmin/dashboard'
                    : role === 'teacher'
                    ? '/teacher/dashboard'
                    : '/student/dashboard'
                  : '/student/login'
              }
              onClick={() => setIsOpen(false)}
              className="py-2.5 px-3 text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 rounded-xl shadow-xs flex items-center justify-center gap-2 text-center min-h-[44px]"
            >
              {role === 'superadmin' ? (
                <ShieldCheck className="w-4 h-4 text-[#0B1120] shrink-0" />
              ) : role === 'teacher' ? (
                <BookOpen className="w-4 h-4 text-[#0B1120] shrink-0" />
              ) : (
                <GraduationCap className="w-4 h-4 text-[#0B1120] shrink-0" />
              )}
              <span>
                {isAuthenticated && user
                  ? role === 'superadmin'
                    ? 'Superadmin Console'
                    : role === 'teacher'
                    ? `Teacher Desk (${user.name.split(' ')[0]})`
                    : `Student Portal (${user.name.split(' ')[0]})`
                  : 'Portal Login'}
              </span>
            </Link>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to="/consultation"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 px-3 text-xs font-extrabold text-white bg-gradient-to-r from-[#17365D] via-[#1E4273] to-[#17365D] dark:text-[#0F172A] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] hover:brightness-105 rounded-xl shadow-sm flex items-center justify-center gap-1.5 text-center min-h-[44px]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#FDE68A] dark:text-[#0F172A]" />
                <span>Book Free Consultation</span>
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-slate-700 hover:text-[#17365D] bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-[#202B3D] dark:hover:bg-[#26334A] border border-slate-300 dark:border-[#344054] rounded-xl flex items-center justify-center gap-1.5 text-center min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" />
                <span>Request Callback</span>
              </Link>
            </div>
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
