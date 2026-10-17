export interface ScheduleSlot {
  id: string;
  batchName: string;
  targetClass: string;
  stream: 'Integrated' | 'JEE Main/Adv' | 'NEET-UG' | '+2 Science Board' | 'OUAT & ICAR';
  sessionName: 'Morning Session' | 'Afternoon Session' | 'Evening Session';
  days: string;
  timeSlot: string;
  subject: string;
  facultyPlaceholder: string;
  room: string;
}

export const TIMETABLE_NOTICE =
  'Classes are organized into 3 high-performance sessions with 4 parallel batches maintained simultaneously per session: Morning (6:30 AM – 8:30 AM), Afternoon (2:00 PM – 4:15 PM), and Evening (5:00 PM – 8:00 PM). Students are allocated into their respective batch based on their academic stream and college routine.';

export const TIMETABLE_DATA: ScheduleSlot[] = [
  /* ======================================================================== */
  /* MORNING SESSION: 06:30 AM – 08:30 AM (4 BATCHES RUNNING SIMULTANEOUSLY)  */
  /* ======================================================================== */
  {
    id: 'tt-m1',
    batchName: 'Morning Batch M1 (+2 CHSE Foundation)',
    targetClass: 'Class 11 (+2 1st Year)',
    stream: '+2 Science Board',
    sessionName: 'Morning Session',
    days: 'Monday to Saturday',
    timeSlot: '06:30 AM – 08:30 AM',
    subject: 'Physics & Chemistry (Theory + Problem Sets)',
    facultyPlaceholder: 'Prasant Kumar Behera (Physics) & Senior Faculty',
    room: 'Hall 1 (Main Hall)',
  },
  {
    id: 'tt-m2',
    batchName: 'Morning Batch M2 (JEE Main & Advanced)',
    targetClass: 'Class 12 (+2 2nd Year)',
    stream: 'JEE Main/Adv',
    sessionName: 'Morning Session',
    days: 'Monday to Saturday',
    timeSlot: '06:30 AM – 08:30 AM',
    subject: 'Mathematics (Calculus & Algebra Focus)',
    facultyPlaceholder: 'Sudeep Dash (Mathematics)',
    room: 'Hall 2 (Advanced Suite)',
  },
  {
    id: 'tt-m3',
    batchName: 'Morning Batch M3 (NEET-UG Medical Drill)',
    targetClass: 'Class 12 (+2 2nd Year)',
    stream: 'NEET-UG',
    sessionName: 'Morning Session',
    days: 'Monday to Saturday',
    timeSlot: '06:30 AM – 08:30 AM',
    subject: 'Biology (Botany / Zoology NCERT Mastery)',
    facultyPlaceholder: 'Medical Faculty Panel',
    room: 'Hall 3 (Medical Wing)',
  },
  {
    id: 'tt-m4',
    batchName: 'Morning Batch M4 (Integrated Board + Entrance)',
    targetClass: 'Class 11 (+2 1st Year)',
    stream: 'Integrated',
    sessionName: 'Morning Session',
    days: 'Monday to Saturday',
    timeSlot: '06:30 AM – 08:30 AM',
    subject: 'Concept Grounding & Daily DPP Drills',
    facultyPlaceholder: 'Sudeep Dash & Prasant Kumar Behera',
    room: 'Hall 4 (Concept Room)',
  },

  /* ======================================================================== */
  /* AFTERNOON SESSION: 02:00 PM – 04:15 PM (4 BATCHES RUNNING SIMULTANEOUSLY)*/
  /* ======================================================================== */
  {
    id: 'tt-a1',
    batchName: 'Afternoon Batch A1 (OUAT & ICAR Target)',
    targetClass: 'Class 12 / Passout Aspirants',
    stream: 'OUAT & ICAR',
    sessionName: 'Afternoon Session',
    days: 'Monday to Friday',
    timeSlot: '02:00 PM – 04:15 PM',
    subject: 'Physics, Chemistry & Agro-Mental Aptitude',
    facultyPlaceholder: 'Prasant Kumar Behera & Agro-Entrance Team',
    room: 'Hall 1 (Main Hall)',
  },
  {
    id: 'tt-a2',
    batchName: 'Afternoon Batch A2 (+2 Science CHSE Board Excellence)',
    targetClass: 'Class 12 (+2 2nd Year)',
    stream: '+2 Science Board',
    sessionName: 'Afternoon Session',
    days: 'Monday to Saturday',
    timeSlot: '02:00 PM – 04:15 PM',
    subject: 'Council Subjective Writing & Practical Coaching',
    facultyPlaceholder: 'Subject Master Faculty Panel',
    room: 'Hall 2 (Advanced Suite)',
  },
  {
    id: 'tt-a3',
    batchName: 'Afternoon Batch A3 (NEET-UG High Yield Drills)',
    targetClass: 'Class 11 (+2 1st Year)',
    stream: 'NEET-UG',
    sessionName: 'Afternoon Session',
    days: 'Monday to Saturday',
    timeSlot: '02:00 PM – 04:15 PM',
    subject: 'Physics Numericals & Physical Chemistry',
    facultyPlaceholder: 'Prasant Kumar Behera (Physics)',
    room: 'Hall 3 (Medical Wing)',
  },
  {
    id: 'tt-a4',
    batchName: 'Afternoon Batch A4 (Integrated Entrance Mastery)',
    targetClass: 'Class 12 (+2 2nd Year)',
    stream: 'Integrated',
    sessionName: 'Afternoon Session',
    days: 'Monday to Saturday',
    timeSlot: '02:00 PM – 04:15 PM',
    subject: 'Advanced Problem Solving & Previous Year Papers',
    facultyPlaceholder: 'Sudeep Dash & Senior Faculty',
    room: 'Hall 4 (Concept Room)',
  },

  /* ======================================================================== */
  /* EVENING SESSION: 05:00 PM – 08:00 PM (4 BATCHES RUNNING SIMULTANEOUSLY)  */
  /* ======================================================================== */
  {
    id: 'tt-e1',
    batchName: 'Evening Batch E1 (JEE Main & Advanced Pinnacle)',
    targetClass: 'Class 11 & 12 Entrance Batch',
    stream: 'JEE Main/Adv',
    sessionName: 'Evening Session',
    days: 'Monday to Saturday',
    timeSlot: '05:00 PM – 08:00 PM',
    subject: 'Advanced Physics, Chemistry & Math Problem Drills',
    facultyPlaceholder: 'Sudeep Dash (Math) & Prasant Kumar Behera (Physics)',
    room: 'Hall 1 (Main Hall)',
  },
  {
    id: 'tt-e2',
    batchName: 'Evening Batch E2 (NEET-UG Medical Super 30)',
    targetClass: 'Class 11 & 12 PCB Medical Batch',
    stream: 'NEET-UG',
    sessionName: 'Evening Session',
    days: 'Monday to Saturday',
    timeSlot: '05:00 PM – 08:00 PM',
    subject: 'Complete PCB NCERT Speed Drills & OMR Mock Testing',
    facultyPlaceholder: 'Medical Entrance Faculty Panel',
    room: 'Hall 2 (Advanced Suite)',
  },
  {
    id: 'tt-e3',
    batchName: 'Evening Batch E3 (+2 Science CHSE Council Mastery)',
    targetClass: 'Class 11 & 12 Regular Day Scholars',
    stream: '+2 Science Board',
    sessionName: 'Evening Session',
    days: 'Monday to Saturday',
    timeSlot: '05:00 PM – 08:00 PM',
    subject: 'CHSE Syllabus Complete Coverage & Daily Doubt Desks',
    facultyPlaceholder: 'Council Master Educators',
    room: 'Hall 3 (Medical Wing)',
  },
  {
    id: 'tt-e4',
    batchName: 'Evening Batch E4 (OUAT & ICAR / Integrated Evening)',
    targetClass: 'Aspirants for OUAT / ICAR & Competitive Exams',
    stream: 'OUAT & ICAR',
    sessionName: 'Evening Session',
    days: 'Monday to Saturday',
    timeSlot: '05:00 PM – 08:00 PM',
    subject: 'Physics, Chemistry, Biology & Agricultural Reasoning',
    facultyPlaceholder: 'Prasant Kumar Behera & Agro-Faculty Team',
    room: 'Hall 4 (Concept Room)',
  },
];
