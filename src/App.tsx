import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { StairsTransition } from './components/StairsTransition';
import { ThemeProvider } from './context/ThemeContext';

// Statically import all pages to eliminate lazy-chunk network roundtrips during page transitions
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import FacultyPage from './pages/FacultyPage';
import ResultsPage from './pages/ResultsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import TimetablePage from './pages/TimetablePage';
import ConsultationPage from './pages/ConsultationPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <StairsTransition />
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111827] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 dark:text-[#F3F4F6] antialiased selection:bg-[#C6922E]/20 dark:selection:bg-[#F4C76B]/30 transition-colors duration-200">
          {/* Sticky Global Navigation */}
          <Navbar />

          {/* Dynamic Route Content - Instant swap synchronized with StairsTransition */}
          <main className="flex-1">
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
          </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
