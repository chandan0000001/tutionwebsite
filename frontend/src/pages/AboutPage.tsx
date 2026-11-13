import React from 'react';
import { AboutSection } from '../components/sections/AboutSection';
import { navigateWithTransition } from '../components/layout/StairsTransition';
import { SEO } from '../components/seo/SEO';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="About Our Academy & Academic Heritage"
        description="Learn about Antariksh Academy's history, disciplined 30-student cohort pedagogy, senior faculty mentorship, and 10+ years of +2 Science, JEE, and NEET excellence in Brahmapur, Odisha."
        canonicalPath="/about"
      />
      <AboutSection
        onLearnMoreCourses={() => navigateWithTransition('/courses')}
        onOpenConsultation={() => navigateWithTransition('/consultation')}
      />
    </div>
  );
};
export default AboutPage;
