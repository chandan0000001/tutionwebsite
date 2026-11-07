import React from 'react';
import { Timetable } from '../components/Timetable';
import { navigateWithTransition } from '../components/StairsTransition';
import { SEO } from '../components/SEO';

export const TimetablePage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="Class Routine & Timetable (Batch Schedules)"
        description="Check Antariksh Academy's daily lecture schedules, laboratory batches, test series timings, and evening 1-on-1 doubt clearing desk hours."
        canonicalPath="/timetable"
      />
      <Timetable onContactForBatch={() => navigateWithTransition('/contact')} />
    </div>
  );
};
export default TimetablePage;
