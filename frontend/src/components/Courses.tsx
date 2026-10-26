import React, { useState } from 'react';
import {
  Atom,
  Stethoscope,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { COURSES_DATA, type Course } from '../data/coursesData';

interface CoursesProps {
  onSelectCourseForEnquiry: (courseTitle: string) => void;
  onViewCourseDetails: (course: Course) => void;
}

export const Courses: React.FC<CoursesProps> = ({
  onSelectCourseForEnquiry,
  onViewCourseDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'entrance' | 'board'>('all');

  const filteredCourses = COURSES_DATA.filter((course) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'entrance') {
      return (
        course.id === 'jee-main-adv' ||
        course.id === 'neet-ug' ||
        course.id === 'ouat-icar-entrance'
      );
    }
    if (activeFilter === 'board') {
      return course.id === 'chse-board' || course.id === 'integrated-prep';
    }
    return true;
  });

  const getCourseIcon = (iconName: Course['icon']) => {
    switch (iconName) {
      case 'Atom':
        return <Atom className="w-6 h-6 text-[#17365D] dark:text-[#F4C76B]" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-[#17365D] dark:text-[#38BDF8]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#17365D] dark:text-[#F4C76B]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-[#38BDF8]" />;
      default:
        return <GraduationCap className="w-6 h-6 text-[#17365D] dark:text-[#F4C76B]" />;
    }
  };

  return (
    <section id="courses" className="py-10 sm:py-16 md:py-20 bg-[#FAF6F0]/90 dark:bg-[#0D0905]/90 text-[#150F0A] dark:text-[#FFEDD7] border-b border-stone-200/90 dark:border-[#FFEDD7]/10 oryzo-blueprint-grid">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#18120B]/90 border border-stone-200/90 dark:border-[#FFEDD7]/15 text-[#C65D1E] dark:text-[#F4C76B] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C65D1E] dark:text-[#F4C76B]" />
            <span>Academic Programs</span>
          </div>
          <h2 className="luxury-editorial-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#150F0A] dark:text-[#FFEDD7] tracking-tight mb-3 break-words">
            Targeted Courses &{' '}
            <span className="font-serif-luxury italic font-normal text-amber-600 dark:text-[#F4C76B]">
              Examination Streams
            </span>
          </h2>
          <p className="font-serif-literata text-slate-600 dark:text-[#D4C3AF] text-xs sm:text-base leading-relaxed">
            Designed specifically for Class 11 & 12 Science students to achieve top council scores alongside national
            entrance qualifications with zero confusion.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
                activeFilter === 'all'
                  ? 'bg-[#17365D] text-white shadow-md dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A]'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xs dark:bg-[#202B3D] dark:text-[#AAB4C3] dark:hover:text-white dark:hover:bg-[#2A374D] dark:border-[#344054]'
              }`}
            >
              All Courses ({COURSES_DATA.length})
            </button>
            <button
              onClick={() => setActiveFilter('entrance')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] text-center max-w-full ${
                activeFilter === 'entrance'
                  ? 'bg-[#17365D] text-white shadow-md dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A]'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xs dark:bg-[#202B3D] dark:text-[#AAB4C3] dark:hover:text-white dark:hover:bg-[#2A374D] dark:border-[#344054]'
              }`}
            >
              Competitive Entrances (JEE, NEET, OUAT, ICAR)
            </button>
            <button
              onClick={() => setActiveFilter('board')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] text-center max-w-full ${
                activeFilter === 'board'
                  ? 'bg-[#17365D] text-white shadow-md dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A]'
                  : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xs dark:bg-[#202B3D] dark:text-[#AAB4C3] dark:hover:text-white dark:hover:bg-[#2A374D] dark:border-[#344054]'
              }`}
            >
              +2 Board & Integrated Programs
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredCourses.map((course) => {
            return (
              <div
                key={course.id}
                className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#17365D] dark:hover:border-[#F4C76B]/40"
              >
                {/* Card Top / Header */}
                <div className="p-6 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      {getCourseIcon(course.icon)}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 dark:bg-[#172033] text-[#C6922E] dark:text-[#F4C76B] border border-amber-200 dark:border-[#344054]">
                      {course.badge}
                    </span>
                  </div>

                  <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#0284C7] dark:group-hover:text-[#F4C76B] transition-colors mb-2">
                    {course.title}
                  </h3>

                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#0284C7] bg-sky-50 dark:bg-[#38BDF8]/15 px-2.5 py-1 rounded-md border border-sky-200 dark:border-[#38BDF8]/30 dark:text-[#38BDF8] inline-block break-words max-w-full leading-snug">
                      Target: {course.targetStudents}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-[#AAB4C3] text-sm leading-relaxed mb-4">
                    {course.shortDescription}
                  </p>

                  {/* Key Learning Benefits */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#344054] mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Key Program Features:
                    </span>
                    {course.keyBenefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom / Footer Actions */}
                <div className="p-6 pt-3 bg-slate-50 dark:bg-[#172033] border-t border-slate-200 dark:border-[#344054] flex flex-col gap-2.5">
                  <div className="text-[11px] text-slate-500 dark:text-[#AAB4C3] flex items-center gap-1.5 py-1">
                    <Info className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" />
                    <span>{course.batchType}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewCourseDetails(course)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 hover:border-[#17365D] hover:text-[#17365D] dark:bg-[#202B3D] dark:hover:bg-[#2A374D] dark:border-[#344054] dark:hover:border-[#F4C76B]/40 dark:text-slate-200 dark:hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[44px] shadow-xs"
                    >
                      <span>Explore Course</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onSelectCourseForEnquiry(course.title)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-white bg-[#17365D] hover:bg-[#102A43] dark:text-[#0F172A] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] hover:brightness-105 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                    >
                      <Calendar className="w-3 h-3 text-white dark:text-[#0F172A]" />
                      <span>Enquire Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Note */}
        <div className="mt-10 sm:mt-12 bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl p-4 text-center max-w-2xl mx-auto text-xs text-slate-600 dark:text-[#AAB4C3] shadow-xs">
          <p className="font-bold text-slate-900 dark:text-white mb-0.5">
            Note on Batch Allocations & Timetables:
          </p>
          <p>
            Batch allocations, subject order, and schedules are adjusted based on student school timings and enrollment.
            Please connect with the academy center at Bijipur to confirm active seats and timings.
          </p>
        </div>

      </div>
    </section>
  );
};
