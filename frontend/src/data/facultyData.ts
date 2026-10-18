export interface FacultyMember {
  id: string;
  placeholderId: string;
  name: string;
  subject: string;
  roleTitle: string;
  phone?: string;
  shortIntro: string;
  areasOfExpertise: string[];
  avatarUrl: string;
  isPlaceholder: boolean;
  avatarCaption?: string;
}

/**
 * Genuine Faculty & Department Leadership for Antariksh Academy
 * Led by Senior Educators Prasant Kumar Behera and Sudeep Dash
 */
export const FACULTY_DATA: FacultyMember[] = [
  {
    id: 'faculty-01',
    placeholderId: 'Faculty Member 01',
    name: 'Prasant Kumar Behera',
    subject: 'Physics',
    phone: '+91 90901 60793',
    roleTitle: 'Senior Faculty — Physics (CHSE Board, NEET-UG & JEE)',
    shortIntro:
      'Focuses on conceptual visualization of physical principles, real-world analogies, and step-by-step mathematical translation for CHSE +2 boards, NEET-UG, and JEE Main/Advanced numericals.',
    areasOfExpertise: [
      'Mechanics, Gravitation & Kinematics',
      'Electrodynamics, AC & Magnetism',
      'Ray & Wave Optics',
      'High-Yield Numerical Speed Shortcuts',
    ],
    avatarUrl: '',
    avatarCaption: 'Senior Physics Faculty',
    isPlaceholder: false,
  },
  {
    id: 'faculty-02',
    placeholderId: 'Faculty Member 02',
    name: 'Sudeep Dash',
    subject: 'Mathematics',
    phone: '+91 87636 54489',
    roleTitle: 'Senior Faculty — Mathematics (JEE Main/Adv & Entrances)',
    shortIntro:
      'Renowned for breaking down complex multi-variable calculus, coordinate geometry, and algebraic structures into systematic algorithmic steps, speed tricks, and rapid competitive shortcuts.',
    areasOfExpertise: [
      'Differential & Integral Calculus',
      'Coordinate Geometry & 3D Vectors',
      'Permutations, Probability & Matrices',
      'OUAT / JEE Speed Calculation Techniques',
    ],
    avatarUrl: '',
    avatarCaption: 'Senior Mathematics Faculty',
    isPlaceholder: false,
  },
  {
    id: 'faculty-03',
    placeholderId: 'Faculty Member 03',
    name: 'Department of Chemistry',
    subject: 'Chemistry',
    roleTitle: 'Faculty — Chemistry (Physical, Organic & Inorganic)',
    shortIntro:
      'Specializes in demystifying chemical bonding, reaction mechanisms, and thermodynamics, guiding students to score with high precision in NEET and CHSE board examinations.',
    areasOfExpertise: [
      'Organic Reaction Mechanisms',
      'Chemical Thermodynamics & Equilibrium',
      'Inorganic Chemistry & Coordination Compounds',
      'NEET High-Yield Question Strategies',
    ],
    avatarUrl: '',
    avatarCaption: 'Chemistry Department',
    isPlaceholder: false,
  },
  {
    id: 'faculty-04',
    placeholderId: 'Faculty Member 04',
    name: 'Department of Biology',
    subject: 'Biology',
    roleTitle: 'Faculty — Biology (Botany & Zoology)',
    shortIntro:
      'Guides NEET medical and OUAT aspirants through exhaustive NCERT-centric learning, diagrammatic memorization, physiological systems, and assertion-reasoning mastery.',
    areasOfExpertise: [
      'Human Physiology & Genetics',
      'Plant Anatomy & Physiology',
      'Ecology, Biotechnology & Molecular Biology',
      'NCERT Line-by-Line Retention Maps',
    ],
    avatarUrl: '',
    avatarCaption: 'Biology Department',
    isPlaceholder: false,
  },
  {
    id: 'faculty-05',
    placeholderId: 'Faculty Member 05',
    name: 'Department of English & IT',
    subject: 'English & Information Technology',
    roleTitle: 'Faculty — English & Academic Communication',
    shortIntro:
      'Develops formal writing mastery, precise comprehension skills, and communicative confidence needed for board examination English papers and entrance requirements.',
    areasOfExpertise: [
      'Board Essay & Report Writing',
      'Grammar Precision & Vocabulary Building',
      'C++ / IT Syllabus for CHSE Board',
      'Academic Presentation Skills',
    ],
    avatarUrl: '',
    avatarCaption: 'English & IT Department',
    isPlaceholder: false,
  },
  {
    id: 'faculty-06',
    placeholderId: 'Faculty Member 06',
    name: 'Department of Agricultural & Mental Aptitude',
    subject: 'OUAT / ICAR Mental Aptitude & General Science',
    roleTitle: 'Faculty — Agricultural Aptitude & Reasoning',
    shortIntro:
      'Equips OUAT, ICAR, and competitive candidates with structured insights into reasoning, quantitative aptitude, and agricultural entrance patterns.',
    areasOfExpertise: [
      'Mental Aptitude & Logical Reasoning for OUAT',
      'Agro-Scientific Problem Solving',
      'Previous 10 Years Entrance Pattern Analysis',
      'Time Management under Exam Conditions',
    ],
    avatarUrl: '',
    avatarCaption: 'Aptitude & Entrance Department',
    isPlaceholder: false,
  },
  {
    id: 'faculty-07',
    placeholderId: 'Faculty Member 07',
    name: 'Academic Mentoring & Student Support',
    subject: 'Academic Mentoring and Strategy',
    roleTitle: 'Director — Academic Strategy & Student Progress',
    shortIntro:
      'Coordinates student evaluation rubrics, conducts diagnostic test reviews, analyzes accuracy trends, and delivers one-on-one academic motivation and revision pacing.',
    areasOfExpertise: [
      'Diagnostic Performance Analysis',
      'Revision Cycle Architecture',
      'Exam Stress Management & Test Demystification',
      'Parent-Student Academic Progress Alignments',
    ],
    avatarUrl: '',
    avatarCaption: 'Leadership & Academic Strategy',
    isPlaceholder: false,
  },
];
