import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  ShieldCheck,
  Phone,
  Calendar,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { COURSES_DATA } from '../data/coursesData';

const currentYear = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0E1420] text-[#AAB4C3] border-t border-[#344054] pt-12 sm:pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Streamlined Footer (< md) to Eliminate Text Bloat */}
        <div className="md:hidden space-y-5 pb-6 border-b border-[#344054]">
          {/* Compact Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#172033] p-1 flex items-center justify-center shrink-0 shadow-md border border-[#344054]">
              <img
                src="/logo_transparent.png"
                alt="Antariksh Academy Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-display font-black text-lg text-white tracking-tight">
                ANTARIKSH <span className="gold-gradient-text">ACADEMY</span>
              </span>
              <span className="block text-[10px] text-[#AAB4C3] font-medium">
                Bijipur, Brahmapur • +2 Science & Entrances
              </span>
            </div>
          </div>

          {/* Direct Mobile Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/consultation"
              className="py-2.5 px-3 rounded-xl text-xs font-extrabold text-[#0F172A] bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] flex items-center justify-center gap-1.5 text-center shadow-sm min-h-[44px]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#0F172A]" />
              <span>Book Consult</span>
            </Link>
            <a
              href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
              className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-200 bg-[#202B3D] border border-[#344054] flex items-center justify-center gap-1.5 text-center min-h-[44px]"
            >
              <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Call Desk</span>
            </a>
          </div>

          {/* Quick Tap Navigation Grid (2 Columns) */}
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 pt-2 text-xs border-t border-[#243042]">
            <Link to="/" className="text-slate-300 hover:text-[#F4C76B] py-1 font-medium">Home</Link>
            <Link to="/courses" className="text-slate-300 hover:text-[#F4C76B] py-1 font-medium">Courses</Link>
            <Link to="/faculty" className="text-slate-300 hover:text-[#F4C76B] py-1 font-medium">Our Teachers</Link>
            <Link to="/results" className="text-slate-300 hover:text-[#F4C76B] py-1 font-medium">Results (10 Yrs)</Link>
            <Link to="/facilities" className="text-slate-300 hover:text-[#F4C76B] py-1 font-medium">Campus & Labs</Link>
            <Link to="/contact" className="text-slate-300 hover:text-[#F4C76B] py-1 font-medium">Contact Center</Link>
          </div>

          {/* Quick Contact & WhatsApp Link */}
          <div className="pt-2 border-t border-[#243042] flex items-center justify-between text-xs text-[#AAB4C3]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F4C76B] shrink-0" />
              <span className="text-[11px] truncate">Bijipur Big Street, Brahmapur</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={ACADEMY_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-[#172033] hover:bg-emerald-600 text-emerald-400 hover:text-white border border-[#344054] flex items-center justify-center text-xs font-bold"
                aria-label="WhatsApp"
              >
                WA
              </a>
              <a
                href={ACADEMY_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-[#172033] hover:bg-[#F4C76B] hover:text-[#0F172A] text-slate-300 border border-[#344054] flex items-center justify-center text-xs font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href={ACADEMY_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-[#172033] hover:bg-[#F4C76B] hover:text-[#0F172A] text-slate-300 border border-[#344054] flex items-center justify-center text-xs font-bold"
                aria-label="Instagram"
              >
                IG
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Full Institutional Grid (>= md) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-12 border-b border-[#344054]">
          
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#172033] p-1 flex items-center justify-center shrink-0 shadow-md border border-[#344054]">
                <img
                  src="/logo_transparent.png"
                  alt="Antariksh Academy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display font-black text-xl text-white tracking-tight">
                  ANTARIKSH <span className="gold-gradient-text">ACADEMY</span>
                </span>
                <span className="block text-[10px] text-[#F4C76B]/90 tracking-wider uppercase font-semibold">
                  {ACADEMY_CONFIG.motto}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#AAB4C3] leading-relaxed">
              Antariksh Academy is dedicated to guiding Class 11 & 12 (+2 Science) students in Odisha toward excellence
              in council board examinations and national entrance tests (JEE, NEET, NDA).
            </p>

            <div className="text-xs text-[#AAB4C3] space-y-2 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F4C76B] shrink-0 mt-0.5" />
                <span>{ACADEMY_CONFIG.address.fullFormatted}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <span>Admissions Desk: {ACADEMY_CONFIG.contact.phoneDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                <a
                  href={`mailto:${ACADEMY_CONFIG.contact.email}`}
                  className="hover:text-[#F4C76B] transition-colors break-all"
                >
                  Email & Queries: {ACADEMY_CONFIG.contact.email}
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={ACADEMY_CONFIG.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#172033] hover:bg-[#F4C76B] hover:text-[#0F172A] text-white border border-[#344054] flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Facebook Page"
              >
                f
              </a>
              <a
                href={ACADEMY_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#172033] hover:bg-[#F4C76B] hover:text-[#0F172A] text-white border border-[#344054] flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Instagram Profile"
              >
                IG
              </a>
              <a
                href={ACADEMY_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#172033] hover:bg-emerald-600 text-white border border-[#344054] flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="WhatsApp (+2 Science)"
              >
                WA
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#F4C76B] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F4C76B] transition-colors">
                  About the Academy
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-[#F4C76B] transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="hover:text-[#F4C76B] transition-colors">
                  Our Teachers & Mentors
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-[#F4C76B] transition-colors">
                  Success Stories (10 Yrs)
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-[#F4C76B] transition-colors">
                  Classrooms & Campus
                </Link>
              </li>
              <li>
                <Link to="/timetable" className="hover:text-[#F4C76B] transition-colors">
                  Batch Timetable
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F4C76B] transition-colors">
                  Contact Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Academic Streams
            </h4>
            <ul className="space-y-2 text-xs">
              {COURSES_DATA.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/courses"
                    className="hover:text-[#F4C76B] transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{c.title}</span>
                    <span className="text-[10px] text-[#F4C76B]/80 group-hover:text-[#F4C76B] transition-colors">
                      {c.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                to="/consultation"
                className="text-xs font-bold text-[#F4C76B] hover:text-white underline cursor-pointer"
              >
                Book Free Consultation (Google Meet) →
              </Link>
            </div>
          </div>

          {/* Column 4: Admissions & Action (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Admissions Desk
            </h4>
            <p className="text-xs text-[#AAB4C3] leading-relaxed">
              Class 11 & 12 batches enrolling now. Secure your seat early for dedicated mentoring and optimal student-to-teacher ratio.
            </p>

            <div className="space-y-2.5 pt-1">
              {/* Option A: 30-min Google Meet Booking */}
              <Link
                to="/consultation"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold text-[#0F172A] bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] hover:brightness-105 shadow-md shadow-amber-900/20 border border-amber-300/40 transition-all text-center flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0F172A]" />
                <span>Book Free Consultation (Google Meet)</span>
              </Link>

              {/* Option B: Manual callback */}
              <Link
                to="/contact"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-[#172033] hover:bg-[#202B3D] border border-[#344054] hover:border-[#F4C76B]/40 transition-colors text-center flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Request Parent Meeting or Callback</span>
              </Link>
            </div>

            <p className="text-[10px] text-slate-400">
              Center Office: Monday–Saturday 7:00 AM – 7:30 PM
            </p>
          </div>

        </div>

        {/* Privacy Notice Regarding Enquiry Data */}
        <div className="py-4 sm:py-6 border-b border-[#344054] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[#AAB4C3]">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Your enquiry information is processed securely for counseling and academic admissions only.
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Odisha CHSE Science & National Entrance Coaching
          </span>
        </div>

        {/* Bottom Bar: Copyright & Location Footnote */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {currentYear} {ACADEMY_CONFIG.name}. All rights reserved.</p>
          <p className="text-center sm:text-right text-[11px]">
            Bijipur Big Street, Brahmapur (Berhampur), Ganjam, Odisha — 760001
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
