import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  FileText,
  MapPin,
  Clock,
} from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#111827] text-slate-800 dark:text-[#F3F4F6] transition-colors duration-200">
      
      {/* Page Header */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#172033] border-b border-slate-200 dark:border-[#344054]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#17365D] dark:text-[#AAB4C3] dark:hover:text-[#F4C76B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] text-[#C6922E] dark:text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B]" />
            <span>Institutional Data Governance</span>
          </div>

          <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Student & Parent Privacy Policy
          </h1>

          <p className="text-slate-600 dark:text-[#AAB4C3] text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
            At Antariksh Academy, we understand that educational decisions are deeply personal. We are committed
            to protecting the privacy and personal information of every student and parent who connects with our institute.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#17365D] dark:text-[#F4C76B]" />
              Effective Academic Session 2026–2027
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#17365D] dark:text-[#F4C76B]" />
              Bijipur, Brahmapur Center
            </span>
          </div>

        </div>
      </section>

      {/* Main Policy Content */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Core Privacy Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#17365D] dark:text-[#F4C76B] flex items-center justify-center mb-4">
                <EyeOff className="w-5 h-5 text-[#17365D] dark:text-[#F4C76B]" />
              </div>
              <h3 className="font-['Outfit',sans-serif] text-base font-bold text-slate-900 dark:text-white mb-2">
                Zero Commercial Selling
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                We never sell, rent, or monetize your contact information. Your details are never passed to external coaching lead aggregators or marketers.
              </p>
            </div>

            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-['Outfit',sans-serif] text-base font-bold text-slate-900 dark:text-white mb-2">
                Purpose-Bound Usage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                Information is collected solely to provide course counseling, schedule Google Meet meetings, and coordinate Class 11/12 batch shifts.
              </p>
            </div>

            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="font-['Outfit',sans-serif] text-base font-bold text-slate-900 dark:text-white mb-2">
                Parental Control & Deletion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                Parents or students can request full removal of their contact records from our counselor follow-up lists at any time with a single phone call.
              </p>
            </div>
          </div>

          {/* Section 1: Information We Collect */}
          <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#17365D] dark:text-[#F4C76B]" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-slate-600 dark:text-[#AAB4C3] text-sm leading-relaxed">
              When you submit a consultation request, callback enquiry, or batch application on our website, we may collect the following details:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B] shrink-0 mt-0.5" />
                <span><strong>Student or Parent Name:</strong> Used to personalize communication and academic consultation sessions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B] shrink-0 mt-0.5" />
                <span><strong>10-Digit Mobile Number:</strong> Required to call you back, coordinate trial classes, or send WhatsApp updates regarding batch schedules.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B] shrink-0 mt-0.5" />
                <span><strong>Current Class & Stream:</strong> (e.g. Class 11, Class 12, Dropper/Repeater) to ensure appropriate curriculum guidance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B] shrink-0 mt-0.5" />
                <span><strong>Target Entrance Exam & Course Interest:</strong> (Odisha CHSE +2 Science, JEE Main/Adv, NEET-UG, OUAT & ICAR Prep, or Integrated Batch).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B] shrink-0 mt-0.5" />
                <span><strong>Preferred Contact Window:</strong> Preferred time for telephone callbacks or parent visits at our Bijipur campus.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B] shrink-0 mt-0.5" />
                <span><strong>Email Address (for Google Meet Booking):</strong> Collected securely via Cal.com when booking an online video consultation to deliver Google Calendar invitations and meeting links.</span>
              </li>
            </ul>
          </div>

          {/* Section 2: How We Handle and Use Personal Information */}
          <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#17365D] dark:text-[#F4C76B]" />
              <span>2. How We Handle and Safeguard Your Data</span>
            </h2>
            <p className="text-slate-600 dark:text-[#AAB4C3] text-sm leading-relaxed">
              We process personal information under strict educational administrative standards:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Confidential Counseling</h4>
                <p className="text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                  Only senior counseling coordinators and academic heads at Antariksh Academy have access to submitted lead data.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Encrypted Transmission</h4>
                <p className="text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                  Website forms transmit inquiries over modern SSL/TLS encrypted HTTPS protocols, guarding against unauthorized interception.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">No Unsolicited Spam</h4>
                <p className="text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                  We do not send automated robot calls or flood your WhatsApp with promotional spam. Outreach is strictly relevant to your academic inquiry.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054]">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Secure Third-Party Tools</h4>
                <p className="text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
                  Online video consultation bookings use Cal.com and Google Meet, conforming to enterprise-grade SOC2 and ISO/IEC 27001 security standards.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Third-Party Services Involved */}
          <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#17365D] dark:text-[#F4C76B]" />
              <span>3. Third-Party Integrations</span>
            </h2>
            <p className="text-slate-600 dark:text-[#AAB4C3] text-sm leading-relaxed">
              To provide modern booking and navigation experiences, our website interfaces with trusted third-party providers:
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054]">
                <strong className="text-slate-900 dark:text-white block mb-1">Cal.com & Google Meet (Online Consultations)</strong>
                <span className="text-slate-600 dark:text-[#AAB4C3]">
                  When you schedule a free 30-minute academic consultation, your name, email, and chosen slot are processed through Cal.com to generate a secure Google Meet link and calendar invitation.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054]">
                <strong className="text-slate-900 dark:text-white block mb-1">EmailJS / Admissions Inbox</strong>
                <span className="text-slate-600 dark:text-[#AAB4C3]">
                  Enquiry and callback forms are securely forwarded to the official Antariksh Academy admissions inbox for manual counselor assignment and timely follow-up.
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054]">
                <strong className="text-slate-900 dark:text-white block mb-1">Google Maps</strong>
                <span className="text-slate-600 dark:text-[#AAB4C3]">
                  Our campus location embed loads directly from Google Maps to help students and parents find our Big Street, Bijipur center in Brahmapur.
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Student & Parent Rights */}
          <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="font-['Outfit',sans-serif] text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#17365D] dark:text-[#F4C76B]" />
              <span>4. Your Data Rights & Control</span>
            </h2>
            <p className="text-slate-600 dark:text-[#AAB4C3] text-sm leading-relaxed">
              You retain complete authority over your personal information:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Right to Opt Out:</strong> If you decide not to pursue admission, inform us and we will immediately cease follow-up calls.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Right to Erasure:</strong> You may request complete deletion of your phone number, email, and consultation logs from our database.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Right to Accurate Correction:</strong> Contact our admissions desk anytime to update your student details, stream preference, or batch timing.</span>
              </li>
            </ul>
          </div>

          {/* Section 5: Admissions Desk Contact */}
          <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 sm:p-8 text-center space-y-4">
            <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-slate-900 dark:text-white">
              Questions Regarding Your Privacy?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] max-w-xl mx-auto leading-relaxed">
              If you have any questions about how your personal information is managed, contact our campus administration desk directly:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold">
              <a
                href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#202B3D] text-[#17365D] dark:text-white border border-slate-300 dark:border-[#344054] hover:bg-slate-50 dark:hover:bg-[#2A374D] shadow-xs transition-colors min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B]" />
                <span>{ACADEMY_CONFIG.contact.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${ACADEMY_CONFIG.contact.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#202B3D] text-[#17365D] dark:text-white border border-slate-300 dark:border-[#344054] hover:bg-slate-50 dark:hover:bg-[#2A374D] shadow-xs transition-colors min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-[#17365D] dark:text-[#38BDF8]" />
                <span>{ACADEMY_CONFIG.contact.email}</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2">
              Antariksh Academy • Bijipur Big Street, Brahmapur (Berhampur), Odisha — 760001
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default PrivacyPolicyPage;
