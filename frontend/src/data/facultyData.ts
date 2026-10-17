export interface FacultyMember {
  id: string;
  placeholderId: string;
  name: string;
  subject: string;
  roleTitle: string;
  shortIntro: string;
  areasOfExpertise: string[];
  avatarUrl: string;
  isPlaceholder: boolean;
  avatarCaption?: string;
}

/**
 * Seven Faculty Profiles for Antariksh Academy
 * 
 * IMPORTANT NOTE:
 * These profiles use clearly designated placeholder identities and portraits.
 * Replace the names, portraits, and introductory texts with verified credentials
 * of Antariksh Academy faculty members when provided.
 */
export const FACULTY_DATA: FacultyMember[] = [
  {
    id: 'faculty-01',
    placeholderId: 'Faculty Member 01',
    name: 'Faculty Member 01',
    subject: 'Physics',
    roleTitle: 'Faculty — Physics (JEE & Board)',
    shortIntro:
      'Focuses on conceptual visualization of physical principles, real-world analogies, and step-by-step mathematical translation for both CHSE +2 boards and JEE Main/Advanced numericals.',
    areasOfExpertise: [
      'Mechanics & Kinematics',
      'Electrodynamics & Magnetism',
      'Optics & Wave Motion',
      'Numerical Problem Solving Techniques',
    ],
    // High-resolution realistic educational portrait
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Illustrative placeholder portrait',
    isPlaceholder: true,
  },
  {
    id: 'faculty-02',
    placeholderId: 'Faculty Member 02',
    name: 'Faculty Member 02',
    subject: 'Chemistry',
    roleTitle: 'Faculty — Chemistry (Physical, Organic & Inorganic)',
    shortIntro:
      'Specializes in demystifying chemical bonding, reaction mechanisms, and thermodynamics, guiding students to score with high precision in NEET and board exams.',
    areasOfExpertise: [
      'Organic Reaction Mechanisms',
      'Chemical Thermodynamics & Equilibrium',
      'Inorganic Chemistry & Periodic Trends',
      'NEET High-Yield Question Strategies',
    ],
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Illustrative placeholder portrait',
    isPlaceholder: true,
  },
  {
    id: 'faculty-03',
    placeholderId: 'Faculty Member 03',
    name: 'Faculty Member 03',
    subject: 'Mathematics',
    roleTitle: 'Faculty — Mathematics (JEE Main/Adv & NDA)',
    shortIntro:
      'Known for breaking down complex multi-variable calculus, coordinate geometry, and algebraic structures into systematic algorithmic steps and rapid shortcuts.',
    areasOfExpertise: [
      'Differential & Integral Calculus',
      'Coordinate Geometry & 3D Vectors',
      'Permutations, Probability & Matrices',
      'NDA Speed Calculation Tricks',
    ],
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Illustrative placeholder portrait',
    isPlaceholder: true,
  },
  {
    id: 'faculty-04',
    placeholderId: 'Faculty Member 04',
    name: 'Faculty Member 04',
    subject: 'Biology',
    roleTitle: 'Faculty — Biology (Botany & Zoology)',
    shortIntro:
      'Guides NEET medical aspirants through exhaustive NCERT-centric learning, diagrammatic memorization, physiological systems, and assertion-reasoning mastery.',
    areasOfExpertise: [
      'Human Physiology & Genetics',
      'Plant Anatomy & Physiology',
      'Ecology & Molecular Biology',
      'NCERT Line-by-Line Retention Maps',
    ],
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Illustrative placeholder portrait',
    isPlaceholder: true,
  },
  {
    id: 'faculty-05',
    placeholderId: 'Faculty Member 05',
    name: 'Faculty Member 05',
    subject: 'English and Communication',
    roleTitle: 'Faculty — English & Academic Communication',
    shortIntro:
      'Develops formal writing mastery, precise comprehension skills, and communicative confidence needed for board examination English papers and competitive examinations.',
    areasOfExpertise: [
      'Board Essay & Report Writing',
      'Grammar Precision & Vocabulary Building',
      'Reading Comprehension & Analysis',
      'Personality & Interview Communication',
    ],
    avatarUrl:
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Illustrative placeholder portrait',
    isPlaceholder: true,
  },
  {
    id: 'faculty-06',
    placeholderId: 'Faculty Member 06',
    name: 'Faculty Member 06',
    subject: 'General Ability and NDA Preparation',
    roleTitle: 'Faculty — General Studies & Defence Aptitude',
    shortIntro:
      'Equips NDA and competitive candidates with structured insights into Indian polity, geography, modern history, and national/international current affairs.',
    areasOfExpertise: [
      'Indian Polity & Geography for NDA',
      'Modern Indian History & Defense General Knowledge',
      'Current Affairs Monthly Analytical Syntheses',
      'Time Management under UPSC Strict Exam Timing',
    ],
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Illustrative placeholder portrait',
    isPlaceholder: true,
  },
  {
    id: 'faculty-07',
    placeholderId: 'Faculty Member 07',
    name: 'Faculty Member 07',
    subject: 'Academic Mentoring and Test Preparation',
    roleTitle: 'Lead Mentor — Academic Strategy & Test Analytics',
    shortIntro:
      'Coordinates student evaluation rubrics, conducts diagnostic test reviews, analyzes accuracy trends, and delivers one-on-one academic motivation and revision pacing.',
    areasOfExpertise: [
      'Diagnostic Performance Analysis',
      'Revision Cycle Architecture',
      'Exam Stress Management & Test Demystification',
      'Parent-Student Academic Progress Alignments',
    ],
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Illustrative placeholder portrait',
    isPlaceholder: true,
  },
];
