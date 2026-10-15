import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, MapPin, ChevronRight, MessageSquare } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Results', path: '/results' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Timetable', path: '/timetable' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-200">
      {/* Top Notification Bar */}
      <div className="bg-[#0F172A] text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#FC1682] shrink-0" />
              <span>{ACADEMY_CONFIG.address.street}, {ACADEMY_CONFIG.address.city} (PIN: 760001)</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[#00C8FF] font-semibold hidden lg:inline">
              Admissions Open 2026-27: +2 Science, JEE Main/Adv, NEET-UG & NDA
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 hidden xl:inline">
              Center Hours: 7:00 AM – 7:30 PM
            </span>
            <span className="text-slate-600 hidden xl:inline">|</span>
            <Link
              to="/contact"
              className="text-[#FC1682] hover:text-pink-300 font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
            >
              <Phone className="w-3 h-3 shrink-0" />
              <span>Request Callback</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <nav className="w-full bg-white/95 backdrop-blur-md py-2.5 sm:py-3" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo with official Antariksh Academy graphic */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#FC1682] rounded-lg shrink-0 min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white p-1 flex items-center justify-center border-2 border-[#FC1682]/40 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo_transparent.png"
                alt="Antariksh Academy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="font-['Outfit',sans-serif] font-black text-lg sm:text-2xl tracking-tight text-[#0F172A] group-hover:text-[#FC1682] transition-colors leading-none truncate">
                ANTARIKSH <span className="text-[#FC1682]">ACADEMY</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 tracking-wider uppercase font-bold mt-1 hidden sm:block truncate">
                Bijipur, Brahmapur • +2 Science & Entrances
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#FC1682] bg-pink-50 font-extrabold shadow-2xs'
                      : 'text-slate-700 hover:text-[#FC1682] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            <Link
              to="/contact"
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#FC1682] shrink-0" />
              <span>Call Us</span>
            </Link>

            <Link
              to="/consultation"
              className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-[#FC1682] to-[#D9146C] hover:from-[#E00E70] hover:to-[#BE125A] rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Book Free Consultation</span>
            </Link>
          </div>

          {/* Mobile / Tablet Controls (< xl) */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
            <Link
              to="/consultation"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#FC1682] to-[#D9146C] rounded-lg shadow-sm transition-colors flex items-center gap-1 shrink-0"
              aria-label="Book Consultation"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Consult</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-700 hover:text-[#FC1682] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FC1682] cursor-pointer"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6 text-[#FC1682]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile / Tablet Dropdown Menu Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 shadow-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
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
                      ? 'text-[#FC1682] bg-pink-50 font-extrabold'
                      : 'text-slate-700 hover:text-[#FC1682] hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
            <Link
              to="/consultation"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#FC1682] to-[#D9146C] hover:from-[#E00E70] rounded-xl shadow-md flex items-center justify-center gap-1.5 text-center"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Free Consultation</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center gap-1.5 text-center"
            >
              <Phone className="w-3.5 h-3.5 text-[#FC1682]" />
              <span>Request Callback</span>
            </Link>
          </div>

          <div className="mt-3 text-center">
            <a
              href={`https://wa.me/${ACADEMY_CONFIG.contact.whatsappNumber}?text=Hello%20Antariksh%20Academy,%20I%20would%20like%20to%20enquire%20about%20admissions.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline py-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Admissions: {ACADEMY_CONFIG.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
