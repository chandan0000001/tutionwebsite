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
    <section id="contact" className="py-20 md:py-28 bg-[#08090D] border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#141824] border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Connect & Visit Us</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Visit Our Center or{' '}
            <span className="bg-gradient-to-r from-white via-pink-200 to-[#FC1682] bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Conveniently located at Bijipur Big Street, right in the heart of Brahmapur. We welcome students and parents
            for campus counseling and batch inquiries.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Academy Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Location & Address Card */}
            <div className="bg-[#141824] border border-pink-500/25 rounded-2xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0D1017] border border-pink-500/30 text-[#FC1682] flex items-center justify-center shrink-0 shadow-inner">
                  <MapPin className="w-5 h-5 text-[#FC1682]" />
                </div>
                <div>
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white mb-1">
                    {ACADEMY_CONFIG.name}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    {ACADEMY_CONFIG.address.street},<br />
                    {ACADEMY_CONFIG.address.city}, {ACADEMY_CONFIG.address.state} — {ACADEMY_CONFIG.address.pincode}, {ACADEMY_CONFIG.address.country}
                  </p>
                  
                  <a
                    href={ACADEMY_CONFIG.socials.googleMapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-pink-300 bg-[#0D1017] border border-pink-500/25 hover:border-pink-500/50 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#FC1682]" />
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Email & Communication Card */}
            <div className="bg-[#141824] border border-pink-500/25 rounded-2xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0D1017] border border-pink-500/30 text-[#38BDF8] flex items-center justify-center shrink-0 shadow-inner">
                  <Mail className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white mb-1">
                    Email & Queries Desk
                  </h3>
                  <p className="text-xs text-slate-400 mb-2">
                    Official inbox for student inquiries, batch details, and counseling:
                  </p>
                  <a
                    href={`mailto:${ACADEMY_CONFIG.contact.email}`}
                    className="text-sm font-bold text-pink-400 hover:text-white hover:underline block break-all mb-2"
                  >
                    {ACADEMY_CONFIG.contact.email}
                  </a>
                  <span className="text-[11px] text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-2 py-0.5 rounded font-medium inline-block">
                    Admissions Desk Active Daily
                  </span>
                </div>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="bg-[#141824] border border-pink-500/25 rounded-2xl p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0D1017] border border-pink-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-white mb-1">
                    Phone & WhatsApp Desk
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
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
                  <span className="text-[10px] text-slate-500 block mt-2">
                    Direct counseling and batch inquiries available Monday through Saturday.
                  </span>
                </div>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="bg-[#0D1017] border border-pink-500/25 text-white rounded-2xl p-6 shadow-md space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#38BDF8] flex items-center gap-1.5">
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
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141824] hover:bg-[#1C2232] border border-pink-500/25 hover:border-pink-500/50 transition-colors text-xs font-semibold text-white"
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
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141824] hover:bg-[#1C2232] border border-pink-500/25 hover:border-pink-500/50 transition-colors text-xs font-semibold text-white"
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
            <div className="bg-[#141824] border border-pink-500/25 rounded-2xl p-6 flex items-start gap-4 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#0D1017] border border-pink-500/30 text-[#FC1682] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#FC1682]" />
              </div>
              <div>
                <h4 className="font-['Outfit',sans-serif] text-base font-bold text-white mb-1">
                  Center Operational Hours
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {ACADEMY_CONFIG.contact.officeHours}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Faculty available on campus for student queries daily</span>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-[#141824] border border-pink-500/25 rounded-2xl overflow-hidden shadow-xl flex flex-col">
              <div className="p-4 bg-[#0D1017] border-b border-pink-500/20 flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FC1682]" />
                  Bijipur, Big Street, Brahmapur Location View
                </span>
                <a
                  href={ACADEMY_CONFIG.socials.googleMapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:text-white font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Open Full Screen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Iframe */}
              <div className="w-full h-80 sm:h-96 relative bg-[#08090D]">
                <iframe
                  title="Antariksh Academy Bijipur Berhampur Location Map"
                  src={ACADEMY_CONFIG.socials.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full opacity-90"
                ></iframe>
              </div>

              {/* Map Footer Bar */}
              <div className="p-4 bg-[#0D1017] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 border-t border-pink-500/20">
                <span className="leading-snug">
                  Landmark: Bijipur Big Street, easily accessible from main Berhampur transit routes.
                </span>
                <a
                  href={ACADEMY_CONFIG.socials.googleMapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] hover:from-[#FF2D92] text-white transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-pink-600/30 border border-pink-400/40"
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

export default ContactSection;
