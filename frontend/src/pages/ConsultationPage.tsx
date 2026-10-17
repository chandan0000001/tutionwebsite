import React from 'react';
import { useLocation } from 'react-router-dom';
import { ConsultationSection } from '../components/ConsultationSection';

export const ConsultationPage: React.FC = () => {
  const location = useLocation();
  const preselectedCourse = (location.state as { preselectedCourse?: string })?.preselectedCourse || '';

  return (
    <div className="w-full">
      <ConsultationSection preselectedCourse={preselectedCourse} isStandalonePage={true} />
    </div>
  );
};
export default ConsultationPage;
