import React from 'react';
import { useNavigate } from 'react-router-dom';
import { About } from '../components/About';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <About
        onLearnMoreCourses={() => navigate('/courses')}
        onOpenConsultation={() => navigate('/consultation')}
      />
    </div>
  );
};
export default AboutPage;
