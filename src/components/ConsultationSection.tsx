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

interface ConsultationSectionProps {
  preselectedCourse?: string;
  isStandalonePage?: boolean;
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({
  preselectedCourse = '',
  isStandalonePage = false,
}) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [embedFailed, setEmbedFailed] = useState(false);

  // Cal.com embed initialization
  useEffect(() => {
    // Timeout safeguard: if embed doesn't trigger load in 8s, offer prominent fallback
    const timer = setTimeout(() => {
      setIsIframeLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="consultation"
      className={`${
        isStandalonePage ? 'py-10 sm:py-16' : 'py-16 sm:py-20 md:py-24'
      } bg-[#111827] text-[#F3F4F6] relative overflow-hidden border-b border-[#243042]`}
    >
      {/* Restrained Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F4C76B]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* 1. Page Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202B3D] border border-[#344054] text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-4 font-cinzel">
            <Video className="w-3.5 h-3.5 text-[#F4C76B]" />
            <span>Option A: Free Online Consultation</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight mb-4">
            Book Your Free Academic Consultation
          </h1>

          {/* 2. Short Explanation */}
          <p className="text-[#AAB4C3] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Discuss your student’s strengths, identify council board and competitive entrance milestones,
            and create a clear academic roadmap with our senior faculty via a 30-minute 1-on-1 session.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3 sm:gap-6 text-xs text-[#AAB4C3] flex-wrap">
            <span className="flex items-center gap-1.5 font-semibold text-[#F3F4F6]">
              <Clock className="w-3.5 h-3.5 text-[#F4C76B]" />
              30-Minute 1-on-1 Session
            </span>
            <span className="text-[#344054]">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-[#38BDF8]">
              <Video className="w-3.5 h-3.5 text-[#38BDF8]" />
              Google Meet Video Conferencing
            </span>
            <span className="text-[#344054]">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Free & Transparent
            </span>
          </div>
        </div>

        {/* 3. Three Key Benefit Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#202B3D] border border-[#344054] rounded-2xl p-5 shadow-sm hover:border-[#F4C76B]/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[#F4C76B]/15 text-[#F4C76B] flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-[#F4C76B]" />
            </div>
            <h3 className="font-display text-sm font-bold text-[#F3F4F6] mb-1.5">
              1. Discuss Academic Goals
            </h3>
            <p className="text-xs text-[#AAB4C3] leading-relaxed">
              Evaluate current baseline marks, target percentiles in JEE/NEET, and identify conceptual strengths early.
            </p>
          </div>

          <div className="bg-[#202B3D] border border-[#344054] rounded-2xl p-5 shadow-sm hover:border-[#38BDF8]/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center mb-3">
              <Compass className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <h3 className="font-display text-sm font-bold text-[#F3F4F6] mb-1.5">
              2. Understand Suitable Pathways
            </h3>
            <p className="text-xs text-[#AAB4C3] leading-relaxed">
              Determine the right batch stream: Integrated CHSE + Entrance, Pure Board Foundation, or Repeater Dropper drills.
            </p>
          </div>

          <div className="bg-[#202B3D] border border-[#344054] rounded-2xl p-5 shadow-sm hover:border-emerald-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-display text-sm font-bold text-[#F3F4F6] mb-1.5">
              3. Board + Entrance Synergy
            </h3>
            <p className="text-xs text-[#AAB4C3] leading-relaxed">
              Learn our proven methodology for scoring 90%+ in subjective CHSE board answers alongside objective speed problem-solving.
            </p>
          </div>
        </div>

        {/* 4. Cal.com Booking Card Container */}
        <div className="bg-[#202B3D] border-2 border-[#344054] rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden">
          
          {/* Booking Area Guidance Message */}
          <div className="bg-[#172033] border border-[#344054] rounded-2xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-[#F3F4F6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F4C76B]/15 text-[#F4C76B] flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-[#F4C76B]" />
              </div>
              <div>
                <p className="font-bold text-[#F3F4F6] leading-snug">
                  Choose an available 30-minute slot for your free academic consultation.
                </p>
                <p className="text-[#AAB4C3] text-xs mt-0.5">
                  Your booking confirmation and Google Meet details will be sent through Cal.com.
                </p>
              </div>
            </div>

            {/* Direct New-Tab Link fallback */}
            <a
              href={ACADEMY_CONFIG.calCom.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2A374E] hover:bg-[#344563] text-xs font-bold text-[#F4C76B] border border-[#3E4F6D] transition-colors shrink-0 cursor-pointer"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Cal.com Embedded Iframe Widget */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#111827] border border-[#344054] min-h-[680px] sm:min-h-[720px] flex flex-col">
            
            {/* Loading Spinner */}
            {isIframeLoading && (
              <div className="absolute inset-0 bg-[#111827] flex flex-col items-center justify-center p-6 z-10 space-y-3">
                <div className="w-10 h-10 border-3 border-[#344054] border-t-[#F4C76B] rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-[#AAB4C3] uppercase tracking-wider font-stat">
                  Connecting with Cal.com Availability...
                </p>
                <p className="text-[11px] text-[#8592A3]">
                  Fetching live 30-minute counseling slots with Google Meet
                </p>
              </div>
            )}

            {/* Embed Error / Adblocker Fallback Notice */}
            {embedFailed && (
              <div className="p-8 text-center space-y-4 my-auto">
                <div className="w-12 h-12 rounded-full bg-[#F4C76B]/15 text-[#F4C76B] flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6 text-[#F4C76B]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#F3F4F6]">Calendar Embed Blocked or Taking Too Long?</h4>
                  <p className="text-xs text-[#AAB4C3] max-w-md mx-auto leading-relaxed">
                    Browser privacy extensions or ad-blockers can occasionally block third-party scheduling widgets.
                    You can open the official Cal.com booking interface directly:
                  </p>
                </div>
                <a
                  href={ACADEMY_CONFIG.calCom.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C76B] text-[#0F172A] font-extrabold text-sm hover:bg-[#E5B555] transition-all shadow-md shadow-amber-500/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open Free Consultation Calendar (Cal.com)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Official Cal.com Iframe with dark theme & overlayCalendar enabled */}
            <iframe
              title="Antariksh Academy 30-Minute Free Academic Consultation Calendar"
              src={ACADEMY_CONFIG.calCom.bookingUrl}
              className="w-full flex-1 border-0 rounded-2xl min-h-[680px] sm:min-h-[720px]"
              onLoad={() => setIsIframeLoading(false)}
              onError={() => {
                setIsIframeLoading(false);
                setEmbedFailed(true);
              }}
            ></iframe>
          </div>

          {/* 5. Small Note Explaining Appointment Availability */}
          <div className="mt-4 pt-4 border-t border-[#344054]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#AAB4C3]">
            <span className="flex items-center gap-1.5 text-center sm:text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Appointment availability, timezones, and automated Google Meet calendar invites are powered through Cal.com.
              </span>
            </span>
            <a
              href={ACADEMY_CONFIG.calCom.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F4C76B] hover:underline font-bold inline-flex items-center gap-1 shrink-0"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* 6. Secondary Section: Prefer to Speak with Our Team? (Option B Distinction) */}
        <div className="mt-12 bg-[#172033] border border-[#344054] rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#202B3D] border border-[#344054] text-[#38BDF8] text-xs font-bold uppercase tracking-wider font-cinzel">
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Option B: Phone Callback or In-Person Visit</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F3F4F6]">
                Prefer to Speak with Our Team?
              </h3>
              <p className="text-xs sm:text-sm text-[#AAB4C3] leading-relaxed">
                Would you prefer an immediate phone conversation or an in-person meeting with our academic team at our Bijipur, Brahmapur center?
                Share your details and our senior mentor will follow up directly.
              </p>
            </div>

            {/* 7. Link to Separate Parent Meeting / Callback Form */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <Link
                to="/contact"
                state={{ preselectedCourse }}
                className="px-5 py-3 rounded-xl bg-[#202B3D] hover:bg-[#2A374E] text-[#F3F4F6] border border-[#344054] hover:border-[#F4C76B]/60 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#F4C76B]" />
                <span>Request Parent Meeting or Callback</span>
              </Link>

              <a
                href={ACADEMY_CONFIG.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>WhatsApp Admissions Desk</span>
              </a>
            </div>

          </div>

          {/* 8. Academy Address and Direct Contact Links */}
          <div className="mt-6 pt-5 border-t border-[#344054]/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#AAB4C3]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#F4C76B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F3F4F6] block">Campus Address</span>
                <span>{ACADEMY_CONFIG.address.street}, {ACADEMY_CONFIG.address.city} (PIN: 760001)</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F3F4F6] block">Direct Phone</span>
                <a href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`} className="hover:text-[#F4C76B] transition-colors">
                  {ACADEMY_CONFIG.contact.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F3F4F6] block">Center Operational Hours</span>
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
