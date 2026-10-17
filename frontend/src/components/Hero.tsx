import React from 'react';
import { Calendar, ArrowRight, BookOpen, Atom, Stethoscope, ShieldCheck, MapPin, CheckCircle2, Trophy, Star } from 'lucide-react';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface HeroProps {
  onExploreCourses: () => void;
  onBookConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCourses, onBookConsultation }) => {
  return (
    <section
      id="home"
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F8FAFC] dark:bg-[#111827] text-slate-800 dark:text-white overflow-hidden border-b border-slate-200 dark:border-[#344054] transition-colors duration-200"
    >
      {/* Decorative Brand Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-80 sm:w-96 h-80 sm:h-96 bg-amber-500/10 dark:bg-[#F4C76B]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-slate-500/10 dark:bg-[#172033]/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Institute Tag & Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-xs font-bold text-[#C6922E] dark:text-[#F4C76B] mb-5 sm:mb-6 shadow-sm flex-wrap">
              <span className="flex h-2 w-2 rounded-full bg-[#C6922E] dark:bg-[#F4C76B] animate-pulse shrink-0"></span>
              <span>Class 11 & 12 (+2 Science) • Berhampur Center</span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
                Bijipur, Brahmapur
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.14] text-slate-900 dark:text-white mb-5 sm:mb-6">
              Your Future. <br />
              <span className="text-[#17365D] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-amber-100 dark:to-[#F4C76B]">
                Our Guidance.
              </span>{' '}
              <br />
              Your Success.
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-7 sm:mb-8 font-normal">
              {ACADEMY_CONFIG.heroSubtitle}
            </p>

            {/* Trust Indicator Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-7 sm:mb-8">
              <div className="flex items-center gap-2 bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 shadow-sm transition-colors">
                <BookOpen className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B] shrink-0" />
                <span className="font-bold">+2 Science Board</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 shadow-sm transition-colors">
                <Atom className="w-4 h-4 text-[#17365D] dark:text-amber-400 shrink-0" />
                <span className="font-bold">JEE Main & Adv</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 shadow-sm transition-colors">
                <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-bold">NEET-UG Medical</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 shadow-sm transition-colors">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span className="font-bold">OUAT & ICAR</span>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onExploreCourses}
                className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Explore Our Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBookConsultation}
                className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-800 dark:text-white bg-white dark:bg-[#202B3D] hover:bg-slate-50 dark:hover:bg-[#2A374D] border border-slate-300 dark:border-[#344054] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#17365D] dark:text-[#F4C76B]" />
                <span>Meet on Google Meet</span>
              </button>
            </div>

            {/* Operational Commitment Note */}
            <p className="mt-4 text-xs text-slate-500 dark:text-[#AAB4C3] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Small batches • Personal mentor for each student • Daily doubt clearing desks</span>
            </p>
          </div>

          {/* Right Column: Authentic Educational Hub & Result Highlights */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 to-sky-500/10 dark:from-[#F4C76B]/20 dark:to-sky-500/20 rounded-3xl blur-xl opacity-60"></div>

              {/* Main Card */}
              <div className="relative rounded-3xl bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] p-5 sm:p-6 shadow-xl text-slate-800 dark:text-white">
                
                {/* Classroom Learning Environment Photo */}
                <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 border border-slate-200 dark:border-[#344054] group">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
                    alt="Students in classroom learning science and mathematics"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 right-3 bg-[#17365D] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:to-[#D4A33B] text-white dark:text-[#0F172A] font-black text-xs px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Admissions Open</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="bg-black/75 backdrop-blur-md font-semibold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#F4C76B]" />
                      Bijipur Center • Brahmapur
                    </span>
                    <span className="bg-black/75 text-amber-300 font-bold px-2 py-0.5 rounded text-[11px] border border-white/20">
                      Odisha 760001
                    </span>
                  </div>
                </div>

                {/* Academic Highlights Dashboard */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#344054] pb-2.5">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                      Coaching Framework
                    </span>
                    <span className="text-[11px] font-extrabold text-[#C6922E] dark:text-[#F4C76B] bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] px-2 py-0.5 rounded-md">
                      Standard of Excellence
                    </span>
                  </div>

                  {/* 4 Feature Badges */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Odisha CHSE +2</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Dual-Track Syllabus</span>
                      <span className="text-[10px] text-[#C6922E] dark:text-[#F4C76B] font-semibold">Board + Competitive</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Daily Doubts</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Post-Class Desks</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">1:1 Teacher Time</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Weekly Testing</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">OMR & Subjective</span>
                      <span className="text-[10px] text-[#C6922E] dark:text-[#F4C76B] font-semibold">Full Exam Simulation</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Prime Location</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Big Street, Bijipur</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">Central Brahmapur</span>
                    </div>
                  </div>

                  {/* Faculty Badge with Facebook Photo Thumbnail */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#344054] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/images/academy_faculty_fb.jpg"
                        alt="Antariksh Academy Faculty Team"
                        className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-[#344054]"
                      />
                      <span className="text-[11px] font-bold text-slate-800 dark:text-white">
                        7 Core Subject Mentors On Campus
                      </span>
                    </div>
                    <a
                      href="#teachers"
                      className="text-[#17365D] dark:text-[#F4C76B] hover:underline font-extrabold text-[11px] whitespace-nowrap"
                    >
                      Meet Team →
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
