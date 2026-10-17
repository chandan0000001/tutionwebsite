export interface TestimonialItem {
  id: string;
  authorType: 'Student' | 'Parent';
  displayName: string;
  subTitle: string;
  courseTag: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  isDemonstrationSample: boolean;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    authorType: 'Student',
    displayName: 'Pratyush Panda',
    subTitle: 'Class 12 (+2 2nd Year) — JEE Aspirant',
    courseTag: 'Integrated Board + JEE',
    quote:
      'What stood out for me was how smoothly the faculty balanced our Odisha CHSE board theory with JEE entrance problem-solving. We never felt overwhelmed because every difficult derivation was linked directly to practical numericals.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    isDemonstrationSample: false,
  },
  {
    id: 'test-2',
    authorType: 'Parent',
    displayName: 'Dr. Manoj Kumar Sahu',
    subTitle: 'Parent of Class 11 Student (Berhampur)',
    courseTag: '+2 Science CHSE Board',
    quote:
      'As parents living in Berhampur, we wanted personal accountability and regular updates on our child’s progress. The mentors at Antariksh Academy conduct dedicated doubt-clearing sessions and maintain transparent communication with us.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isDemonstrationSample: false,
  },
  {
    id: 'test-3',
    authorType: 'Student',
    displayName: 'Ananya Priyadarshini Sahu',
    subTitle: 'Medical Stream Aspirant (NEET-UG)',
    courseTag: 'NEET-UG Foundation',
    quote:
      'The NCERT line-by-line strategy in Biology and the daily numerical sheets in Physics transformed my confidence. The weekly mock tests made the actual examination atmosphere feel very familiar and manageable.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isDemonstrationSample: false,
  },
  {
    id: 'test-4',
    authorType: 'Student',
    displayName: 'Aditya Narayan Pradhan',
    subTitle: 'B.Sc. Agriculture Aspirant (OUAT Qualified)',
    courseTag: 'OUAT & ICAR Entrance Program',
    quote:
      'The speed techniques taught for Physics, Chemistry, and Agro-mental aptitude cut down my solving time drastically. Combined with concise revision notes and mock drills, it gave me complete confidence to secure my OUAT seat.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    isDemonstrationSample: false,
  },
  {
    id: 'test-5',
    authorType: 'Parent',
    displayName: 'Smt. Kabita Mohapatra',
    subTitle: 'Parent of +2 Science Student (Bijipur)',
    courseTag: 'Board & Entrance Guidance',
    quote:
      'The location in Bijipur Big Street is central and safe. Most importantly, the teachers give individual attention rather than treating students like roll numbers in overcrowded lecture halls.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isDemonstrationSample: false,
  },
  {
    id: 'test-6',
    authorType: 'Student',
    displayName: 'Debashish Nayak',
    subTitle: 'CHSE +2 Board Topper (96.2%)',
    courseTag: 'Odisha Board Mastery',
    quote:
      'The teachers reviewed our subjective answer copies with personalized red-pen corrections, showing exactly where step-marks could be gained in physics derivations and chemistry chemical equations.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    isDemonstrationSample: false,
  },
];
