import React from 'react';
import { Teachers } from '../components/Teachers';
import { SEO } from '../components/SEO';

export const FacultyPage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="Expert Faculty & Senior Mentors"
        description="Meet Antariksh Academy's distinguished faculty team in Physics, Chemistry, Mathematics, and Biology. Highly experienced educators dedicated to personal student mentorship and concept mastery."
        canonicalPath="/faculty"
      />
      <Teachers />
    </div>
  );
};
export default FacultyPage;
