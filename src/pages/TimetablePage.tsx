import React from 'react';
import { Timetable } from '../components/Timetable';
import { navigateWithTransition } from '../components/StairsTransition';

export const TimetablePage: React.FC = () => {
  return (
    <div className="w-full">
      <Timetable onContactForBatch={() => navigateWithTransition('/contact')} />
    </div>
  );
};
export default TimetablePage;
