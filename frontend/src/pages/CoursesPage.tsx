import React, { useState } from 'react';
import { Courses } from '../components/Courses';
import { CourseModal } from '../components/CourseModal';
import { navigateWithTransition } from '../components/StairsTransition';
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
