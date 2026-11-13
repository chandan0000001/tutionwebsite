import React from 'react';
import { FacilitiesSection } from '../components/sections/FacilitiesSection';
import { SEO } from '../components/seo/SEO';

export const FacilitiesPage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="Campus Infrastructure & Facilities | Bijipur, Brahmapur"
        description="Tour Antariksh Academy's modern academic infrastructure in Bijipur, Brahmapur: soundproof classrooms, air-conditioned study rooms, 1-on-1 doubt clearing desks, and comprehensive science library."
        canonicalPath="/facilities"
      />
      <FacilitiesSection />
    </div>
  );
};
export default FacilitiesPage;
