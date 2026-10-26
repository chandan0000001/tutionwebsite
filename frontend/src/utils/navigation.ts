/**
 * Global helper to trigger page navigation through the staircase transition
 */
export const navigateWithTransition = (path: string, state?: unknown) => {
  window.dispatchEvent(
    new CustomEvent('page-transition-navigate', { detail: { path, state } })
  );
};

// Route preloader registry for lazy portal routes
const PORTAL_PRELOADERS: Record<string, () => Promise<unknown>> = {
  '/student/login': () => import('../pages/student/StudentLoginPage'),
  '/login': () => import('../pages/student/StudentLoginPage'),
  '/teacher/login': () => import('../pages/student/StudentLoginPage'),
  '/superadmin/login': () => import('../pages/student/StudentLoginPage'),
  '/student/change-password': () => import('../pages/student/ChangePasswordPage'),
  '/student/dashboard': () => import('../pages/student/StudentDashboardPage'),
  '/student/lectures': () => import('../pages/student/RecordedLecturesPage'),
  '/student/profile': () => import('../pages/student/StudentProfilePage'),
  '/teacher/dashboard': () => import('../pages/teacher/TeacherDashboardPage'),
  '/teacher/students': () => import('../pages/teacher/TeacherStudentsPage'),
  '/teacher/lectures': () => import('../pages/teacher/TeacherLecturesPage'),
  '/teacher/profile': () => import('../pages/teacher/TeacherProfilePage'),
  '/teacher/change-password': () => import('../pages/teacher/TeacherChangePasswordPage'),
  '/superadmin/dashboard': () => import('../pages/superadmin/SuperadminDashboardPage'),
  '/superadmin/batches': () => import('../pages/superadmin/SuperadminBatchesPage'),
  '/superadmin/teachers': () => import('../pages/superadmin/SuperadminTeachersPage'),
  '/superadmin/students': () => import('../pages/superadmin/SuperadminStudentsPage'),
  '/superadmin/lectures': () => import('../pages/superadmin/SuperadminLecturesPage'),
  '/superadmin/audit-logs': () => import('../pages/superadmin/SuperadminAuditLogsPage'),
  '/superadmin/profile': () => import('../pages/superadmin/SuperadminProfilePage'),
  '/superadmin/change-password': () => import('../pages/superadmin/SuperadminChangePasswordPage'),
};

export const preloadRoute = (path: string) => {
  const normalizedPath = path.split('?')[0].split('#')[0];
  const loader = PORTAL_PRELOADERS[normalizedPath];
  if (loader) {
    return loader().catch(() => {});
  }
  return Promise.resolve();
};
