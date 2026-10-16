import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageLoader } from './components/PageLoader';
import { ScrollToTop } from './components/ScrollToTop';
import { StairsTransition } from './components/StairsTransition';
import { ThemeProvider } from './context/ThemeContext';

// Code-split pages for high performance and on-demand section loading
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const FacultyPage = lazy(() => import('./pages/FacultyPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const FacilitiesPage = lazy(() => import('./pages/FacilitiesPage'));
const TimetablePage = lazy(() => import('./pages/TimetablePage'));
const ConsultationPage = lazy(() => import('./pages/ConsultationPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <StairsTransition />
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111827] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 dark:text-[#F3F4F6] antialiased selection:bg-[#C6922E]/20 dark:selection:bg-[#F4C76B]/30 transition-colors duration-200">
          {/* Sticky Global Navigation */}
          <Navbar />

        {/* Dynamic Route Content with Instant Suspense Transition */}
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/faculty" element={<FacultyPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/consultation" element={<ConsultationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              {/* Catch-all route defaults back to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
