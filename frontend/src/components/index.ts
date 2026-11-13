/**
 * @file components/index.ts
 * Centralized Component Architecture for Antariksh Academy
 *
 * Organized by respective domain and functional responsibility:
 * - layout/   : Shell navigation (Navbar, Footer, ScrollToTop, StairsTransition)
 * - home/     : Homepage interactive modules (HeroLeadForm, CampusCarousel, FaqSection)
 * - sections/ : Public page content sections (About, Courses, Faculty, Facilities, Results, Timetable, etc.)
 * - modals/   : Interactive dialogs (CourseModal, LightboxModal, GoogleMeetGuideModal)
 * - common/   : Reusable UI primitives (SpecularCard, MagneticButton, LoadingButton, SkeletonLoader, etc.)
 * - auth/     : Route guards & access control (ProtectedRoute)
 * - seo/      : Document metadata & Open Graph management (SEO)
 * - canvas/   : Ambient background visuals (CosmicBackgroundCanvas)
 * - teacher/  : Teacher dashboard components (TeacherHeader)
 * - superadmin/ : Superadmin dashboard components (SuperadminHeader)
 */

// 1. Layout & Shell
export * from './layout';

// 2. Homepage Modules
export * from './home/HeroLeadForm';
export * from './home/CampusCarousel';
export * from './home/FaqSection';

// 3. Page Sections
export * from './sections';

// 4. Modals & Dialogs
export * from './modals';

// 5. Common UI Primitives
export * from './common/SpecularCard';
export * from './common/MagneticButton';
export * from './common/LoadingButton';
export * from './common/LoadingSpinner';
export * from './common/SkeletonLoader';
export * from './common/NotificationBanner';
export * from './common/ConfirmModal';
export * from './common/CredentialsModal';

// 6. Access Control & Shell
export * from './auth/ProtectedRoute';

// 7. SEO & Visual Canvas
export * from './seo/SEO';
export * from './canvas/CosmicBackgroundCanvas';

// 8. Role Headers
export * from './teacher/TeacherHeader';
export * from './superadmin/SuperadminHeader';
