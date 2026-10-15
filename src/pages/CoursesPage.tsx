import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Courses } from '../components/Courses';
import { CourseModal } from '../components/CourseModal';
import type { Course } from '../data/coursesData';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCourseForEnquiry = (courseTitle: string) => {
    navigate('/contact', { state: { preselectedCourse: courseTitle } });
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
