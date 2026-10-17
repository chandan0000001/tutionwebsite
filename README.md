# Antariksh Academy — Institute Management & Lecture Portal System

Official web platform for **Antariksh Academy Coaching Institute** (Bijipur, Brahmapur, Odisha), featuring a responsive public institute website, Cal.com consultation booking, parent callback inquiry system, and a **Role-Based Management & Lecture Portal** supporting three distinct user tiers:

1. **`student`**: Enrolled students access batch-isolated recorded lectures and profile records.
2. **`teacher`**: Faculty administrators manage student rosters and lecture metadata for assigned batches.
3. **`superadmin`**: Institute leadership exercises master oversight across all batches, teachers, students, lectures, and audit logs.

---

## 1. Repository Architecture

The project is organized into separate, decoupled frontend and backend applications:

```text
antariksh-academy/
├── .gitignore                    # Universal root gitignore
├── README.md                     # Master documentation & deployment guide
│
├── frontend/                     # React 19 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/           # Public UI & Role-Specific Components
│   │   │   ├── auth/             # ProtectedRoute with role enforcement & 403 fallback
│   │   │   ├── common/           # CredentialsModal for one-time temporary passwords
│   │   │   ├── superadmin/       # SuperadminHeader & master navigation tabs
│   │   │   └── teacher/          # TeacherHeader & faculty navigation tabs
│   │   ├── config/               # Public API & Academy Configurations
│   │   ├── context/              # AuthContext (role-aware) & ThemeContext
│   │   ├── data/                 # Course, faculty, timetable & testimonials
│   │   ├── pages/                # Public Institute & Portal Pages
│   │   │   ├── student/          # Login, Change Password, Dashboard, Lectures, Profile
│   │   │   ├── teacher/          # Dashboard, Students, Lectures, Profile, Change Password
│   │   │   └── superadmin/       # Overview, Batches, Teachers, Students, Lectures, Audit Logs
│   │   ├── services/             # FormSubmit admissions submission
│   │   ├── utils/                # Calendar & validation helpers
│   │   ├── App.tsx               # Route declarations & synchronized transitions
│   │   └── main.tsx              # Application entry point
│   ├── public/                   # Logos, faculty assets, favicon
│   ├── package.json              # Frontend scripts & dependencies
│   ├── vite.config.ts            # Vite 8 build & bundler configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vercel.json               # SPA client routing rewrite rules
│   ├── .env                      # Local frontend variables (git-ignored)
│   └── .env.example              # Public frontend environment template
│
└── backend/                      # Node.js + Express + MongoDB REST API
    ├── src/
    │   ├── config/               # Database connection & environment validation
    │   ├── controllers/          # Auth, Teacher, Superadmin & Lecture controllers
    │   ├── middleware/           # Role-based auth (requireRole, requireAssignedBatch, etc.)
    │   ├── models/               # Batch, Staff, Student, Lecture, AuditLog schemas
    │   ├── routes/               # Routes (/api/auth, /api/teacher, /api/superadmin, /api/lectures)
    │   ├── services/             # Excel template generation & streaming parser (ExcelJS)
    │   ├── utils/                # JWT Token, YouTube Embed & Audit Logger utilities
    │   ├── app.js                # Express app with Helmet, CORS & Rate Limits
    │   └── server.js             # Server startup & graceful shutdown handlers
    ├── data/
    │   ├── students/             # Batch-wise student JSON files (batch-2026.json, batch-2027.json)
    │   └── lectures/             # Sample lecture seed data
    ├── scripts/
    │   ├── seedStudents.js       # Student & lecture seeding script
    │   └── seedStaff.js          # Staff bootstrap script (Superadmin & initial Teachers)
    ├── tests/                    # Built-in Node.js unit test suite
    │   └── unit.test.js
    ├── package.json              # Backend scripts & dependencies (exceljs, multer, bcryptjs)
    ├── .env                      # Local backend variables (git-ignored)
    └── .env.example              # Backend environment template
```

---

## 2. Quick Start & Local Development

### Prerequisites
- **Node.js**: v18+ (tested on Node.js v24.18.0)
- **MongoDB**: Local MongoDB community instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI

### Step 1: Install Dependencies
Open two terminal windows or run sequentially:

```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Install backend dependencies (includes exceljs, multer, bcryptjs)
cd ../backend
npm install
```

### Step 2: Configure Local Environment Variables
Create `.env` in both folders using the provided `.env.example` templates:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

### Step 3: Seed Database & Bootstrap Administrative Staff

Make sure your MongoDB server is running (locally at `mongodb://127.0.0.1:27017/antariksh_academy` or configured via `MONGODB_URI` in `backend/.env`).

```bash
cd backend

# A. Bootstrap Batches, Superadmin & Teachers (idempotent, displays one-time passwords once in console)
npm run bootstrap:staff

# B. Seed Students & Sample Lectures
npm run seed:students
```

#### Bootstrapped Staff Accounts (for initial setup & testing):
- **Superadmin**: Username: `aa_superadmin` (temporary 8-digit password printed upon bootstrap)
- **Faculty Teacher 1**: Username: `aa_teacher_subrat` (assigned: `BATCH-2026`, `BATCH-2027`)
- **Faculty Teacher 2**: Username: `aa_teacher_kalyani` (assigned: `BATCH-2026`)

*Note: All bootstrapped staff have `mustChangePassword: true` and are prompted to choose a private personal password upon first sign-in.*

### Step 4: Run the Applications

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Vite dev server starts on http://localhost:5173
```

---

## 3. Role-Based Access Control (RBAC) System

The application strictly enforces role permissions on the backend through middleware, preventing unauthorized access even if a client modifies client-side state.

| Role | Accessible Frontend Routes | Key Backend Permissions |
| :--- | :--- | :--- |
| **`student`** | `/student/*` | Stream recorded lectures for assigned batch, view profile, change password |
| **`teacher`** | `/teacher/*` | Manage students & lectures in **assigned batches only**, bulk Excel student import, change own password |
| **`superadmin`** | `/superadmin/*`, `/teacher/*` | Master control: batch CRUD, teacher provisioning, password reset, cross-batch student & lecture management, full audit trail |

### Batch Scoping for Teachers
Teacher operations enforce the `requireAssignedBatch` middleware. If a teacher attempts to view, add, or edit students/lectures in a batch not in their `assignedBatches` array, the server returns a `403 Forbidden` error.

---

## 4. Bulk Excel Student Import

Both Teachers (scoped to an assigned batch) and Superadmins (for any batch) can import students in bulk using Microsoft Excel (`.xlsx` files):

1. **Download Template**: Click **"Bulk Excel Import"** -> **"Download .xlsx"** on the Students management page.
2. **Canonical Columns**:
   - `name`: Student full name (required, min 2 characters)
   - `phone`: 10-digit Indian mobile number (required, uniqueness enforced)
   - `dateOfBirth`: Date of birth (required, format: `YYYY-MM-DD` or text)
   - `email`: Student email (optional, validated)
   - `address`: Residential address (optional)
   - `college`: School / Junior College name (optional)
   - `fatherName`: Father's name (optional)
   - `motherName`: Mother's name (optional)
3. **Validation & Account Generation**:
   - Skips empty rows.
   - Detects in-sheet duplicates by phone and email.
   - Generates deterministic unique usernames (e.g. `aa26_aarav`).
   - Generates cryptographically secure 8-digit temporary passwords.
   - Displays a comprehensive import summary with newly created credentials ready to copy or export.

---

## 5. Security & Audit Logging

- **Cryptographic Passwords**: Passwords stored exclusively as `bcrypt` hashes with 12 salt rounds (`ENV.BCRYPT_SALT_ROUNDS`). Plaintext passwords or hashes are never returned by any endpoint or log.
- **Audit Trails**: Sensitive actions (`STUDENT_CREATE`, `STUDENT_UPDATE`, `STUDENT_DEACTIVATE`, `TEACHER_CREATE`, `TEACHER_UPDATE`, `PASSWORD_RESET`, `PASSWORD_CHANGE`, `EXCEL_IMPORT`, `BATCH_CREATE`, `BATCH_UPDATE`, `LECTURE_CREATE`, `LECTURE_DELETE`) are saved to the `AuditLog` collection with actor username, role, action, target, timestamp, and sanitized metadata.
- **Generic Auth Errors**: Login endpoint returns generic `"Invalid username or password."` to eliminate username enumeration attacks.
- **Brute Force Protection**: Express rate limiters protect `/api/auth/login` (10 attempts per 15 min per IP) and `/api/auth/change-password`.
- **Security Headers & CORS**: `helmet` configured with strict cross-origin policies; CORS restricted to `FRONTEND_URL`.

---

## 6. Environment Variables Reference

### Frontend (`frontend/.env`)
> **Security Rule:** All `VITE_*` variables are embedded into public client JavaScript. Never place MongoDB credentials or secrets here.

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Base URL of the backend API |
| `VITE_CALCOM_BOOKING_URL` | `https://cal.com/antarikshacademy/30min?overlayCalendar=true` | Official Cal.com consultation booking URL |
| `VITE_FORMSUBMIT_EMAIL` | `kumardalaichandan803@gmail.com` | Destination inbox for parent callback forms |

### Backend (`backend/.env`)
> **Security Rule:** Keep `backend/.env` strictly out of Git version control.

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Yes | `development` | Set to `production` in production deployment |
| `PORT` | No | `5000` | Port on which Express server listens |
| `MONGODB_URI` | Yes | `mongodb://127.0.0.1:27017/antariksh_academy` | Local MongoDB or MongoDB Atlas URI |
| `JWT_SECRET` | Yes | *Random 64-char string* | Secret key for signing JWT access tokens (>= 32 chars) |
| `JWT_EXPIRES_IN` | No | `1d` | Expiry duration for session tokens |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Allowed CORS origin for frontend client |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Cost factor for password hashing |

---

## 7. Automated Tests & Quality Checks

Run the verification commands:

```bash
# Frontend Build Verification (TypeScript & Vite 8 bundle)
cd frontend
npm run build

# Frontend Linter
npm run lint

# Backend Unit Tests (YouTube parser, token roles, Excel generator & parser)
cd ../backend
npm test
```

