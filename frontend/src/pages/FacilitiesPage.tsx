import React from 'react';
import { Facilities } from '../components/Facilities';
import { SEO } from '../components/SEO';

export const FacilitiesPage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="Campus Infrastructure & Facilities | Bijipur, Brahmapur"
        description="Tour Antariksh Academy's modern academic infrastructure in Bijipur, Brahmapur: soundproof classrooms, air-conditioned study rooms, 1-on-1 doubt clearing desks, and comprehensive science library."
        canonicalPath="/facilities"
      />
      <Facilities />
    </div>
  );
};
export default FacilitiesPage;
