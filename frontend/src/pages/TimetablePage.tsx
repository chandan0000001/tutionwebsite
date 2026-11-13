import React from 'react';
import { TimetableSection } from '../components/sections/TimetableSection';
import { navigateWithTransition } from '../components/layout/StairsTransition';
import { SEO } from '../components/seo/SEO';

export const TimetablePage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="Class Routine & Timetable (Batch Schedules)"
        description="Check Antariksh Academy's daily lecture schedules, laboratory batches, test series timings, and evening 1-on-1 doubt clearing desk hours."
        canonicalPath="/timetable"
      />
      <TimetableSection onContactForBatch={() => navigateWithTransition('/contact')} />
    </div>
  );
};
export default TimetablePage;
