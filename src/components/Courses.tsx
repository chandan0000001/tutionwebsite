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
        course.id === 'nda-entrance'
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
        return <Atom className="w-6 h-6 text-[#FC1682]" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-[#38BDF8]" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-[#38BDF8]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#FC1682]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#38BDF8]" />;
      default:
        return <GraduationCap className="w-6 h-6 text-[#FC1682]" />;
    }
  };

  return (
    <section id="courses" className="py-16 sm:py-20 md:py-24 bg-[#08090D] border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#141824] border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Academic Programs</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Targeted Courses &{' '}
            <span className="bg-gradient-to-r from-white via-pink-200 to-[#FC1682] bg-clip-text text-transparent">
              Examination Streams
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Designed specifically for Class 11 & 12 Science students to achieve top council scores alongside national
            entrance qualifications with zero confusion.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] text-white shadow-md shadow-pink-600/30 border border-pink-400/40'
                  : 'bg-[#141824] text-slate-300 hover:text-white hover:bg-[#1C2232] border border-pink-500/20'
              }`}
            >
              All Courses ({COURSES_DATA.length})
            </button>
            <button
              onClick={() => setActiveFilter('entrance')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFilter === 'entrance'
                  ? 'bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] text-white shadow-md shadow-pink-600/30 border border-pink-400/40'
                  : 'bg-[#141824] text-slate-300 hover:text-white hover:bg-[#1C2232] border border-pink-500/20'
              }`}
            >
              Competitive Entrances (JEE, NEET, NDA)
            </button>
            <button
              onClick={() => setActiveFilter('board')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFilter === 'board'
                  ? 'bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] text-white shadow-md shadow-pink-600/30 border border-pink-400/40'
                  : 'bg-[#141824] text-slate-300 hover:text-white hover:bg-[#1C2232] border border-pink-500/20'
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
                className="bg-[#141824] border border-pink-500/25 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-pink-500/60"
              >
                {/* Card Top / Header */}
                <div className="p-6 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0D1017] border border-pink-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      {getCourseIcon(course.icon)}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#0D1017] text-pink-300 border border-pink-500/35">
                      {course.badge}
                    </span>
                  </div>

                  <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-white group-hover:text-pink-300 transition-colors mb-2">
                    {course.title}
                  </h3>

                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#38BDF8] bg-[#38BDF8]/15 px-2.5 py-0.5 rounded-md border border-[#38BDF8]/30">
                      Target: {course.targetStudents}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {course.shortDescription}
                  </p>

                  {/* Key Learning Benefits */}
                  <div className="space-y-2 pt-2 border-t border-pink-500/20 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Key Program Features:
                    </span>
                    {course.keyBenefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-[#FC1682] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom / Footer Actions */}
                <div className="p-6 pt-0 bg-[#0D1017]/80 border-t border-pink-500/20 flex flex-col gap-2.5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 py-1">
                    <Info className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{course.batchType}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewCourseDetails(course)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-slate-200 bg-[#141824] hover:bg-[#1C2232] border border-pink-500/25 hover:border-pink-500/50 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore Course</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onSelectCourseForEnquiry(course.title)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] hover:from-[#FF2D92] hover:to-[#FC1682] rounded-xl shadow-md shadow-pink-600/25 border border-pink-400/30 transition-colors flex items-center justify-center gap-1 cursor-pointer font-bold"
                    >
                      <Calendar className="w-3 h-3 text-white" />
                      <span>Enquire Now</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Note */}
        <div className="mt-12 bg-[#141824] border border-pink-500/25 rounded-xl p-4 text-center max-w-2xl mx-auto text-xs text-slate-300 shadow-md">
          <p className="font-bold text-white mb-0.5">
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
