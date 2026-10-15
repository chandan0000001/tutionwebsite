export interface FacilityItem {
  id: string;
  title: string;
  category: 'Classroom' | 'Study Area' | 'Doubt & Discussion' | 'Testing & Practice' | 'Team & Mentorship';
  description: string;
  imageUrl: string;
  isAcademyOriginal?: boolean;
  attributionNote: string;
  aspectRatio?: string;
}

export const FACILITIES_DATA: FacilityItem[] = [
  {
    id: 'fac-1',
    title: 'Modern Ergonomic Classrooms',
    category: 'Classroom',
    description:
      'Air-conditioned, ergonomically arranged lecture rooms fitted with high-visibility whiteboards, optimal lighting, and focused acoustic distribution for seamless teacher-student communication.',
    imageUrl:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    isAcademyOriginal: false,
    attributionNote: 'Bijipur Center Campus • Air-Conditioned Lecture Hall',
  },
  {
    id: 'fac-2',
    title: 'Teacher-Led Interactive Sessions',
    category: 'Classroom',
    description:
      'Dedicated faculty delivering step-by-step problem derivations, theoretical clarity, and interactive question-answering in intimate batch sizes to foster continuous student engagement.',
    imageUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    isAcademyOriginal: false,
    attributionNote: 'Concept-Driven Board & Entrance Classes',
  },
  {
    id: 'fac-3',
    title: 'Dedicated Self-Study & Reference Library',
    category: 'Study Area',
    description:
      'Quiet, disturbance-free reading space stocked with recommended reference textbooks, NCERT editions, previous years question compendiums, and solved modules.',
    imageUrl:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    isAcademyOriginal: false,
    attributionNote: 'Campus Reference Library • Extended Study Hours',
  },
  {
    id: 'fac-4',
    title: 'One-on-One Doubt Resolution Desks',
    category: 'Doubt & Discussion',
    description:
      'Specialized doubt counters where students consult subject mentors right after lectures to clarify stubborn homework problems and strengthen conceptual gaps before the next day.',
    imageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    isAcademyOriginal: false,
    attributionNote: 'Daily Post-Class Doubt Clearance Counters',
  },
  {
    id: 'fac-5',
    title: 'Proctored Test & Exam Simulation Hall',
    category: 'Testing & Practice',
    description:
      'Strict, invigilated examination environment mirroring the discipline, timing constraints, and focus required for actual CHSE Board, JEE, and NEET test days.',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    isAcademyOriginal: false,
    attributionNote: 'Weekly OMR & Council Format Mock Test Arena',
  },
  {
    id: 'fac-6',
    title: 'Antariksh Academy Faculty & Leadership',
    category: 'Team & Mentorship',
    description:
      'Official photograph from Antariksh Academy Berhampur representing the dedicated leadership and academic educators at the institute.',
    imageUrl: '/images/academy_faculty_fb.jpg',
    isAcademyOriginal: true,
    attributionNote: 'Official Faculty Photo • Antariksh Academy Berhampur',
  },
];
