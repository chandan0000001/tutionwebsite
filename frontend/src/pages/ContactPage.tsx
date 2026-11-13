import React from 'react';
import { useLocation } from 'react-router-dom';
import { ContactSection } from '../components/sections/ContactSection';
import { CallbackSection } from '../components/sections/CallbackSection';
import { SEO } from '../components/seo/SEO';

export const ContactPage: React.FC = () => {
  const location = useLocation();
  const preselectedCourse = (location.state as { preselectedCourse?: string })?.preselectedCourse || '';

  return (
    <div className="w-full">
      <SEO
        title="Contact Admissions Office | Bijipur, Brahmapur (Berhampur)"
        description="Connect with Antariksh Academy admissions team. Phone: +91 90901 60793. Address: Bijipur Big Street, Brahmapur, Odisha. Request an urgent callback or visit our center."
        canonicalPath="/contact"
      />
      <ContactSection />
      <CallbackSection preselectedCourse={preselectedCourse} isStandalonePage={true} />
    </div>
  );
};
export default ContactPage;
