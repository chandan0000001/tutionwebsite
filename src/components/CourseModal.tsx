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
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-pink-50 text-[#BE125A] border border-pink-200">
                {course.badge}
              </span>
              <span className="text-xs text-[#0284C7] font-semibold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {course.targetStudents}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold font-['Outfit',sans-serif] text-slate-900">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {course.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Close Course Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Course Overview:
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {course.shortDescription}
            </p>
          </div>

          {/* Curriculum Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#FC1682]" />
              <span>Syllabus & Core Modules:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.curriculumHighlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FC1682] shrink-0 mt-1.5"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Learning Benefits */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Included Preparation Benefits:
            </h4>
            <div className="space-y-2">
              {course.keyBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For & Batch Info */}
          <div className="p-3 bg-pink-50/60 border border-pink-200 rounded-xl text-xs text-slate-800 space-y-1">
            <p>
              <strong className="text-[#BE125A]">Target Audience:</strong> {course.suitableFor}
            </p>
            <p>
              <strong className="text-[#BE125A]">Batch Timing:</strong> {course.batchType} (Contact academy for latest shift schedule)
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Back to Courses
          </button>

          <button
            onClick={() => {
              onClose();
              onEnquire(course.title);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Enquire for this Batch</span>
          </button>
        </div>

      </div>
    </div>
  );
};
