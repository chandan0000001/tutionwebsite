import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Trophy,
  Users,
  Phone,
  Send,
  Star,
  ShieldCheck,
  BookOpen,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Flame,
  Award,
} from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';
import { RESULTS_DATA } from '../data/resultsData';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';
import { submitEnquiryToGmail } from '../services/formSubmission';
import { sanitizeMobileInput, getMobileValidationError } from '../utils/validation';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const HomePage: React.FC = () => {
  // Above-the-fold Hero Lead Form State
  const [heroName, setHeroName] = useState('');
  const [heroPhone, setHeroPhone] = useState('');
  const [heroTargetClass, setHeroTargetClass] = useState('+2 1st Year (Class 11)');
  const [heroCourse, setHeroCourse] = useState('Integrated Board + Entrance');
  const [heroStatus, setHeroStatus] = useState<string | null>(null);
  const [isHeroSubmitting, setIsHeroSubmitting] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

    await submitEnquiryToGmail({
      formType: 'Callback Request',
      fullName: heroName.trim(),
      mobileNumber: heroPhone.trim(),
      studentClass: heroTargetClass,
      courseInterest: heroCourse,
      preferredTime: 'Immediate Admissions Callback Requested',
    });

    setIsHeroSubmitting(false);
    setHeroStatus('SUCCESS: Callback request dispatched! Our senior academic counselor will call you within 15 minutes.');
    setHeroName('');
    setHeroPhone('');
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Top 4 results for preview
  const topResults = RESULTS_DATA.slice(0, 4);

  // FAQ items for business conversion
  const faqItems = [
    {
      q: 'How does Antariksh Academy balance CHSE Odisha Board syllabus with JEE / NEET preparation?',
      a: 'We utilize a synchronized dual-track pedagogy. Fundamental concepts are taught first for council board theory (subjective answers and derivations), followed immediately by objective shortcut techniques, numerical drills, and negative-marking control for JEE and NEET. This prevents syllabus duplication and eliminates student burnout.',
    },
    {
      q: 'Why is the batch size strictly capped at 30 students?',
      a: 'In crowded coaching centers with 80–150 students, average and hesitant students get left behind. By capping each batch at 30 students, our faculty knows every student personally, identifies conceptual weak spots early, and provides individualized guidance.',
    },
    {
      q: 'What happens if a student has difficulty understanding a specific topic?',
      a: 'We provide dedicated 1-on-1 daily evening doubt desks with our subject mentors. Students can sit with faculty without hesitation until their doubts are 100% resolved. We also offer special concept recap sessions before major weekly tests.',
    },
    {
      q: 'Can parents monitor attendance, test marks, and academic progress?',
      a: 'Yes. Attendance is tracked every session, and weekly test scorecards (OMR analytics + subjective CHSE marks) are shared directly with parents. Periodic Parent-Teacher Mentorship Meetings are conducted to review performance and career roadmaps.',
    },
    {
      q: 'Are fee installment options and merit scholarships available?',
      a: 'Yes. We provide flexible installment payment plans to support parents. Furthermore, students scoring above 85% in their 10th board examinations or performing well in our Antariksh Talent Assessment Test are eligible for merit-based fee concessions.',
    },
  ];

  return (
    <div className="flex flex-col w-full font-body">
      
      {/* 1. TOP URGENT ANNOUNCEMENT TICKER (Business Conversion Driver) */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-2 px-4 border-b border-pink-500/30 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FC1682] text-white text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
              <Flame className="w-3 h-3" />
              Admissions Active 2026–27
            </span>
            <span className="text-slate-300 font-medium">
              Class 11 & 12 (+2 Science CHSE) | JEE & NEET Early-Bird Counseling This Sunday
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-slate-400 text-[11px] hidden md:inline">Limited 30 Seats/Batch</span>
            <a
              href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
              className="text-[#00C8FF] hover:text-white font-bold flex items-center gap-1 transition-colors text-xs"
            >
              <Phone className="w-3 h-3 text-[#FC1682]" />
              <span>{ACADEMY_CONFIG.contact.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE BUSINESS HERO & DIRECT LEAD GENERATION SECTION */}
      <section className="relative w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-slate-50 to-pink-50/25 text-slate-900 overflow-hidden border-b border-slate-200">
        {/* Ambient Subtle Gradients */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#FC1682]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#00C8FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Strategic Copy Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Institutional Authority Seal Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#FC1682] animate-ping"></span>
                <span className="font-cinzel text-xs font-bold text-[#BE125A] tracking-wider uppercase">
                  Antariksh Academy • Established 2017
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[11px] font-semibold text-slate-600">Berhampur, Odisha</span>
              </div>

              {/* Main Multi-Font Headline */}
              <div className="space-y-2">
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#0F172A]">
                  Empowering{' '}
                  <span className="font-serif-prestige italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#0284C7]">
                    +2 Science
                  </span>{' '}
                  <br className="hidden sm:inline" />
                  & Competitive Aspirants to Excel.
                </h1>
                <p className="font-serif-prestige italic text-base sm:text-lg text-slate-700 font-medium">
                  Where rigorous concept mastery meets disciplined mentorship.
                </p>
              </div>

              {/* Business Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Prepare for your Odisha CHSE Council Board examinations alongside national competitive entrance exams
                (JEE Main & Advanced, NEET-UG, NDA). With small 30-student batches, dedicated 1-on-1 daily faculty doubt desks,
                and personalized test analytics, we ensure zero student gets left behind.
              </p>

              {/* 3 Core Value Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 text-[#FC1682] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 font-display">Strictly 30/Batch</span>
                    <span className="text-[11px] text-slate-500">No mass crowds; 100% individual mentor focus.</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 font-display">Dual-Track Syllabus</span>
                    <span className="text-[11px] text-slate-500">Board subjective answers + MCQ speed drills.</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 font-display">10 Yrs Proven</span>
                    <span className="text-[11px] text-slate-500">1,200+ successful alumni across Odisha.</span>
                  </div>
                </div>
              </div>

              {/* Social Proof Trust Ticker */}
              <div className="flex flex-wrap items-center gap-4 pt-2 pb-1 border-t border-slate-200/80">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800 font-stat">4.9 / 5.0</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-600 font-medium">
                  Trusted by <strong>500+</strong> Families in Brahmapur
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-xs text-emerald-700 font-bold hidden sm:inline flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Board Pass Record
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/consultation"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-center font-display"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free 2-Day Trial & Counseling</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={ACADEMY_CONFIG.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl font-bold text-sm text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-emerald-500 shadow-xs transition-all flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Admissions Desk</span>
                </a>
              </div>

            </div>

            {/* Right Column: HIGH-CONVERSION EXECUTIVE ADMISSIONS WIDGET */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-white border-2 border-slate-200/90 p-5 sm:p-7 shadow-2xl overflow-hidden">
                {/* Visual Top Header Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FC1682] via-[#0284C7] to-[#FC1682]"></div>
                
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <span className="font-cinzel text-[11px] font-bold uppercase tracking-widest text-[#FC1682] block">
                      Direct Admissions Desk
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                      Reserve Seat / Request Call
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#BE125A] text-[10px] font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FC1682] animate-pulse"></span>
                    2026–27 Batches
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Speak directly with our Academic Director for syllabus guidance, batch timings, and merit scholarship evaluation within 15 minutes.
                </p>

                <form onSubmit={(e) => { void handleHeroLeadSubmit(e); }} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Student / Parent Name <span className="text-[#FC1682]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Patnaik"
                      value={heroName}
                      onChange={(e) => setHeroName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FC1682] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      10-Digit Mobile Number <span className="text-[#FC1682]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        placeholder="90901 60793"
                        value={heroPhone}
                        onChange={(e) => setHeroPhone(sanitizeMobileInput(e.target.value))}
                        className="w-full pl-11 pr-14 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FC1682] focus:border-transparent font-stat tracking-wider transition-all"
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-semibold text-slate-400 pointer-events-none font-stat">
                        {heroPhone.length}/10
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Current Class
                      </label>
                      <select
                        value={heroTargetClass}
                        onChange={(e) => setHeroTargetClass(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FC1682] transition-all"
                      >
                        <option value="+2 1st Year (Class 11)">+2 1st Year (Class 11)</option>
                        <option value="+2 2nd Year (Class 12)">+2 2nd Year (Class 12)</option>
                        <option value="Class 10 Moving to 11">Class 10 Moving to 11</option>
                        <option value="Dropper / Repeater Batch">Dropper / Repeater Batch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Target Exam
                      </label>
                      <select
                        value={heroCourse}
                        onChange={(e) => setHeroCourse(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FC1682] transition-all"
                      >
                        <option value="Integrated Board + Entrance">Integrated Board + Entrance</option>
                        <option value="JEE Main & JEE Advanced">JEE Main & JEE Advanced</option>
                        <option value="NEET-UG Medical">NEET-UG Medical</option>
                        <option value="+2 Science Board (CHSE)">+2 Science Board (CHSE)</option>
                        <option value="NDA Defence Academy">NDA Defence Academy</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isHeroSubmitting}
                    className="w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 font-display mt-2"
                  >
                    {isHeroSubmitting ? (
                      <span>Dispatching to Admissions Desk...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>Request Priority Admissions Callback</span>
                      </>
                    )}
                  </button>
                </form>

                {heroStatus && (
                  <div
                    className={`mt-3 p-3 rounded-xl text-xs text-center font-semibold flex items-center justify-center gap-2 ${
                      heroStatus.startsWith('SUCCESS')
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {heroStatus.startsWith('SUCCESS') ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{heroStatus}</span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Confidential
                  </span>
                  <span>Direct Counselor Call</span>
                  <span>Zero Spam</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. EXECUTIVE CREDENTIALS & METRICS STRIP (Corporate Authority) */}
      <section className="bg-[#0F172A] text-white py-10 sm:py-12 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 text-center">
            
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/40 transition-colors">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#FC1682] font-stat mb-1">
                10+
              </span>
              <span className="font-display text-xs sm:text-sm font-bold text-white block uppercase tracking-wider">
                Years of Excellence
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Est. 2017 in Berhampur</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#00C8FF] font-stat mb-1">
                99.4%ile
              </span>
              <span className="font-display text-xs sm:text-sm font-bold text-white block uppercase tracking-wider">
                Top JEE Percentile
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">IIT & NIT Selections</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-400 font-stat mb-1">
                678 / 720
              </span>
              <span className="font-display text-xs sm:text-sm font-bold text-white block uppercase tracking-wider">
                Top NEET-UG Score
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Govt Medical Colleges</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-colors">
              <span className="block text-3xl sm:text-4xl font-extrabold text-amber-400 font-stat mb-1">
                100%
              </span>
              <span className="font-display text-xs sm:text-sm font-bold text-white block uppercase tracking-wider">
                CHSE Board Pass Rate
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">10 Consecutive Years</span>
            </div>

            <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-colors">
              <span className="block text-3xl sm:text-4xl font-extrabold text-purple-400 font-stat mb-1">
                1,200+
              </span>
              <span className="font-display text-xs sm:text-sm font-bold text-white block uppercase tracking-wider">
                Alumni Impact
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Engineers, Doctors & Officers</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BUSINESS DECISION MATRIX: "ANTARIKSH ACADEMY VS ORDINARY COACHING" */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#FC1682] bg-pink-50 border border-pink-200 px-3.5 py-1 rounded-full">
              The Antariksh Business Advantage
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-3 mb-3">
              Why Discerning Parents & Students Choose Us
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Compare our structured, disciplined academic model with typical crowded coaching centers in Berhampur.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <thead>
                <tr className="bg-slate-900 text-white text-left text-xs sm:text-sm font-display">
                  <th className="py-4 px-5 sm:px-6 w-1/3">Key Academic Parameter</th>
                  <th className="py-4 px-5 sm:px-6 w-1/3 bg-[#FC1682] text-white font-extrabold">
                    ★ Antariksh Academy (Berhampur)
                  </th>
                  <th className="py-4 px-5 sm:px-6 w-1/3 bg-slate-800 text-slate-300">
                    Typical Tuitions / Mega Factories
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-slate-200">
                <tr className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-slate-900">
                    Classroom Batch Capacity
                  </td>
                  <td className="py-4 px-5 sm:px-6 font-semibold text-emerald-800 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Strictly capped at 30 students for guaranteed attention</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 text-slate-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>80 to 150+ crowded classrooms where students get lost</span>
                    </div>
                  </td>
                </tr>

                <tr className="bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-slate-900">
                    1-on-1 Daily Doubt Resolution
                  </td>
                  <td className="py-4 px-5 sm:px-6 font-semibold text-emerald-800 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Daily evening faculty desks; mentors stay until doubt is cleared</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 text-slate-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Zero personal doubt time; students must move on with doubts</span>
                    </div>
                  </td>
                </tr>

                <tr className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-slate-900">
                    Curriculum Architecture
                  </td>
                  <td className="py-4 px-5 sm:px-6 font-semibold text-emerald-800 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Harmonized Dual-Track: CHSE Council Theory + Objective Entrance</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 text-slate-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Misaligned; student must take separate tuitions causing burnout</span>
                    </div>
                  </td>
                </tr>

                <tr className="bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-slate-900">
                    Testing & Performance Analytics
                  </td>
                  <td className="py-4 px-5 sm:px-6 font-semibold text-emerald-800 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Weekly OMR + subjective board answer sheet correction & parent reports</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 text-slate-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Infrequent testing with delayed or no analytical feedback</span>
                    </div>
                  </td>
                </tr>

                <tr className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-slate-900">
                    Faculty Stability & Accountability
                  </td>
                  <td className="py-4 px-5 sm:px-6 font-semibold text-emerald-800 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Full-time senior mentors with 10+ years specialized teaching experience</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 text-slate-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Frequent teacher turnover and inexperienced guest tutors</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FC1682] hover:underline"
            >
              <span>Learn more about our 10-year institutional methodology →</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 5. TARGETED ACADEMIC PROGRAMS (Executive Program Grid) */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#BE125A] bg-pink-50 border border-pink-200 px-3.5 py-1 rounded-full">
                Curated Academic Pathways
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-3">
                Comprehensive Coaching Programs
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors shrink-0"
            >
              <span>Explore All Syllabi & Timings</span>
              <ArrowRight className="w-4 h-4 text-[#FC1682]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES_DATA.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group hover:border-[#FC1682]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-pink-50 text-[#BE125A] border border-pink-200 uppercase tracking-wider">
                      {course.badge}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-stat">
                      Batch: 30 Max
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-[#FC1682] transition-colors mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {course.shortDescription}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-3 mb-4">
                    {course.keyBenefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium">{course.batchType}</span>
                  </div>
                  <Link
                    to="/consultation"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#FC1682] hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>Check Batch Availability</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. 10-YEAR HALL OF FAME: VERIFIED RESULTS & ALUMNI SUCCESS */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#BE125A] text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-[#FC1682]" />
                <span className="font-cinzel">10 Years of Proven Success (2017–2026)</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Our Results Speak for Themselves.
              </h2>
            </div>

            <Link
              to="/results"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FC1682] hover:underline shrink-0"
            >
              <span>View Complete 10-Year Hall of Fame (50+ Records)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topResults.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group hover:border-[#FC1682]/70"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-stat">
                        Session {item.year}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-50 text-[#BE125A] border border-pink-200 font-cinzel">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-[#FC1682]/40 shrink-0">
                      <img src={item.photoUrl} alt={item.studentName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-sm font-bold text-slate-900 truncate">
                        {item.studentName}
                      </h4>
                      <div className="text-xs font-extrabold text-[#FC1682] font-stat">
                        {item.scoreOrRank}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {item.allotmentOrCollege}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-pink-50/50 border-l-2 border-[#FC1682] pl-2.5 py-1.5 rounded-r-lg line-clamp-2">
                    "{item.storyQuote}"
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium line-clamp-1">{item.achievementSummary}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. THREE-STEP ADMISSION ROADMAP (Eliminating Friction) */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#BE125A] bg-pink-50 border border-pink-200 px-3.5 py-1 rounded-full">
              Friction-Free Enrollment
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-3 mb-3">
              How Admission Works in 3 Simple Steps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We ensure every student and parent is completely confident in our faculty and methodology before formal enrollment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-[#FC1682] flex items-center justify-center font-stat font-extrabold text-xl mb-4">
                01
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                1. Free Concept & Target Counseling
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Meet our senior counselor (in-person or video call) to assess current academic baselines, career targets, and subject requirements.
              </p>
            </div>

            <div className="bg-white border-2 border-[#FC1682]/40 rounded-2xl p-6 sm:p-8 shadow-md relative">
              <div className="w-12 h-12 rounded-2xl bg-[#FC1682] text-white flex items-center justify-center font-stat font-extrabold text-xl mb-4">
                02
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                2. Attend 2-Day Trial Classes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sit inside our active classrooms. Experience our concept derivations, solve daily practice sheets, and interact directly with our mentors.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-[#0284C7] flex items-center justify-center font-stat font-extrabold text-xl mb-4">
                03
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                3. Secure Batch & Receive Study Kit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Confirm your capped 30-student batch slot, receive official curriculum booklets and DPP modules, and begin your guided journey to success.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FC1682] to-[#D9146C] hover:from-[#E00E70] shadow-md shadow-pink-500/20 transition-all font-display"
            >
              <span>Schedule Step 1: Free Counseling</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 8. PARENT & STUDENT VOICES (Institutional Social Proof) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#BE125A] bg-pink-50 border border-pink-200 px-3.5 py-1 rounded-full">
              Voices of Trust
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-3 mb-2">
              Endorsed by Families Across Brahmapur
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Real reflections on our disciplined atmosphere, mentor accessibility, and balanced preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-50 text-[#0284C7] border border-cyan-200 font-cinzel">
                      {item.authorType} Voice
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-4 font-serif-prestige">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-[#FC1682]/40 shrink-0">
                    <img src={item.avatarUrl} alt={item.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block font-display">{item.displayName}</span>
                    <span className="text-[11px] text-[#FC1682] font-semibold block">{item.subTitle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION (Overcoming Objections) */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#BE125A] bg-pink-50 border border-pink-200 px-3.5 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-3">
              Answers for Prospective Students & Parents
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-slate-900 hover:text-[#FC1682] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. HIGH-IMPACT CLOSING CONVERSION BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FC1682]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FC1682]/20 text-pink-300 text-xs font-bold uppercase tracking-wider border border-pink-500/30 font-cinzel">
            <Calendar className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Admissions Desk 2026–27</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Give Your Child the Advantage of{' '}
            <span className="font-serif-prestige italic text-transparent bg-clip-text bg-gradient-to-r from-[#FC1682] via-pink-400 to-[#00C8FF]">
              Disciplined Academic Mentorship.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Small batches fill up quickly. Schedule a free 30-minute consultation or visit our Bijipur Big Street campus today.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/consultation"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-lg shadow-pink-500/25 transition-all text-center font-display"
            >
              Book a Free Consultation
            </Link>

            <a
              href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-center font-display flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FC1682]" />
              <span>Call Admissions: {ACADEMY_CONFIG.contact.phoneDisplay}</span>
            </a>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Bijipur, Big Street, Brahmapur (PIN: 760001) • Office open 7:00 AM – 7:30 PM daily
          </p>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
