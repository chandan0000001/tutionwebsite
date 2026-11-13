# Antariksh Academy — Codebase Architecture & File Organization Guide

This document provides a human-readable guide to the codebase organization across both backend and frontend. Files are structured strictly according to their functional domain ("working") with intuitive, self-describing names.

---

## 1. Backend Architecture (`backend/src`)

The backend follows an idiomatic, layered Model-Controller-Route (MVC) architecture with clear separation of concerns.

```
backend/src/
├── app.js                          # Express application configuration, security middleware, route registration
├── server.js                       # HTTP server entrypoint, database and Redis cluster lifecycle management
│
├── config/                         # Environment & Service Configuration
│   ├── env.js                      # Centralized environment variable validator and typed config
│   ├── db.js                       # MongoDB Atlas Mongoose connection pool management
│   └── redis.js                    # Redis client initialization, token blacklist, and caching helpers
│
├── controllers/                    # Business Logic Controllers (by Domain)
│   ├── authController.js           # Login, logout, session verification (/me), password change
│   ├── studentController.js        # Student profile and dashboard data retrieval
│   ├── studentBatchController.js   # Student batch code assignment and multi-batch associations
│   ├── teacherController.js        # Teacher portal: student roster, batch views, lecture creation
│   ├── superadminController.js     # Superadmin portal: batch management, teacher & student CRUD, audit logs
│   └── lectureController.js        # Video lecture feed and subject categorization for enrolled students
│
├── middleware/                     # Express Request Lifecycle Interceptors
│   ├── authMiddleware.js           # JWT verification, active user checks, tokenVersion validation, role guards
│   ├── validateRequest.js          # Joi / schema validation for incoming request payloads
│   └── errorHandler.js             # Centralized error handler returning sanitized JSON responses
│
├── models/                         # Mongoose Data Schemas & Models
│   ├── Student.js                  # Student accounts, roll numbers, credentials, assigned batches
│   ├── Staff.js                    # Teacher and Superadmin accounts, qualifications, assigned batches
│   ├── Batch.js                    # Batch cohorts (+2 Science, JEE, NEET, OUAT/ICAR) and subject mappings
│   ├── Lecture.js                  # Video lectures (YouTube / Streamable links, topics, Drive notes, batches)
│   ├── Session.js                  # Active sessions and token revocation tracking in MongoDB
│   ├── LoginRateLimit.js           # IP and username-based brute force protection counters
│   └── AuditLog.js                 # Immutable audit logs for critical admin actions (password resets, deletions)
│
├── routes/                         # API Route Definitions (by Domain)
│   ├── healthRoutes.js             # GET /api/health (service health, database, and Redis checks)
│   ├── authRoutes.js               # POST /api/auth/login, logout, change-password, me
│   ├── studentRoutes.js            # GET /api/student/profile, dashboard
│   ├── studentBatchRoutes.js       # GET/POST /api/students/batches
│   ├── teacherRoutes.js            # /api/teacher/* (students, batches, lecture uploads)
│   ├── superadminRoutes.js         # /api/superadmin/* (students, teachers, batches, audit-logs, lectures)
│   └── lectureRoutes.js            # /api/lectures/* (student lecture player and subjects)
│
├── services/                       # Third-Party & Shared Services
│   └── excelService.js             # Student Excel import and formatted template generation
│
└── utils/                          # Pure Helper & Utility Functions
    ├── mediaValidator.js           # Centralized validator & embed generator for YouTube, Streamable & Google Drive
    ├── youtube.js                  # Re-export of mediaValidator.js for backward compatibility
    ├── token.js                    # JWT signing, verification, and payload extraction
    ├── sessionManager.js           # Database-backed session creation, validation, and token revocation
    ├── loginRateLimiter.js         # Brute-force throttling logic
    ├── phone.js                    # Standard Indian 10-digit mobile number sanitization & validation
    ├── usernameGenerator.js        # Automated username generation for newly admitted students and teachers
    ├── sanitizeSearch.js           # Regex special-character escaping for secure text queries
    └── auditLogger.js              # Standardized audit event dispatcher
```

---

## 2. Frontend Architecture (`frontend/src`)

The frontend is built with React 19, TypeScript, and Vite. Components are stored strictly according to their domain and UI responsibility.

```
frontend/src/
├── main.tsx                        # React application bootstrap and DOM root mounting
├── App.tsx                         # Root router, lazy-loaded page route registration, global shell
├── App.css / index.css             # Tailwind CSS styles and luxury typographic system
│
├── components/                     # Component Library (Organized by Domain)
│   │
│   ├── layout/                     # Global Shell & Navigation
│   │   ├── Navbar.tsx              # Main responsive navigation bar (desktop + mobile drawer)
│   │   ├── Footer.tsx              # Architectural institutional footer
│   │   ├── ScrollToTop.tsx         # Scroll-reset on route change
│   │   ├── StairsTransition.tsx    # Smooth 5-column cascade page transition
│   │   └── index.ts                # Centralized layout barrel export
│   │
│   ├── home/                       # Homepage-Specific Interactive Modules
│   │   ├── HeroLeadForm.tsx        # Isolated above-the-fold callback / parent meeting enquiry form
│   │   ├── CampusCarousel.tsx      # Auto-swiping photo album carousel (3.8s timer with pause on hover)
│   │   └── FaqSection.tsx          # Self-contained expandable FAQ accordion
│   │
│   ├── sections/                   # Public Page Content Sections (Reusable & Testable)
│   │   ├── AboutSection.tsx        # Institutional history, pedagogy, 30-student cohort model
│   │   ├── CoursesSection.tsx      # Course cards, filterable tabs (Board / Entrance / Integrated)
│   │   ├── FacultySection.tsx      # Senior faculty mentors and academic leadership profiles
│   │   ├── FacilitiesSection.tsx   # Campus facilities gallery with categories
│   │   ├── ResultsSection.tsx      # 10-year academic track record, toppers, and percentiles
│   │   ├── TimetableSection.tsx    # Daily schedule, morning/evening sessions, batch slots
│   │   ├── ContactSection.tsx      # Office location, Google Maps directions, phone contacts
│   │   ├── ConsultationSection.tsx # 1-on-1 Google Meet consultation scheduling workflow
│   │   ├── CallbackSection.tsx     # Urgent admissions callback request form
│   │   └── index.ts                # Centralized sections barrel export
│   │
│   ├── modals/                     # Interactive Dialog Modals
│   │   ├── CourseModal.tsx         # Course syllabus, batch features, and curriculum modal
│   │   ├── LightboxModal.tsx       # Campus photo gallery zoom viewer with keyboard navigation
│   │   ├── GoogleMeetGuideModal.tsx# Instructions for parents joining online consultations
│   │   └── index.ts                # Centralized modals barrel export
│   │
│   ├── common/                     # Reusable UI Primitives (Zero State Re-render Optimized)
│   │   ├── SpecularCard.tsx        # Card with ref-based CSS variable radial glow & subtle tilt
│   │   ├── MagneticButton.tsx      # Button with ref-based GPU translate3d cursor attraction
│   │   ├── LoadingButton.tsx       # Button with integrated spinning spinner and disabled state
│   │   ├── LoadingSpinner.tsx      # Branded animated SVG spinner
│   │   ├── SkeletonLoader.tsx      # Card and table placeholder shimmer loaders
│   │   ├── NotificationBanner.tsx  # Floating dismissible success / error alerts
│   │   ├── ConfirmModal.tsx        # Danger / Warning confirmation dialogs
│   │   └── CredentialsModal.tsx    # Post-creation modal displaying new student login credentials
│   │
│   ├── auth/                       # Access Control
│   │   └── ProtectedRoute.tsx      # Route guard verifying JWT auth and matching role permissions
│   │
│   ├── seo/                        # Document Head Management
│   │   ├── SEO.tsx                 # React 19 native metadata tags (<title>, <meta>, <link>)
│   │   └── index.ts                # Centralized SEO barrel export
│   │
│   ├── canvas/                     # Visual Background Visuals
│   │   └── CosmicBackgroundCanvas.tsx # Ambient canvas particle starfield (memoized)
│   │
│   ├── teacher/                    # Teacher Dashboard UI Components
│   │   └── TeacherHeader.tsx       # Header with teacher profile, navigation tabs, and logout
│   │
│   ├── superadmin/                 # Superadmin Dashboard UI Components
│   │   └── SuperadminHeader.tsx    # Header with superadmin stats, audit links, and quick actions
│   │
│   └── index.ts                    # Master component library entrypoint
│
├── pages/                          # Routed Views (Connected to React Router)
│   ├── HomePage.tsx                # Master landing page (lightweight, zero-re-render orchestration)
│   ├── AboutPage.tsx               # /about
│   ├── CoursesPage.tsx             # /courses
│   ├── FacultyPage.tsx             # /faculty
│   ├── FacilitiesPage.tsx          # /facilities
│   ├── ResultsPage.tsx             # /results
│   ├── TimetablePage.tsx           # /timetable
│   ├── ContactPage.tsx             # /contact
│   ├── ConsultationPage.tsx        # /consultation
│   ├── PrivacyPolicyPage.tsx       # /privacy-policy
│   ├── NotFoundPage.tsx            # 404 handler
│   │
│   ├── student/                    # Student Portal Views
│   │   ├── StudentLoginPage.tsx    # /student/login
│   │   ├── StudentDashboardPage.tsx# /student/dashboard
│   │   ├── RecordedLecturesPage.tsx# /student/lectures (video player + Google Drive notes)
│   │   ├── StudentProfilePage.tsx  # /student/profile
│   │   └── ChangePasswordPage.tsx  # /student/change-password
│   │
│   ├── teacher/                    # Teacher Portal Views
│   │   ├── TeacherDashboardPage.tsx# /teacher/dashboard
│   │   ├── TeacherStudentsPage.tsx # /teacher/students (batch roster and Excel export)
│   │   ├── TeacherLecturesPage.tsx # /teacher/lectures (upload YouTube/Streamable & Drive notes)
│   │   ├── TeacherProfilePage.tsx  # /teacher/profile
│   │   └── TeacherChangePasswordPage.tsx # /teacher/change-password
│   │
│   └── superadmin/                 # Superadmin Portal Views
│       ├── SuperadminDashboardPage.tsx # /superadmin/dashboard
│       ├── SuperadminStudentsPage.tsx  # /superadmin/students (student CRUD, credentials, reset)
│       ├── SuperadminTeachersPage.tsx  # /superadmin/teachers (teacher CRUD, batch assignments)
│       ├── SuperadminBatchesPage.tsx   # /superadmin/batches (batch management, subject setups)
│       ├── SuperadminLecturesPage.tsx  # /superadmin/lectures (global video repository)
│       ├── SuperadminAuditLogsPage.tsx # /superadmin/audit-logs (security audit trail)
│       ├── SuperadminProfilePage.tsx   # /superadmin/profile
│       └── SuperadminChangePasswordPage.tsx # /superadmin/change-password
│
├── context/                        # Global State Providers
│   ├── AuthContext.tsx             # User authentication, token lifecycle, session refresh (useMemoized)
│   ├── ThemeContext.tsx            # Light / dark theme toggle with localStorage persistence (useMemoized)
│   └── SoundContext.tsx            # Subtle acoustic feedback engine
│
├── services/                       # Network & External API Services
│   └── formSubmission.ts           # Client-side enquiry & callback submission handler
│
├── utils/                          # Frontend Helper Functions
│   ├── mediaUtils.ts               # Video parsing (YouTube, Streamable), Drive previews, app deep-links
│   ├── video.ts                    # Backward-compatible re-export of mediaUtils.ts
│   ├── navigation.ts               # Route prefetching and transition coordinator
│   ├── validation.ts               # Indian mobile number and input sanitation
│   ├── googleCalendar.ts           # Google Meet consultation event helper
│   └── soundEngine.ts              # Web Audio API procedural sound synthesizer
│
└── data/                           # Static Content & Configuration Data
    ├── coursesData.ts              # Detailed syllabus for CHSE, JEE, NEET, OUAT
    ├── facultyData.ts              # Faculty biographies, qualifications, teaching domains
    ├── facilitiesData.ts           # Campus facility photos, locations, and descriptions
    ├── resultsData.ts              # 10-year topper percentiles and board marks
    ├── testimonialsData.ts         # Verified student and parent testimonials
    └── timetableData.ts            # Daily batch schedules and lecture timings
```

---

## 3. Key Design & Performance Principles

1. **Self-Describing Working Folders**:
   Components that serve a common architectural function (layout, sections, modals, common primitives) live together in dedicated folders.
2. **Backward Compatibility**:
   Root component files (e.g. `components/Navbar.tsx`, `components/About.tsx`, `utils/video.ts`, `backend/utils/youtube.js`) act as transparent re-exports so that any legacy import path continues to work with zero broken imports.
3. **Zero State Mouse Animations**:
   `SpecularCard` and `MagneticButton` update CSS variables and GPU transforms directly through element refs, ensuring 0 React virtual-DOM re-renders during mouse movement.
4. **Isolated Page States**:
   Heavy pages like `HomePage` delegate high-frequency state (form keystrokes, carousel interval timers, FAQ accordion toggles) to self-contained memoized child components (`HeroLeadForm`, `CampusCarousel`, `FaqSection`), keeping the page render tree static and fast.
5. **Modern React 19 Document Metadata**:
   The `SEO` component uses React 19's native `<title>`, `<meta>`, and `<link>` JSX hoisting, eliminating manual `document.head.appendChild()` DOM mutations.
