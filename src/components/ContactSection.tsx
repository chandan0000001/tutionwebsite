import React from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  MessageSquare,
  Navigation,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#BE125A] text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Connect & Visit Us</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Visit Our Center or Get in Touch
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Conveniently located at Bijipur Big Street, right in the heart of Brahmapur. We welcome students and parents
            for campus counseling and batch inquiries.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Academy Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Location & Address Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#FC1682] to-[#D9146C] text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-slate-900 mb-1">
                    {ACADEMY_CONFIG.name}
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed mb-3">
                    {ACADEMY_CONFIG.address.street},<br />
                    {ACADEMY_CONFIG.address.city}, {ACADEMY_CONFIG.address.state} — {ACADEMY_CONFIG.address.pincode}, {ACADEMY_CONFIG.address.country}
                  </p>
                  
                  <a
                    href={ACADEMY_CONFIG.socials.googleMapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#FC1682] bg-white border border-slate-300 hover:border-[#FC1682] px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#FC1682]" />
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Email & Communication Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-slate-900 mb-1">
                    Email & Queries Desk
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">
                    Official inbox for student inquiries, batch details, and counseling:
                  </p>
                  <a
                    href={`mailto:${ACADEMY_CONFIG.contact.email}`}
                    className="text-sm font-bold text-[#0284C7] hover:text-[#FC1682] hover:underline block break-all mb-2"
                  >
                    {ACADEMY_CONFIG.contact.email}
                  </a>
                  <span className="text-[11px] text-[#0284C7] bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded font-medium inline-block">
                    Admissions Desk Active Daily
                  </span>
                </div>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-slate-900 mb-1">
                    Phone & WhatsApp Desk
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    {ACADEMY_CONFIG.contact.phoneDisplay}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={ACADEMY_CONFIG.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Admissions (+2 Science)</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-2">
                    Direct counseling and batch inquiries available Monday through Saturday.
                  </span>
                </div>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#00C8FF] flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                Verified Social Handles
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Stay updated with seminar announcements, class notices, and student activities through our official profiles:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Facebook */}
                <a
                  href={ACADEMY_CONFIG.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800 hover:bg-[#FC1682]/20 border border-slate-700 hover:border-[#FC1682]/40 transition-colors text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold text-sm">
                    f
                  </div>
                  <div className="truncate">
                    <span className="block truncate">Facebook Profile</span>
                    <span className="text-[10px] text-slate-400 truncate block">Antariksh Academy</span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href={ACADEMY_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800 hover:bg-pink-900/40 border border-slate-700 hover:border-pink-500/40 transition-colors text-xs font-semibold text-slate-200 hover:text-white"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#FC1682] via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                    IG
                  </div>
                  <div className="truncate">
                    <span className="block truncate">Instagram Handle</span>
                    <span className="text-[10px] text-slate-400 truncate block">@antarikshacademy1</span>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Center Hours and Embedded Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Working Hours Card */}
            <div className="bg-pink-50/60 border border-pink-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FC1682] to-[#D9146C] text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-['Outfit',sans-serif] text-base font-bold text-slate-900 mb-1">
                  Center Operational Hours
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  {ACADEMY_CONFIG.contact.officeHours}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Faculty available on campus for student queries daily</span>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FC1682]" />
                  Bijipur, Big Street, Brahmapur Location View
                </span>
                <a
                  href={ACADEMY_CONFIG.socials.googleMapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0284C7] hover:text-[#FC1682] font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Open Full Screen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Iframe */}
              <div className="w-full h-80 sm:h-96 relative bg-slate-200">
                <iframe
                  title="Antariksh Academy Bijipur Berhampur Location Map"
                  src={ACADEMY_CONFIG.socials.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Map Footer Bar */}
              <div className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100">
                <span className="leading-snug">
                  Landmark: Bijipur Big Street, easily accessible from main Berhampur transit routes.
                </span>
                <a
                  href={ACADEMY_CONFIG.socials.googleMapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#FC1682] to-[#D9146C] hover:from-[#E00E70] text-white transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-white" />
                  <span>Navigate There</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
