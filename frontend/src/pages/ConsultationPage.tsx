import React from 'react';
import { useLocation } from 'react-router-dom';
import { ConsultationSection } from '../components/ConsultationSection';
import { SEO } from '../components/SEO';

export const ConsultationPage: React.FC = () => {
  const location = useLocation();
  const preselectedCourse = (location.state as { preselectedCourse?: string })?.preselectedCourse || '';

  return (
    <div className="w-full">
      <SEO
        title="Book 1-on-1 Academic Consultation & Campus Visit"
        description="Schedule a personalized 1-on-1 consultation session with Antariksh Academy's academic director. Get comprehensive roadmap guidance for +2 Science, JEE, and NEET preparation."
        canonicalPath="/consultation"
      />
      <ConsultationSection preselectedCourse={preselectedCourse} isStandalonePage={true} />
    </div>
  );
};
export default ConsultationPage;
