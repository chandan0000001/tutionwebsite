export interface Course {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  targetStudents: string;
  shortDescription: string;
  keyBenefits: string[];
  curriculumHighlights: string[];
  icon: 'Compass' | 'Atom' | 'Stethoscope' | 'ShieldCheck' | 'BookOpen' | 'GraduationCap';
  suitableFor: string;
  batchType: string;
}

export const COURSES_DATA: Course[] = [
  {
    id: 'jee-main-adv',
    title: 'JEE Main & JEE Advanced',
    tagline: 'Rigorous engineering entrance foundation and problem-solving mastery',
    badge: 'Engineering Entrance',
    targetStudents: 'Class 11 (+2 1st Year) & Class 12 (+2 2nd Year) Science Students',
    shortDescription:
      'In-depth, concept-oriented training in Physics, Chemistry, and Mathematics designed to crack the challenging patterns of both JEE Main and JEE Advanced.',
    keyBenefits: [
      'Daily Problem Solving Sheets (DPPs) with stepped difficulty levels',
      'Extensive previous years question (PYQ) dissection and speed drills',
      'Weekly computer-based test simulation aligned with NTA JEE format',
      'Micro-concept doubt resolution before moving to advanced topics',
      'Personal rank improvement tracking and weak area diagnosis',
    ],
    curriculumHighlights: [
      'Mechanics, Electrodynamics & Modern Physics',
      'Physical, Organic & Inorganic Reaction Mechanisms',
      'Calculus, Vectors, 3D Geometry & Algebra',
      'Time-management strategies and negative marking control',
    ],
    icon: 'Atom',
    suitableFor: 'Aspirants targeting IITs, NITs, IIITs, and premier engineering institutes',
    batchType: 'Regular Evening & Weekend Batches Available',
  },
  {
    id: 'neet-ug',
    title: 'NEET-UG Medical Preparation',
    tagline: 'Comprehensive NCERT mastery with high-yield biological & numerical drills',
    badge: 'Medical Entrance',
    targetStudents: 'Class 11 (+2 1st Year) & Class 12 (+2 2nd Year) PCB Students',
    shortDescription:
      'Targeted medical entrance preparation emphasizing 100% NCERT line-by-line grasp in Biology along with high-accuracy numerical skills in Physics and Physical Chemistry.',
    keyBenefits: [
      'Line-by-line NCERT decoding and diagrammatic retention maps',
      'Rigorous biology test series with assertion-reasoning question sets',
      'Physics numerical simplified sessions tailored for medical aspirants',
      'Speed and accuracy reinforcement to complete 180 questions efficiently',
      'Bi-weekly OMR sheet test practice to eliminate bubbling errors',
    ],
    curriculumHighlights: [
      'Botany & Zoology comprehensive NCERT coverage',
      'Organic mechanisms and direct inorganic fact banks',
      'Formulas and application tricks for Physics mechanics & optics',
      'Full syllabus mock tests with percentile analysis',
    ],
    icon: 'Stethoscope',
    suitableFor: 'Aspirants targeting MBBS, BDS, and allied healthcare admissions in AIIMS, state medical colleges',
    batchType: 'Regular & Morning Batches Available',
  },
  {
    id: 'chse-board',
    title: '+2 Science Odisha CHSE Board',
    tagline: 'Solid academic grounding for high scores in council examinations',
    badge: 'Board Excellence',
    targetStudents: 'Odisha CHSE +2 1st Year & +2 2nd Year Science Students',
    shortDescription:
      'Thorough academic coaching according to the prescribed Odisha CHSE syllabus, ensuring flawless subjective answer writing, numerical problem-solving, and practical readiness.',
    keyBenefits: [
      'Subjective answer formulation matching CHSE marking scheme requirements',
      'Complete coverage of Physics, Chemistry, Mathematics, Biology / IT',
      'Regular chapter-wise subjective tests with detailed teacher feedback',
      'Comprehensive revision of council question banks and model papers',
      'Individual attention to clear foundational doubts without rush',
    ],
    curriculumHighlights: [
      'CHSE prescribed textbook problem sets and theory breakdowns',
      'Derivations, chemical equations, and labeled diagram practices',
      'Model question paper sets simulating council examination conditions',
      'Special remedial batches for students needing extra foundational care',
    ],
    icon: 'BookOpen',
    suitableFor: 'Students aiming for top percentage (>90%) in Odisha Council +2 Science Examinations',
    batchType: 'Weekday Morning & Evening Sessions',
  },
  {
    id: 'integrated-prep',
    title: 'Integrated Board + Entrance Preparation',
    tagline: 'Harmonized syllabus coverage eliminating duplication and exam stress',
    badge: 'Flagship Program',
    targetStudents: 'Class 11 & Class 12 Science Students targeting both Boards & Entrances',
    shortDescription:
      'A balanced dual-track curriculum that aligns council board theory requirements with objective entrance problem-solving so students excel in both without burnout.',
    keyBenefits: [
      'Zero collision between board exam dates and entrance test modules',
      'Single concept explained from fundamental theory up to competitive level',
      'Dual practice format: subjective answers + multiple choice speed drills',
      'Structured study timetable preventing student stress and overload',
      'Continuous parent-teacher progress reporting and academic counselling',
    ],
    curriculumHighlights: [
      'Cohesive topic progression bridging board textbooks with entrance syllabus',
      'Synchronized weekly assessments covering both patterns',
      'Time management and study habits mentorship',
      'Personalized study plans during pre-board and entrance phases',
    ],
    icon: 'GraduationCap',
    suitableFor: 'Students who want maximum efficiency and high performance in both +2 and competitive exams',
    batchType: 'Full-Year Comprehensive Program',
  },
  {
    id: 'ouat-icar-entrance',
    title: 'OUAT & ICAR Preparation',
    tagline: 'Specialized agro-scientific, veterinary & allied sciences entrance coaching',
    badge: 'Agriculture & Allied Science',
    targetStudents: 'Class 11, Class 12 (+2 Science) & Repeaters targeting OUAT & ICAR AIEEA',
    shortDescription:
      'Dedicated coaching for Odisha University of Agriculture and Technology (OUAT) and ICAR AIEEA-UG with intensive preparation across Physics, Chemistry, Mathematics/Biology, and Agro-mental ability.',
    keyBenefits: [
      'Comprehensive syllabus coverage strictly aligned with OUAT weightage',
      'Specialized sessions for Mental Aptitude, Quantitative Reasoning & English',
      'High-yield question bank dissecting previous 10 years OUAT question patterns',
      'Regular full-length mock examinations with OMR time management drills',
      'Dedicated faculty doubt desks for agro-biological and physical concepts',
    ],
    curriculumHighlights: [
      'PCB / PCM integrated conceptual problem solving',
      'Botanical genetics, plant physiology & cell biology focus',
      'Speed calculation techniques for Physics and Physical Chemistry',
      'OUAT & ICAR previous years question papers & mock simulations',
    ],
    icon: 'ShieldCheck',
    suitableFor: 'Aspirants targeting B.Sc. (Hons) Agriculture, Horticulture, Veterinary Science & Animal Husbandry, Forestry, and Fishery',
    batchType: 'Morning (6:30–8:30 AM), Afternoon (2:00–4:15 PM) & Evening (5:00–8:00 PM)',
  },
];
