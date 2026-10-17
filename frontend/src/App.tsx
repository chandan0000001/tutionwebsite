import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { StairsTransition } from './components/StairsTransition';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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

// Student Portal Pages
import StudentLoginPage from './pages/student/StudentLoginPage';
import ChangePasswordPage from './pages/student/ChangePasswordPage';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import RecordedLecturesPage from './pages/student/RecordedLecturesPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Teacher Admin Portal Pages
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
import TeacherStudentsPage from './pages/teacher/TeacherStudentsPage';
import TeacherLecturesPage from './pages/teacher/TeacherLecturesPage';
import TeacherProfilePage from './pages/teacher/TeacherProfilePage';
import TeacherChangePasswordPage from './pages/teacher/TeacherChangePasswordPage';

// Superadmin Portal Pages
import SuperadminDashboardPage from './pages/superadmin/SuperadminDashboardPage';
import SuperadminBatchesPage from './pages/superadmin/SuperadminBatchesPage';
import SuperadminTeachersPage from './pages/superadmin/SuperadminTeachersPage';
import SuperadminStudentsPage from './pages/superadmin/SuperadminStudentsPage';
import SuperadminLecturesPage from './pages/superadmin/SuperadminLecturesPage';
import SuperadminAuditLogsPage from './pages/superadmin/SuperadminAuditLogsPage';
import SuperadminProfilePage from './pages/superadmin/SuperadminProfilePage';
import SuperadminChangePasswordPage from './pages/superadmin/SuperadminChangePasswordPage';

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
            </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
