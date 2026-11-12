import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  MapPin,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const ALBUM_SLIDES = [
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

export const CampusCarousel: React.FC = memo(() => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Auto-swipe timer: advances slide every 3.8s when not hovered/paused
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % ALBUM_SLIDES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : ALBUM_SLIDES.length - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % ALBUM_SLIDES.length);
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

  return (
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
          {ALBUM_SLIDES.map((slide, idx) => {
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
              {ALBUM_SLIDES.map((slide, idx) => (
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
              <span className="text-[#64748B] text-xs font-stat"> / 0{ALBUM_SLIDES.length}</span>
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
              className="font-bold text-[#0369A1] hover:text-[#075985] dark:text-[#38BDF8] dark:hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>View Campus & Classrooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
});

CampusCarousel.displayName = 'CampusCarousel';
