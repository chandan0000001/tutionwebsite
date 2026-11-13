import React from 'react';
import { FacultySection } from '../components/sections/FacultySection';
import { SEO } from '../components/seo/SEO';

export const FacultyPage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="Expert Faculty & Senior Mentors"
        description="Meet Antariksh Academy's distinguished faculty team in Physics, Chemistry, Mathematics, and Biology. Highly experienced educators dedicated to personal student mentorship and concept mastery."
        canonicalPath="/faculty"
      />
      <FacultySection />
    </div>
  );
};
export default FacultyPage;
