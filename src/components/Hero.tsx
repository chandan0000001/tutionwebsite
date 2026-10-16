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
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-[#08090D] text-white overflow-hidden border-b border-slate-800"
    >
      {/* Decorative Brand Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-80 sm:w-96 h-80 sm:h-96 bg-[#FC1682]/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-[#FF2E93]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Institute Tag & Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-bold text-[#FC1682] mb-5 sm:mb-6 shadow-sm flex-wrap">
              <span className="flex h-2 w-2 rounded-full bg-[#FC1682] animate-pulse shrink-0"></span>
              <span>Class 11 & 12 (+2 Science) • Berhampur Center</span>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <span className="flex items-center gap-1 text-slate-300 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#FC1682]" />
                Bijipur, Brahmapur
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.14] text-white mb-5 sm:mb-6">
              Your Future. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-[#FC1682]">
                Our Guidance.
              </span>{' '}
              <br />
              Your Success.
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mb-7 sm:mb-8 font-normal">
              {ACADEMY_CONFIG.heroSubtitle}
            </p>

            {/* Trust Indicator Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-7 sm:mb-8">
              <div className="flex items-center gap-2 bg-[#141824] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-sm hover:border-pink-500/40 transition-colors">
                <BookOpen className="w-4 h-4 text-[#FC1682] shrink-0" />
                <span className="font-bold">+2 Science Board</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141824] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-sm hover:border-pink-500/40 transition-colors">
                <Atom className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="font-bold">JEE Main & Adv</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141824] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-sm hover:border-pink-500/40 transition-colors">
                <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">NEET-UG Medical</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141824] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-sm hover:border-pink-500/40 transition-colors">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-bold">NDA Defense</span>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onExploreCourses}
                className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Explore Our Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBookConsultation}
                className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-[#141824] hover:bg-[#1A2030] border border-slate-800 hover:border-pink-500/50 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#FC1682]" />
                <span>Meet on Google Meet</span>
              </button>
            </div>

            {/* Operational Commitment Note */}
            <p className="mt-4 text-xs text-[#AAB4C3] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Small batches • Personal mentor for each student • Daily doubt clearing desks</span>
            </p>
          </div>

          {/* Right Column: Authentic Educational Hub & Result Highlights */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FC1682]/20 to-[#FF2E93]/20 rounded-3xl blur-xl opacity-60"></div>

              {/* Main Card */}
              <div className="relative rounded-3xl bg-[#141824] border border-slate-800 p-5 sm:p-6 shadow-xl text-white">
                
                {/* Classroom Learning Environment Photo */}
                <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 border border-slate-800 group">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
                    alt="Students in classroom learning science and mathematics"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090D]/90 via-[#08090D]/30 to-transparent"></div>
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-[#FC1682] to-[#BE125A] text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Admissions Open</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="bg-[#08090D]/90 backdrop-blur-md font-semibold px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#FC1682]" />
                      Bijipur Center • Brahmapur
                    </span>
                    <span className="bg-[#141824] text-pink-300 font-bold px-2 py-0.5 rounded text-[11px] border border-slate-800">
                      Odisha 760001
                    </span>
                  </div>
                </div>

                {/* Academic Highlights Dashboard */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                      Coaching Framework
                    </span>
                    <span className="text-[11px] font-extrabold text-[#FC1682] bg-pink-500/15 border border-pink-500/30 px-2 py-0.5 rounded-md">
                      Standard of Excellence
                    </span>
                  </div>

                  {/* 4 Feature Badges */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-[#08090D] border border-slate-800/80 rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-400 font-medium">Odisha CHSE +2</span>
                      <span className="text-xs font-bold text-white mt-0.5">Dual-Track Syllabus</span>
                      <span className="text-[10px] text-pink-300 font-semibold">Board + Competitive</span>
                    </div>

                    <div className="bg-[#08090D] border border-slate-800/80 rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-400 font-medium">Daily Doubts</span>
                      <span className="text-xs font-bold text-white mt-0.5">Post-Class Desks</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">1:1 Teacher Time</span>
                    </div>

                    <div className="bg-[#08090D] border border-slate-800/80 rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-400 font-medium">Weekly Testing</span>
                      <span className="text-xs font-bold text-white mt-0.5">OMR & Subjective</span>
                      <span className="text-[10px] text-pink-300 font-semibold">Full Exam Simulation</span>
                    </div>

                    <div className="bg-[#08090D] border border-slate-800/80 rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-400 font-medium">Prime Location</span>
                      <span className="text-xs font-bold text-white mt-0.5">Big Street, Bijipur</span>
                      <span className="text-[10px] text-slate-300 font-semibold">Central Brahmapur</span>
                    </div>
                  </div>

                  {/* Faculty Badge with Facebook Photo Thumbnail */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/images/academy_faculty_fb.jpg"
                        alt="Antariksh Academy Faculty Team"
                        className="w-8 h-8 rounded-full object-cover border-2 border-pink-500/50"
                      />
                      <span className="text-[11px] font-bold text-white">
                        7 Core Subject Mentors On Campus
                      </span>
                    </div>
                    <a
                      href="#teachers"
                      className="text-pink-400 hover:text-pink-300 font-extrabold text-[11px] whitespace-nowrap"
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
