import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
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
import { SpecularCard } from '../components/common/SpecularCard';
import { MagneticButton } from '../components/common/MagneticButton';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect hash #courses to the dedicated /courses page immediately
  useEffect(() => {
    if (location.hash === '#courses') {
      navigate('/courses', { replace: true });
    }
  }, [location.hash, navigate]);

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
    <div className="flex flex-col w-full font-body overflow-x-hidden bg-[#FAF6F0] dark:bg-[#0D0905] text-[#150F0A] dark:text-[#FFEDD7]">
      
      {/* 1. TOP URGENT ANNOUNCEMENT TICKER (Hidden on mobile to save vertical height) */}
      <div className="hidden sm:block bg-[#F3EDE2] dark:bg-[#140E08] text-stone-700 dark:text-[#D4C3AF] py-2 px-3 sm:px-4 border-b border-stone-200/90 dark:border-[#FFEDD7]/10 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-900 dark:bg-[#F4C76B] dark:text-[#0F172A] text-[10px] font-extrabold uppercase tracking-wider shrink-0 font-stat">
              <Flame className="w-3 h-3 text-stone-900 dark:text-[#0F172A]" />
              Admissions 2026–27
            </span>
            <span className="text-stone-600 dark:text-[#AAB4C3] font-medium text-[11px] sm:text-xs">
              Class 11 & 12 (+2 Science CHSE) • JEE Main/Adv • NEET-UG • OUAT & ICAR
            </span>
          </div>
          <a
            href={`tel:${ACADEMY_CONFIG.contact.phoneRaw}`}
            className="text-amber-800 dark:text-[#F4C76B] hover:underline font-bold inline-flex items-center gap-1.5 transition-colors text-[11px] sm:text-xs font-mono-tech"
          >
            <Phone className="w-3 h-3 text-amber-700 dark:text-[#F4C76B]" />
            <span>Call Admissions: {ACADEMY_CONFIG.contact.phoneDisplay}</span>
          </a>
        </div>
      </div>

      {/* 2. EXECUTIVE BUSINESS HERO & ORYZO/LUSION INTERACTIVE STAGE */}
      <section className="relative w-full py-4 sm:py-8 lg:py-10 bg-[#FAF6F0] dark:bg-[#0D0905] text-[#150F0A] dark:text-[#FFEDD7] overflow-hidden border-b border-stone-200/90 dark:border-[#FFEDD7]/10 oryzo-blueprint-grid">
        {/* Oryzo Technical Header Metadata Strip */}
        <div className="w-full border-b border-stone-200/80 dark:border-[#FFEDD7]/10 py-1.5 sm:py-2.5 px-3 sm:px-6 lg:px-8 mb-3 sm:mb-6 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono-tech tracking-wider text-stone-500 dark:text-[#9E8D7B] overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 shrink min-w-0 truncate">
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-[#F4C76B] font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              ESTD. 2017 • BRAHMAPUR
            </span>
            <span className="text-stone-300 dark:text-stone-700 hidden sm:inline">•</span>
            <span className="hidden sm:inline">LAT 19.3149° N, LONG 84.7941° E</span>
            <span className="text-stone-300 dark:text-stone-700 hidden md:inline">•</span>
            <span className="hidden md:inline">CHSE ODISHA • JEE MAIN/ADV • NEET-UG</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-5 font-bold shrink-0">
            <span className="hidden xs:inline">CAPACITY: 30 / BATCH</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[9px] sm:text-[11px] whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 shrink-0" /> 100% BOARD PASS
            </span>
          </div>
        </div>

        {/* Giant Architectural Watermark */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="font-oryzo-brand font-black text-[17vw] tracking-[-0.05em] leading-none text-stone-900/[0.035] dark:text-[#FFEDD7]/[0.045] whitespace-nowrap uppercase">
            ANTARIKSH
          </span>
        </div>

        {/* Sticky Model/Session Ribbon Label on Right Viewport (Oryzo-1 Style) */}
        <div className="hidden 2xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 origin-top-right rotate-90 translate-x-full items-center gap-2 px-3 py-1.5 bg-[#150F0A] dark:bg-[#FFEDD7] text-[#FFEDD7] dark:text-[#150F0A] rounded-b-md text-[10px] font-mono-tech tracking-[0.2em] uppercase shadow-xl border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>SESSION 2026–27 ADMISSIONS OPEN</span>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 w-full overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Strategic Copy Column (7 cols) - Pure Architectural Editorial Rigor */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
              
              {/* Institutional Authority Seal Badge - 100% Responsive */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/90 dark:bg-[#18120B]/90 backdrop-blur-md border border-stone-200/90 dark:border-[#FFEDD7]/15 shadow-xs max-w-full overflow-hidden">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                <span className="font-cinzel text-[9px] sm:text-xs font-bold text-amber-700 dark:text-[#F4C76B] tracking-wider uppercase whitespace-nowrap shrink-0">
                  Antariksh Academy
                </span>
                <span className="text-stone-300 dark:text-stone-700 shrink-0">|</span>
                <span className="font-mono-tech text-[9px] sm:text-[11px] text-stone-500 dark:text-[#9E8D7B] truncate">
                  Bijipur, Brahmapur
                </span>
              </div>

              {/* Main Headline with High-End Architectural Ink-Trapped Grotesk & Editorial Italic */}
              <div className="space-y-2 sm:space-y-3">
                <h1 className="luxury-editorial-heading text-[2.15rem] xs:text-4xl sm:text-6xl lg:text-[4.2rem] font-black text-[#150F0A] dark:text-[#FFEDD7] leading-[1.05] tracking-tight break-words">
                  Designed for Rigor.{' '}
                  <br />
                  Built for{' '}
                  <span className="font-serif-luxury italic font-normal text-amber-600 dark:text-[#F4C76B] text-[1.12em] tracking-normal inline-block pr-1">
                    Rankers.
                  </span>
                </h1>
                <p className="font-serif-literata text-xs sm:text-base lg:text-lg text-stone-600 dark:text-[#D4C3AF] leading-relaxed max-w-2xl">
                  Brahmapur’s premier academic institute where disciplined 30-student cohorts master deep CHSE council derivations alongside speed-accurate JEE & NEET entrance drills under full-time senior faculty.
                </p>
              </div>

              {/* Architectural Technical Specifications Matrix (Oryzo Blueprint Precision) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
                <div className="border border-stone-200/90 dark:border-[#FFEDD7]/15 rounded-xl p-2.5 sm:p-3 bg-white/70 dark:bg-[#18120B]/70 backdrop-blur-md">
                  <span className="font-mono-tech text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-500 dark:text-[#9E8D7B] block truncate">
                    COHORT DENSITY
                  </span>
                  <span className="font-display text-base sm:text-lg font-black text-[#150F0A] dark:text-[#FFEDD7] block">
                    30 Max
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-stone-600 dark:text-[#B8A795] block truncate">
                    Strict batch cap
                  </span>
                </div>
                <div className="border border-stone-200/90 dark:border-[#FFEDD7]/15 rounded-xl p-2.5 sm:p-3 bg-white/70 dark:bg-[#18120B]/70 backdrop-blur-md">
                  <span className="font-mono-tech text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-500 dark:text-[#9E8D7B] block truncate">
                    COUNCIL RECORD
                  </span>
                  <span className="font-display text-base sm:text-lg font-black text-[#150F0A] dark:text-[#FFEDD7] block">
                    100%
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-stone-600 dark:text-[#B8A795] block truncate">
                    First class pass
                  </span>
                </div>
                <div className="border border-stone-200/90 dark:border-[#FFEDD7]/15 rounded-xl p-2.5 sm:p-3 bg-white/70 dark:bg-[#18120B]/70 backdrop-blur-md">
                  <span className="font-mono-tech text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-500 dark:text-[#9E8D7B] block truncate">
                    DOUBT SESSIONS
                  </span>
                  <span className="font-display text-base sm:text-lg font-black text-[#150F0A] dark:text-[#FFEDD7] block">
                    1-on-1
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-stone-600 dark:text-[#B8A795] block truncate">
                    Daily evening desk
                  </span>
                </div>
                <div className="border border-stone-200/90 dark:border-[#FFEDD7]/15 rounded-xl p-2.5 sm:p-3 bg-white/70 dark:bg-[#18120B]/70 backdrop-blur-md">
                  <span className="font-mono-tech text-[8px] sm:text-[9px] uppercase tracking-wider text-stone-500 dark:text-[#9E8D7B] block truncate">
                    TOP ENTRANCE
                  </span>
                  <span className="font-display text-base sm:text-lg font-black text-[#150F0A] dark:text-[#FFEDD7] block">
                    685 / 720
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-stone-600 dark:text-[#B8A795] block truncate">
                    NEET • 99.2%ile JEE
                  </span>
                </div>
              </div>

              {/* Dual Action Buttons with Apple-Style Magnetic Physics */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Primary Action: Explore Courses */}
                <Link to="/courses" className="inline-block flex-1 sm:flex-initial">
                  <MagneticButton className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#17365D] to-[#102A43] hover:from-[#102A43] hover:to-[#0A1D30] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-lg shadow-[#17365D]/15 dark:shadow-[#F4C76B]/15 hover:brightness-105 transition-all flex items-center justify-center gap-2 text-center font-display min-h-[46px]">
                    <BookOpen className="w-4 h-4 shrink-0 text-white dark:text-[#0F172A]" />
                    <span>Explore Academic Programs</span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-white dark:text-[#0F172A]" />
                  </MagneticButton>
                </Link>

                {/* Secondary Action: Consultation Booking */}
                <a href="#callback-widget" className="inline-block flex-1 sm:flex-initial">
                  <MagneticButton className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-xs text-[#17365D] dark:text-[#FFEDD7] hover:text-[#102A43] dark:hover:text-white bg-white/90 dark:bg-[#1C140C]/90 hover:bg-slate-50 dark:hover:bg-[#241A10] border border-stone-300 dark:border-[#FFEDD7]/20 hover:border-amber-500 shadow-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 text-center font-display min-h-[46px]">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-[#F4C76B] shrink-0" />
                    <span>Request Parent Consultation</span>
                  </MagneticButton>
                </a>
              </div>

              {/* Social Proof Trust Ticker */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-dashed border-stone-300 dark:border-[#FFEDD7]/15">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#C65D1E] dark:fill-[#F4C76B]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#150F0A] dark:text-[#FFEDD7] font-stat">4.9 / 5.0 Rating</span>
                </div>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-xs text-stone-600 dark:text-[#D4C3AF] font-medium">
                  500+ Families Enrolled
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-xs text-stone-600 dark:text-[#D4C3AF] font-medium">
                  10+ Yrs Specialized Pedagogy
                </span>
              </div>

            </div>

            {/* Right Column: Direct Admissions Desk Widget with Apple Specular Glass (5 cols) */}
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
                  <div className="grid grid-cols-2 gap-2 pb-1">
                    <button
                      type="button"
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
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs sm:text-sm font-bold text-slate-400 dark:text-[#8592A3]">
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
                        className="w-full pl-11 pr-14 py-2.5 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-300 dark:border-[#344054] text-base sm:text-sm text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#8592A3] focus:border-[#17365D] dark:focus:border-[#F4C76B] focus:ring-1 focus:ring-[#17365D] dark:focus:ring-[#F4C76B] focus:outline-none font-stat tracking-wider transition-all min-h-[44px]"
                      />
                      <span className="absolute right-3 top-3 text-[10px] font-semibold text-slate-400 dark:text-[#8592A3] pointer-events-none font-stat">
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

          </div>

          {/* Oryzo Technical Ruler & Radar Scroll Indicator */}
          <div className="mt-8 sm:mt-12 pt-4 border-t border-dashed border-stone-300 dark:border-[#FFEDD7]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 dark:text-[#9E8D7B]">
            <div className="font-mono-tech text-[10px] tracking-[0.3em] hidden md:block select-none text-stone-500 dark:text-stone-400" aria-hidden="true">
              00 &nbsp; 10 &nbsp; 20 &nbsp; 30 &nbsp; 40 &nbsp; 50 &nbsp; 60 &nbsp; 70 &nbsp; 80 &nbsp; 90 &nbsp; 100 &nbsp; 110 &nbsp; 120
            </div>
            <div className="flex items-center gap-2 font-mono-tech text-[10px] sm:text-[11px] uppercase tracking-widest text-stone-700 dark:text-[#FFEDD7]">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-500 animate-spin border-dashed shrink-0" aria-hidden="true" />
              <span>Scroll to explore curriculum & archive ↓</span>
            </div>
            <div className="font-mono-tech text-[10px] tracking-wider hidden sm:block text-stone-500 dark:text-stone-400" aria-hidden="true">
              ANTARIKSH.EDU // ESTD.2017
            </div>
          </div>

        </div>
      </section>

      {/* 3. EXECUTIVE CREDENTIALS & METRICS STRIP (ORYZO HARDWARE SPECULARITY) */}
      <section className="bg-[#F3EDE2]/80 dark:bg-[#140E08]/80 backdrop-blur-md text-[#150F0A] dark:text-[#FFEDD7] py-6 sm:py-10 border-b border-stone-200/90 dark:border-[#FFEDD7]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 text-center">
            
            <SpecularCard glowColor="gold" tilt={true} className="p-3.5 sm:p-5 text-center">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#C65D1E] dark:text-[#F4C76B] font-stat mb-0.5 sm:mb-1">
                10+
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wider">
                Years of Excellence
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-0.5 block">ESTD. 2017 BRAHMAPUR</span>
            </SpecularCard>

            <SpecularCard glowColor="blue" tilt={true} className="p-3.5 sm:p-5 text-center">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#0284C7] dark:text-[#38BDF8] font-stat mb-0.5 sm:mb-1">
                99.4%ile
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wider">
                Top JEE Percentile
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-0.5 block">IIT & NIT SELECTIONS</span>
            </SpecularCard>

            <SpecularCard glowColor="emerald" tilt={true} className="p-3.5 sm:p-5 text-center">
              <span className="block text-2xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-stat mb-0.5 sm:mb-1">
                678 / 720
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wider">
                Top NEET-UG Score
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-0.5 block">GOVT MEDICAL ALLOTMENTS</span>
            </SpecularCard>

            <SpecularCard glowColor="gold" tilt={true} className="p-3.5 sm:p-5 text-center">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#C65D1E] dark:text-[#F4C76B] font-stat mb-0.5 sm:mb-1">
                100%
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wider">
                CHSE Board Pass Rate
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-0.5 block">10 CONSECUTIVE YEARS</span>
            </SpecularCard>

            <SpecularCard glowColor="blue" tilt={true} className="col-span-2 sm:col-span-1 p-3.5 sm:p-5 text-center">
              <span className="block text-2xl sm:text-4xl font-extrabold text-amber-600 dark:text-[#FDE68A] font-stat mb-0.5 sm:mb-1">
                1,200+
              </span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wider">
                Alumni Impact
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-0.5 block">ENGINEERS & DOCTORS</span>
            </SpecularCard>

          </div>
        </div>
      </section>

      {/* 4. AUTO-SWIPING CAMPUS & CLASSROOM PHOTO ALBUM */}
      <section className="py-8 sm:py-16 bg-[#F8FAFC] dark:bg-[#111827] text-slate-800 dark:text-[#F3F4F6] relative overflow-hidden border-b border-slate-200 dark:border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] text-[#854D0E] dark:text-[#F4C76B] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 font-cinzel shadow-xs">
                <Camera className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#F4C76B]" />
                <span>Inside Antariksh Academy • Photo Album</span>
              </div>
              <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#172033] dark:text-[#F3F4F6] tracking-tight">
                Our Teachers, Classrooms & Campus Life
              </h2>
              <p className="text-slate-600 dark:text-[#AAB4C3] text-xs sm:text-sm mt-1 max-w-2xl">
                Experience the authentic teaching energy, disciplined small batches, and 1-on-1 mentorship at our Bijipur, Brahmapur center.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setIsCarouselPaused(!isCarouselPaused)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-[#202B3D] dark:hover:bg-[#263449] text-xs font-bold text-slate-700 dark:text-[#D1D5DB] flex items-center gap-1.5 border border-slate-200 dark:border-[#344054] transition-colors cursor-pointer shadow-xs"
                aria-label={isCarouselPaused ? 'Resume auto-swiping' : 'Pause auto-swiping'}
                title={isCarouselPaused ? 'Resume auto-swiping' : 'Pause auto-swiping'}
              >
                {isCarouselPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Play</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-700 dark:text-[#F4C76B]" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white hover:bg-[#17365D] hover:text-white dark:bg-[#202B3D] dark:hover:bg-[#F4C76B] dark:hover:text-[#0F172A] text-slate-700 dark:text-white flex items-center justify-center transition-all border border-slate-200 dark:border-[#344054] cursor-pointer active:scale-95 shadow-xs"
                  aria-label="Previous photo slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white hover:bg-[#17365D] hover:text-white dark:bg-[#202B3D] dark:hover:bg-[#F4C76B] dark:hover:text-[#0F172A] text-slate-700 dark:text-white flex items-center justify-center transition-all border border-slate-200 dark:border-[#344054] cursor-pointer active:scale-95 shadow-xs"
                  aria-label="Next photo slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cinematic Carousel Stage with Responsive Height */}
          <div
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0B0F19] border-2 border-slate-300 dark:border-[#344054] shadow-xl dark:shadow-2xl h-[320px] sm:h-[400px] lg:h-[480px] group select-none"
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
                    width="1200"
                    height="480"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
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
                  <div className="absolute bottom-12 sm:bottom-16 left-3 sm:left-8 right-3 sm:right-8 z-20 space-y-1 sm:space-y-2.5 text-left">
                    <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded bg-[#F4C76B] text-[#0F172A] text-[9.5px] sm:text-[11px] font-extrabold uppercase tracking-wider font-stat">
                      {slide.badge}
                    </span>

                    <h3 className="font-display text-sm sm:text-2xl lg:text-3xl font-black text-white leading-tight max-w-3xl drop-shadow-md">
                      {slide.title}
                    </h3>

                    <p className="font-serif-prestige italic text-[11px] sm:text-sm text-[#FDE68A] font-medium max-w-2xl hidden sm:block">
                      {slide.tagline}
                    </p>

                    <p className="text-[#D1D5DB] text-[11px] sm:text-sm leading-snug sm:leading-relaxed max-w-2xl line-clamp-2">
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
                    aria-label={`Go to slide ${idx + 1}: ${slide.shortLabel}`}
                    className={`min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
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
            <div className="text-slate-500 dark:text-slate-400 text-center sm:text-left">
              <span>Swipe or use arrows to view campus classrooms & facilities</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                to="/faculty"
                className="font-bold text-[#17365D] hover:text-[#102A43] dark:text-[#F4C76B] dark:hover:text-[#FDE68A] flex items-center gap-1 transition-colors"
              >
                <span>Meet Our Teachers & Mentors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-300 dark:text-[#344054]">•</span>
              <Link
                to="/facilities"
                className="font-bold text-[#0284C7] hover:text-[#0369A1] dark:text-[#38BDF8] dark:hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>View Campus & Classrooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4.5 ARCHITECTURAL PEDAGOGY SPECIFICATIONS (Boxy Gradient Blueprint Bridge) */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#FAF6F0] via-[#F3EDE2]/70 to-[#FAF6F0] dark:from-[#0D0905] dark:via-[#140E08]/80 dark:to-[#0D0905] border-b border-stone-200/90 dark:border-[#FFEDD7]/10 oryzo-blueprint-grid relative overflow-hidden">
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-amber-500/10 via-sky-500/5 to-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Tag with Oryzo Telemetry */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-dashed border-stone-300 dark:border-[#FFEDD7]/15">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
              <h2 className="font-mono-tech text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800 dark:text-[#F4C76B]">
                ACADEMIC ARCHITECTURE // 4 CORE RIGOR SPECIFICATIONS
              </h2>
            </div>
            <div className="font-mono-tech text-[10px] text-stone-500 dark:text-[#9E8D7B] tracking-wider hidden sm:block">
              DISCIPLINED BATCH EXECUTION • BIJIPUR CAMPUS
            </div>
          </div>

          {/* 4 Boxy Blueprint Gradient Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Box 1: Council Blackboard Derivations */}
            <div className="group relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-500/[0.08] via-white/80 to-white/40 dark:from-amber-500/[0.12] dark:via-[#18120B]/90 dark:to-[#18120B]/60 backdrop-blur-md border border-amber-500/30 dark:border-amber-500/30 shadow-sm hover:shadow-md hover:border-amber-500/60 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-tech text-[9px] uppercase tracking-wider text-amber-700 dark:text-[#F4C76B] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  SPEC // 01
                </span>
                <span className="text-xs font-mono-tech font-bold text-amber-700 dark:text-[#F4C76B]">CHSE COUNCIL</span>
              </div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-stone-900 dark:text-[#FFEDD7] mb-1 group-hover:text-amber-700 dark:group-hover:text-[#F4C76B] transition-colors">
                Blackboard Derivations
              </h3>
              <p className="font-serif-literata text-xs text-stone-600 dark:text-[#D4C3AF] leading-relaxed mb-3">
                Live step-by-step mathematical proofs and theory worked out on blackboards—checking every notebook rather than rushing digital slides.
              </p>
              <div className="pt-2 border-t border-dashed border-stone-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono-tech text-stone-500 dark:text-[#9E8D7B]">
                <span>100% Subjective Depth</span>
                <span className="text-amber-700 dark:text-[#F4C76B] font-bold">First Class</span>
              </div>
            </div>

            {/* Box 2: Daily DPP Speed Drills */}
            <div className="group relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-sky-500/[0.08] via-white/80 to-white/40 dark:from-sky-500/[0.12] dark:via-[#18120B]/90 dark:to-[#18120B]/60 backdrop-blur-md border border-sky-500/30 dark:border-sky-500/30 shadow-sm hover:shadow-md hover:border-sky-500/60 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-tech text-[9px] uppercase tracking-wider text-sky-700 dark:text-[#38BDF8] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                  SPEC // 02
                </span>
                <span className="text-xs font-mono-tech font-bold text-sky-700 dark:text-[#38BDF8]">SPEED & ACCURACY</span>
              </div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-stone-900 dark:text-[#FFEDD7] mb-1 group-hover:text-sky-700 dark:group-hover:text-[#38BDF8] transition-colors">
                Daily DPP Practice Drills
              </h3>
              <p className="font-serif-literata text-xs text-stone-600 dark:text-[#D4C3AF] leading-relaxed mb-3">
                30 targeted problem sets every session with negative-marking audits and shortcut drills to build entrance examination stamina.
              </p>
              <div className="pt-2 border-t border-dashed border-stone-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono-tech text-stone-500 dark:text-[#9E8D7B]">
                <span>Negative Marking Control</span>
                <span className="text-sky-700 dark:text-[#38BDF8] font-bold">JEE & NEET</span>
              </div>
            </div>

            {/* Box 3: 1-on-1 Evening Doubt Desks */}
            <div className="group relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-emerald-500/[0.08] via-white/80 to-white/40 dark:from-emerald-500/[0.12] dark:via-[#18120B]/90 dark:to-[#18120B]/60 backdrop-blur-md border border-emerald-500/30 dark:border-emerald-500/30 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-tech text-[9px] uppercase tracking-wider text-emerald-700 dark:text-[#34D399] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  SPEC // 03
                </span>
                <span className="text-xs font-mono-tech font-bold text-emerald-700 dark:text-[#34D399]">1-ON-1 DESKS</span>
              </div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-stone-900 dark:text-[#FFEDD7] mb-1 group-hover:text-emerald-700 dark:group-hover:text-[#34D399] transition-colors">
                Personalized Doubt Desks
              </h3>
              <p className="font-serif-literata text-xs text-stone-600 dark:text-[#D4C3AF] leading-relaxed mb-3">
                Faculty stay on campus until evening. Students sit directly across from teachers to clear stumbling blocks before heading home.
              </p>
              <div className="pt-2 border-t border-dashed border-stone-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono-tech text-stone-500 dark:text-[#9E8D7B]">
                <span>Zero Unresolved Doubts</span>
                <span className="text-emerald-700 dark:text-[#34D399] font-bold">Daily 7:00 PM</span>
              </div>
            </div>

            {/* Box 4: Synchronized Dual-Track Curriculum */}
            <div className="group relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-600/[0.08] via-white/80 to-white/40 dark:from-amber-600/[0.12] dark:via-[#18120B]/90 dark:to-[#18120B]/60 backdrop-blur-md border border-amber-600/30 dark:border-amber-600/30 shadow-sm hover:shadow-md hover:border-amber-600/60 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-tech text-[9px] uppercase tracking-wider text-amber-800 dark:text-[#F4C76B] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  SPEC // 04
                </span>
                <span className="text-xs font-mono-tech font-bold text-amber-800 dark:text-[#F4C76B]">DUAL TRACK</span>
              </div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-stone-900 dark:text-[#FFEDD7] mb-1 group-hover:text-amber-800 dark:group-hover:text-[#F4C76B] transition-colors">
                Synchronized Curriculum
              </h3>
              <p className="font-serif-literata text-xs text-stone-600 dark:text-[#D4C3AF] leading-relaxed mb-3">
                Council theory and competitive entrance questions taught concurrently in unified chapters—eliminating disjointed multi-coaching fatigue.
              </p>
              <div className="pt-2 border-t border-dashed border-stone-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono-tech text-stone-500 dark:text-[#9E8D7B]">
                <span>No Duplicate Tuitions</span>
                <span className="text-amber-800 dark:text-[#F4C76B] font-bold">Zero Burnout</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. BUSINESS DECISION MATRIX: "ANTARIKSH ACADEMY VS ORDINARY COACHING" */}
      <section className="py-12 sm:py-20 bg-[#FAF6F0]/90 dark:bg-[#0D0905]/90 text-[#150F0A] dark:text-[#FFEDD7] border-b border-stone-200/90 dark:border-[#FFEDD7]/10 oryzo-blueprint-grid">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-[#F4C76B] bg-white/90 dark:bg-[#18120B]/90 border border-stone-200/90 dark:border-[#FFEDD7]/15 px-3.5 py-1 rounded-full shadow-xs">
              The Antariksh Business Advantage
            </span>
            <h2 className="luxury-editorial-heading text-2xl xs:text-3xl sm:text-4xl font-black text-[#150F0A] dark:text-[#FFEDD7] tracking-tight mt-3 mb-2 sm:mb-3 break-words">
              Why Discerning Parents & Students{' '}
              <span className="font-serif-luxury italic font-normal text-amber-600 dark:text-[#F4C76B]">
                Choose Us
              </span>
            </h2>
            <p className="font-serif-literata text-slate-600 dark:text-[#D4C3AF] text-xs sm:text-base leading-relaxed">
              Compare our structured, disciplined academic model with typical crowded coaching centers in Berhampur.
            </p>
          </div>

          {/* A. MOBILE-NATIVE COMPARISON CARD STACK (< md) */}
          <div className="md:hidden space-y-3.5">
            {comparisonItems.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-[#344054]/70">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#172033] text-[#17365D] dark:text-[#F4C76B] flex items-center justify-center text-[11px] font-stat font-extrabold shrink-0 border border-slate-200 dark:border-[#344054]">
                    {idx + 1}
                  </span>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-[#F3F4F6] leading-snug">
                    {item.parameter}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-[#172033] border border-emerald-300 dark:border-emerald-500/40 text-xs text-slate-800 dark:text-[#F3F4F6] flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-[#0F172A] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white dark:text-[#0F172A]" />
                    </div>
                    <div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[10px] uppercase tracking-wider font-cinzel">
                        ★ Antariksh Academy
                      </span>
                      <span className="font-medium text-slate-700 dark:text-[#D1D5DB] leading-relaxed block mt-0.5">
                        {item.antariksh}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#344054] text-xs text-slate-600 dark:text-[#AAB4C3] flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 dark:text-[#8592A3] block text-[10px] uppercase tracking-wider">
                        Typical Tuitions / Mega Centers
                      </span>
                      <span className="text-slate-500 dark:text-[#8592A3] leading-relaxed block mt-0.5">
                        {item.typical}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* B. DESKTOP / TABLET COMPARISON TABLE (>= md) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 dark:border-[#344054] shadow-md dark:shadow-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#17365D] dark:bg-[#0B0F19] text-white text-left text-xs sm:text-sm font-display">
                  <th className="py-4 px-5 sm:px-6 w-1/3 text-white dark:text-[#F3F4F6]">Key Academic Parameter</th>
                  <th className="py-4 px-5 sm:px-6 w-1/3 bg-[#102A43] dark:bg-[#202B3D] text-amber-300 dark:text-[#F4C76B] font-extrabold border-b-2 border-amber-400 dark:border-[#F4C76B]">
                    ★ Antariksh Academy (Berhampur)
                  </th>
                  <th className="py-4 px-5 sm:px-6 w-1/3 bg-[#17365D]/90 dark:bg-[#111827] text-slate-200 dark:text-[#8592A3]">
                    Typical Tuitions / Mega Factories
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-slate-200 dark:divide-[#344054]/60">
                {comparisonItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white dark:bg-[#202B3D]/90' : 'bg-slate-50 dark:bg-[#172033]/90'}
                  >
                    <td className="py-4 px-5 sm:px-6 font-bold text-slate-900 dark:text-[#F3F4F6]">
                      {item.parameter}
                    </td>
                    <td className="py-4 px-5 sm:px-6 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{item.antariksh}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-slate-500 dark:text-[#8592A3]">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
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
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#17365D] hover:text-[#102A43] dark:text-[#F4C76B] hover:underline"
            >
              <span>Learn more about our 10-year institutional methodology →</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 6. TARGETED ACADEMIC PROGRAMS */}
      <section id="courses" className="py-6 sm:py-16 bg-[#F8FAFC] dark:bg-[#111827] border-b border-slate-200 dark:border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Streamlined Teaser Card (< md) - Eliminates Home Page Bloat & Directs to Dedicated /courses Page */}
          <div className="md:hidden bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#344054] rounded-2xl p-5 text-center space-y-3 shadow-xs">
            <span className="font-cinzel text-[10px] font-bold uppercase tracking-widest text-[#854D0E] dark:text-[#F4C76B] bg-amber-50 dark:bg-[#202B3D] border border-amber-200 dark:border-[#344054] px-3 py-1 rounded-full inline-block">
              Curated Academic Pathways
            </span>
            <h2 className="font-display text-lg font-bold text-[#172033] dark:text-white">
              Targeted Science & Entrance Programs
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#AAB4C3] leading-relaxed">
              Odisha CHSE +2 Science, JEE Main/Adv, NEET-UG, OUAT & ICAR batches with dedicated daily doubt desks and 30-student batch capacity.
            </p>
            <Link
              to="/courses"
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-white dark:text-[#0F172A]" />
              <span>Explore All Courses on Dedicated Page</span>
              <ArrowRight className="w-4 h-4 text-white dark:text-[#0F172A]" />
            </Link>
          </div>

          {/* Desktop Full Course Discovery Grid (>= md) */}
          <div className="hidden md:block">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-3 sm:gap-4">
              <div>
                <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#854D0E] dark:text-[#F4C76B] bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] px-3.5 py-1 rounded-full shadow-xs">
                  Curated Academic Pathways
                </span>
                <h2 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#172033] dark:text-[#F3F4F6] tracking-tight mt-2.5">
                  Comprehensive Coaching Programs
                </h2>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-[#F3F4F6] bg-white dark:bg-[#202B3D] hover:bg-slate-50 dark:hover:bg-[#26334A] border border-slate-300 dark:border-[#344054] hover:border-[#17365D] dark:hover:border-[#F4C76B]/50 transition-colors shrink-0 shadow-xs"
              >
                <span>Explore All Course Syllabus & Batches</span>
                <ArrowRight className="w-4 h-4 text-[#854D0E] dark:text-[#F4C76B]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {COURSES_DATA.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-lg hover:border-[#17365D] dark:hover:border-[#F4C76B]/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-[#172033] text-[#854D0E] dark:text-[#F4C76B] border border-amber-200 dark:border-[#F4C76B]/30 uppercase tracking-wider">
                        {course.badge}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-[#AAB4C3] font-stat shrink-0">
                        Batch: 30 Max
                      </span>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0284C7] dark:group-hover:text-[#F4C76B] transition-colors mb-1.5">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-[#AAB4C3] leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3">
                      {course.shortDescription}
                    </p>

                    <div className="space-y-1.5 border-t border-slate-100 dark:border-[#344054]/70 pt-2.5 mb-3">
                      {course.keyBenefits.slice(0, 2).map((benefit, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-200 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#344054]/70 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#AAB4C3]">
                      <span className="font-medium">{course.batchType}</span>
                    </div>
                    <Link
                      to="/consultation"
                      className="w-full py-2.5 px-3 rounded-xl bg-[#17365D] hover:bg-[#102A43] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all text-center min-h-[42px] shadow-sm"
                    >
                      <span>Meet on Google Meet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6.5 DEDICATED PARENT MEETING OR CALLBACK DISCOVERY BANNER (Placed right after Course Discovery) */}
      <section className="py-6 sm:py-10 bg-[#F1F5F9] dark:bg-[#172033] border-b border-slate-200 dark:border-[#243042]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-5 sm:p-7 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#854D0E] dark:text-[#F4C76B] block">
                Direct Admissions & Faculty Desks
              </span>
              <h3 className="font-display text-base sm:text-xl font-bold text-[#172033] dark:text-[#F3F4F6]">
                Prefer a Phone Conversation or In-Person Center Visit?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] max-w-xl">
                Would you prefer a phone callback or a face-to-face meeting with our academic team at our Bijipur, Brahmapur center? Share your details and our team will follow up.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
              <Link
                to="/contact"
                className="px-5 py-3 rounded-xl bg-[#17365D] hover:bg-[#102A43] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-white dark:text-[#0F172A]" />
                <span>Request Callback / Parent Meeting</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 10-YEAR HALL OF FAME: VERIFIED RESULTS & ALUMNI SUCCESS */}
      <section className="py-12 sm:py-20 bg-[#FAF6F0] dark:bg-[#140E08] border-b border-stone-200/90 dark:border-[#FFEDD7]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-[#1C140C] border border-stone-200 dark:border-[#FFEDD7]/15 text-amber-700 dark:text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-[#F4C76B]" />
                <span className="font-cinzel">10 Years of Proven Success (2017–2026)</span>
              </div>
              <h2 className="luxury-editorial-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-[#FFEDD7] tracking-tight">
                A Decade of Proven{' '}
                <span className="font-serif-luxury italic font-normal text-amber-600 dark:text-[#F4C76B] text-[1.12em]">
                  Academic Excellence
                </span>
              </h2>
            </div>

            <Link
              to="/results"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-800 hover:text-stone-950 dark:text-[#F4C76B] dark:hover:text-[#FDE68A] hover:underline shrink-0"
            >
              <span>View Complete 10-Year Hall of Fame (50+ Records)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {topResults.map((item) => (
              <SpecularCard
                key={item.id}
                glowColor="gold"
                tilt={true}
                className="p-4 sm:p-5 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-[#140E08] text-stone-800 dark:text-[#FFEDD7] border border-stone-200 dark:border-[#FFEDD7]/15 font-stat">
                        Session {item.year}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-700/50 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 dark:bg-[#140E08] text-amber-700 dark:text-[#F4C76B] border border-amber-200 dark:border-[#F4C76B]/30 font-cinzel">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 dark:bg-[#140E08] border-2 border-amber-400 dark:border-[#F4C76B]/40 shrink-0 shadow-sm flex items-center justify-center p-1">
                      <img
                        src={item.photoUrl || '/logo_transparent.png'}
                        alt={`${item.studentName} Emblem`}
                        width="48"
                        height="48"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = '/logo_transparent.png';
                        }}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-sm font-bold text-stone-900 dark:text-[#FFEDD7] break-words">
                        {item.studentName}
                      </h3>
                      <div className="text-xs font-extrabold text-amber-700 dark:text-[#F4C76B] font-stat break-words">
                        {item.scoreOrRank}
                      </div>
                      <div className="text-[10px] text-stone-600 dark:text-stone-300 break-words leading-tight mt-0.5">
                        {item.allotmentOrCollege}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-stone-700 dark:text-stone-200 italic bg-stone-50 dark:bg-[#140E08] border-l-2 border-amber-600 dark:border-[#F4C76B] pl-3 pr-2 py-2.5 rounded-r-lg break-words leading-relaxed mb-3 font-serif-literata">
                    "{item.storyQuote}"
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-stone-200 dark:border-[#FFEDD7]/15 text-[11px] text-stone-600 dark:text-stone-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium break-words leading-snug">{item.achievementSummary}</span>
                </div>
              </SpecularCard>
            ))}
          </div>

        </div>
      </section>

      {/* 8. THREE-STEP ADMISSION ROADMAP */}
      <section className="py-8 sm:py-16 bg-[#F1F5F9] dark:bg-[#111827] border-b border-slate-200 dark:border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#854D0E] dark:text-[#F4C76B] bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] px-3.5 py-1 rounded-full shadow-xs">
              Friction-Free Enrollment
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#172033] dark:text-[#F3F4F6] tracking-tight mt-3 mb-2 sm:mb-3">
              How Admission Works in 3 Simple Steps
            </h2>
            <p className="text-slate-600 dark:text-[#AAB4C3] text-xs sm:text-base leading-relaxed">
              We ensure every student and parent is completely confident in our faculty and methodology before formal enrollment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 relative">
            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-5 sm:p-8 shadow-xs relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#17365D] dark:text-[#F4C76B] flex items-center justify-center font-stat font-extrabold text-lg sm:text-xl mb-3 sm:mb-4">
                01
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
                1. Book Free Consultation (Google Meet)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Choose a 30-minute online slot (Google Meet) to assess baseline marks, target ranks, and syllabus roadmap.
              </p>
            </div>

            <div className="bg-white dark:bg-[#202B3D] border-2 border-[#17365D]/30 dark:border-[#F4C76B]/50 rounded-2xl p-5 sm:p-8 shadow-md relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#17365D] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:to-[#D4A33B] dark:text-[#0F172A] flex items-center justify-center font-stat font-extrabold text-lg sm:text-xl mb-3 sm:mb-4 shadow-sm shadow-slate-900/20">
                02
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
                2. Attend 2-Day Trial Classes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Sit inside our active classrooms. Experience our concept derivations, solve daily practice sheets, and interact directly with our mentors.
              </p>
            </div>

            <div className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-5 sm:p-8 shadow-xs relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#17365D] dark:text-[#38BDF8] flex items-center justify-center font-stat font-extrabold text-lg sm:text-xl mb-3 sm:mb-4">
                03
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
                3. Secure Batch Slot & Begin
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Confirm your capped 30-student batch slot, receive official curriculum booklets and DPP modules, and begin your guided journey.
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-md transition-all font-display min-h-[46px]"
            >
              <span>Schedule Step 1: Free Consultation (Google Meet)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 9. PARENT & STUDENT VOICES */}
      <section className="py-12 sm:py-20 bg-[#F8FAFC] dark:bg-[#172033] border-b border-slate-200 dark:border-[#243042]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#854D0E] dark:text-[#F4C76B] bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] px-3.5 py-1 rounded-full shadow-xs">
              Voices of Trust
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#172033] dark:text-[#F3F4F6] tracking-tight mt-3 mb-2">
              Endorsed by Families Across Brahmapur
            </h2>
            <p className="text-slate-600 dark:text-[#AAB4C3] text-xs sm:text-base">
              Real reflections on our disciplined atmosphere, mentor accessibility, and balanced preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#854D0E] dark:text-[#F4C76B]">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C6922E] dark:fill-[#F4C76B]" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-[#172033] text-[#0284C7] dark:text-[#38BDF8] border border-slate-200 dark:border-[#344054] font-cinzel">
                      {item.authorType} Voice
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-[#D1D5DB] text-xs sm:text-sm leading-relaxed italic mb-4 font-serif-prestige">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#344054]/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-500/10 border-2 border-amber-400 dark:border-[#F4C76B]/40 shrink-0 flex items-center justify-center font-display font-extrabold text-amber-700 dark:text-[#F4C76B] text-xs">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.displayName}
                        width="40"
                        height="40"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{item.displayName.split(' ').map((n) => n[0]).slice(0, 2).join('')}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] block font-display">{item.displayName}</span>
                    <span className="text-[11px] text-[#854D0E] dark:text-[#F4C76B] font-semibold block">{item.subTitle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. INTERACTIVE FAQ ACCORDION */}
      <section className="py-12 sm:py-20 bg-[#F1F5F9] dark:bg-[#111827] border-b border-slate-200 dark:border-[#243042]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8 sm:mb-10">
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#854D0E] dark:text-[#F4C76B] bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] px-3.5 py-1 rounded-full shadow-xs">
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold text-[#172033] dark:text-[#F3F4F6] tracking-tight mt-3">
              Answers for Prospective Students & Parents
            </h2>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl sm:rounded-2xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full py-3.5 sm:py-4 px-4 sm:px-6 text-left flex items-center justify-between gap-3 font-display font-bold text-xs sm:text-base text-slate-900 hover:text-[#17365D] dark:text-[#F3F4F6] dark:hover:text-[#F4C76B] transition-colors cursor-pointer min-h-[48px]"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] flex items-center justify-center shrink-0 text-slate-500 dark:text-[#AAB4C3]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="px-4 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] leading-relaxed border-t border-slate-100 dark:border-[#344054]/60"
                    >
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
      <section className="py-8 sm:py-16 bg-gradient-to-b from-[#F1F5F9] via-[#E2E8F0] to-[#F1F5F9] dark:bg-gradient-to-r dark:from-[#111827] dark:via-[#172033] dark:to-[#111827] text-slate-800 dark:text-[#F3F4F6] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#202B3D] text-[#854D0E] dark:text-[#F4C76B] text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-[#344054] font-cinzel shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#854D0E] dark:text-[#F4C76B]" />
            <span>Admissions Desk 2026–27</span>
          </div>

          <h2 className="font-display text-xl sm:text-4xl lg:text-5xl font-black text-[#172033] dark:text-[#F3F4F6] tracking-tight leading-tight">
            Give Your Child the Advantage of{' '}
            <span className="font-serif-prestige italic text-transparent bg-clip-text bg-gradient-to-r from-[#17365D] via-[#C6922E] to-[#0284C7] dark:from-[#F4C76B] dark:via-[#FDE68A] dark:to-[#38BDF8]">
              Disciplined Academic Mentorship.
            </span>
          </h2>

          <p className="text-slate-600 dark:text-[#AAB4C3] text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            Small batches fill up quickly. Choose an available slot online or request a callback / parents meeting today.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            {/* Option A */}
            <Link
              to="/consultation"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-extrabold text-xs sm:text-base text-white bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] hover:brightness-105 shadow-md shadow-slate-900/10 dark:shadow-amber-500/10 transition-all text-center font-display min-h-[46px] flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-white dark:text-[#0F172A]" />
              <span>Book Free Consultation (Google Meet)</span>
            </Link>

            {/* Option B */}
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-xl font-bold text-xs sm:text-base text-[#17365D] dark:text-[#F3F4F6] hover:text-[#102A43] dark:hover:text-white bg-white hover:bg-slate-50 dark:bg-[#202B3D] dark:hover:bg-[#26334A] border border-slate-300 dark:border-[#344054] hover:border-[#17365D] dark:hover:border-[#F4C76B]/40 transition-colors text-center font-display flex items-center justify-center gap-2 min-h-[46px] shadow-xs"
            >
              <Phone className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8]" />
              <span>Request Parent Meeting / Callback</span>
            </Link>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#8592A3] pt-2">
            Bijipur, Big Street, Brahmapur (PIN: 760001) • Office open 7:00 AM – 7:30 PM daily
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
