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
      className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-[#111827] text-[#F3F4F6] overflow-hidden border-b border-[#344054]"
    >
      {/* Decorative Brand Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-80 sm:w-96 h-80 sm:h-96 bg-[#F4C76B]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-[#38BDF8]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Institute Tag & Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4C76B]/15 border border-[#F4C76B]/30 text-xs font-bold text-[#F4C76B] mb-5 sm:mb-6 shadow-sm flex-wrap">
              <span className="flex h-2 w-2 rounded-full bg-[#F4C76B] animate-pulse shrink-0"></span>
              <span>Class 11 & 12 (+2 Science) • Berhampur Center</span>
              <span className="text-[#344054] hidden sm:inline">|</span>
              <span className="flex items-center gap-1 text-[#CBD5E1] shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#F4C76B]" />
                Bijipur, Brahmapur
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.14] text-[#F3F4F6] mb-5 sm:mb-6">
              Your Future. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#38BDF8]">
                Our Guidance.
              </span>{' '}
              <br />
              Your Success.
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-[#AAB4C3] leading-relaxed max-w-2xl mb-7 sm:mb-8 font-normal">
              {ACADEMY_CONFIG.heroSubtitle}
            </p>

            {/* Trust Indicator Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-7 sm:mb-8">
              <div className="flex items-center gap-2 bg-[#202B3D] border border-[#344054] rounded-xl px-3 py-2 text-xs text-[#CBD5E1] shadow-sm hover:border-[#F4C76B]/40 transition-colors">
                <BookOpen className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span className="font-bold">+2 Science Board</span>
              </div>
              <div className="flex items-center gap-2 bg-[#202B3D] border border-[#344054] rounded-xl px-3 py-2 text-xs text-[#CBD5E1] shadow-sm hover:border-[#F4C76B]/40 transition-colors">
                <Atom className="w-4 h-4 text-[#F4C76B] shrink-0" />
                <span className="font-bold">JEE Main & Adv</span>
              </div>
              <div className="flex items-center gap-2 bg-[#202B3D] border border-[#344054] rounded-xl px-3 py-2 text-xs text-[#CBD5E1] shadow-sm hover:border-[#F4C76B]/40 transition-colors">
                <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">NEET-UG Medical</span>
              </div>
              <div className="flex items-center gap-2 bg-[#202B3D] border border-[#344054] rounded-xl px-3 py-2 text-xs text-[#CBD5E1] shadow-sm hover:border-[#F4C76B]/40 transition-colors">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-bold">NDA Defense</span>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onExploreCourses}
                className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-[#0B0F19] bg-gradient-to-r from-[#F4C76B] to-[#E5B555] hover:from-[#E5B555] hover:to-[#D4A344] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-bold transform hover:-translate-y-0.5"
              >
                <span>Explore Our Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBookConsultation}
                className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-[#F3F4F6] bg-[#172033] hover:bg-[#202B3D] border border-[#344054] hover:border-[#F4C76B]/50 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#F4C76B]" />
                <span>Book Free Consultation</span>
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
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F4C76B]/20 to-[#38BDF8]/20 rounded-3xl blur-xl opacity-60"></div>

              {/* Main Card */}
              <div className="relative rounded-3xl bg-[#202B3D] border border-[#344054] p-5 sm:p-6 shadow-xl text-[#F3F4F6]">
                
                {/* Classroom Learning Environment Photo */}
                <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 border border-[#344054] group">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
                    alt="Students in classroom learning science and mathematics"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-[#111827]/30 to-transparent"></div>
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 right-3 bg-[#F4C76B] text-[#0B0F19] font-black text-xs px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#0B0F19]" />
                    <span>Admissions Open</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="bg-[#111827]/90 backdrop-blur-md font-semibold px-2.5 py-1 rounded-lg border border-[#344054] flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#38BDF8]" />
                      Bijipur Center • Brahmapur
                    </span>
                    <span className="bg-[#172033] text-[#F4C76B] font-bold px-2 py-0.5 rounded text-[11px] border border-[#344054]">
                      Odisha 760001
                    </span>
                  </div>
                </div>

                {/* Academic Highlights Dashboard */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#344054] pb-2.5">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-[#AAB4C3]">
                      Coaching Framework
                    </span>
                    <span className="text-[11px] font-extrabold text-[#F4C76B] bg-[#F4C76B]/15 border border-[#F4C76B]/30 px-2 py-0.5 rounded-md">
                      Standard of Excellence
                    </span>
                  </div>

                  {/* 4 Feature Badges */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-[#172033] border border-[#344054] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-[#AAB4C3] font-medium">Odisha CHSE +2</span>
                      <span className="text-xs font-bold text-[#F3F4F6] mt-0.5">Dual-Track Syllabus</span>
                      <span className="text-[10px] text-[#F4C76B] font-semibold">Board + Competitive</span>
                    </div>

                    <div className="bg-[#172033] border border-[#344054] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-[#AAB4C3] font-medium">Daily Doubts</span>
                      <span className="text-xs font-bold text-[#F3F4F6] mt-0.5">Post-Class Desks</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">1:1 Teacher Time</span>
                    </div>

                    <div className="bg-[#172033] border border-[#344054] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-[#AAB4C3] font-medium">Weekly Testing</span>
                      <span className="text-xs font-bold text-[#F3F4F6] mt-0.5">OMR & Subjective</span>
                      <span className="text-[10px] text-[#38BDF8] font-semibold">Full Exam Simulation</span>
                    </div>

                    <div className="bg-[#172033] border border-[#344054] rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-[#AAB4C3] font-medium">Prime Location</span>
                      <span className="text-xs font-bold text-[#F3F4F6] mt-0.5">Big Street, Bijipur</span>
                      <span className="text-[10px] text-[#CBD5E1] font-semibold">Central Brahmapur</span>
                    </div>
                  </div>

                  {/* Faculty Badge with Facebook Photo Thumbnail */}
                  <div className="mt-3 pt-2.5 border-t border-[#344054] flex items-center justify-between text-xs text-[#AAB4C3]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/images/academy_faculty_fb.jpg"
                        alt="Antariksh Academy Faculty Team"
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#F4C76B]"
                      />
                      <span className="text-[11px] font-bold text-[#F3F4F6]">
                        7 Core Subject Mentors On Campus
                      </span>
                    </div>
                    <a
                      href="#teachers"
                      className="text-[#F4C76B] hover:underline font-extrabold text-[11px] whitespace-nowrap"
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
