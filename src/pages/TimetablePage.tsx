import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Timetable } from '../components/Timetable';

export const TimetablePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Timetable onContactForBatch={() => navigate('/contact')} />
    </div>
  );
};
export default TimetablePage;
