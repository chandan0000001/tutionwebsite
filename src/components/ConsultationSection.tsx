import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Send,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { buildGoogleCalendarUrl } from '../utils/googleCalendar';
import { isValidEmail, sanitizeMobileInput, getMobileValidationError } from '../utils/validation';
import { submitEnquiryToGmail } from '../services/formSubmission';

interface ConsultationSectionProps {
  preselectedCourse?: string;
  isStandalonePage?: boolean;
}

function getTomorrowDateStr(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function getDefaultDateStr(): string {
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);
  return defaultDate.toISOString().split('T')[0];
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({
  preselectedCourse = '',
  isStandalonePage = false,
}) => {
  const [minDateStr] = useState(getTomorrowDateStr);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentClass, setStudentClass] = useState('+2 First Year (Class 11)');
  const [courseInterest, setCourseInterest] = useState(
    preselectedCourse || 'Integrated Board + Entrance Preparation'
  );
  const [preferredDate, setPreferredDate] = useState(getDefaultDateStr);
  const [preferredTime, setPreferredTime] = useState<string>(ACADEMY_CONFIG.consultation.availableSlots[1]);
  const [consultationType, setConsultationType] = useState('Google Meet Video Call');
  const [specificQuery, setSpecificQuery] = useState('');

  // Form Validation & Status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [calendarUrl, setCalendarUrl] = useState<string>('');

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    } else if (fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters.';
    }

    if (!email.trim()) {
      errs.email = 'Please provide an email address for meeting confirmations.';
    } else if (!isValidEmail(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (mobileNumber.trim()) {
      const phoneErr = getMobileValidationError(mobileNumber);
      if (phoneErr) {
        errs.mobileNumber = phoneErr;
      }
    }

    if (!preferredDate) {
      errs.preferredDate = 'Please select a consultation date.';
    } else {
      const selected = new Date(preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.preferredDate = 'Consultation date cannot be in the past.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Generate Google Calendar Link for user convenience
    const calUrl = buildGoogleCalendarUrl({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: mobileNumber.trim() || undefined,
      studentClass,
      courseInterest,
      preferredDate,
      preferredTime,
      notes: specificQuery.trim() || undefined,
    });
    setCalendarUrl(calUrl);

    // Transmit directly to academy admissions inbox
    await submitEnquiryToGmail({
      formType: 'Consultation Booking',
      fullName: fullName.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim() || undefined,
      studentClass,
      courseInterest,
      preferredDate,
      preferredTime,
      consultationType,
      message: specificQuery.trim() || undefined,
    });

    setIsSubmitting(false);
    setSubmissionSuccess(true);
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setMobileNumber('');
    setSpecificQuery('');
    setErrors({});
    setSubmissionSuccess(false);
    setCalendarUrl('');
  };

  return (
    <section
      id="consultation"
      className={`${
        isStandalonePage ? 'py-12 sm:py-16' : 'py-16 sm:py-20 md:py-24'
      } bg-gradient-to-b from-white via-pink-50/25 to-slate-50 border-b border-slate-200 relative overflow-hidden`}
    >
      {/* Decorative Glows */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#FC1682]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#00C8FF]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#BE125A] text-xs font-bold uppercase tracking-wider mb-3">
            <Video className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>1-on-1 Academic Counseling</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4">
            Book a Free Academic Consultation
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Discuss your student’s strengths, identify board and entrance requirements, and plan a clear academic roadmap with
            our senior faculty via Google Meet or in person at Bijipur, Brahmapur.
          </p>

          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-[#FC1682]" />
              30-Minute Interactive Session
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Free & Personalized
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 font-bold text-[#0284C7]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
              Direct Faculty Interaction
            </span>
          </div>
        </div>

        {/* Main Consultation Form Card */}
        <div className="bg-white border-2 border-pink-100 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-xl">
          
          {submissionSuccess ? (
            <div className="space-y-6 text-center py-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-pink-50 border-2 border-[#FC1682]/40 text-[#FC1682] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#FC1682]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-pink-100 text-[#BE125A]">
                  Consultation Request Dispatched
                </span>
                <h3 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-2">
                  We Have Received Your Slot Request!
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-slate-900">{fullName}</span>. Your appointment request for{' '}
                  <span className="font-bold text-[#FC1682]">{courseInterest}</span> on{' '}
                  <span className="font-bold text-slate-900">{preferredDate}</span> ({preferredTime}) has been sent directly to the
                  Antariksh Academy Admissions Desk.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 text-left space-y-3 max-w-xl mx-auto">
                <div className="flex items-center gap-2 font-bold text-[#0F172A] text-sm border-b border-slate-200 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Next Steps for Your Consultation:</span>
                </div>
                <ul className="space-y-2 text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FC1682] shrink-0 mt-1.5"></span>
                    <span>Our academic counselor will review faculty availability and confirm the slot.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FC1682] shrink-0 mt-1.5"></span>
                    <span>The secure Google Meet video link will be sent to <strong className="text-slate-800">{email}</strong> and WhatsApp.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FC1682] shrink-0 mt-1.5"></span>
                    <span>Prepare any previous marks cards or specific question sets you would like the mentor to evaluate.</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {calendarUrl && (
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Save to My Google Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#FC1682]" />
                  <span>Book Another Slot</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(e); }} className="space-y-6" noValidate>
              
              {/* Row 1: Full Name and Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cs-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student or Parent Name <span className="text-[#FC1682]">*</span>
                  </label>
                  <input
                    id="cs-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Priyabrata Mohapatra"
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

                <div>
                  <label htmlFor="cs-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address (for Google Meet Link) <span className="text-[#FC1682]">*</span>
                  </label>
                  <input
                    id="cs-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="student@example.com"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682] transition-all ${
                      errors.email ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Mobile Number and Student Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cs-mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mobile Number <span className="text-slate-400 font-normal">(for SMS/WhatsApp Confirmation)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-xs font-bold text-slate-500 pointer-events-none">
                      +91
                    </span>
                    <input
                      id="cs-mobile"
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

                <div>
                  <label htmlFor="cs-class" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student Current Class / Status
                  </label>
                  <select
                    id="cs-class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682]"
                  >
                    <option value="+2 First Year (Class 11)">Class 11 (+2 First Year Science)</option>
                    <option value="+2 Second Year (Class 12)">Class 12 (+2 Second Year Science)</option>
                    <option value="+2 Passout (Repeater / Dropper)">12th Passout / Dropper Batch</option>
                    <option value="Class 10 Moving to 11">Class 10 Moving to +2 Science</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Target Course and Consultation Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cs-course" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Course Stream
                  </label>
                  <select
                    id="cs-course"
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

                <div>
                  <label htmlFor="cs-mode" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Consultation Medium
                  </label>
                  <select
                    id="cs-mode"
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682]"
                  >
                    <option value="Google Meet Video Call">Google Meet Video Call</option>
                    <option value="In-Person at Bijipur Centre">In-Person at Bijipur Center, Brahmapur</option>
                    <option value="Phone Call Consultation">Direct Phone Consultation</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Preferred Date and Preferred Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="cs-date" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Date <span className="text-[#FC1682]">*</span>
                  </label>
                  <input
                    id="cs-date"
                    type="date"
                    min={minDateStr}
                    value={preferredDate}
                    onChange={(e) => {
                      setPreferredDate(e.target.value);
                      if (errors.preferredDate) setErrors((prev) => ({ ...prev, preferredDate: '' }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682] ${
                      errors.preferredDate ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  {errors.preferredDate && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.preferredDate}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cs-time" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    id="cs-time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682]"
                  >
                    {ACADEMY_CONFIG.consultation.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Specific Questions or Academic Focus (Optional) */}
              <div>
                <label htmlFor="cs-query" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Specific Questions / Academic Focus <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="cs-query"
                  rows={3}
                  value={specificQuery}
                  onChange={(e) => setSpecificQuery(e.target.value)}
                  placeholder="e.g. Currently scoring 75% in school, want advice on managing JEE numericals alongside CHSE Physics."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FC1682] resize-y"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting with Admissions Desk...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Confirm & Schedule Free Consultation</span>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Footnote (NO email mentioned, NO demo mode) */}
              <div className="flex items-center justify-center text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-1.5 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Your information is strictly protected and shared solely with Antariksh Academy senior mentors.</span>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
};
