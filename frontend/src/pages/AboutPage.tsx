import React from 'react';
import { About } from '../components/About';
import { navigateWithTransition } from '../components/StairsTransition';
import { SEO } from '../components/SEO';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="About Our Academy & Academic Heritage"
        description="Learn about Antariksh Academy's history, disciplined 30-student cohort pedagogy, senior faculty mentorship, and 10+ years of +2 Science, JEE, and NEET excellence in Brahmapur, Odisha."
        canonicalPath="/about"
      />
      <About
        onLearnMoreCourses={() => navigateWithTransition('/courses')}
        onOpenConsultation={() => navigateWithTransition('/consultation')}
      />
    </div>
  );
};
export default AboutPage;
