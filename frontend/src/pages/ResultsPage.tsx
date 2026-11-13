import React from 'react';
import { ResultsSection } from '../components/sections/ResultsSection';
import { SEO } from '../components/seo/SEO';

export const ResultsPage: React.FC = () => {
  return (
    <div className="w-full">
      <SEO
        title="Student Results & Entrance Ranks (JEE, NEET & CHSE Boards)"
        description="View Antariksh Academy's verifiable track record of top percentiles in JEE Main & Advanced (99.4%ile), NEET-UG medical allotments (678/720), and 100% first-class CHSE board passes."
        canonicalPath="/results"
      />
      <ResultsSection />
    </div>
  );
};
export default ResultsPage;
