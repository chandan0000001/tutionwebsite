import React from 'react';
import { useLocation } from 'react-router-dom';
import { ContactSection } from '../components/ContactSection';
import { CallbackSection } from '../components/CallbackSection';

export const ContactPage: React.FC = () => {
  const location = useLocation();
  const preselectedCourse = (location.state as { preselectedCourse?: string })?.preselectedCourse || '';

  return (
    <div className="w-full">
      <ContactSection />
      <CallbackSection preselectedCourse={preselectedCourse} isStandalonePage={true} />
    </div>
  );
};
export default ContactPage;
