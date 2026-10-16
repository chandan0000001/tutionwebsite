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
      <div className="bg-[#141824] border-2 border-pink-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-pink-500/20 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#0D1017] text-pink-300 border border-pink-500/35">
                {course.badge}
              </span>
              <span className="text-xs text-[#38BDF8] font-semibold bg-[#38BDF8]/15 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                {course.targetStudents}
              </span>
            </div>
            <h3 className="text-2xl font-black font-['Outfit',sans-serif] text-white">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {course.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#0D1017] hover:bg-[#1C2232] text-slate-300 hover:text-white border border-pink-500/25 transition-colors cursor-pointer"
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
            <p className="text-sm text-slate-200 leading-relaxed">
              {course.shortDescription}
            </p>
          </div>

          {/* Curriculum Breakdown */}
          <div className="bg-[#0D1017] border border-pink-500/20 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#FC1682]" />
              <span>Syllabus & Core Modules:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.curriculumHighlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FC1682] shrink-0 mt-1.5 shadow-sm shadow-pink-500/50"></div>
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
                  <CheckCircle2 className="w-4 h-4 text-[#FC1682] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For & Batch Info */}
          <div className="p-3 bg-[#0D1017] border border-pink-500/25 rounded-xl text-xs text-slate-200 space-y-1">
            <p>
              <strong className="text-pink-300">Target Audience:</strong> {course.suitableFor}
            </p>
            <p>
              <strong className="text-pink-300">Batch Timing:</strong> {course.batchType} (Contact academy for latest shift schedule)
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            Back to Courses
          </button>

          <button
            onClick={() => {
              onClose();
              onEnquire(course.title);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] hover:from-[#FF2D92] hover:to-[#FC1682] shadow-md shadow-pink-600/30 border border-pink-400/40 flex items-center justify-center gap-2 cursor-pointer font-bold"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Enquire for this Batch</span>
          </button>
        </div>

      </div>
    </div>
  );
};
