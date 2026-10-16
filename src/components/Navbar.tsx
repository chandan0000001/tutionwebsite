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
    { label: 'Our Teachers', path: '/faculty' },
    { label: 'Results', path: '/results' },
    { label: 'Campus & Classrooms', path: '/facilities' },
    { label: 'Timetable', path: '/timetable' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111827] shadow-lg border-b border-[#1F2937]">
      {/* Top Notification Bar */}
      <div className="bg-[#0B0F19] text-[#9CA3AF] text-[11px] sm:text-xs py-1.5 px-4 hidden md:block border-b border-[#1F2937]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <span className="flex items-center gap-1.5 text-[#D1D5DB] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#F4C76B] shrink-0" />
              <span>{ACADEMY_CONFIG.address.street}, {ACADEMY_CONFIG.address.city} (PIN: 760001)</span>
            </span>
            <span className="text-[#374151]">|</span>
            <span className="text-[#38BDF8] font-semibold hidden lg:inline">
              Admissions Open 2026–27: +2 Science, JEE Main/Adv, NEET-UG & NDA
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#9CA3AF] hidden xl:inline">
              Center Hours: 7:00 AM – 7:30 PM
            </span>
            <span className="text-[#374151] hidden xl:inline">|</span>
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
      <nav className="w-full bg-[#111827]/95 backdrop-blur-md py-2.5 sm:py-3" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo with official Antariksh Academy graphic */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#F4C76B] rounded-lg shrink-0 min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#202B3D] p-1 flex items-center justify-center border-2 border-[#F4C76B]/40 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo_transparent.png"
                alt="Antariksh Academy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="font-display font-black text-lg sm:text-2xl tracking-tight text-[#F3F4F6] group-hover:text-[#F4C76B] transition-colors leading-none truncate">
                ANTARIKSH <span className="text-[#F4C76B]">ACADEMY</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#AAB4C3] tracking-wider uppercase font-bold mt-1 hidden sm:block truncate">
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
                      ? 'text-[#F4C76B] bg-[#202B3D] border border-[#344054] font-extrabold shadow-sm'
                      : 'text-[#D1D5DB] hover:text-[#F4C76B] hover:bg-[#172033]'
                  }`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Action Buttons: Clear Distinction between Option A and Option B */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            {/* Option B: Manual callback */}
            <Link
              to="/contact"
              className="px-3.5 py-2 text-xs font-bold text-[#E5E7EB] hover:text-[#F4C76B] bg-[#202B3D] hover:bg-[#263449] border border-[#344054] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
              <span>Request Callback</span>
            </Link>

            {/* Option A: Cal.com 30-min booking */}
            <Link
              to="/consultation"
              className="px-4 py-2 text-xs font-extrabold text-[#0F172A] bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] hover:brightness-105 rounded-xl shadow-md shadow-amber-500/15 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#0F172A] shrink-0" />
              <span>Book Free Consultation</span>
            </Link>
          </div>

          {/* Mobile / Tablet Controls (< xl) */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
            <Link
              to="/consultation"
              className="px-2.5 sm:px-3 py-1.5 text-xs font-extrabold text-[#0F172A] bg-gradient-to-r from-[#F4C76B] to-[#E5B555] rounded-lg shadow-sm transition-colors flex items-center gap-1 shrink-0"
              aria-label="Book Consultation"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Consult</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-[#D1D5DB] hover:text-[#F4C76B] hover:bg-[#202B3D] focus:outline-none focus:ring-2 focus:ring-[#F4C76B] cursor-pointer"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6 text-[#F4C76B]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile / Tablet Dropdown Menu Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-[#111827] border-t border-[#1F2937] shadow-2xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
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
                      ? 'text-[#F4C76B] bg-[#202B3D] border border-[#344054] font-extrabold'
                      : 'text-[#D1D5DB] hover:text-[#F4C76B] hover:bg-[#172033]'
                  }`}
                >
                  <span className="truncate">{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#4B5563] shrink-0" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-3 border-t border-[#1F2937] flex flex-col sm:flex-row gap-2">
            <Link
              to="/consultation"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-xs font-extrabold text-[#0F172A] bg-gradient-to-r from-[#F4C76B] to-[#E5B555] hover:brightness-105 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-center"
            >
              <Calendar className="w-3.5 h-3.5 text-[#0F172A]" />
              <span>Book Free Consultation (Cal.com)</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 text-xs font-bold text-[#E5E7EB] bg-[#202B3D] hover:bg-[#263449] border border-[#344054] rounded-xl flex items-center justify-center gap-1.5 text-center"
            >
              <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Request Callback / Meeting</span>
            </Link>
          </div>

          <div className="mt-3 text-center">
            <a
              href={ACADEMY_CONFIG.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline py-1"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Admissions: {ACADEMY_CONFIG.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
