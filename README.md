# Antariksh Academy Website

A modern, responsive, production-quality static frontend website for **Antariksh Academy**, an educational coaching institute located in Bijipur, Brahmapur, Odisha, India.

---

## 1. Institute & Project Overview

- **Official Name:** Antariksh Academy
- **Location:** Bijipur, Big Street, Brahmapur, Odisha 760001, India
- **Provisional Contact Email:** `kumardalaichandan803@gmail.com`
- **Motto:** *"Education for world stage"*
- **Headline:** *"Your Future. Our Guidance. Your Success."*
- **Target Students:** Class 11 (+2 First Year) and Class 12 (+2 Second Year) preparing for Odisha CHSE Board examinations alongside competitive examinations.
- **Streams Offered:**
  - JEE Main and JEE Advanced
  - NEET-UG (Medical Entrance)
  - UPSC NDA (National Defence Academy)
  - Odisha CHSE +2 Science Board
  - Integrated Board + Entrance Preparation

---

## 2. Technology Stack

- **Framework:** React 19 with Vite & TypeScript
- **Styling:** Tailwind CSS v4 with custom academic color palette (Deep Navy Blue `#0B1938`, Slate, and Warm Gold/Amber accents)
- **Icons:** Lucide React
- **Design System:** Accessible forms, interactive modals, responsive table/card timetable views, and image lightbox.
- **Architecture:** Zero backend required for initial static hosting, modular data files for instant faculty/results editing.

---

## 3. Project Directory Structure

```text
tutionWebsite/
├── public/
│   ├── favicon.svg             # Antariksh Academy cosmic orbit icon
│   ├── logo.svg                # Brand emblem
│   └── images/
│       └── academy_faculty_fb.jpg # Public verified photo from academy social media
├── src/
│   ├── config/
│   │   └── academyConfig.ts    # Centralized configuration (name, address, email, phone, links)
│   ├── data/
│   │   ├── coursesData.ts      # 5 Course streams, syllabi, and learning benefits
│   │   ├── facultyData.ts      # 7 Faculty profiles with placeholder designations
│   │   ├── facilitiesData.ts   # Infrastructure gallery and attribution notes
│   │   ├── resultsData.ts      # 6-Year result templates (2021–2026) with transparency labels
│   │   ├── timetableData.ts    # Morning, evening, and weekend batch slots
│   │   └── testimonialsData.ts # Student and parent review templates
│   ├── utils/
│   │   ├── googleCalendar.ts   # Isolated Google Calendar URL generator & Meet architecture
│   │   └── validation.ts       # Indian phone number validation, email checks, date logic
│   ├── components/
│   │   ├── Navbar.tsx          # Responsive sticky navigation with mobile drawer
│   │   ├── Hero.tsx            # Academic hero with trust badges & highlight dashboard
│   │   ├── About.tsx           # Mission, 6 learning pillars, and board+entrance philosophy
│   │   ├── Courses.tsx         # Filterable course cards with syllabus highlights
│   │   ├── Teachers.tsx        # 7 Faculty profile cards with area of expertise tags
│   │   ├── Facilities.tsx      # Photo gallery with category filters
│   │   ├── Lightbox.tsx        # Accessible full-screen lightbox with keyboard controls
│   │   ├── Results.tsx         # 6-Year filtered success stories with ethical disclosure
│   │   ├── Timetable.tsx       # Responsive schedule table with mobile cards
│   │   ├── Testimonials.tsx    # Student and parent community feedback
│   │   ├── CallbackSection.tsx # "Need Guidance? Let Us Call You" with Indian mobile validation
│   │   ├── ConsultationSection.tsx # "Book a Free Academic Consultation" (Google Meet / In-Person)
│   │   ├── ContactSection.tsx  # Bijipur address, official Facebook/Instagram, map directions
│   │   ├── Footer.tsx          # Dynamic copyright, navigation, courses, and privacy notice
│   │   ├── CourseModal.tsx     # Detailed course curriculum popup
│   │   └── GoogleMeetGuideModal.tsx # Architectural guide for automated Google Meet production
│   ├── App.tsx                 # Root layout and interactive modal coordination
│   ├── main.tsx                # React entrypoint
│   └── index.css               # Tailwind CSS base and theme rules
├── index.html                  # SEO metadata, Open Graph tags, and typography
├── package.json
└── tsconfig.json
```

---

## 4. Quickstart: Running Locally

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v24)
- npm (v9 or higher)

### Installation & Commands

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev

# 3. Build for production (TypeScript check + Vite bundler)
npm run build

# 4. Preview the production build locally
npm run preview
```

When you run `npm run dev`, open the URL printed in the terminal (usually `http://localhost:5173`) in any modern browser.

---

## 5. How to Update Content & Data

All institute content is organized in local data files so changes can be made without modifying React UI markup:

1. **Academy Details & Contact:**
   - File: [`src/config/academyConfig.ts`](file:///home/chandan/Desktop/tutionWebsite/src/config/academyConfig.ts)
   - Update phone number, WhatsApp number, email, address, or social links.

2. **Faculty Profiles (7 Mentors):**
   - File: [`src/data/facultyData.ts`](file:///home/chandan/Desktop/tutionWebsite/src/data/facultyData.ts)
   - Replace placeholder names (`Faculty Member 01`, etc.) and placeholder portraits with verified teacher photographs and bios.

3. **Student Results & Success Stories:**
   - File: [`src/data/resultsData.ts`](file:///home/chandan/Desktop/tutionWebsite/src/data/resultsData.ts)
   - Contains a 6-year history (2021 to 2026). Replace `studentNamePlaceholder` and `storyPlaceholder` with verified student records, marks, and rank allotments.

4. **Class Schedules & Batches:**
   - File: [`src/data/timetableData.ts`](file:///home/chandan/Desktop/tutionWebsite/src/data/timetableData.ts)
   - Adjust morning, evening, and weekend timings to match active batches.

5. **Student & Parent Testimonials:**
   - File: [`src/data/testimonialsData.ts`](file:///home/chandan/Desktop/tutionWebsite/src/data/testimonialsData.ts)
   - Add verified reviews and student quotes.

---

## 6. Integrations & Engineering Accuracy

### A. Callback Request Form (`CallbackSection.tsx`)
- Validates 10-digit Indian mobile numbers starting with 6, 7, 8, or 9 (cleans out `+91`, spaces, and hyphens).
- Prevents accidental immediate duplicate submissions.
- **Honest Demo State:** Clearly informs the user that this static frontend validated the request locally. It provides direct 1-click WhatsApp and email shortcuts to contact the Berhampur desk immediately.

### B. Google Meet & Consultation Booking (`ConsultationSection.tsx` & `googleCalendar.ts`)
- Prevents selection of past dates.
- Validates standard email addresses.
- **Demo Mode (Default):** Static frontends cannot securely create private Google Calendar events or generate authorized Google Meet links without exposing API secrets. In demo mode, the website generates an official Google Calendar URL that opens the visitor's Google Calendar with the title, description, and slot pre-filled, inviting the academy's official email (`kumardalaichandan803@gmail.com`).
- **Production Architecture Guide:** A dedicated modal is embedded in the UI detailing the 5 steps required for the academy to connect a Google Cloud Service Account or serverless webhook for automated Meet generation.

---

## 7. Official Social Links & Location

- **Physical Center:** Bijipur, Big Street, Brahmapur, Odisha 760001, India
- **Provisional Email:** `kumardalaichandan803@gmail.com`
- **Facebook:** [Antariksh Academy Berhampur Profile](https://www.facebook.com/people/Antariksh-Academy-Berhampur/100066790522018/)
- **Instagram:** [@antarikshacademy1](https://www.instagram.com/antarikshacademy1/)
