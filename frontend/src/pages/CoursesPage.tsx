import React, { useState } from 'react';
import { Courses } from '../components/Courses';
import { CourseModal } from '../components/CourseModal';
import { navigateWithTransition } from '../components/StairsTransition';
import { SEO } from '../components/SEO';
import type { Course } from '../data/coursesData';

export const CoursesPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCourseForEnquiry = (courseTitle: string) => {
    navigateWithTransition('/contact', { preselectedCourse: courseTitle });
  };

  const handleViewCourseDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <SEO
        title="Academic Programs & Entrance Courses (+2 Science, JEE, NEET, OUAT)"
        description="Explore Antariksh Academy's specialized courses: +2 Science CHSE Odisha Board, JEE Main & Advanced, NEET-UG Medical, and OUAT & ICAR preparation with rigorous DPPs and personalized doubt clearing."
        canonicalPath="/courses"
      />
      <Courses
        onSelectCourseForEnquiry={handleSelectCourseForEnquiry}
        onViewCourseDetails={handleViewCourseDetails}
      />

      <CourseModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEnquire={handleSelectCourseForEnquiry}
      />
    </div>
  );
};
export default CoursesPage;
