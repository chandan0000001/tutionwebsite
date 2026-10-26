import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  ShieldCheck,
  Target,
  BookOpen,
  Compass,
  Phone,
  MessageSquare,
  MapPin,
  HelpCircle,
  Users,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { useTheme } from '../context/ThemeContext';

interface ConsultationSectionProps {
  preselectedCourse?: string;
  isStandalonePage?: boolean;
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({
  preselectedCourse = '',
  isStandalonePage = false,
}) => {
  const { theme } = useTheme();
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isTakingLong, setIsTakingLong] = useState(false);

  const bookingIframeUrl = `${ACADEMY_CONFIG.calCom.bookingUrl}&theme=${theme}`;

  useEffect(() => {
    // If iframe takes longer than 5.5s, display a visible direct-booking fallback
    const timer = setTimeout(() => {
      setIsTakingLong(true);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="consultation"
      className={`${
        isStandalonePage ? 'py-8 sm:py-14' : 'py-10 sm:py-16 md:py-20'
      } bg-[#FAF6F0]/90 dark:bg-[#0D0905]/90 text-[#150F0A] dark:text-[#FFEDD7] relative overflow-hidden border-b border-stone-200/90 dark:border-[#FFEDD7]/10 oryzo-blueprint-grid`}
    >
      {/* Restrained Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-amber-400/5 dark:bg-[#F4C76B]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-sky-400/5 dark:bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* 1. Page Heading */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] text-[#C6922E] dark:text-[#F4C76B] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 font-cinzel shadow-xs">
            <Video className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
            <span>Free Online Consultation</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-[#172033] dark:text-[#F3F4F6] tracking-tight mb-2 sm:mb-3">
            Book Your Free{' '}
            <span className="bg-gradient-to-r from-[#17365D] via-[#C6922E] to-[#0284C7] dark:from-[#F4C76B] dark:via-[#FDE68A] dark:to-[#38BDF8] bg-clip-text text-transparent font-serif-prestige italic font-bold">
              Academic Consultation
            </span>
          </h1>

          {/* 2. Short Explanation */}
          <p className="text-slate-600 dark:text-[#AAB4C3] text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Discuss your student’s strengths, identify council board and competitive entrance milestones,
            and create a clear academic roadmap with our senior faculty via a 30-minute 1-on-1 session.
          </p>

          <div className="mt-3.5 sm:mt-5 flex items-center justify-center gap-2.5 sm:gap-6 text-xs text-slate-600 dark:text-[#CBD5E1] flex-wrap">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-[#F3F4F6]">
              <Clock className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
              30-Minute 1-on-1 Session
            </span>
            <span className="text-slate-300 dark:text-[#344054]">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-[#0284C7] dark:text-[#38BDF8]">
              <Video className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" />
              Google Meet Video
            </span>
            <span className="text-slate-300 dark:text-[#344054]">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              100% Free & Transparent
            </span>
          </div>
        </div>

        {/* 3. Three Key Benefit Items - Compact on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center mb-2.5">
              <Target className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B]" />
            </div>
            <h3 className="font-display text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
              1. Discuss Academic Goals
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
              Evaluate current baseline marks and target percentiles for +2 Council Boards, JEE Main/Adv & NEET-UG.
            </p>
          </div>

          <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center mb-2.5">
              <Compass className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8]" />
            </div>
            <h3 className="font-display text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
              2. Tailored Stream Pathway
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
              Determine the right batch stream: Integrated CHSE + Entrance, Pure Board Foundation, or Repeater Drills.
            </p>
          </div>

          <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-display text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
              3. Board + Entrance Synergy
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
              Master step-by-step subjective derivation alongside timed MCQ speed drills for high ranks.
            </p>
          </div>
        </div>

        {/* 4. Google Meet Booking Card Container */}
        <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-md dark:shadow-xl relative overflow-hidden">
          
          {/* Booking Area Guidance Message */}
          <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-4 text-xs sm:text-sm text-slate-800 dark:text-[#F3F4F6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B]" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white leading-snug">
                  Choose an available 30-minute slot for your free academic consultation.
                </p>
                <p className="text-slate-600 dark:text-[#AAB4C3] text-[11px] sm:text-xs mt-0.5">
                  Your booking confirmation and Google Meet video link will be sent directly to your email.
                </p>
              </div>
            </div>

            {/* Direct New-Tab Link fallback */}
            <a
              href={ACADEMY_CONFIG.calCom.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#202B3D] hover:bg-slate-100 dark:hover:bg-[#26334A] text-xs font-bold text-[#17365D] dark:text-[#F4C76B] border border-slate-300 dark:border-[#344054] hover:border-[#17365D] dark:hover:border-[#F4C76B]/40 transition-colors shrink-0 cursor-pointer min-h-[38px] shadow-xs"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* If Iframe Takes Long to Load: Prominent Visible Fallback Banner */}
          {isTakingLong && !isIframeLoaded && (
            <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-amber-50 dark:bg-[#172033] border border-amber-200 dark:border-[#F4C76B]/40 text-xs text-slate-700 dark:text-[#CBD5E1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B] shrink-0" />
                <span>Calendar taking a moment to load? You can also book your slot directly:</span>
              </div>
              <a
                href={ACADEMY_CONFIG.calCom.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] text-white dark:text-[#0F172A] font-extrabold text-xs inline-flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <span>Book 30-Min Slot (Google Meet)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Embedded Iframe Widget */}
          <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#344054] min-h-[580px] sm:min-h-[680px] flex flex-col">
            
            {/* Loading Spinner */}
            {!isIframeLoaded && (
              <div className="absolute inset-0 bg-slate-50 dark:bg-[#111827] flex flex-col items-center justify-center p-6 z-10 space-y-3">
                <div className="w-9 h-9 border-3 border-slate-300 dark:border-[#344054] border-t-[#17365D] dark:border-t-[#F4C76B] rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6] uppercase tracking-wider font-stat">
                  Connecting with Google Meet Scheduling...
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#AAB4C3]">
                  Fetching available 30-minute counseling slots
                </p>
              </div>
            )}

            {/* Official Iframe with synchronized theme & overlayCalendar enabled */}
            <iframe
              title="Antariksh Academy 30-Minute Free Academic Consultation Calendar"
              src={bookingIframeUrl}
              loading="lazy"
              className="w-full flex-1 border-0 rounded-xl sm:rounded-2xl min-h-[580px] sm:min-h-[680px]"
              onLoad={() => setIsIframeLoaded(true)}
              onError={() => {
                setIsTakingLong(true);
              }}
            ></iframe>
          </div>

          {/* 5. Appointment Availability Note */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-200 dark:border-[#344054] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-slate-500 dark:text-[#AAB4C3]">
            <span className="flex items-center gap-1.5 text-center sm:text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Appointment availability, timezones, and automated Google Meet calendar invites are synchronized live.
              </span>
            </span>
            <a
              href={ACADEMY_CONFIG.calCom.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#17365D] hover:underline dark:text-[#F4C76B] font-bold inline-flex items-center gap-1 shrink-0"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* 6. Option B Distinction: Prefer to Speak with Our Team? */}
        <div className="mt-8 sm:mt-12 bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            
            <div className="space-y-1.5 max-w-2xl text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-[#172033] border border-sky-200 dark:border-[#344054] text-[#0284C7] dark:text-[#38BDF8] text-[11px] sm:text-xs font-bold uppercase tracking-wider font-cinzel">
                <Users className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" />
                <span>Phone Callback or In-Person Center Visit</span>
              </div>
              <h3 className="font-display text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                Prefer to Speak with Our Team?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                Would you prefer a phone conversation or an in-person meeting with our academic team at our Bijipur, Brahmapur center?
                Share your details and our senior mentor will follow up directly.
              </p>
            </div>

            {/* 7. Link to Separate Parent Meeting / Callback Form */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
              <Link
                to="/contact"
                state={{ preselectedCourse }}
                className="px-5 py-3 rounded-xl bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] text-white dark:text-[#0F172A] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-white dark:text-[#0F172A]" />
                <span>Request Parent Meeting or Callback</span>
              </Link>

              <a
                href={ACADEMY_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>WhatsApp Admissions</span>
              </a>
            </div>

          </div>

          {/* 8. Academy Address and Direct Contact Links */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#344054] grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-slate-600 dark:text-[#AAB4C3] text-left">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Campus Address</span>
                <span>{ACADEMY_CONFIG.address.street}, {ACADEMY_CONFIG.address.city} (PIN: 760001)</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Direct Phone</span>
                <a href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`} className="hover:text-[#17365D] dark:hover:text-[#F4C76B] transition-colors">
                  {ACADEMY_CONFIG.contact.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Center Operational Hours</span>
                <span>Monday – Saturday: 7:00 AM – 7:30 PM</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ConsultationSection;
