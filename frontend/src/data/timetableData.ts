export interface ScheduleSlot {
  id: string;
  batchName: string;
  targetClass: string;
  stream: 'Integrated' | 'JEE Main/Adv' | 'NEET-UG' | '+2 Science Board' | 'NDA Prep';
  days: string;
  timeSlot: string;
  subject: string;
  facultyPlaceholder: string;
  room: string;
}

export const TIMETABLE_NOTICE =
  'Notice: The schedules listed below represent illustrative batch slots. Because batch seatings are customized per academic intake and school timings in Berhampur, students and parents should contact Antariksh Academy directly to confirm active batch availability, classroom allotments, and live timings.';

export const TIMETABLE_DATA: ScheduleSlot[] = [
  // Morning Sessions (Ideal for regular school-going or shift students)
  {
    id: 'tt-1',
    batchName: 'Morning Foundation Batch A1',
    targetClass: 'Class 11 (+2 1st Year)',
    stream: '+2 Science Board',
    days: 'Mon, Wed, Fri',
    timeSlot: '06:30 AM – 08:00 AM',
    subject: 'Physics (Mechanics & Properties)',
    facultyPlaceholder: 'Faculty Member 01 (Physics)',
    room: 'Hall 1 (Main Lecture Room)',
  },
  {
    id: 'tt-2',
    batchName: 'Morning Foundation Batch A1',
    targetClass: 'Class 11 (+2 1st Year)',
    stream: '+2 Science Board',
    days: 'Tue, Thu, Sat',
    timeSlot: '06:30 AM – 08:00 AM',
    subject: 'Chemistry (Physical & Inorganic)',
    facultyPlaceholder: 'Faculty Member 02 (Chemistry)',
    room: 'Hall 1 (Main Lecture Room)',
  },
  {
    id: 'tt-3',
    batchName: 'Morning Foundation Batch A1',
    targetClass: 'Class 11 (+2 1st Year)',
    stream: 'NEET-UG',
    days: 'Mon, Wed, Fri',
    timeSlot: '08:00 AM – 09:15 AM',
    subject: 'Biology (Botany & Cell Structure)',
    facultyPlaceholder: 'Faculty Member 04 (Biology)',
    room: 'Bio-Seminar Room',
  },

  // Evening Integrated Sessions
  {
    id: 'tt-4',
    batchName: 'Integrated JEE Pinnacle B1',
    targetClass: 'Class 12 (+2 2nd Year)',
    stream: 'JEE Main/Adv',
    days: 'Mon, Tue, Wed, Thu',
    timeSlot: '04:30 PM – 06:00 PM',
    subject: 'Mathematics (Calculus & Coordinate)',
    facultyPlaceholder: 'Faculty Member 03 (Mathematics)',
    room: 'Hall 2 (Advanced Suite)',
  },
  {
    id: 'tt-5',
    batchName: 'Integrated JEE Pinnacle B1',
    targetClass: 'Class 12 (+2 2nd Year)',
    stream: 'JEE Main/Adv',
    days: 'Mon, Tue, Wed, Thu',
    timeSlot: '06:15 PM – 07:45 PM',
    subject: 'Physics (Electrodynamics & Optics)',
    facultyPlaceholder: 'Faculty Member 01 (Physics)',
    room: 'Hall 2 (Advanced Suite)',
  },
  {
    id: 'tt-6',
    batchName: 'Target NEET Achievers B2',
    targetClass: 'Class 12 (+2 2nd Year)',
    stream: 'NEET-UG',
    days: 'Mon, Wed, Fri, Sat',
    timeSlot: '04:30 PM – 06:00 PM',
    subject: 'Chemistry (Organic Mechanisms)',
    facultyPlaceholder: 'Faculty Member 02 (Chemistry)',
    room: 'Hall 3 (Medical Wing)',
  },
  {
    id: 'tt-7',
    batchName: 'Target NEET Achievers B2',
    targetClass: 'Class 12 (+2 2nd Year)',
    stream: 'NEET-UG',
    days: 'Mon, Wed, Fri, Sat',
    timeSlot: '06:15 PM – 07:45 PM',
    subject: 'Biology (Human Physiology & Genetics)',
    facultyPlaceholder: 'Faculty Member 04 (Biology)',
    room: 'Hall 3 (Medical Wing)',
  },

  // Weekend Special / NDA / Test Analysis
  {
    id: 'tt-8',
    batchName: 'NDA Defence Warriors C1',
    targetClass: '+2 Science / Passout',
    stream: 'NDA Prep',
    days: 'Saturday & Sunday',
    timeSlot: '09:00 AM – 11:30 AM',
    subject: 'NDA Mathematics Speed Drills',
    facultyPlaceholder: 'Faculty Member 03 (Mathematics)',
    room: 'Hall 1 (Main Lecture Room)',
  },
  {
    id: 'tt-9',
    batchName: 'NDA Defence Warriors C1',
    targetClass: '+2 Science / Passout',
    stream: 'NDA Prep',
    days: 'Saturday & Sunday',
    timeSlot: '11:45 AM – 01:15 PM',
    subject: 'General Ability Test (GAT) & English',
    facultyPlaceholder: 'Faculty Member 06 & 05',
    room: 'Hall 1 (Main Lecture Room)',
  },
  {
    id: 'tt-10',
    batchName: 'All-Batches Doubt & Mock Clinic',
    targetClass: 'All Enrolled Students',
    stream: 'Integrated',
    days: 'Sunday',
    timeSlot: '08:00 AM – 12:00 PM',
    subject: 'Weekly Proctored Mock Test & Live Doubt Clearing',
    facultyPlaceholder: 'Full Faculty Panel & Faculty Member 07',
    room: 'Examination Hall & Doubt Desks',
  },
];
