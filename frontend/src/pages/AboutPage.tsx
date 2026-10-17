import React from 'react';
import { About } from '../components/About';
import { navigateWithTransition } from '../components/StairsTransition';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full">
      <About
        onLearnMoreCourses={() => navigateWithTransition('/courses')}
        onOpenConsultation={() => navigateWithTransition('/consultation')}
      />
    </div>
  );
};
export default AboutPage;
