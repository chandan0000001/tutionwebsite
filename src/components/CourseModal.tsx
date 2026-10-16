import React, { useEffect } from 'react';
import { X, CheckCircle2, Calendar, BookOpen } from 'lucide-react';
import type { Course } from '../data/coursesData';

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire: (courseTitle: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnquire,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${course.title} Program Details`}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-[#202B3D] border border-[#344054] rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#344054] pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#172033] text-[#F4C76B] border border-[#344054]">
                {course.badge}
              </span>
              <span className="text-xs text-[#38BDF8] font-semibold bg-[#38BDF8]/15 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                {course.targetStudents}
              </span>
            </div>
            <h3 className="text-2xl font-black font-['Outfit',sans-serif] text-white">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#AAB4C3] mt-1">
              {course.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#172033] hover:bg-[#2A374D] text-[#AAB4C3] hover:text-white border border-[#344054] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Course Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Course Overview:
            </h4>
            <p className="text-sm text-[#AAB4C3] leading-relaxed">
              {course.shortDescription}
            </p>
          </div>

          {/* Curriculum Breakdown */}
          <div className="bg-[#172033] border border-[#344054] rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#F4C76B]" />
              <span>Syllabus & Core Modules:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.curriculumHighlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F4C76B] shrink-0 mt-1.5 shadow-sm shadow-amber-500/50"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Learning Benefits */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Included Preparation Benefits:
            </h4>
            <div className="space-y-2">
              {course.keyBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#F4C76B] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For & Batch Info */}
          <div className="p-3 bg-[#172033] border border-[#344054] rounded-xl text-xs text-[#AAB4C3] space-y-1">
            <p>
              <strong className="text-[#F4C76B]">Target Audience:</strong> {course.suitableFor}
            </p>
            <p>
              <strong className="text-[#F4C76B]">Batch Timing:</strong> {course.batchType} (Contact academy for latest shift schedule)
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-[#344054] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#AAB4C3] hover:text-white cursor-pointer min-h-[44px]"
          >
            Back to Courses
          </button>

          <button
            onClick={() => {
              onClose();
              onEnquire(course.title);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#0F172A] bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] hover:brightness-105 shadow-md shadow-amber-900/20 border border-amber-300/40 flex items-center justify-center gap-2 cursor-pointer font-bold min-h-[44px]"
          >
            <Calendar className="w-4 h-4 text-[#0F172A]" />
            <span>Enquire for this Batch</span>
          </button>
        </div>

      </div>
    </div>
  );
};
