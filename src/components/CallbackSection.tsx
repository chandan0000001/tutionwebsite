import React, { useState } from 'react';
import {
  Phone,
  CheckCircle2,
  AlertCircle,
  Send,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
  Users,
  Clock,
} from 'lucide-react';
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
  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentClass, setStudentClass] = useState('+2 First Year (Class 11)');
  const [courseInterest, setCourseInterest] = useState(
    preselectedCourse || 'Integrated Board + Entrance Preparation'
  );
  const [contactMethod, setContactMethod] = useState<'Phone callback' | 'Parents meeting at the academy'>(
    'Phone callback'
  );
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 AM - 12:00 PM)');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Form Submission & Status State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [lastSubmittedPhone, setLastSubmittedPhone] = useState('');
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    mobileNumber: string;
    courseInterest: string;
    contactMethod: string;
    preferredTime: string;
  } | null>(null);

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
      errs.consent = 'Please provide consent so our counselors may follow up regarding your enquiry.';
    }

    // Duplicate check
    if (submissionSuccess && lastSubmittedPhone === mobileNumber.trim()) {
      errs.mobileNumber = 'A request with this phone number was already submitted.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    // Send directly to admissions inbox (Option B flow: Manual follow-up)
    const result = await submitEnquiryToGmail({
      formType: contactMethod === 'Parents meeting at the academy' ? 'Parent Meeting Request' : 'Phone Callback Request',
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      studentClass,
      courseInterest,
      preferredTime: `${contactMethod} | ${preferredTime}`,
      consultationType: contactMethod,
      message: message.trim() || undefined,
      honeypot,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmittedData({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        courseInterest,
        contactMethod,
        preferredTime,
      });
      setSubmissionSuccess(true);
      setLastSubmittedPhone(mobileNumber.trim());
      // Reset form fields only after confirmed provider acceptance
      setFullName('');
      setMobileNumber('');
      setMessage('');
      setConsent(false);
      setHoneypot('');
      setErrors({});
    } else {
      setSubmissionSuccess(false);
      setSubmissionError(
        result.message ||
          'We were unable to transmit your request right now. Please call or WhatsApp our admissions desk directly.'
      );
    }
  };

  const handleReset = () => {
    setFullName('');
    setMobileNumber('');
    setMessage('');
    setConsent(false);
    setHoneypot('');
    setErrors({});
    setSubmissionSuccess(null);
    setSubmissionError(null);
    setSubmittedData(null);
  };

  return (
    <section
      id="callback"
      className={`${
        isStandalonePage ? 'py-10 sm:py-16' : 'py-16 sm:py-20 md:py-24'
      } bg-[#08090D] text-white relative overflow-hidden border-b border-pink-500/20`}
    >
      {/* Ambient Gradient Glows */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#FC1682]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading & Supporting Text (Option B: Dedicated Flow) */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141824] border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3 font-cinzel">
            <Phone className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Option B: Direct Academy Follow-Up</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Request a{' '}
            <span className="bg-gradient-to-r from-white via-pink-200 to-[#FC1682] bg-clip-text text-transparent">
              Parent Meeting or Callback
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Would you prefer a phone conversation or an in-person meeting with our academic team?
            Share your details and our team will follow up.
          </p>
        </div>

        {/* Elevated Form Card Container */}
        <div className="bg-[#141824] border-2 border-pink-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative backdrop-blur-xl">
          
          {submissionSuccess ? (
            <div className="text-center py-8 space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-[#0D1017] border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Request Dispatched to Admissions Desk
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-2">
                  Thank You, {submittedData?.fullName || 'Student/Parent'}!
                </h3>
                <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  We have received your preference for{' '}
                  <span className="text-[#FC1682] font-bold">{submittedData?.contactMethod}</span> regarding{' '}
                  <span className="text-white font-semibold">{submittedData?.courseInterest}</span>. Our senior counselor
                  will connect with you at <strong className="text-white">+91 {submittedData?.mobileNumber}</strong> during your
                  requested window ({submittedData?.preferredTime}).
                </p>
              </div>

              {/* Direct Instant Connect Options */}
              <div className="bg-[#0D1017] border border-pink-500/20 rounded-2xl p-4 text-xs text-slate-300 text-left max-w-lg mx-auto space-y-2">
                <div className="flex items-center gap-2 text-pink-300 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#FC1682]" />
                  <span>Need Immediate Assistance?</span>
                </div>
                <p className="leading-relaxed">
                  You can also message our counseling desk on WhatsApp for fee structures and seat reservations:
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                  <a
                    href={`https://wa.me/${ACADEMY_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
                      `Hello Antariksh Academy, my name is ${submittedData?.fullName || 'a student/parent'}. I submitted a ${submittedData?.contactMethod} request for ${submittedData?.courseInterest}.`
                    )}`}
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
                  className="px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-[#0D1017] hover:bg-[#1A2030] border border-pink-500/30 rounded-xl transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Submit Another Request</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(e); }} className="space-y-6" noValidate>
              
              {/* Anti-spam honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="cb-honey">Leave this field blank</label>
                <input
                  id="cb-honey"
                  type="text"
                  name="_honey"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Submission Error Banner with Fallback Links */}
              {submissionError && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs sm:text-sm space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-100">Submission Notice</p>
                      <p className="mt-0.5 leading-relaxed text-rose-300">{submissionError}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#08090D] hover:bg-black text-white font-bold text-xs border border-pink-500/30 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FC1682]" />
                      <span>Call {ACADEMY_CONFIG.contact.phoneDisplay}</span>
                    </a>
                    <a
                      href={ACADEMY_CONFIG.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Preferred Contact Method Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2 font-display">
                  Preferred Contact Method <span className="text-[#FC1682]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      contactMethod === 'Phone callback'
                        ? 'bg-[#0D1017] border-[#FC1682] text-white shadow-sm shadow-pink-600/10'
                        : 'bg-[#0D1017]/70 border-pink-500/20 text-slate-300 hover:border-pink-500/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="contactMethod"
                      value="Phone callback"
                      checked={contactMethod === 'Phone callback'}
                      onChange={() => setContactMethod('Phone callback')}
                      className="mt-1 h-4 w-4 text-[#FC1682] focus:ring-[#FC1682] border-pink-500/40 bg-[#08090D]"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#FC1682]" />
                        Phone Callback
                      </span>
                      <span className="text-[11px] text-slate-400 leading-snug mt-0.5 block">
                        Our counselor calls you at your preferred time window.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      contactMethod === 'Parents meeting at the academy'
                        ? 'bg-[#0D1017] border-[#FC1682] text-white shadow-sm shadow-pink-600/10'
                        : 'bg-[#0D1017]/70 border-pink-500/20 text-slate-300 hover:border-pink-500/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="contactMethod"
                      value="Parents meeting at the academy"
                      checked={contactMethod === 'Parents meeting at the academy'}
                      onChange={() => setContactMethod('Parents meeting at the academy')}
                      className="mt-1 h-4 w-4 text-[#FC1682] focus:ring-[#FC1682] border-pink-500/40 bg-[#08090D]"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                        Parents Meeting at Academy
                      </span>
                      <span className="text-[11px] text-slate-400 leading-snug mt-0.5 block">
                        Meet faculty in person at Bijipur campus, Brahmapur.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Row 1: Full Name and Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cb-name" className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5 font-display">
                    Parent or Student Name <span className="text-[#FC1682]">*</span>
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
                    className={`w-full px-4 py-3 rounded-xl bg-[#0D1017] border text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FC1682] focus:ring-1 focus:ring-[#FC1682] transition-all ${
                      errors.fullName ? 'border-rose-500 bg-rose-950/30' : 'border-pink-500/25'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cb-mobile" className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5 font-display">
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
                      className={`w-full pl-12 pr-16 py-3 rounded-xl bg-[#0D1017] border text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FC1682] focus:ring-1 focus:ring-[#FC1682] transition-all font-mono tracking-wider ${
                        errors.mobileNumber ? 'border-rose-500 bg-rose-950/30' : 'border-pink-500/25'
                      }`}
                    />
                    <span className="absolute right-3.5 top-3.5 text-[11px] font-semibold text-slate-500 pointer-events-none">
                      {mobileNumber.length}/10
                    </span>
                  </div>
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.mobileNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Class & Course Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cb-class" className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5 font-display">
                    Student's Class
                  </label>
                  <select
                    id="cb-class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1017] border border-pink-500/25 text-white text-sm focus:outline-none focus:border-[#FC1682] focus:ring-1 focus:ring-[#FC1682]"
                  >
                    <option value="+2 First Year (Class 11)">+2 First Year (Class 11 Science)</option>
                    <option value="+2 Second Year (Class 12)">+2 Second Year (Class 12 Science)</option>
                    <option value="+2 Passout / Dropper">+2 Passout / Entrance Repeater</option>
                    <option value="Class 10 Moving to 11">Class 10 Moving to +2 Science</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cb-course" className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5 font-display">
                    Course or Exam Interest
                  </label>
                  <select
                    id="cb-course"
                    value={courseInterest}
                    onChange={(e) => setCourseInterest(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1017] border border-pink-500/25 text-white text-sm focus:outline-none focus:border-[#FC1682] focus:ring-1 focus:ring-[#FC1682]"
                  >
                    <option value="Integrated Board + Entrance Preparation">Integrated Board + Entrance Preparation</option>
                    <option value="JEE Main & JEE Advanced">JEE Main & JEE Advanced</option>
                    <option value="NEET-UG Medical Preparation">NEET-UG Medical Preparation</option>
                    <option value="+2 Science Odisha CHSE Board">+2 Science Odisha CHSE Board</option>
                    <option value="NDA (National Defence Academy) Preparation">NDA (National Defence Academy) Preparation</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Preferred Time or Meeting Preference */}
              <div>
                <label htmlFor="cb-time" className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5 font-display">
                  {contactMethod === 'Parents meeting at the academy'
                    ? 'Preferred Meeting Time at Bijipur Campus'
                    : 'Preferred Callback Time Window'}
                </label>
                <select
                  id="cb-time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0D1017] border border-pink-500/25 text-white text-sm focus:outline-none focus:border-[#FC1682] focus:ring-1 focus:ring-[#FC1682]"
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM – 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM – 04:00 PM)</option>
                  <option value="Evening (04:00 PM - 07:30 PM)">Evening (04:00 PM – 07:30 PM)</option>
                  <option value="Anytime during working hours">Anytime during academy hours (07:00 AM – 07:30 PM)</option>
                </select>
              </div>

              {/* Row 4: Optional Message */}
              <div>
                <label htmlFor="cb-message" className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5 font-display">
                  Optional Message or Questions <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="cb-message"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Inquiring about hostel accommodation, fee installments, or current batch schedules."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D1017] border border-pink-500/25 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FC1682] focus:ring-1 focus:ring-[#FC1682] resize-y"
                ></textarea>
              </div>

              {/* Row 5: Consent Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                    }}
                    className="mt-1 h-4 w-4 rounded border-pink-500/40 bg-[#0D1017] text-[#FC1682] focus:ring-[#FC1682]"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                    I authorize Antariksh Academy counselors to contact me on the provided number solely regarding
                    academic guidance, fee structures, and batch admissions. We respect your privacy.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              {/* Submit Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] hover:from-[#FF2D92] hover:to-[#FC1682] shadow-lg shadow-pink-600/30 border border-pink-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 font-display"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>
                        {contactMethod === 'Parents meeting at the academy'
                          ? 'Request Parents Meeting at Academy'
                          : 'Request Academic Phone Callback'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Distinction Footnote */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-pink-500/20 gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Manual follow-up by Antariksh Academy admissions team (Private & Confidential)</span>
                </span>
                <span className="flex items-center gap-1 text-[#38BDF8]">
                  <Clock className="w-3 h-3" />
                  <span>Response within 15–30 minutes</span>
                </span>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
};

export default CallbackSection;
