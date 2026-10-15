import React, { useState } from 'react';
import { Phone, CheckCircle2, AlertCircle, Send, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
import { sanitizeMobileInput, getMobileValidationError } from '../utils/validation';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { submitEnquiryToGmail } from '../services/formSubmission';

interface CallbackSectionProps {
  preselectedCourse?: string;
  isStandalonePage?: boolean;
}

export const CallbackSection: React.FC<CallbackSectionProps> = ({
  preselectedCourse = '',
  isStandalonePage = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentClass, setStudentClass] = useState('+2 First Year (Class 11)');
  const [courseInterest, setCourseInterest] = useState(preselectedCourse || 'Integrated Board + Entrance Preparation');
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 AM - 12:00 PM)');
  const [consent, setConsent] = useState(false);

  // Form State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(null);
  const [lastSubmittedPhone, setLastSubmittedPhone] = useState('');

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Please enter student or parent name.';
    } else if (fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters long.';
    }

    const phoneErr = getMobileValidationError(mobileNumber);
    if (phoneErr) {
      errs.mobileNumber = phoneErr;
    }

    if (!consent) {
      errs.consent = 'Please provide consent so we may call you regarding your enquiry.';
    }

    // Duplicate check
    if (submissionSuccess && lastSubmittedPhone === mobileNumber.trim()) {
      errs.mobileNumber = 'A callback request with this phone number was already submitted.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Send directly to admissions inbox
    await submitEnquiryToGmail({
      formType: 'Callback Request',
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      studentClass,
      courseInterest,
      preferredTime,
    });

    setIsSubmitting(false);
    setSubmissionSuccess(true);
    setLastSubmittedPhone(mobileNumber.trim());
  };

  const handleReset = () => {
    setFullName('');
    setMobileNumber('');
    setConsent(false);
    setErrors({});
    setSubmissionSuccess(null);
  };

  return (
    <section
      id="callback"
      className={`${
        isStandalonePage ? 'py-12 sm:py-16' : 'py-16 sm:py-20 md:py-24'
      } bg-gradient-to-b from-white via-pink-50/20 to-slate-50 text-slate-900 relative overflow-hidden border-b border-slate-200`}
    >
      {/* Brand Pink & Cyan Glows */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#FC1682]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#00C8FF]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#BE125A] text-xs font-bold uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Fast Academic Assistance</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-3">
            Need Guidance? Let Us Call You.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have questions about +2 board coaching, entrance test patterns, or batch timings? Leave your contact details
            and our senior counselor will reach out.
          </p>
        </div>

        {/* Card Form Container */}
        <div className="bg-white border-2 border-pink-100 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-xl">
          
          {submissionSuccess ? (
            <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-pink-50 border-2 border-[#FC1682]/40 rounded-full flex items-center justify-center mx-auto text-[#FC1682]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-['Outfit',sans-serif] text-[#0F172A]">
                  Callback Request Submitted!
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. Your details for{' '}
                  <span className="text-[#FC1682] font-semibold">{courseInterest}</span> have been sent to our Berhampur admissions office.
                  A counselor will call you at <span className="font-bold text-slate-900">+91 {mobileNumber}</span> during your preferred window ({preferredTime}).
                </p>
              </div>

              {/* Direct Instant Connect Options */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 text-left max-w-lg mx-auto space-y-2">
                <div className="flex items-center gap-2 text-[#BE125A] font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#FC1682]" />
                  <span>Prefer to Connect Right Now?</span>
                </div>
                <p className="leading-relaxed">
                  You can also message our counseling team directly on WhatsApp for immediate fee structures and brochure downloads:
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                  <a
                    href={`https://wa.me/${ACADEMY_CONFIG.contact.whatsappNumber}?text=Hello%20Antariksh%20Academy,%20my%20name%20is%20${encodeURIComponent(fullName)}.%20I%20enquired%20about%20${encodeURIComponent(courseInterest)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Admissions ({ACADEMY_CONFIG.contact.phoneDisplay})</span>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-[#FC1682] transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Submit Another Request</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(e); }} className="space-y-6" noValidate>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label htmlFor="cb-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student or Parent Name <span className="text-[#FC1682]">*</span>
                  </label>
                  <input
                    id="cb-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Ramesh Chandra Das"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682] transition-all ${
                      errors.fullName ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="cb-mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Number (10 Digits) <span className="text-[#FC1682]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-xs font-bold text-slate-500 pointer-events-none">
                      +91
                    </span>
                    <input
                      id="cb-mobile"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={mobileNumber}
                      onChange={(e) => {
                        const sanitized = sanitizeMobileInput(e.target.value);
                        setMobileNumber(sanitized);
                        if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: '' }));
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`w-full pl-12 pr-16 py-3 rounded-xl bg-slate-50 border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682] transition-all font-mono tracking-wider ${
                        errors.mobileNumber ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                      }`}
                    />
                    <span className="absolute right-3.5 top-3.5 text-[11px] font-semibold text-slate-400 pointer-events-none">
                      {mobileNumber.length}/10
                    </span>
                  </div>
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.mobileNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Class & Course Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Student's Current Class */}
                <div>
                  <label htmlFor="cb-class" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Class / Level
                  </label>
                  <select
                    id="cb-class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682]"
                  >
                    <option value="+2 First Year (Class 11)">+2 First Year (Class 11 Science)</option>
                    <option value="+2 Second Year (Class 12)">+2 Second Year (Class 12 Science)</option>
                    <option value="+2 Passout / Dropper">+2 Passout / Entrance Repeater</option>
                    <option value="Class 10 Moving to 11">Class 10 Moving to +2 Science</option>
                  </select>
                </div>

                {/* Course of Interest */}
                <div>
                  <label htmlFor="cb-course" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Interested Course
                  </label>
                  <select
                    id="cb-course"
                    value={courseInterest}
                    onChange={(e) => setCourseInterest(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682]"
                  >
                    <option value="Integrated Board + Entrance Preparation">Integrated Board + Entrance Preparation</option>
                    <option value="JEE Main & JEE Advanced">JEE Main & JEE Advanced</option>
                    <option value="NEET-UG Medical Preparation">NEET-UG Medical Preparation</option>
                    <option value="+2 Science Odisha CHSE Board">+2 Science Odisha CHSE Board</option>
                    <option value="NDA (National Defence Academy) Preparation">NDA (National Defence Academy) Preparation</option>
                  </select>
                </div>
              </div>

              {/* Preferred Time Slot */}
              <div>
                <label htmlFor="cb-time" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Preferred Callback Time Window
                </label>
                <select
                  id="cb-time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682]"
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM – 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM – 04:00 PM)</option>
                  <option value="Evening (04:00 PM - 07:30 PM)">Evening (04:00 PM – 07:30 PM)</option>
                  <option value="Anytime during working hours">Anytime during academy office hours</option>
                </select>
              </div>

              {/* Consent Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-[#FC1682] focus:ring-[#FC1682]"
                  />
                  <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors leading-relaxed">
                    I authorize Antariksh Academy counselors to contact me on the provided number solely regarding
                    academic guidance, fee structures, and batch admissions. We respect your privacy.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Request Free Academic Callback</span>
                    </>
                  )}
                </button>
              </div>

              {/* Footnote */}
              <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Your details are private and used solely to fulfill your admission guidance enquiry</span>
              </p>
            </form>
          )}

        </div>

      </div>
    </section>
  );
};
