import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Users,
  Phone,
  Star,
  BookOpen,
  Check,
  X,
  Flame,
  Award,
  Sparkles,
  MapPin,
  GraduationCap,
  Target,
  Layers,
} from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';
import { RESULTS_DATA } from '../data/resultsData';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';
import { ACADEMY_CONFIG } from '../config/academyConfig';
import { SpecularCard } from '../components/common/SpecularCard';
import { MagneticButton } from '../components/common/MagneticButton';
import { SEO } from '../components/seo/SEO';
import { HeroLeadForm } from '../components/home/HeroLeadForm';
import { CampusCarousel } from '../components/home/CampusCarousel';
import { FaqSection } from '../components/home/FaqSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect hash #courses to the dedicated /courses page immediately
  useEffect(() => {
    if (location.hash === '#courses') {
      navigate('/courses', { replace: true });
    }
  }, [location.hash, navigate]);

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

  return (
    <div className="flex flex-col w-full font-body overflow-x-hidden bg-[#FAF6F0] dark:bg-[#0D0905] text-[#150F0A] dark:text-[#FFEDD7]">
      <SEO
        title="Antariksh Academy | Coaching for +2 Science, JEE Main & Advanced, NEET, OUAT & ICAR | Berhampur"
        description="Premier coaching institute in Bijipur, Brahmapur (Berhampur), Odisha for Class 11 & 12 (+2 Science CHSE Odisha), JEE Main & Advanced, NEET-UG, and OUAT & ICAR. Disciplined 30-student cohorts with experienced senior faculty."
        canonicalPath="/"
      />
      
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
                  <MagneticButton as="div" className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#17365D] to-[#102A43] hover:from-[#102A43] hover:to-[#0A1D30] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-lg shadow-[#17365D]/15 dark:shadow-[#F4C76B]/15 hover:brightness-105 transition-all flex items-center justify-center gap-2 text-center font-display min-h-[46px]">
                    <BookOpen className="w-4 h-4 shrink-0 text-white dark:text-[#0F172A]" />
                    <span>Explore Academic Programs</span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-white dark:text-[#0F172A]" />
                  </MagneticButton>
                </Link>

                {/* Secondary Action: Consultation Booking */}
                <a href="#callback-widget" className="inline-block flex-1 sm:flex-initial">
                  <MagneticButton as="div" className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-xs text-[#17365D] dark:text-[#FFEDD7] hover:text-[#102A43] dark:hover:text-white bg-white/90 dark:bg-[#1C140C]/90 hover:bg-slate-50 dark:hover:bg-[#241A10] border border-stone-300 dark:border-[#FFEDD7]/20 hover:border-amber-500 shadow-sm backdrop-blur-md transition-all flex items-center justify-center gap-2 text-center font-display min-h-[46px]">
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
            <HeroLeadForm />

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-3 xl:gap-5 text-center">
            
            <SpecularCard glowColor="gold" tilt={true} className="px-2 py-3.5 sm:px-4 sm:py-5 lg:px-2 lg:py-4 xl:px-4 xl:py-5 text-center flex flex-col justify-between h-full">
              <div>
                <span className="block text-2xl sm:text-3xl lg:text-[1.65rem] xl:text-3xl 2xl:text-4xl font-extrabold text-[#C65D1E] dark:text-[#F4C76B] font-stat mb-1 tracking-tight whitespace-nowrap">
                  10<span className="text-[0.75em] font-bold ml-0.5">+</span>
                </span>
                <span className="font-display text-[10px] sm:text-[11px] xl:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wide leading-snug">
                  Years of Excellence
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] xl:text-[10.5px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-1.5 block leading-tight">
                ESTD. 2017 BRAHMAPUR
              </span>
            </SpecularCard>

            <SpecularCard glowColor="blue" tilt={true} className="px-2 py-3.5 sm:px-4 sm:py-5 lg:px-2 lg:py-4 xl:px-4 xl:py-5 text-center flex flex-col justify-between h-full">
              <div>
                <span className="block text-2xl sm:text-3xl lg:text-[1.65rem] xl:text-3xl 2xl:text-4xl font-extrabold text-[#0284C7] dark:text-[#38BDF8] font-stat mb-1 tracking-tight whitespace-nowrap">
                  99.4<span className="text-[0.62em] font-bold tracking-normal ml-0.5 opacity-90">%ile</span>
                </span>
                <span className="font-display text-[10px] sm:text-[11px] xl:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wide leading-snug">
                  Top JEE Percentile
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] xl:text-[10.5px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-1.5 block leading-tight">
                IIT & NIT SELECTIONS
              </span>
            </SpecularCard>

            <SpecularCard glowColor="emerald" tilt={true} className="px-2 py-3.5 sm:px-4 sm:py-5 lg:px-2 lg:py-4 xl:px-4 xl:py-5 text-center flex flex-col justify-between h-full">
              <div>
                <span className="block text-2xl sm:text-3xl lg:text-[1.45rem] xl:text-[1.65rem] 2xl:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-stat mb-1 tracking-tight whitespace-nowrap">
                  678<span className="text-[0.6em] font-semibold text-emerald-700/60 dark:text-emerald-300/60 mx-0.5 font-sans">/</span><span className="text-[0.85em] opacity-90">720</span>
                </span>
                <span className="font-display text-[10px] sm:text-[11px] xl:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wide leading-snug">
                  Top NEET-UG Score
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] xl:text-[10.5px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-1.5 block leading-tight">
                GOVT MEDICAL ALLOTMENTS
              </span>
            </SpecularCard>

            <SpecularCard glowColor="gold" tilt={true} className="px-2 py-3.5 sm:px-4 sm:py-5 lg:px-2 lg:py-4 xl:px-4 xl:py-5 text-center flex flex-col justify-between h-full">
              <div>
                <span className="block text-2xl sm:text-3xl lg:text-[1.65rem] xl:text-3xl 2xl:text-4xl font-extrabold text-[#C65D1E] dark:text-[#F4C76B] font-stat mb-1 tracking-tight whitespace-nowrap">
                  100<span className="text-[0.75em] font-bold ml-0.5">%</span>
                </span>
                <span className="font-display text-[10px] sm:text-[11px] xl:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wide leading-snug">
                  CHSE Board Pass Rate
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] xl:text-[10.5px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-1.5 block leading-tight">
                10 CONSECUTIVE YEARS
              </span>
            </SpecularCard>

            <SpecularCard glowColor="blue" tilt={true} className="col-span-2 sm:col-span-1 px-2 py-3.5 sm:px-4 sm:py-5 lg:px-2 lg:py-4 xl:px-4 xl:py-5 text-center flex flex-col justify-between h-full">
              <div>
                <span className="block text-2xl sm:text-3xl lg:text-[1.65rem] xl:text-3xl 2xl:text-4xl font-extrabold text-amber-600 dark:text-[#FDE68A] font-stat mb-1 tracking-tight whitespace-nowrap">
                  1,200<span className="text-[0.75em] font-bold ml-0.5">+</span>
                </span>
                <span className="font-display text-[10px] sm:text-[11px] xl:text-xs font-bold text-stone-900 dark:text-[#FFEDD7] block uppercase tracking-wide leading-snug">
                  Alumni Impact
                </span>
              </div>
              <span className="text-[9px] sm:text-[9.5px] xl:text-[10.5px] font-mono-tech text-stone-500 dark:text-[#9E8D7B] mt-1.5 block leading-tight">
                ENGINEERS & DOCTORS
              </span>
            </SpecularCard>

          </div>
        </div>
      </section>

      {/* 4. AUTO-SWIPING CAMPUS & CLASSROOM PHOTO ALBUM */}
      <CampusCarousel />

      {/* 4.5 FOUR CORNERSTONES OF CLASSROOM RIGOR */}
      <section className="py-12 sm:py-16 bg-[#FAF6F0] dark:bg-[#0D0905] border-b border-stone-200/90 dark:border-[#FFEDD7]/10 relative overflow-hidden">
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-amber-500/5 via-stone-400/5 to-amber-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-stone-200/90 dark:border-[#FFEDD7]/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-[#F4C76B]/10 border border-amber-500/20 text-amber-800 dark:text-[#F4C76B] text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-[#F4C76B]" />
                <span>The Antariksh Pedagogy</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 dark:text-[#FFEDD7] tracking-tight">
                Four Cornerstones of Classroom Rigor
              </h2>
            </div>
            <div className="text-xs font-medium text-stone-500 dark:text-[#9E8D7B] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-[#F4C76B]" />
              <span>Bijipur Main Campus • Dedicated Faculty Mentorship</span>
            </div>
          </div>

          {/* 4 Pedagogical Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Box 1: Council Blackboard Derivations */}
            <div className="group relative rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#18120B]/90 backdrop-blur-md border border-stone-200/90 dark:border-[#FFEDD7]/15 shadow-sm hover:shadow-xl hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-[#F4C76B] flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-[#F4C76B] border border-amber-500/20 font-display">
                    Council Depth
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 dark:text-[#FFEDD7] mb-2 group-hover:text-amber-800 dark:group-hover:text-[#F4C76B] transition-colors">
                  Blackboard Derivations
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 dark:text-[#D4C3AF] leading-relaxed mb-4">
                  Live step-by-step mathematical proofs and theory worked out on blackboards—checking every student's notebook rather than rushing digital slides.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                <span className="text-stone-500 dark:text-[#9E8D7B] font-medium">Subjective Proofs</span>
                <span className="text-amber-800 dark:text-[#F4C76B] font-bold shrink-0">100% Board Pass</span>
              </div>
            </div>

            {/* Box 2: Daily DPP Speed Drills */}
            <div className="group relative rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#18120B]/90 backdrop-blur-md border border-stone-200/90 dark:border-[#FFEDD7]/15 shadow-sm hover:shadow-xl hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-700 dark:text-[#38BDF8] flex items-center justify-center shadow-xs">
                    <Target className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-800 dark:text-[#38BDF8] border border-sky-500/20 font-display">
                    Speed & Accuracy
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 dark:text-[#FFEDD7] mb-2 group-hover:text-sky-700 dark:group-hover:text-[#38BDF8] transition-colors">
                  Daily Practice Drills
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 dark:text-[#D4C3AF] leading-relaxed mb-4">
                  30 targeted problem sets every session with negative-marking audits and shortcut drills to build entrance examination speed and stamina.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                <span className="text-stone-500 dark:text-[#9E8D7B] font-medium">Speed Audits</span>
                <span className="text-sky-700 dark:text-[#38BDF8] font-bold shrink-0">JEE & NEET Focus</span>
              </div>
            </div>

            {/* Box 3: 1-on-1 Evening Doubt Desks */}
            <div className="group relative rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#18120B]/90 backdrop-blur-md border border-stone-200/90 dark:border-[#FFEDD7]/15 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-[#34D399] flex items-center justify-center shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-[#34D399] border border-emerald-500/20 font-display">
                    1-on-1 Faculty
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 dark:text-[#FFEDD7] mb-2 group-hover:text-emerald-700 dark:group-hover:text-[#34D399] transition-colors">
                  Personalized Doubt Desks
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 dark:text-[#D4C3AF] leading-relaxed mb-4">
                  Faculty remain on campus until evening. Students sit directly across from teachers to clear every stumbling block before heading home.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                <span className="text-stone-500 dark:text-[#9E8D7B] font-medium">Evening Help Desk</span>
                <span className="text-emerald-700 dark:text-[#34D399] font-bold shrink-0">Till 7:00 PM</span>
              </div>
            </div>

            {/* Box 4: Synchronized Dual-Track Curriculum */}
            <div className="group relative rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#18120B]/90 backdrop-blur-md border border-stone-200/90 dark:border-[#FFEDD7]/15 shadow-sm hover:shadow-xl hover:border-amber-600/40 dark:hover:border-amber-600/40 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-amber-600/20 text-amber-800 dark:text-[#F4C76B] flex items-center justify-center shadow-xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-[#F4C76B] border border-amber-500/20 font-display">
                    Dual Track
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 dark:text-[#FFEDD7] mb-2 group-hover:text-amber-800 dark:group-hover:text-[#F4C76B] transition-colors">
                  Synchronized Curriculum
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 dark:text-[#D4C3AF] leading-relaxed mb-4">
                  Council theory and competitive entrance questions taught concurrently in unified chapters—eliminating disjointed multi-coaching fatigue.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-200/80 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                <span className="text-stone-500 dark:text-[#9E8D7B] font-medium">Integrated Syllabus</span>
                <span className="text-amber-800 dark:text-[#F4C76B] font-bold shrink-0">Zero Clashing</span>
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
                <span className="font-serif-luxury italic font-normal text-amber-700 dark:text-[#F4C76B] text-[1.12em]">
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
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-[#172033] text-[#0369A1] dark:text-[#38BDF8] border border-slate-200 dark:border-[#344054] font-cinzel">
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
      <FaqSection />

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
