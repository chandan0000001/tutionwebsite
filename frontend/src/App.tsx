import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { StairsTransition } from './components/StairsTransition';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Keep HomePage directly imported for instantaneous first paint on mobile & desktop
import HomePage from './pages/HomePage';

// Lazy-loaded secondary public pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const FacultyPage = lazy(() => import('./pages/FacultyPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const FacilitiesPage = lazy(() => import('./pages/FacilitiesPage'));
const TimetablePage = lazy(() => import('./pages/TimetablePage'));
const ConsultationPage = lazy(() => import('./pages/ConsultationPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));

// Lazy-loaded Student Portal Pages
const StudentLoginPage = lazy(() => import('./pages/student/StudentLoginPage'));
const ChangePasswordPage = lazy(() => import('./pages/student/ChangePasswordPage'));
const StudentDashboardPage = lazy(() => import('./pages/student/StudentDashboardPage'));
const RecordedLecturesPage = lazy(() => import('./pages/student/RecordedLecturesPage'));
const StudentProfilePage = lazy(() => import('./pages/student/StudentProfilePage'));

// Lazy-loaded Teacher Admin Portal Pages
const TeacherDashboardPage = lazy(() => import('./pages/teacher/TeacherDashboardPage'));
const TeacherStudentsPage = lazy(() => import('./pages/teacher/TeacherStudentsPage'));
const TeacherLecturesPage = lazy(() => import('./pages/teacher/TeacherLecturesPage'));
const TeacherProfilePage = lazy(() => import('./pages/teacher/TeacherProfilePage'));
const TeacherChangePasswordPage = lazy(() => import('./pages/teacher/TeacherChangePasswordPage'));

// Lazy-loaded Superadmin Portal Pages
const SuperadminDashboardPage = lazy(() => import('./pages/superadmin/SuperadminDashboardPage'));
const SuperadminBatchesPage = lazy(() => import('./pages/superadmin/SuperadminBatchesPage'));
const SuperadminTeachersPage = lazy(() => import('./pages/superadmin/SuperadminTeachersPage'));
const SuperadminStudentsPage = lazy(() => import('./pages/superadmin/SuperadminStudentsPage'));
const SuperadminLecturesPage = lazy(() => import('./pages/superadmin/SuperadminLecturesPage'));
const SuperadminAuditLogsPage = lazy(() => import('./pages/superadmin/SuperadminAuditLogsPage'));
const SuperadminProfilePage = lazy(() => import('./pages/superadmin/SuperadminProfilePage'));
const SuperadminChangePasswordPage = lazy(() => import('./pages/superadmin/SuperadminChangePasswordPage'));

function RouteLoadingFallback() {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3"
      role="status"
      aria-label="Loading page"
    >
      <div className="w-8 h-8 border-3 border-slate-300 dark:border-[#344054] border-t-[#17365D] dark:border-t-[#F4C76B] rounded-full animate-spin"></div>
      <span className="sr-only">Loading page content...</span>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <StairsTransition />
          <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111827] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 dark:text-[#F3F4F6] antialiased selection:bg-[#C6922E]/20 dark:selection:bg-[#F4C76B]/30 transition-colors duration-200">
            {/* Sticky Global Navigation */}
            <Navbar />

            {/* Dynamic Route Content - Instant swap synchronized with StairsTransition */}
            <main className="flex-1">
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                  {/* Public Institute Website Routes */}
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

                {/* Authentication Routes */}
                <Route path="/student/login" element={<StudentLoginPage />} />
                <Route path="/login" element={<StudentLoginPage />} />
                <Route path="/teacher/login" element={<StudentLoginPage />} />
                <Route path="/superadmin/login" element={<StudentLoginPage />} />

                {/* Protected Student Portal Routes */}
                <Route
                  path="/student/change-password"
                  element={
                    <ProtectedRoute allowedRoles={['student']} allowPasswordChangeOnly>
                      <ChangePasswordPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/lectures"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <RecordedLecturesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Teacher Admin Portal Routes */}
                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['teacher', 'superadmin']}>
                      <TeacherDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/students"
                  element={
                    <ProtectedRoute allowedRoles={['teacher', 'superadmin']}>
                      <TeacherStudentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/lectures"
                  element={
                    <ProtectedRoute allowedRoles={['teacher', 'superadmin']}>
                      <TeacherLecturesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/profile"
                  element={
                    <ProtectedRoute allowedRoles={['teacher', 'superadmin']}>
                      <TeacherProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/change-password"
                  element={
                    <ProtectedRoute
                      allowedRoles={['teacher', 'superadmin']}
                      allowPasswordChangeOnly
                    >
                      <TeacherChangePasswordPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Superadmin Portal Routes */}
                <Route
                  path="/superadmin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperadminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/superadmin/batches"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperadminBatchesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/superadmin/teachers"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperadminTeachersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/superadmin/students"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperadminStudentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/superadmin/lectures"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperadminLecturesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/superadmin/audit-logs"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperadminAuditLogsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/superadmin/profile"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <SuperadminProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/superadmin/change-password"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']} allowPasswordChangeOnly>
                      <SuperadminChangePasswordPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all route defaults back to Home */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </BrowserRouter>
        <Analytics />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
