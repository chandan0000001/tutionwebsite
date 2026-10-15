import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { COURSES_DATA } from '../data/coursesData';

const currentYear = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-1 flex items-center justify-center shrink-0 shadow-md border-2 border-[#FC1682]/40">
                <img
                  src="/logo_transparent.png"
                  alt="Antariksh Academy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-['Outfit',sans-serif] font-bold text-xl text-white tracking-tight">
                  ANTARIKSH <span className="text-[#FC1682]">ACADEMY</span>
                </span>
                <span className="block text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  {ACADEMY_CONFIG.motto}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Antariksh Academy is dedicated to guiding Class 11 & 12 (+2 Science) students in Odisha toward excellence
              in council board examinations and national entrance tests (JEE, NEET, NDA).
            </p>

            <div className="text-xs text-slate-400 space-y-1.5 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FC1682] shrink-0 mt-0.5" />
                <span>{ACADEMY_CONFIG.address.fullFormatted}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00C8FF] shrink-0" />
                <span>Admissions Desk: {ACADEMY_CONFIG.contact.phoneDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00C8FF] shrink-0" />
                <a
                  href={`mailto:${ACADEMY_CONFIG.contact.email}`}
                  className="hover:text-[#FC1682] transition-colors break-all"
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
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#FC1682] text-white flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Facebook Page"
              >
                f
              </a>
              <a
                href={ACADEMY_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#FC1682] text-white flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="Instagram Profile"
              >
                IG
              </a>
              <a
                href={ACADEMY_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors text-xs font-bold"
                aria-label="WhatsApp (+2 Science)"
              >
                WA
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#FC1682] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FC1682] transition-colors">
                  About the Academy
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-[#FC1682] transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="hover:text-[#FC1682] transition-colors">
                  Our Teachers & Mentors
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-[#FC1682] transition-colors">
                  Success Stories (10 Yrs)
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-[#FC1682] transition-colors">
                  Classrooms & Campus
                </Link>
              </li>
              <li>
                <Link to="/timetable" className="hover:text-[#FC1682] transition-colors">
                  Batch Timetable
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FC1682] transition-colors">
                  Contact Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Courses (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-sm font-bold uppercase tracking-wider text-white">
              Academic Courses
            </h4>
            <ul className="space-y-2 text-xs">
              {COURSES_DATA.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/courses"
                    className="hover:text-[#FC1682] transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{c.title}</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-[#FC1682] transition-colors">
                      {c.badge}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                to="/consultation"
                className="text-xs font-bold text-[#00C8FF] hover:text-[#FC1682] underline cursor-pointer"
              >
                Request Syllabus Counseling →
              </Link>
            </div>
          </div>

          {/* Column 4: Admissions & Action (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-sm font-bold uppercase tracking-wider text-white">
              Admissions Desk
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Class 11 & 12 batches enrolling now. Secure your seat early for dedicated mentoring and optimal student-to-teacher ratio.
            </p>

            <div className="space-y-2 pt-1">
              <Link
                to="/consultation"
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-md shadow-pink-500/20 transition-all text-center block"
              >
                Book a Free Consultation
              </Link>

              <Link
                to="/contact"
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#FC1682] transition-colors text-center block"
              >
                Request a Quick Callback
              </Link>
            </div>

            <p className="text-[10px] text-slate-500">
              Center Office: Monday–Saturday 7:00 AM – 7:30 PM
            </p>
          </div>

        </div>

        {/* Privacy Notice Regarding Enquiry Data */}
        <div className="my-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#00C8FF] shrink-0" />
            <span>Privacy & Admissions Data Policy</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-400">
            Antariksh Academy treats all student and parent enquiries with strict confidentiality. Personal information
            (names, contact numbers, email addresses, and academic scores) is collected exclusively to fulfill admission requests,
            provide academic counseling, and coordinate batch timetables.
          </p>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1 text-center sm:text-left">
            <span>© {currentYear} {ACADEMY_CONFIG.legalName}. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-500">
              Bijipur, Brahmapur, Odisha 760001
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
