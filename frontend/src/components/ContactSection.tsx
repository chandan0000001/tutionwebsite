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
    <section id="contact" className="py-10 sm:py-16 md:py-20 bg-[#FAF6F0]/90 dark:bg-[#0D0905]/90 text-[#150F0A] dark:text-[#FFEDD7] border-b border-stone-200/90 dark:border-[#FFEDD7]/10 oryzo-blueprint-grid transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#18120B]/90 border border-stone-200/90 dark:border-[#FFEDD7]/15 text-[#C65D1E] dark:text-[#F4C76B] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-[#C65D1E] dark:text-[#F4C76B]" />
            <span>Connect & Visit Us</span>
          </div>
          <h2 className="luxury-editorial-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#150F0A] dark:text-[#FFEDD7] tracking-tight mb-3 break-words">
            Visit Our Center or{' '}
            <span className="font-serif-luxury italic font-normal text-amber-600 dark:text-[#F4C76B]">
              Get in Touch
            </span>
          </h2>
          <p className="font-serif-literata text-slate-600 dark:text-[#D4C3AF] text-xs sm:text-base leading-relaxed">
            Conveniently located at Bijipur Big Street, right in the heart of Brahmapur. We welcome students and parents
            for campus counseling and batch inquiries.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Academy Details Cards */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Location & Address Card */}
            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#17365D] dark:text-[#F4C76B] flex items-center justify-center shrink-0 shadow-inner">
                  <MapPin className="w-5 h-5 text-[#17365D] dark:text-[#F4C76B]" />
                </div>
                <div>
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {ACADEMY_CONFIG.name}
                  </h3>
                  <p className="text-slate-600 dark:text-[#AAB4C3] text-sm leading-relaxed mb-3">
                    {ACADEMY_CONFIG.address.street},<br />
                    {ACADEMY_CONFIG.address.city}, {ACADEMY_CONFIG.address.state} — {ACADEMY_CONFIG.address.pincode}, {ACADEMY_CONFIG.address.country}
                  </p>
                  
                  <a
                    href={ACADEMY_CONFIG.socials.googleMapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-white dark:hover:text-[#F4C76B] bg-slate-50 hover:bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] hover:border-slate-300 dark:hover:border-[#F4C76B]/40 px-3 py-2 rounded-lg shadow-sm transition-colors min-h-[44px]"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#17365D] dark:text-[#F4C76B]" />
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Email & Communication Card */}
            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#17365D] dark:text-[#38BDF8] flex items-center justify-center shrink-0 shadow-inner">
                  <Mail className="w-5 h-5 text-[#17365D] dark:text-[#38BDF8]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Email & Queries Desk
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C3] mb-2">
                    Official inbox for student inquiries, batch details, and counseling:
                  </p>
                  <a
                    href={`mailto:${ACADEMY_CONFIG.contact.email}`}
                    className="text-sm font-bold text-[#17365D] dark:text-[#F4C76B] hover:underline block break-all mb-2"
                  >
                    {ACADEMY_CONFIG.contact.email}
                  </a>
                  <span className="text-[11px] text-sky-800 dark:text-[#38BDF8] bg-sky-50 dark:bg-[#38BDF8]/15 border border-sky-200 dark:border-[#38BDF8]/30 px-2 py-0.5 rounded font-medium inline-block">
                    Admissions Desk Active Daily
                  </span>
                </div>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Phone & WhatsApp Desk
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C3] mb-3">
                    {ACADEMY_CONFIG.contact.phoneDisplay}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={ACADEMY_CONFIG.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm min-h-[44px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Admissions (+2 Science)</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-2">
                    Direct counseling and batch inquiries available Monday through Saturday.
                  </span>
                </div>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-slate-800 dark:text-white rounded-2xl p-6 shadow-sm space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#C6922E] dark:text-[#F4C76B] flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                Verified Social Handles
              </span>
              <p className="text-xs text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                Stay updated with seminar announcements, class notices, and student activities through our official profiles:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Facebook */}
                <a
                  href={ACADEMY_CONFIG.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#202B3D] hover:bg-slate-100 dark:hover:bg-[#2A374D] border border-slate-200 dark:border-[#344054] transition-colors text-xs font-semibold text-slate-800 dark:text-white min-h-[44px]"
                >
                  <div className="w-6 h-6 rounded-md bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <span className="block truncate">Facebook Profile</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">Antariksh Academy</span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href={ACADEMY_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#202B3D] hover:bg-slate-100 dark:hover:bg-[#2A374D] border border-slate-200 dark:border-[#344054] transition-colors text-xs font-semibold text-slate-800 dark:text-white min-h-[44px]"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#FC1682] via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <span className="block truncate">Instagram Handle</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">@antarikshacademy1</span>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Center Hours and Embedded Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Working Hours Card */}
            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#17365D] dark:text-[#F4C76B] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#17365D] dark:text-[#F4C76B]" />
              </div>
              <div>
                <h4 className="font-['Outfit',sans-serif] text-base font-bold text-slate-900 dark:text-white mb-1">
                  Center Operational Hours
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#AAB4C3] leading-relaxed mb-2">
                  {ACADEMY_CONFIG.contact.officeHours}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Faculty available on campus for student queries daily</span>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl overflow-hidden shadow-xl flex flex-col">
              <div className="p-4 bg-slate-100 dark:bg-[#172033] border-b border-slate-200 dark:border-[#344054] flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#17365D] dark:text-[#F4C76B]" />
                  Bijipur, Big Street, Brahmapur Location View
                </span>
                <a
                  href={ACADEMY_CONFIG.socials.googleMapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#17365D] dark:text-[#F4C76B] hover:underline font-semibold flex items-center gap-1 min-h-[44px]"
                >
                  <span>Open Full Screen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Iframe */}
              <div className="w-full h-80 sm:h-96 relative bg-slate-100 dark:bg-[#111827]">
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
              <div className="p-4 bg-slate-100 dark:bg-[#172033] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-[#AAB4C3] border-t border-slate-200 dark:border-[#344054]">
                <span className="leading-snug">
                  Landmark: Bijipur Big Street, easily accessible from main Berhampur transit routes.
                </span>
                <a
                  href={ACADEMY_CONFIG.socials.googleMapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg text-xs font-extrabold text-white bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:hover:brightness-105 dark:text-[#0F172A] transition-colors shrink-0 flex items-center gap-1.5 shadow-md border border-transparent dark:border-amber-300/40 min-h-[44px]"
                >
                  <Navigation className="w-3.5 h-3.5 text-white dark:text-[#0F172A]" />
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
