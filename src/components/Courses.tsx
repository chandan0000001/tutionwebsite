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
        return <Stethoscope className="w-6 h-6 text-emerald-600" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-[#0284C7]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-purple-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-indigo-600" />;
      default:
        return <GraduationCap className="w-6 h-6 text-[#FC1682]" />;
    }
  };

  return (
    <section id="courses" className="py-16 sm:py-20 md:py-24 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#BE125A] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Academic Programs</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-4">
            Targeted Courses & Examination Streams
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Designed specifically for Class 11 & 12 Science students to achieve top council scores alongside national
            entrance qualifications with zero confusion.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-[#FC1682] to-[#D9146C] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Courses ({COURSES_DATA.length})
            </button>
            <button
              onClick={() => setActiveFilter('entrance')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFilter === 'entrance'
                  ? 'bg-gradient-to-r from-[#FC1682] to-[#D9146C] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Competitive Entrances (JEE, NEET, NDA)
            </button>
            <button
              onClick={() => setActiveFilter('board')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeFilter === 'board'
                  ? 'bg-gradient-to-r from-[#FC1682] to-[#D9146C] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
                className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#FC1682]/60"
              >
                {/* Card Top / Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-50/60 border border-pink-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      {getCourseIcon(course.icon)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-pink-50 text-[#BE125A] border border-pink-200">
                      {course.badge}
                    </span>
                  </div>

                  <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-slate-900 group-hover:text-[#FC1682] transition-colors mb-2">
                    {course.title}
                  </h3>

                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#0284C7] bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                      Target: {course.targetStudents}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {course.shortDescription}
                  </p>

                  {/* Key Learning Benefits */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Key Program Features:
                    </span>
                    {course.keyBenefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-[#FC1682] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom / Footer Actions */}
                <div className="p-6 pt-0 bg-slate-50/60 border-t border-slate-100 flex flex-col gap-2.5">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 py-1">
                    <Info className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>{course.batchType}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewCourseDetails(course)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 hover:border-[#FC1682] hover:text-[#FC1682] rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore Course</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onSelectCourseForEnquiry(course.title)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-[#FC1682] to-[#D9146C] hover:from-[#E00E70] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
        <div className="mt-12 bg-white border border-slate-200 rounded-xl p-4 text-center max-w-2xl mx-auto text-xs text-slate-600 shadow-2xs">
          <p className="font-bold text-[#0F172A] mb-0.5">
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
