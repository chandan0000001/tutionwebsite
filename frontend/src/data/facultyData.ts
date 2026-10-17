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
 * Faculty Profiles for Antariksh Academy
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
      'Focuses on conceptual visualization of physical principles, real-world analogies, and step-by-step mathematical translation for both CHSE +2 boards, NEET-UG, and JEE Main/Advanced numericals.',
    areasOfExpertise: [
      'Mechanics, Gravitation & Kinematics',
      'Electrodynamics, AC & Magnetism',
      'Ray & Wave Optics',
      'High-Yield Numerical Speed Shortcuts',
    ],
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
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
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Senior Mathematics Faculty',
    isPlaceholder: false,
  },
  {
    id: 'faculty-03',
    placeholderId: 'Faculty Member 03',
    name: 'Faculty — Chemistry',
    subject: 'Chemistry',
    roleTitle: 'Faculty — Chemistry (Physical, Organic & Inorganic)',
    shortIntro:
      'Specializes in demystifying chemical bonding, reaction mechanisms, and thermodynamics, guiding students to score with high precision in NEET and board exams.',
    areasOfExpertise: [
      'Organic Reaction Mechanisms',
      'Chemical Thermodynamics & Equilibrium',
      'Inorganic Chemistry & Coordination Compounds',
      'NEET High-Yield Question Strategies',
    ],
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Chemistry Faculty',
    isPlaceholder: true,
  },
  {
    id: 'faculty-04',
    placeholderId: 'Faculty Member 04',
    name: 'Faculty — Biology',
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
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Biology Faculty',
    isPlaceholder: true,
  },
  {
    id: 'faculty-05',
    placeholderId: 'Faculty Member 05',
    name: 'Faculty — English & IT',
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
    avatarUrl:
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'English & IT Faculty',
    isPlaceholder: true,
  },
  {
    id: 'faculty-06',
    placeholderId: 'Faculty Member 06',
    name: 'Faculty — Agro & Mental Aptitude',
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
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Aptitude & Entrance Faculty',
    isPlaceholder: true,
  },
  {
    id: 'faculty-07',
    placeholderId: 'Faculty Member 07',
    name: 'Director & Academic Mentor',
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
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    avatarCaption: 'Leadership & Academic Strategy',
    isPlaceholder: true,
  },
];
