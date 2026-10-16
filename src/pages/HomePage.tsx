import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Flame,
  Award,
  Camera,
  Sparkles,
  Pause,
  Play,
  MapPin,
} from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';
import { RESULTS_DATA } from '../data/resultsData';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';
import { submitEnquiryToGmail } from '../services/formSubmission';
import { sanitizeMobileInput, getMobileValidationError } from '../utils/validation';
import { ACADEMY_CONFIG } from '../config/academyConfig';

export const HomePage: React.FC = () => {
  // Option B: Above-the-fold Parent Meeting or Callback Lead Form State
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

  // Auto-Swiping Campus & Classroom Photo Album State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // FAQ Accordion State - Default closed on mobile and desktop
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Curated Album Slides (Teachers, Classrooms, Mentorship, Testing & Facilities)
  const albumSlides = [
    {
      id: 'album-faculty',
      title: 'Our Dedicated Subject Teachers & Academic Mentors',
      category: 'Our Expert Teachers',
      tagline: '7 Senior Subject Mentors with 10+ Years Proven Teaching Legacy',
      description:
        'Official photograph from Antariksh Academy Berhampur representing the dedicated leadership and academic educators across Physics, Chemistry, Mathematics, and Biology.',
      imageUrl: '/images/academy_faculty_fb.jpg',
      badge: 'Official Academy Teachers',
      location: 'Bijipur Big Street Campus • Brahmapur',
      shortLabel: 'Our Teachers',
    },
    {
      id: 'album-classroom',
      title: 'Teacher-Led Interactive Board & Entrance Sessions',
      category: 'Student Classrooms',
      tagline: 'Strictly Capped 30-Student Batches for Uncompromised Individual Attention',
      description:
        'Engaged classroom atmosphere where theoretical concepts are derived step-by-step on the board, followed immediately by targeted entrance-level problem sets.',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      badge: 'Concept Derivations',
      location: 'Lecture Hall A • Air-Conditioned',
      shortLabel: 'Classrooms',
    },
    {
      id: 'album-dpp',
      title: 'Focused Student Problem-Solving & Daily Practice Drills',
      category: 'Student Practice',
      tagline: 'Building Speed, Derivation Stamina & Precision Every Day',
      description:
        'Students actively solving Daily Practice Problem (DPP) sheets with faculty walking the aisles to clear micro-stumbling blocks in real time.',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      badge: 'Daily DPP Hours',
      location: 'Focused Practice Arena',
      shortLabel: 'Student Drills',
    },
    {
      id: 'album-doubt',
      title: '1-on-1 Faculty Desks for Personal Doubt Clearance',
      category: 'Personal Mentorship',
      tagline: 'Zero Unanswered Doubts Before Heading Home',
      description:
        'Teachers stay on campus every evening so students can sit directly with them, ask hesitation-free questions, and master stubborn numerical topics.',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      badge: 'Evening Doubt Desks',
      location: 'Faculty Consultation Room',
      shortLabel: 'Doubt Desks',
    },
    {
      id: 'album-testing',
      title: 'Proctored Mock Test Hall & OMR Performance Drills',
      category: 'Assessment Arena',
      tagline: 'Simulating Actual CHSE Board & Entrance Exam Conditions',
      description:
        'Weekly invigilated test sessions mirroring the exact timing and negative marking constraints of CHSE, JEE Main, and NEET.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
      badge: 'Weekly Testing Hall',
      location: 'Simulated Examination Center',
      shortLabel: 'Mock Tests',
    },
    {
      id: 'album-library',
      title: 'Quiet Reference Library & Self-Study Pods',
      category: 'Campus Facilities',
      tagline: 'Distraction-Free Environment for High-Focus Study',
      description:
        'Peaceful self-study area stocked with NCERT textbooks, standard entrance reference compendiums, and previous 10 years solved papers.',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
      badge: 'Reference Library',
      location: 'Campus Reading Pods',
      shortLabel: 'Study Library',
    },
  ];

  // Auto-swipe timer: advances slide every 3.8s when not hovered/paused
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % albumSlides.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isCarouselPaused, albumSlides.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : albumSlides.length - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % albumSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsCarouselPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsCarouselPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNextSlide();
    } else if (diff < -45) {
      handlePrevSlide();
    }
    setTouchStartX(null);
  };

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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Top 4 results for preview
  const topResults = RESULTS_DATA.slice(0, 4);

  // Comparison Matrix Items
  const comparisonItems = [
    {
      parameter: 'Classroom Batch Capacity',
      antariksh: 'Strictly capped at 30 students for guaranteed personal faculty attention.',
      typical: '80 to 150+ crowded classrooms where students get lost in the noise.',
    },
    {
      parameter: '1-on-1 Daily Doubt Resolution',
      antariksh: 'Daily evening faculty desks; mentors stay until every doubt is resolved.',
      typical: 'Zero personal doubt time; students must move on with persistent doubts.',
    },
    {
      parameter: 'Curriculum & Syllabus Architecture',
      antariksh: 'Harmonized Dual-Track: CHSE Council Theory + Objective Entrance (JEE/NEET).',
      typical: 'Misaligned syllabus; students forced into multiple disjointed tuitions.',
    },
    {
      parameter: 'Testing & Performance Analytics',
      antariksh: 'Weekly OMR + subjective board answer sheet correction & parent reports.',
      typical: 'Infrequent testing with delayed or no diagnostic feedback for parents.',
    },
    {
      parameter: 'Faculty Stability & Accountability',
      antariksh: 'Full-time senior mentors with 10+ years specialized teaching experience.',
      typical: 'Frequent teacher turnover and inexperienced rotating guest tutors.',
    },
  ];

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
    <div className="flex flex-col w-full font-body overflow-x-hidden bg-[#111827] text-[#F3F4F6]">
      
      {/* 1. TOP URGENT ANNOUNCEMENT TICKER (Hidden on mobile to save vertical height) */}
      <div className="hidden sm:block bg-[#0E1420] text-[#D1D5DB] py-2 px-3 sm:px-4 border-b border-[#243042] text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F4C76B] text-[#0F172A] text-[10px] font-extrabold uppercase tracking-wider shrink-0">
              <Flame className="w-3 h-3 text-[#0F172A]" />
              Admissions 2026–27
            </span>
            <span className="text-[#AAB4C3] font-medium text-[11px] sm:text-xs">
              Class 11 & 12 (+2 Science CHSE) • JEE Main/Adv • NEET-UG • NDA
            </span>
          </div>
          <a
            href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
            className="text-[#38BDF8] hover:text-[#F4C76B] font-bold inline-flex items-center gap-1.5 transition-colors text-[11px] sm:text-xs"
          >
            <Phone className="w-3 h-3 text-[#F4C76B]" />
            <span>Call Admissions: {ACADEMY_CONFIG.contact.phoneDisplay}</span>
          </a>
        </div>
      </div>

      {/* 2. EXECUTIVE BUSINESS HERO & DUAL JOURNEY CTAS */}
      <section className="relative w-full py-4 sm:py-12 lg:py-16 bg-[#111827] text-[#F3F4F6] overflow-hidden border-b border-[#243042]">
        {/* Restrained Ambient Glows */}
        <div className="absolute top-0 left-1/3 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#F4C76B]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-5 sm:right-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#38BDF8]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Strategic Copy Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
              
              {/* Institutional Authority Seal Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#202B3D] border border-[#344054] shadow-xs max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#F4C76B] animate-ping shrink-0"></span>
                <span className="font-cinzel text-[10px] sm:text-xs font-bold text-[#F4C76B] tracking-wider uppercase truncate">
                  Antariksh Academy • Estd. 2017
                </span>
                <span className="text-[#344054]">|</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#AAB4C3] truncate">Bijipur, Brahmapur</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.16] text-[#F3F4F6]">
                  Empowering{' '}
                  <span className="font-serif-prestige italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F4C76B] via-[#FDE68A] to-[#38BDF8]">
                    +2 Science
                  </span>{' '}
                  <br className="hidden sm:inline" />
                  & Competitive Aspirants to Excel.
                </h1>
                <p className="font-serif-prestige italic text-xs sm:text-base text-[#D1D5DB] font-medium leading-snug">
                  Where rigorous concept mastery meets disciplined mentorship.
                </p>
              </div>

              {/* Business Description - Concise on mobile to eliminate vertical bloat */}
              <p className="text-[#AAB4C3] text-xs sm:text-base leading-relaxed max-w-2xl font-normal">
                Odisha CHSE Council Board preparation alongside national competitive exams (JEE Main & Adv, NEET-UG, NDA).
                Strict 30-student batch capacity, dedicated 1-on-1 daily faculty doubt desks, and 10 consecutive years of proven excellence in Brahmapur.
              </p>

              {/* Mobile-First: Dual Action Buttons Shown Immediately Above-The-Fold */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                {/* Primary Action: Explore Courses */}
                <a
                  href="#courses"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-[#0F172A] bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] hover:brightness-105 shadow-md shadow-amber-500/10 transition-all flex items-center justify-center gap-2 text-center font-display min-h-[44px] active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4 shrink-0 text-[#0F172A]" />
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#0F172A]" />
                </a>

                {/* Secondary Action: 30-min Google Meet Booking */}
                <Link
                  to="/consultation"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-[#F3F4F6] hover:text-white bg-[#202B3D] hover:bg-[#26334A] border border-[#344054] hover:border-[#F4C76B]/50 shadow-xs transition-all flex items-center justify-center gap-2 text-center font-display min-h-[44px] active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4 text-[#F4C76B] shrink-0" />
                  <span>Book Free Consultation</span>
                </Link>
              </div>

              {/* Compact Callback Link */}
              <div className="pt-0.5 flex items-center gap-1.5 text-xs text-[#AAB4C3] flex-wrap">
                <span>Prefer a phone conversation or campus visit?</span>
                <Link
                  to="/contact"
                  className="text-[#F4C76B] hover:text-[#FDE68A] font-bold transition-colors inline-flex items-center gap-0.5 underline underline-offset-2"
                >
                  <span>Request a Callback →</span>
                </Link>
              </div>

              {/* 3 Core Value Guarantees (Stacked cleanly below CTAs) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2">
                <div className="bg-[#202B3D] border border-[#344054] rounded-xl p-2.5 sm:p-3 shadow-xs flex items-center sm:items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F4C76B]/15 text-[#F4C76B] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-[#F4C76B]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F3F4F6] font-display">Strictly 30/Batch</span>
                    <span className="text-[11px] text-[#AAB4C3]">No mass crowds; 100% individual mentor focus.</span>
                  </div>
                </div>

                <div className="bg-[#202B3D] border border-[#344054] rounded-xl p-2.5 sm:p-3 shadow-xs flex items-center sm:items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F3F4F6] font-display">Dual-Track Syllabus</span>
                    <span className="text-[11px] text-[#AAB4C3]">Board subjective answers + MCQ speed drills.</span>
                  </div>
                </div>

                <div className="bg-[#202B3D] border border-[#344054] rounded-xl p-2.5 sm:p-3 shadow-xs flex items-center sm:items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#F3F4F6] font-display">10 Yrs Proven</span>
                    <span className="text-[11px] text-[#AAB4C3]">1,200+ successful alumni across Odisha.</span>
                  </div>
                </div>
              </div>

              {/* Social Proof Trust Ticker */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-1 sm:pt-2 pb-1 border-t border-[#344054]/70">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#F4C76B]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#F4C76B]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#F3F4F6] font-stat">4.9 / 5.0</span>
                </div>
                <span className="text-[#344054]">•</span>
                <span className="text-xs text-[#AAB4C3] font-medium">
                  Trusted by <strong className="text-[#F3F4F6]">500+</strong> Families in Brahmapur
                </span>
                <span className="text-[#344054] hidden sm:inline">•</span>
                <span className="text-xs text-emerald-400 font-bold hidden sm:inline flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Board Pass Record
                </span>
              </div>

            </div>

            {/* Right Column: OPTION B LEAD WIDGET ("Request a Parent Meeting or Callback") - Preserved side-by-side on desktop (hidden on mobile to prevent early form stacking) */}
            <div id="callback-widget" className="hidden lg:block lg:col-span-5 relative w-full">
              <div className="relative rounded-2xl sm:rounded-3xl bg-[#202B3D] border-2 border-[#344054] p-4 sm:p-7 shadow-2xl overflow-hidden">
                {/* Visual Top Header Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F4C76B] via-[#38BDF8] to-[#F4C76B]"></div>
                
                <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-[#344054]/70">
                  <div>
                    <span className="font-cinzel text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#F4C76B] block">
                      Direct Admissions Desk
                    </span>
                    <h3 className="font-display text-base sm:text-xl font-extrabold text-[#F3F4F6]">
                      Request a Parent Meeting or Callback
                    </h3>
                  </div>
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#172033] border border-[#344054] text-[#F4C76B] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shrink-0 flex items-center gap-1 font-stat">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4C76B] animate-pulse"></span>
                    2026–27 Batches
                  </span>
                </div>

                <p className="text-xs text-[#AAB4C3] leading-relaxed mb-3 sm:mb-4">
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
                  <div className="grid grid-cols-2 gap-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setHeroContactMethod('Phone callback')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                        heroContactMethod === 'Phone callback'
                          ? 'bg-[#172033] text-[#F4C76B] border-[#F4C76B]'
                          : 'bg-[#172033]/50 text-[#AAB4C3] border-[#344054] hover:text-[#F3F4F6]'
                      }`}
                    >
                      <Phone className="w-3 h-3" />
                      <span>Phone Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroContactMethod('Parents meeting at the academy')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                        heroContactMethod === 'Parents meeting at the academy'
                          ? 'bg-[#172033] text-[#F4C76B] border-[#F4C76B]'
                          : 'bg-[#172033]/50 text-[#AAB4C3] border-[#344054] hover:text-[#F3F4F6]'
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      <span>Meeting at Center</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#F3F4F6] uppercase tracking-wider mb-1 font-display">
                      Parent / Student Name <span className="text-[#F4C76B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Patnaik"
                      value={heroName}
                      onChange={(e) => setHeroName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#172033] border border-[#344054] text-base sm:text-sm text-[#F3F4F6] placeholder-[#8592A3] focus:border-[#F4C76B] focus:ring-1 focus:ring-[#F4C76B] focus:outline-none transition-all min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#F3F4F6] uppercase tracking-wider mb-1 font-display">
                      10-Digit Mobile Number <span className="text-[#F4C76B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs sm:text-sm font-bold text-[#8592A3]">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                        pattern="[0-9]*"
                        maxLength={10}
                        placeholder="90901 60793"
                        value={heroPhone}
                        onChange={(e) => setHeroPhone(sanitizeMobileInput(e.target.value))}
                        className="w-full pl-11 pr-14 py-2.5 rounded-xl bg-[#172033] border border-[#344054] text-base sm:text-sm text-[#F3F4F6] placeholder-[#8592A3] focus:border-[#F4C76B] focus:ring-1 focus:ring-[#F4C76B] focus:outline-none font-stat tracking-wider transition-all min-h-[44px]"
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-semibold text-[#8592A3] pointer-events-none font-stat">
                        {heroPhone.length}/10
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#F3F4F6] uppercase tracking-wider mb-1 font-display">
                        Current Class
                      </label>
                      <select
                        value={heroTargetClass}
                        onChange={(e) => setHeroTargetClass(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#172033] border border-[#344054] text-base sm:text-xs text-[#F3F4F6] focus:border-[#F4C76B] focus:outline-none transition-all min-h-[44px]"
                      >
                        <option value="+2 1st Year (Class 11)">+2 1st Year (Class 11)</option>
                        <option value="+2 2nd Year (Class 12)">+2 2nd Year (Class 12)</option>
                        <option value="Class 10 Moving to 11">Class 10 Moving to 11</option>
                        <option value="Dropper / Repeater Batch">Dropper / Repeater Batch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#F3F4F6] uppercase tracking-wider mb-1 font-display">
                        Target Exam
                      </label>
                      <select
                        value={heroCourse}
                        onChange={(e) => setHeroCourse(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#172033] border border-[#344054] text-base sm:text-xs text-[#F3F4F6] focus:border-[#F4C76B] focus:outline-none transition-all min-h-[44px]"
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
                    className="w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm text-[#0F172A] bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] hover:brightness-105 shadow-md shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 font-display mt-2 min-h-[48px] active:scale-[0.98]"
                  >
                    {isHeroSubmitting ? (
                      <span>Dispatching to Admissions Desk...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#0F172A] shrink-0" />
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
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {heroStatus.startsWith('SUCCESS') ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span>{heroStatus}</span>
                    </div>
                    {!heroStatus.startsWith('SUCCESS') && (
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <a
                          href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
                          className="px-2.5 py-1 rounded-lg bg-[#111827] text-[#F3F4F6] font-bold text-[11px] border border-[#344054] hover:bg-black transition-colors"
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
                <div className="mt-3.5 pt-3 border-t border-[#344054]/70 flex items-center justify-between text-[10px] sm:text-[11px] text-[#AAB4C3]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    100% Confidential
                  </span>
                  <Link
                    to="/consultation"
                    className="text-pink-400 hover:text-white font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <span>Need instant Google Meet? Book 1:1 Online Slot →</span>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. EXECUTIVE CREDENTIALS & METRICS STRIP */}
      <section className="bg-[#172033] text-[#F3F4F6] py-8 sm:py-12 border-b border-[#243042] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-6 text-center">
            
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#202B3D] border border-[#344054] hover:border-[#F4C76B]/40 transition-colors">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#F4C76B] font-stat mb-0.5 sm:mb-1">
                10+
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-[#F3F4F6] block uppercase tracking-wider">
                Years of Excellence
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#AAB4C3] mt-0.5 block">Est. 2017 in Berhampur</span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#202B3D] border border-[#344054] hover:border-[#38BDF8]/40 transition-colors">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#38BDF8] font-stat mb-0.5 sm:mb-1">
                99.4%ile
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-[#F3F4F6] block uppercase tracking-wider">
                Top JEE Percentile
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#AAB4C3] mt-0.5 block">IIT & NIT Selections</span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#202B3D] border border-[#344054] hover:border-emerald-500/40 transition-colors">
              <span className="block text-2xl sm:text-4xl font-extrabold text-emerald-400 font-stat mb-0.5 sm:mb-1">
                678 / 720
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-[#F3F4F6] block uppercase tracking-wider">
                Top NEET-UG Score
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#AAB4C3] mt-0.5 block">Govt Medical Colleges</span>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#202B3D] border border-[#344054] hover:border-[#F4C76B]/40 transition-colors">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#F4C76B] font-stat mb-0.5 sm:mb-1">
                100%
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-[#F3F4F6] block uppercase tracking-wider">
                CHSE Board Pass Rate
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#AAB4C3] mt-0.5 block">10 Consecutive Years</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#202B3D] border border-[#344054] hover:border-purple-400/40 transition-colors">
              <span className="block text-2xl sm:text-4xl font-extrabold text-purple-300 font-stat mb-0.5 sm:mb-1">
                1,200+
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-[#F3F4F6] block uppercase tracking-wider">
                Alumni Impact
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#AAB4C3] mt-0.5 block">Engineers, Doctors & Officers</span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. AUTO-SWIPING CAMPUS & CLASSROOM PHOTO ALBUM */}
      <section className="py-8 sm:py-16 bg-[#111827] text-[#F3F4F6] relative overflow-hidden border-b border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202B3D] border border-[#344054] text-[#F4C76B] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 font-cinzel">
                <Camera className="w-3.5 h-3.5 text-[#F4C76B]" />
                <span>Inside Antariksh Academy • Photo Album</span>
              </div>
              <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#F3F4F6] tracking-tight">
                Our Teachers, Classrooms & Campus Life
              </h2>
              <p className="text-[#AAB4C3] text-xs sm:text-sm mt-1 max-w-2xl">
                Experience the authentic teaching energy, disciplined small batches, and 1-on-1 mentorship at our Bijipur, Brahmapur center.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                className="px-3 py-1.5 rounded-lg bg-[#202B3D] hover:bg-[#263449] text-xs font-bold text-[#D1D5DB] flex items-center gap-1.5 border border-[#344054] transition-colors cursor-pointer"
                aria-label={isCarouselPaused ? 'Resume auto-swiping' : 'Pause auto-swiping'}
                title={isCarouselPaused ? 'Resume auto-swiping' : 'Pause auto-swiping'}
              >
                {isCarouselPaused ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Play</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-[#F4C76B]" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#202B3D] hover:bg-[#F4C76B] hover:text-[#0F172A] text-white flex items-center justify-center transition-all border border-[#344054] cursor-pointer active:scale-95"
                  aria-label="Previous photo slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#202B3D] hover:bg-[#F4C76B] hover:text-[#0F172A] text-white flex items-center justify-center transition-all border border-[#344054] cursor-pointer active:scale-95"
                  aria-label="Next photo slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cinematic Carousel Stage with Responsive Height */}
          <div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0B0F19] border-2 border-[#344054] shadow-2xl h-[290px] sm:h-[400px] lg:h-[480px] group select-none"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {albumSlides.map((slide, idx) => {
              const isCurrent = idx === activeSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Photo Background */}
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover transform duration-1000 ease-out group-hover:scale-105"
                  />

                  {/* Dark Vignette & Readability Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/65 to-[#0B0F19]/25"></div>

                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between z-20">
                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#111827]/90 backdrop-blur-md border border-[#F4C76B]/40 text-[#F4C76B] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <Sparkles className="w-3 h-3 text-[#F4C76B]" />
                      <span>{slide.category}</span>
                    </span>

                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#111827]/90 backdrop-blur-md border border-[#344054] text-[#D1D5DB] font-stat text-[10px] sm:text-xs font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#38BDF8]" />
                      <span className="hidden sm:inline">{slide.location}</span>
                      <span className="sm:hidden">{slide.badge}</span>
                    </span>
                  </div>

                  {/* Bottom Captions & Content */}
                  <div className="absolute bottom-13 sm:bottom-16 left-3 sm:left-8 right-3 sm:right-8 z-20 space-y-1.5 sm:space-y-2.5 text-left">
                    <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded bg-[#F4C76B] text-[#0F172A] text-[9.5px] sm:text-[11px] font-extrabold uppercase tracking-wider font-stat">
                      {slide.badge}
                    </span>

                    <h3 className="font-display text-base sm:text-2xl lg:text-3xl font-black text-white leading-tight max-w-3xl drop-shadow-md">
                      {slide.title}
                    </h3>

                    <p className="font-serif-prestige italic text-[11px] sm:text-sm text-[#FDE68A] font-medium max-w-2xl hidden sm:block">
                      {slide.tagline}
                    </p>

                    <p className="text-[#D1D5DB] text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-2">
                      {slide.description}
                    </p>
                  </div>

                </div>
              );
            })}

            {/* Bottom Progress Bar & Direct Slide Switcher */}
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-t border-[#344054] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
                {albumSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlide(idx)}
                    className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      activeSlide === idx
                        ? 'bg-[#F4C76B] text-[#0F172A] shadow-md font-extrabold'
                        : 'bg-[#202B3D] text-[#AAB4C3] hover:text-[#F3F4F6] hover:bg-[#263449]'
                    }`}
                  >
                    <span>{idx + 1}. {slide.shortLabel}</span>
                  </button>
                ))}
              </div>

              <div className="text-right shrink-0">
                <span className="font-stat text-xs sm:text-sm font-extrabold text-[#F4C76B]">
                  0{activeSlide + 1}
                </span>
                <span className="text-[#64748B] text-xs font-stat"> / 0{albumSlides.length}</span>
              </div>
            </div>

            {/* Floating Left/Right Arrows on Desktop */}
            <button
              type="button"
              onClick={handlePrevSlide}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#111827]/80 hover:bg-[#F4C76B] hover:text-[#0F172A] text-white items-center justify-center backdrop-blur-md border border-[#344054] transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xl"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNextSlide}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#111827]/80 hover:bg-[#F4C76B] hover:text-[#0F172A] text-white items-center justify-center backdrop-blur-md border border-[#344054] transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xl"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Quick Action Navigation Links below the Carousel */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-400 text-center sm:text-left">
              <span>Swipe or use arrows to view campus classrooms & facilities</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                to="/faculty"
                className="font-bold text-[#F4C76B] hover:text-[#FDE68A] flex items-center gap-1 transition-colors"
              >
                <span>Meet Our Teachers & Mentors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[#344054]">•</span>
              <Link
                to="/facilities"
                className="font-bold text-[#38BDF8] hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>View Campus & Classrooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BUSINESS DECISION MATRIX: "ANTARIKSH ACADEMY VS ORDINARY COACHING" */}
      <section className="py-12 sm:py-20 bg-[#172033] border-b border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#F4C76B] bg-[#202B3D] border border-[#344054] px-3.5 py-1 rounded-full">
              The Antariksh Business Advantage
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F3F4F6] tracking-tight mt-3 mb-2 sm:mb-3">
              Why Discerning Parents & Students Choose Us
            </h2>
            <p className="text-[#AAB4C3] text-xs sm:text-base leading-relaxed">
              Compare our structured, disciplined academic model with typical crowded coaching centers in Berhampur.
            </p>
          </div>

          {/* A. MOBILE-NATIVE COMPARISON CARD STACK (< md) */}
          <div className="md:hidden space-y-3.5">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="bg-[#202B3D] border border-[#344054] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#344054]/70">
                  <span className="w-5 h-5 rounded-full bg-[#172033] text-[#F4C76B] flex items-center justify-center text-[11px] font-stat font-extrabold shrink-0 border border-[#344054]">
                    {idx + 1}
                  </span>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#F3F4F6] leading-snug">
                    {item.parameter}
                  </h4>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[#172033] border border-emerald-500/40 text-xs text-[#F3F4F6] flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-[#0F172A] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#0F172A]" />
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400 block text-[10px] uppercase tracking-wider font-cinzel">
                        ★ Antariksh Academy
                      </span>
                      <span className="font-medium text-[#D1D5DB] leading-relaxed block mt-0.5">
                        {item.antariksh}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#111827] border border-[#344054] text-xs text-[#AAB4C3] flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-bold text-[#8592A3] block text-[10px] uppercase tracking-wider">
                        Typical Tuitions / Mega Centers
                      </span>
                      <span className="text-[#8592A3] leading-relaxed block mt-0.5">
                        {item.typical}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* B. DESKTOP / TABLET COMPARISON TABLE (>= md) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-[#344054] shadow-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0B0F19] text-white text-left text-xs sm:text-sm font-display">
                  <th className="py-4 px-5 sm:px-6 w-1/3 text-[#F3F4F6]">Key Academic Parameter</th>
                  <th className="py-4 px-5 sm:px-6 w-1/3 bg-[#202B3D] text-[#F4C76B] font-extrabold border-b-2 border-[#F4C76B]">
                    ★ Antariksh Academy (Berhampur)
                  </th>
                  <th className="py-4 px-5 sm:px-6 w-1/3 bg-[#111827] text-[#8592A3]">
                    Typical Tuitions / Mega Factories
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-[#344054]/60">
                {comparisonItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-[#202B3D]/90' : 'bg-[#172033]/90'}
                  >
                    <td className="py-4 px-5 sm:px-6 font-bold text-[#F3F4F6]">
                      {item.parameter}
                    </td>
                    <td className="py-4 px-5 sm:px-6 font-semibold text-emerald-300 bg-emerald-950/20">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item.antariksh}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-[#8592A3]">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{item.typical}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#F4C76B] hover:underline"
            >
              <span>Learn more about our 10-year institutional methodology →</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 6. TARGETED ACADEMIC PROGRAMS */}
      <section id="courses" className="py-8 sm:py-16 bg-[#111827] border-b border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
            <div>
              <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#F4C76B] bg-[#202B3D] border border-[#344054] px-3.5 py-1 rounded-full">
                Curated Academic Pathways
              </span>
              <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#F3F4F6] tracking-tight mt-2.5">
                Comprehensive Coaching Programs
              </h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#F3F4F6] bg-[#202B3D] hover:bg-[#26334A] border border-[#344054] hover:border-[#F4C76B]/50 transition-colors shrink-0"
            >
              <span>Explore All Course Syllabus & Batches</span>
              <ArrowRight className="w-4 h-4 text-[#F4C76B]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {COURSES_DATA.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="bg-[#202B3D] border border-[#344054] rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:border-[#F4C76B]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#172033] text-[#F4C76B] border border-[#F4C76B]/30 uppercase tracking-wider">
                      {course.badge}
                    </span>
                    <span className="text-[10px] font-bold text-[#AAB4C3] font-stat shrink-0">
                      Batch: 30 Max
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-[#F4C76B] transition-colors mb-1.5">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#AAB4C3] leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3">
                    {course.shortDescription}
                  </p>

                  <div className="space-y-1.5 border-t border-[#344054]/70 pt-2.5 mb-3">
                    {course.keyBenefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-200 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#344054]/70 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-[#AAB4C3]">
                    <span className="font-medium">{course.batchType}</span>
                  </div>
                  <Link
                    to="/consultation"
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] text-[#0F172A] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all text-center min-h-[42px] shadow-sm"
                  >
                    <span>Meet on Google Meet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6.5 DEDICATED PARENT MEETING OR CALLBACK DISCOVERY BANNER (Placed right after Course Discovery) */}
      <section className="py-6 sm:py-10 bg-[#172033] border-b border-[#243042]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#202B3D] border border-[#344054] rounded-2xl p-5 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F4C76B] block">
                Direct Admissions & Faculty Desks
              </span>
              <h3 className="font-display text-base sm:text-xl font-bold text-[#F3F4F6]">
                Prefer a Phone Conversation or In-Person Center Visit?
              </h3>
              <p className="text-xs sm:text-sm text-[#AAB4C3] max-w-xl">
                Would you prefer a phone callback or a face-to-face meeting with our academic team at our Bijipur, Brahmapur center? Share your details and our team will follow up.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
              <Link
                to="/contact"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] text-[#0F172A] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[#0F172A]" />
                <span>Request Callback / Parent Meeting</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 10-YEAR HALL OF FAME: VERIFIED RESULTS & ALUMNI SUCCESS */}
      <section className="py-12 sm:py-20 bg-[#172033] border-b border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#202B3D] border border-[#344054] text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-[#F4C76B]" />
                <span className="font-cinzel">10 Years of Proven Success (2017–2026)</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F3F4F6] tracking-tight">
                Our Results Speak for Themselves.
              </h2>
            </div>

            <Link
              to="/results"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F4C76B] hover:underline shrink-0"
            >
              <span>View Complete 10-Year Hall of Fame (50+ Records)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {topResults.map((item) => (
              <div
                key={item.id}
                className="bg-[#202B3D] border border-[#344054] rounded-2xl p-4 sm:p-5 shadow-sm hover:border-[#F4C76B]/40 transition-all flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#172033] text-white border border-[#344054] font-stat">
                        Session {item.year}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-700/50 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#172033] text-[#F4C76B] border border-[#F4C76B]/30 font-cinzel">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#172033] border-2 border-[#F4C76B]/40 shrink-0 shadow-sm">
                      <img src={item.photoUrl} alt={item.studentName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-sm font-bold text-white break-words">
                        {item.studentName}
                      </h4>
                      <div className="text-xs font-extrabold text-[#F4C76B] font-stat break-words">
                        {item.scoreOrRank}
                      </div>
                      <div className="text-[10px] text-slate-300 break-words leading-tight mt-0.5">
                        {item.allotmentOrCollege}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-200 italic bg-[#172033] border-l-2 border-[#F4C76B] pl-3 pr-2 py-2.5 rounded-r-lg break-words leading-relaxed mb-3">
                    "{item.storyQuote}"
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-[#344054]/70 text-[11px] text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium break-words leading-snug">{item.achievementSummary}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. THREE-STEP ADMISSION ROADMAP */}
      <section className="py-8 sm:py-16 bg-[#111827] border-b border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#F4C76B] bg-[#202B3D] border border-[#344054] px-3.5 py-1 rounded-full">
              Friction-Free Enrollment
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F3F4F6] tracking-tight mt-3 mb-2 sm:mb-3">
              How Admission Works in 3 Simple Steps
            </h2>
            <p className="text-[#AAB4C3] text-xs sm:text-base leading-relaxed">
              We ensure every student and parent is completely confident in our faculty and methodology before formal enrollment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 relative">
            <div className="bg-[#202B3D] border border-[#344054] rounded-2xl p-5 sm:p-8 shadow-sm relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#172033] border border-[#344054] text-[#F4C76B] flex items-center justify-center font-stat font-extrabold text-lg sm:text-xl mb-3 sm:mb-4">
                01
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">
                1. Book Free Consultation (Google Meet)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Choose a 30-minute online slot (Google Meet) to assess baseline marks, target ranks, and syllabus roadmap.
              </p>
            </div>

            <div className="bg-[#141824] border-2 border-pink-500/50 rounded-2xl p-5 sm:p-8 shadow-md relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FC1682] to-[#E11D74] text-white flex items-center justify-center font-stat font-extrabold text-lg sm:text-xl mb-3 sm:mb-4 shadow-sm shadow-pink-600/30">
                02
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">
                2. Attend 2-Day Trial Classes
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sit inside our active classrooms. Experience our concept derivations, solve daily practice sheets, and interact directly with our mentors.
              </p>
            </div>

            <div className="bg-[#141824] border border-pink-500/25 rounded-2xl p-5 sm:p-8 shadow-sm relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0D1017] border border-pink-500/30 text-[#38BDF8] flex items-center justify-center font-stat font-extrabold text-lg sm:text-xl mb-3 sm:mb-4">
                03
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">
                3. Secure Batch Slot & Begin
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Confirm your capped 30-student batch slot, receive official curriculum booklets and DPP modules, and begin your guided journey.
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] hover:from-[#FF2D92] hover:to-[#FC1682] shadow-lg shadow-pink-600/30 border border-pink-400/40 transition-all font-display min-h-[46px]"
            >
              <span>Schedule Step 1: Free Consultation (Google Meet)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 9. PARENT & STUDENT VOICES */}
      <section className="py-12 sm:py-20 bg-[#172033] border-b border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#F4C76B] bg-[#202B3D] border border-[#344054] px-3.5 py-1 rounded-full">
              Voices of Trust
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F3F4F6] tracking-tight mt-3 mb-2">
              Endorsed by Families Across Brahmapur
            </h2>
            <p className="text-[#AAB4C3] text-xs sm:text-base">
              Real reflections on our disciplined atmosphere, mentor accessibility, and balanced preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-[#202B3D] border border-[#344054] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#F4C76B]">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#F4C76B]" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#172033] text-[#38BDF8] border border-[#344054] font-cinzel">
                      {item.authorType} Voice
                    </span>
                  </div>

                  <p className="text-[#D1D5DB] text-xs sm:text-sm leading-relaxed italic mb-4 font-serif-prestige">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#344054]/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#172033] border-2 border-[#F4C76B]/40 shrink-0">
                    <img src={item.avatarUrl} alt={item.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F3F4F6] block font-display">{item.displayName}</span>
                    <span className="text-[11px] text-[#F4C76B] font-semibold block">{item.subTitle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. INTERACTIVE FAQ ACCORDION */}
      <section className="py-12 sm:py-20 bg-[#111827] border-b border-[#243042]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8 sm:mb-10">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#F4C76B] bg-[#202B3D] border border-[#344054] px-3.5 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold text-[#F3F4F6] tracking-tight mt-3">
              Answers for Prospective Students & Parents
            </h2>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#202B3D] border border-[#344054] rounded-xl sm:rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-3.5 sm:py-4 px-4 sm:px-6 text-left flex items-center justify-between gap-3 font-display font-bold text-xs sm:text-base text-[#F3F4F6] hover:text-[#F4C76B] transition-colors cursor-pointer min-h-[48px]"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <span className="w-6 h-6 rounded-full bg-[#172033] border border-[#344054] flex items-center justify-center shrink-0 text-[#AAB4C3]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-[#AAB4C3] leading-relaxed border-t border-[#344054]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. HIGH-IMPACT CLOSING CONVERSION BANNER */}
      <section className="py-8 sm:py-16 bg-gradient-to-r from-[#111827] via-[#172033] to-[#111827] text-[#F3F4F6] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#202B3D] text-[#F4C76B] text-xs font-bold uppercase tracking-wider border border-[#344054] font-cinzel">
            <Calendar className="w-3.5 h-3.5 text-[#F4C76B]" />
            <span>Admissions Desk 2026–27</span>
          </div>

          <h2 className="font-display text-xl sm:text-4xl lg:text-5xl font-black text-[#F3F4F6] tracking-tight leading-tight">
            Give Your Child the Advantage of{' '}
            <span className="font-serif-prestige italic text-transparent bg-clip-text bg-gradient-to-r from-[#F4C76B] via-[#FDE68A] to-[#38BDF8]">
              Disciplined Academic Mentorship.
            </span>
          </h2>

          <p className="text-[#AAB4C3] text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            Small batches fill up quickly. Choose an available slot online or request a callback / parents meeting today.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            {/* Option A */}
            <Link
              to="/consultation"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-extrabold text-xs sm:text-base text-[#0F172A] bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] hover:brightness-105 shadow-md shadow-amber-500/10 transition-all text-center font-display min-h-[46px] flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#0F172A]" />
              <span>Book Free Consultation (Google Meet)</span>
            </Link>

            {/* Option B */}
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-xl font-bold text-xs sm:text-base text-[#F3F4F6] hover:text-white bg-[#202B3D] hover:bg-[#26334A] border border-[#344054] hover:border-[#F4C76B]/40 transition-colors text-center font-display flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Phone className="w-4 h-4 text-[#38BDF8]" />
              <span>Request Parent Meeting / Callback</span>
            </Link>
          </div>

          <p className="text-[11px] sm:text-xs text-[#8592A3] pt-2">
            Bijipur, Big Street, Brahmapur (PIN: 760001) • Office open 7:00 AM – 7:30 PM daily
          </p>
        </div>
      </section>

      {/* 12. MOBILE FLOATING QUICK-CONNECT WHATSAPP BUTTON (Compact Circular FAB) */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <a
          href={ACADEMY_CONFIG.contact.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Admissions on WhatsApp"
          className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all border border-emerald-400/50"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>
      </div>

    </div>
  );
};

export default HomePage;
