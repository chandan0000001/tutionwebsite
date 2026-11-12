import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Users, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitEnquiryToGmail } from '../../services/formSubmission';
import { sanitizeMobileInput, getMobileValidationError } from '../../utils/validation';
import { ACADEMY_CONFIG } from '../../config/academyConfig';
import { SpecularCard } from '../common/SpecularCard';

export const HeroLeadForm: React.FC = memo(() => {
  const [heroName, setHeroName] = useState('');
  const [heroPhone, setHeroPhone] = useState('');
  const [heroTargetClass, setHeroTargetClass] = useState('+2 1st Year (Class 11)');
  const [heroCourse, setHeroCourse] = useState('Integrated Board + Entrance');
  const [heroContactMethod, setHeroContactMethod] = useState<'Phone callback' | 'Parents meeting at the academy'>(
    'Phone callback'
  );
  const [heroHoney, setHeroHoney] = useState('');
  const [heroStatus, setHeroStatus] = useState<string | null>(null);
  const [isHeroSubmitting, setIsHeroSubmitting] = useState(false);

  const handleHeroLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim()) {
      setHeroStatus('Please enter the student or parent name.');
      return;
    }
    const phoneErr = getMobileValidationError(heroPhone);
    if (phoneErr) {
      setHeroStatus(phoneErr);
      return;
    }

    setIsHeroSubmitting(true);
    setHeroStatus(null);

    const result = await submitEnquiryToGmail({
      formType: 'Callback Request',
      fullName: heroName.trim(),
      mobileNumber: heroPhone.trim(),
      studentClass: heroTargetClass,
      courseInterest: heroCourse,
      preferredTime: `${heroContactMethod} | Immediate Admissions Request`,
      consultationType: heroContactMethod,
      honeypot: heroHoney,
    });

    setIsHeroSubmitting(false);

    if (result.success) {
      setHeroStatus('SUCCESS: Request accepted! Our senior counselor will follow up with you shortly.');
      setHeroName('');
      setHeroPhone('');
      setHeroHoney('');
    } else {
      setHeroStatus(
        result.message ||
          'Submission unsuccessful. Please call our admissions desk at +91 90901 60793 or connect on WhatsApp.'
      );
    }
  };

  return (
    <div id="callback-widget" className="lg:col-span-5 relative w-full scroll-mt-24">
      <SpecularCard glowColor="gold" tilt={false} className="p-4 sm:p-6 shadow-xl dark:shadow-2xl">
        {/* Visual Top Header Accent */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-white/10">
          <div>
            <span className="font-cinzel text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-[#F4C76B] block">
              Direct Admissions Desk
            </span>
            <h2 className="font-display text-base font-extrabold text-stone-900 dark:text-[#FFEDD7]">
              Request Parent Meeting
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-[#F4C76B] text-[9px] font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1 font-stat">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            2026–27
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-[#AAB4C3] leading-relaxed mb-3 sm:mb-4">
          Would you prefer a phone conversation or an in-person meeting with our academic team?
          Share your details and our team will follow up.
        </p>

        <form onSubmit={(e) => { void handleHeroLeadSubmit(e); }} className="space-y-3 sm:space-y-3.5">
          {/* Anti-spam honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hero-honey">Leave this blank</label>
            <input
              id="hero-honey"
              type="text"
              name="_honey"
              value={heroHoney}
              onChange={(e) => setHeroHoney(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Preferred Contact Mode Toggle */}
          <div className="grid grid-cols-2 gap-2 pb-1" role="group" aria-label="Preferred Contact Mode">
            <button
              type="button"
              aria-pressed={heroContactMethod === 'Phone callback'}
              onClick={() => setHeroContactMethod('Phone callback')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                heroContactMethod === 'Phone callback'
                  ? 'bg-[#17365D] text-white border-[#17365D] dark:bg-[#172033] dark:text-[#F4C76B] dark:border-[#F4C76B]'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 dark:bg-[#172033]/50 dark:text-[#AAB4C3] dark:border-[#344054] dark:hover:text-[#F3F4F6]'
              }`}
            >
              <Phone className="w-3 h-3" />
              <span>Phone Call</span>
            </button>
            <button
              type="button"
              aria-pressed={heroContactMethod === 'Parents meeting at the academy'}
              onClick={() => setHeroContactMethod('Parents meeting at the academy')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                heroContactMethod === 'Parents meeting at the academy'
                  ? 'bg-[#17365D] text-white border-[#17365D] dark:bg-[#172033] dark:text-[#F4C76B] dark:border-[#F4C76B]'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:text-slate-900 dark:bg-[#172033]/50 dark:text-[#AAB4C3] dark:border-[#344054] dark:hover:text-[#F3F4F6]'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Meeting at Center</span>
            </button>
          </div>

          <div>
            <label htmlFor="hero-name" className="block text-[11px] font-bold text-slate-800 dark:text-[#F3F4F6] uppercase tracking-wider mb-1 font-display">
              Parent / Student Name <span className="text-amber-600 dark:text-[#F4C76B]">*</span>
            </label>
            <input
              id="hero-name"
              type="text"
              required
              placeholder="e.g. Rajesh Patnaik"
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-300 dark:border-[#344054] text-base sm:text-sm text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#8592A3] focus:border-[#17365D] dark:focus:border-[#F4C76B] focus:ring-1 focus:ring-[#17365D] dark:focus:ring-[#F4C76B] focus:outline-none transition-all min-h-[44px]"
            />
          </div>

          <div>
            <label htmlFor="hero-phone" className="block text-[11px] font-bold text-slate-800 dark:text-[#F3F4F6] uppercase tracking-wider mb-1 font-display">
              10-Digit Mobile Number <span className="text-amber-600 dark:text-[#F4C76B]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
                +91
              </div>
              <input
                id="hero-phone"
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel"
                pattern="[0-9]*"
                maxLength={10}
                placeholder="90901 60793"
                value={heroPhone}
                onChange={(e) => setHeroPhone(sanitizeMobileInput(e.target.value))}
                className="w-full pl-11 pr-14 py-2.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-300 dark:border-[#344054] text-base sm:text-sm text-slate-900 dark:text-[#F3F4F6] placeholder-slate-500 dark:placeholder-[#8592A3] focus:border-[#17365D] dark:focus:border-[#F4C76B] focus:ring-1 focus:ring-[#17365D] dark:focus:ring-[#F4C76B] focus:outline-none font-stat tracking-wider transition-all min-h-[44px]"
              />
              <span className="absolute right-3 top-3 text-[10px] font-semibold text-slate-600 dark:text-slate-300 pointer-events-none font-stat">
                {heroPhone.length}/10
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label htmlFor="hero-class" className="block text-[11px] font-bold text-slate-800 dark:text-[#F3F4F6] uppercase tracking-wider mb-1 font-display">
                Current Class
              </label>
              <select
                id="hero-class"
                value={heroTargetClass}
                onChange={(e) => setHeroTargetClass(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-300 dark:border-[#344054] text-base sm:text-xs text-slate-900 dark:text-[#F3F4F6] focus:border-[#17365D] dark:focus:border-[#F4C76B] focus:outline-none transition-all min-h-[44px]"
              >
                <option value="+2 1st Year (Class 11)">+2 1st Year (Class 11)</option>
                <option value="+2 2nd Year (Class 12)">+2 2nd Year (Class 12)</option>
                <option value="Class 10 Moving to 11">Class 10 Moving to 11</option>
                <option value="Dropper / Repeater Batch">Dropper / Repeater Batch</option>
              </select>
            </div>

            <div>
              <label htmlFor="hero-course" className="block text-[11px] font-bold text-slate-800 dark:text-[#F3F4F6] uppercase tracking-wider mb-1 font-display">
                Target Exam
              </label>
              <select
                id="hero-course"
                value={heroCourse}
                onChange={(e) => setHeroCourse(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-300 dark:border-[#344054] text-base sm:text-xs text-slate-900 dark:text-[#F3F4F6] focus:border-[#17365D] dark:focus:border-[#F4C76B] focus:outline-none transition-all min-h-[44px]"
              >
                <option value="Integrated Board + Entrance">Integrated Board + Entrance</option>
                <option value="JEE Main & JEE Advanced">JEE Main & JEE Advanced</option>
                <option value="NEET-UG Medical">NEET-UG Medical</option>
                <option value="+2 Science Board (CHSE)">+2 Science Board (CHSE)</option>
                <option value="OUAT & ICAR Preparation">OUAT & ICAR Preparation</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isHeroSubmitting}
            className="w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] hover:brightness-105 shadow-md shadow-slate-900/10 dark:shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 font-display mt-2 min-h-[48px] active:scale-[0.98]"
          >
            {isHeroSubmitting ? (
              <span>Dispatching to Admissions Desk...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-white dark:text-[#0F172A] shrink-0" />
                <span>
                  {heroContactMethod === 'Parents meeting at the academy'
                    ? 'Request Parents Meeting at Center'
                    : 'Request Priority Phone Callback'}
                </span>
              </>
            )}
          </button>
        </form>

        {heroStatus && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs text-center font-semibold space-y-2 ${
              heroStatus.startsWith('SUCCESS')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {heroStatus.startsWith('SUCCESS') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <Phone className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span>{heroStatus}</span>
            </div>
            {!heroStatus.startsWith('SUCCESS') && (
              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-[11px] border border-slate-700 hover:bg-black transition-colors"
                >
                  Call Direct
                </a>
                <a
                  href={ACADEMY_CONFIG.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 transition-colors"
                >
                  WhatsApp Desk
                </a>
              </div>
            )}
          </div>
        )}

        {/* Direct Cross-Link to Option A */}
        <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-[#344054]/70 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-[#AAB4C3]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            100% Confidential
          </span>
          <Link
            to="/consultation"
            className="text-[#0284C7] hover:text-[#17365D] dark:text-[#F4C76B] dark:hover:text-white font-bold transition-colors inline-flex items-center gap-1"
          >
            <span>Need instant Google Meet? Book 1:1 Online Slot →</span>
          </Link>
        </div>
      </SpecularCard>
    </div>
  );
});

HeroLeadForm.displayName = 'HeroLeadForm';
