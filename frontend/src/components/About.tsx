import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  Layers,
  HelpCircle,
  FileCheck2,
  Compass,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  HeartHandshake,
  Lock,
  ShieldCheck,
  EyeOff,
} from 'lucide-react';

interface AboutProps {
  onLearnMoreCourses: () => void;
  onOpenConsultation: () => void;
}

export const About: React.FC<AboutProps> = ({ onLearnMoreCourses, onOpenConsultation }) => {
  const pillars = [
    {
      icon: Lightbulb,
      title: 'Concept-Based Teaching',
      shortDesc: 'First-principles learning so students master the "why" and "how" before tackling complex numericals.',
      description:
        'Instead of rote memorization or surface shortcuts, we build concepts from the first principles. Students learn the "why" and "how" behind every formula before tackling complex numericals.',
      color: 'text-[#F4C76B] bg-[#172033] border-[#344054]',
    },
    {
      icon: Layers,
      title: 'Structured Preparation',
      shortDesc: 'Synchronized CHSE board + JEE/NEET/OUAT curriculum eliminating confusion and academic fatigue.',
      description:
        'We bridge the Odisha CHSE Council syllabus with competitive JEE/NEET patterns through a synchronized chapter flow, eliminating syllabus confusion and academic fatigue.',
      color: 'text-[#38BDF8] bg-[#172033] border-[#344054]',
    },
    {
      icon: HelpCircle,
      title: 'Dedicated Doubt-Clearing',
      shortDesc: 'Daily post-class doubt desk for personalized 1-on-1 problem solving every working day.',
      description:
        'Learning happens when unresolved questions are addressed promptly. Our teachers maintain scheduled post-class doubt desks for one-on-one clarification every working day.',
      color: 'text-[#F4C76B] bg-[#172033] border-[#344054]',
    },
    {
      icon: FileCheck2,
      title: 'Practice Tests & Revision',
      shortDesc: 'Weekly council subjective drills paired with entrance OMR simulations for exam speed.',
      description:
        'Weekly subjective answer drills for council examinations alongside computerized/OMR simulations for entrance tests develop examination temperament and speed under pressure.',
      color: 'text-emerald-400 bg-[#172033] border-[#344054]',
    },
    {
      icon: Compass,
      title: 'Academic Mentoring',
      shortDesc: 'Personalized pacing, stress mitigation, and performance tracking during critical +2 years.',
      description:
        'Students encounter stress and fluctuating confidence during +2 years. Our mentors monitor individual learning curves, identify weak areas, and guide pacing strategies.',
      color: 'text-amber-400 bg-[#172033] border-[#344054]',
    },
    {
      icon: MessageCircle,
      title: 'Parent-Student Sync',
      shortDesc: 'Regular attendance reports, progress reviews, and open feedback meetings.',
      description:
        'We believe parents are partners in their child’s academic journey. Regular updates, attendance tracking, and feedback meetings ensure everyone remains aligned.',
      color: 'text-[#38BDF8] bg-[#172033] border-[#344054]',
    },
  ];

  return (
    <section id="about" className="py-8 sm:py-16 md:py-20 bg-[#F8FAFC] dark:bg-[#111827] border-b border-slate-200 dark:border-[#344054] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#C6922E] dark:text-[#F4C76B] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
            <span>10 Years of Excellence • Brahmapur</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl md:text-5xl font-black text-[#172033] dark:text-white tracking-tight mb-2 sm:mb-3 leading-tight">
            A Balanced Approach to Board &{' '}
            <span className="bg-gradient-to-r from-[#17365D] via-[#C6922E] to-[#0284C7] dark:from-white dark:via-amber-100 dark:to-[#F4C76B] bg-clip-text text-transparent">
              Competitive Mastery
            </span>
          </h2>
          <p className="text-slate-600 dark:text-[#AAB4C3] text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Providing science students with concept-oriented teaching, disciplined study routines, and individual faculty mentorship in Ganjam.
          </p>
        </div>

        {/* Narrative Feature Row: Mission and Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center mb-10 sm:mb-16 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#344054] rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-sm dark:shadow-2xl">
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#C6922E] dark:text-[#F4C76B] bg-amber-50 dark:bg-[#172033] border border-amber-200 dark:border-[#344054] px-2.5 py-1 rounded-md">
              <Compass className="w-3.5 h-3.5" />
              <span>Bridging School & Entrance</span>
            </div>
            
            <h3 className="font-['Outfit',sans-serif] text-lg sm:text-2xl md:text-3xl font-bold text-[#172033] dark:text-white leading-snug">
              Why We Prioritize Foundation Alongside Problem Solving
            </h3>

            {/* Mobile-Optimized 3-Pillar Highlight Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-[#C6922E] dark:text-[#F4C76B] block">Step 01</span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block mt-0.5">CHSE Council Depth</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">Crystalline theory based on council syllabus.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 block">Step 02</span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block mt-0.5">Entrance Analytics</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">Immediate application to JEE/NEET/OUAT.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">Step 03</span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block mt-0.5">Zero Fatigue</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">Synchronized routine without duplicate stress.</p>
              </div>
            </div>

            {/* Brief Desktop Narrative */}
            <p className="hidden md:block text-slate-600 dark:text-[#AAB4C3] leading-relaxed text-sm">
              Every topic in Physics, Chemistry, Mathematics, and Biology is first taught with thorough theoretical depth for the Odisha CHSE board, immediately reinforced with analytical numerical problem sets.
            </p>
            
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B] shrink-0" />
                <span>Zero duplicate preparation stress</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B] shrink-0" />
                <span>Small batch size for direct mentoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
                <span>Centrally located in Bijipur, Brahmapur</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
                <span>Ethical, transparent student guidance</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <button
                onClick={onLearnMoreCourses}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#17365D] hover:bg-[#102A43] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] hover:brightness-105 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm min-h-[42px]"
              >
                <span>View All 5 Batches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-[#17365D] dark:bg-[#111827] dark:hover:bg-[#1E293B] dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px] shadow-xs"
              >
                <HeartHandshake className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B]" />
                <span>Book Free Meet Session</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
                alt="Students studying science and mathematics with focused guidance"
                className="w-full h-48 sm:h-72 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1524]/95 via-[#0B1524]/40 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[10px] font-bold text-amber-300 dark:text-[#F4C76B] uppercase tracking-wider">
                  Center Commitment
                </p>
                <p className="text-xs sm:text-sm font-medium text-white mt-0.5 line-clamp-2">
                  "Every student is capable of excellence when provided systematic conceptual clarity and steady encouragement."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Key Pillars Grid */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <h3 className="font-['Outfit',sans-serif] text-lg sm:text-2xl md:text-3xl font-black text-[#17365D] dark:text-white">
              The Six Pillars of Academic Learning
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Engineered methodology for consistent board & entrance results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 hover:border-[#17365D] dark:hover:border-[#F4C76B]/40 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all group flex flex-col text-left"
                >
                  <div className="flex items-center gap-3 mb-2.5 sm:mb-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border bg-slate-50 dark:bg-[#111827] border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#17365D] dark:text-[#F4C76B]" />
                    </div>
                    <h4 className="font-['Outfit',sans-serif] text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#17365D] dark:text-white dark:group-hover:text-[#F4C76B] transition-colors leading-snug">
                      {pillar.title}
                    </h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed flex-1">
                    <span className="sm:hidden">{pillar.shortDesc}</span>
                    <span className="hidden sm:inline">{pillar.description}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy & Trust Badge Card - Compact & Scannable */}
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#1E293B] dark:to-[#111827] border border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Student Privacy Guarantee</span>
              </div>
              <h3 className="font-['Outfit',sans-serif] text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                Your Contact Information Stays 100% Confidential
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                We never sell or share student data with telemarketers. Details are used solely for academic counseling and batch coordination.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  SSL Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                  Zero Ad Sales
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Instant Opt-Out
                </span>
              </div>
            </div>

            <Link
              to="/privacy"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#17365D] hover:bg-[#102A43] dark:text-[#0F172A] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] hover:brightness-105 shadow-xs transition-all shrink-0 min-h-[40px]"
            >
              <span>Privacy Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
