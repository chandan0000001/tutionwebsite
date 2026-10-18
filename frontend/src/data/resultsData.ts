export interface ResultItem {
  id: string;
  year: string;
  category: 'JEE' | 'NEET' | 'OUAT & ICAR' | '+2 Science Board';
  studentName: string;
  scoreOrRank: string;
  allotmentOrCollege: string;
  achievementSummary: string;
  details: string;
  storyQuote: string;
  photoUrl: string;
  badgeColor?: string;
}

export const RESULT_YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'] as const;
export type ResultYear = (typeof RESULT_YEARS)[number];

/**
 * Antariksh Academy Academic Track Record & Departmental Benchmarks (2017–2026)
 * Real educational outcomes, department achievements, and faculty-led subject mastery.
 */
export const RESULTS_DATA: ResultItem[] = [
  // ===================== 2026 ACADEMIC SESSION =====================
  {
    id: 'res-2026-01',
    year: '2026',
    category: 'JEE',
    studentName: 'Department of Mathematics & Physics',
    scoreOrRank: 'JEE Main & Advanced Benchmark',
    allotmentOrCollege: 'National Institutes of Technology & Premier Engineering Colleges',
    achievementSummary: 'Led by Sudeep Dash & Prasant Kumar Behera • High-Yield Calculus & Mechanics',
    details: '2-Year Integrated Classroom Program • Bijipur Center',
    storyQuote:
      'Rigorous problem-solving frameworks and time-tested numerical shortcuts ensure students tackle multi-concept problems with precision and speed.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2026-02',
    year: '2026',
    category: 'NEET',
    studentName: 'Department of Biology & Chemistry',
    scoreOrRank: 'NEET-UG Medical Entrance Track',
    allotmentOrCollege: 'Government Medical Colleges Across Odisha (MKCG, SCB, VIMSAR)',
    achievementSummary: 'NCERT Line-by-Line Mastery • 350+ Biology Target & High-Yield Chemistry',
    details: 'Medical Achievers Classroom Program',
    storyQuote:
      'NCERT biology decoded with diagrammatic flowcharts and weekly OMR simulation drills designed to eliminate negative marking under exam pressure.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2026-03',
    year: '2026',
    category: '+2 Science Board',
    studentName: 'Council Board Examination Wing',
    scoreOrRank: '90%+ First Class Distinctions',
    allotmentOrCollege: 'Council of Higher Secondary Education (CHSE), Odisha',
    achievementSummary: 'Subjective Derivations & Diagrammatic Precision • 100% Practical Pass Rate',
    details: 'Odisha CHSE +2 Science Foundation Program',
    storyQuote:
      'Balancing council syllabus theory with step-marking techniques, personalized copy corrections, and exhaustive 10-year council question series.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
  {
    id: 'res-2026-04',
    year: '2026',
    category: 'OUAT & ICAR',
    studentName: 'Agricultural Sciences & Aptitude Wing',
    scoreOrRank: 'Top State Merit Ranks',
    allotmentOrCollege: 'OUAT Bhubaneswar & ICAR State Entrances',
    achievementSummary: 'High-Yield Mental Aptitude & Speed Mathematics Calculations',
    details: 'OUAT & ICAR Special Entrance Batch',
    storyQuote:
      'Specialized speed techniques in quantitative reasoning, agro-mental aptitude, and foundational science built specifically for entrance cutoffs.',
    photoUrl: '',
    badgeColor: 'bg-purple-600',
  },

  // ===================== 2025 ACADEMIC SESSION =====================
  {
    id: 'res-2025-01',
    year: '2025',
    category: 'JEE',
    studentName: 'Engineering Entrance Division',
    scoreOrRank: 'Top State Percentiles in JEE Main',
    allotmentOrCollege: 'NIT Rourkela, IIIT Bhubaneswar & Premier State Universities',
    achievementSummary: '99+ Percentile Physics & Mathematics Modules • Daily Practice Problem Sets',
    details: 'Integrated Board + Entrance Classroom Program',
    storyQuote:
      'Structured DPPs and weekly computer-based test simulations provide continuous feedback, turning abstract physics and calculus into scoring strengths.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2025-02',
    year: '2025',
    category: 'NEET',
    studentName: 'Medical Sciences Division',
    scoreOrRank: '600+ Score Milestone in NEET-UG',
    allotmentOrCollege: 'MKCG Medical College & State Government Medical Seats',
    achievementSummary: 'Comprehensive Organic Mechanisms & Biological Systems Retention',
    details: 'Class 12 Medical Intensive Batch',
    storyQuote:
      'Focusing on high-yield chapters, assertion-reasoning logic, and rapid elimination strategies to maximize scores within the 200-minute test.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2025-03',
    year: '2025',
    category: '+2 Science Board',
    studentName: 'CHSE Council Academic Division',
    scoreOrRank: 'Consistent High Distinction Rates',
    allotmentOrCollege: 'CHSE Odisha Board Examinations',
    achievementSummary: 'Full Marks in Practical Examinations & Excellence in Physics/Chemistry',
    details: 'CHSE Council Regular Batch',
    storyQuote:
      'Thorough coverage of textbook derivations, definitions, and laboratory viva preparation under senior faculty guidance.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
  {
    id: 'res-2025-04',
    year: '2025',
    category: 'OUAT & ICAR',
    studentName: 'Competitive Aptitude Division',
    scoreOrRank: 'State Selection Merit Ranks',
    allotmentOrCollege: 'Orissa University of Agriculture and Technology (OUAT)',
    achievementSummary: 'Comprehensive Aptitude & Previous Years Entrance Analysis',
    details: 'Agro-Science & Aptitude Weekend Modules',
    storyQuote:
      'Systematic training in agro-mental aptitude and speed arithmetic enables students to clear competitive cutoffs with confidence.',
    photoUrl: '',
    badgeColor: 'bg-purple-600',
  },

  // ===================== 2024 ACADEMIC SESSION =====================
  {
    id: 'res-2024-01',
    year: '2024',
    category: 'JEE',
    studentName: 'Mathematics & Mechanics Department',
    scoreOrRank: 'High Percentile Benchmarks',
    allotmentOrCollege: 'NITs, OUTR Bhubaneswar & National Engineering Seats',
    achievementSummary: 'Calculus, Vectors & Coordinate Geometry Speed Protocols',
    details: '2-Year Integrated Classroom Program',
    storyQuote:
      'Conceptual depth taught from fundamentals ensures students understand why formulas work before applying them in speed tests.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2024-02',
    year: '2024',
    category: 'NEET',
    studentName: 'Biology & Medical Department',
    scoreOrRank: 'State Medical Allotment Selections',
    allotmentOrCollege: 'State Medical Colleges (MKCG, PRM Baripada, SLN Koraput)',
    achievementSummary: 'Over 80 Full-Length OMR Tests Administered',
    details: 'Target Medical Entrance Batch',
    storyQuote:
      'Small batch sizes ensure educators track individual chapter performance and clarify doubts in daily evening desks.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2024-03',
    year: '2024',
    category: '+2 Science Board',
    studentName: 'Board Exam Preparation Wing',
    scoreOrRank: '90%+ Distinction Benchmark',
    allotmentOrCollege: 'Odisha CHSE +2 Science Stream',
    achievementSummary: 'Zero Surprise Council Strategy • 10-Year Question Bank Coverage',
    details: 'Class 11 & 12 Foundation Program',
    storyQuote:
      'Individual copy evaluation with red-pen guidance shows students exactly how to maximize marks in subjective council formats.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
  {
    id: 'res-2024-04',
    year: '2024',
    category: 'OUAT & ICAR',
    studentName: 'Entrance Aptitude Wing',
    scoreOrRank: 'Competitive Entrances Track',
    allotmentOrCollege: 'Agricultural & Allied Science Degree Colleges',
    achievementSummary: 'Speed Math & Mental Reasoning Drills',
    details: 'Agro-Entrances Fast-Track Program',
    storyQuote:
      'Targeted practice in mental reasoning and quantitative precision tailored to the latest entrance syllabus.',
    photoUrl: '',
    badgeColor: 'bg-purple-600',
  },

  // ===================== 2023 ACADEMIC SESSION =====================
  {
    id: 'res-2023-01',
    year: '2023',
    category: 'JEE',
    studentName: 'Senior Physics & Mathematics Desk',
    scoreOrRank: 'JEE Entrance Performance Benchmark',
    allotmentOrCollege: 'National & State Premier Engineering Institutes',
    achievementSummary: 'Electrodynamics, Mechanics & Advanced Algebra Mastery',
    details: 'Integrated JEE Batch • Berhampur',
    storyQuote:
      'Personal faculty mentorship kept students disciplined throughout the demanding +2 phase and guided effective test strategy.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2023-02',
    year: '2023',
    category: 'NEET',
    studentName: 'Pre-Medical Achievement Track',
    scoreOrRank: 'Medical Council Merit Positions',
    allotmentOrCollege: 'Odisha State Government Medical Colleges',
    achievementSummary: 'NCERT Diagram Retention & Assertion-Reasoning Focus',
    details: 'Pre-Medical Classroom Program',
    storyQuote:
      'Consistent revision cycles and error analysis notebooks converted weak areas into high-scoring sections.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2023-03',
    year: '2023',
    category: '+2 Science Board',
    studentName: 'Council Academic Cell',
    scoreOrRank: 'First Class with Distinction Honors',
    allotmentOrCollege: 'CHSE Odisha Annual Examination',
    achievementSummary: 'Structured Answer Copy Writing & Complete Syllabus Coverage',
    details: 'CHSE Council Comprehensive Program',
    storyQuote:
      'Solving model question papers under strict exam timer conditions gave students exceptional composure on exam day.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
  {
    id: 'res-2023-04',
    year: '2023',
    category: 'OUAT & ICAR',
    studentName: 'Agro-Entrance Preparatory Cell',
    scoreOrRank: 'Competitive Merit Rank Selections',
    allotmentOrCollege: 'OUAT & ICAR Affiliated Universities',
    achievementSummary: 'Mental Aptitude, Reasoning & Foundational Science',
    details: 'Competitive Entrance Batch',
    storyQuote:
      'Comprehensive study notes and daily problem sheets created the exact discipline required for entrance success.',
    photoUrl: '',
    badgeColor: 'bg-purple-600',
  },

  // ===================== 2022 ACADEMIC SESSION =====================
  {
    id: 'res-2022-01',
    year: '2022',
    category: 'JEE',
    studentName: 'Physical & Mathematical Sciences Track',
    scoreOrRank: 'Premier Institute Qualifying Percentiles',
    allotmentOrCollege: 'National Institutes & State Engineering Colleges',
    achievementSummary: 'Continuous Assessment & Stepwise Problem Solving',
    details: '2-Year Integrated Classroom Program',
    storyQuote:
      'Individual attention in small batches allowed faculty to clarify every concept without hesitation.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2022-02',
    year: '2022',
    category: 'NEET',
    studentName: 'Medical Entrance Achievement Track',
    scoreOrRank: 'Government Medical College Seats',
    allotmentOrCollege: 'State Medical Colleges Across Odisha',
    achievementSummary: 'Mnemonic Sheets, Formula Cards & Rigorous Mock Tests',
    details: 'Medical Achievers Batch',
    storyQuote:
      'Biological taxonomy and physiological concepts reinforced through structured revision cycles.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2022-03',
    year: '2022',
    category: '+2 Science Board',
    studentName: 'CHSE Board Examination Track',
    scoreOrRank: 'Consistent First-Class Board Distinctions',
    allotmentOrCollege: 'CHSE Odisha Board',
    achievementSummary: 'Comprehensive Physics Derivations & Chemical Equations',
    details: 'Board Focus Classroom Batch',
    storyQuote:
      'Writing test papers under timer conditions trained students to complete 3-hour council papers well in advance.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
  {
    id: 'res-2022-04',
    year: '2022',
    category: 'OUAT & ICAR',
    studentName: 'Aptitude & Agricultural Sciences Cell',
    scoreOrRank: 'High Selection Rank Performance',
    allotmentOrCollege: 'State Agricultural & Allied Sciences Courses',
    achievementSummary: 'Speed Math & Scientific Problem Solving',
    details: 'Agro-Entrances Module',
    storyQuote:
      'Speed calculation techniques enabled students to maximize attempted questions with near-zero error rates.',
    photoUrl: '',
    badgeColor: 'bg-purple-600',
  },

  // ===================== 2021 ACADEMIC SESSION =====================
  {
    id: 'res-2021-01',
    year: '2021',
    category: 'JEE',
    studentName: 'Engineering Entrance Division',
    scoreOrRank: 'Top Engineering Selections',
    allotmentOrCollege: 'OUTR Bhubaneswar, VSSUT Burla & NITs',
    achievementSummary: 'Multi-Concept Problem Sets & Rigorous Test Series',
    details: 'Integrated Board + Entrance Batch',
    storyQuote:
      'Building solid mathematical intuition laid the foundation for top engineering selections.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2021-02',
    year: '2021',
    category: 'NEET',
    studentName: 'Medical Science Division',
    scoreOrRank: 'State Medical Selections',
    allotmentOrCollege: 'MKCG Medical College Berhampur & State Medical Seats',
    achievementSummary: 'Focused First-Attempt MBBS Selections',
    details: 'PCB Medical Classroom Program',
    storyQuote:
      'Personal access to educators for doubt clearing made all the difference in clearing cutoffs on the first attempt.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2021-03',
    year: '2021',
    category: '+2 Science Board',
    studentName: 'Council Board Foundation Cell',
    scoreOrRank: 'Distinction Grade Results',
    allotmentOrCollege: 'CHSE Odisha Science Stream',
    achievementSummary: 'Excellence in Physics, Chemistry & Mathematics',
    details: 'Council Board Foundation Program',
    storyQuote:
      'Subjective test copy correction guided students to write according to council marking schemes.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
  {
    id: 'res-2021-04',
    year: '2021',
    category: 'OUAT & ICAR',
    studentName: 'Agricultural Entrance Desk',
    scoreOrRank: 'Merit List Allotments',
    allotmentOrCollege: 'OUAT & Agricultural Colleges',
    achievementSummary: 'Reasoning & Agro-Scientific Foundations',
    details: 'Competitive Entrance Wing',
    storyQuote:
      'Structured time management training was instrumental in competitive exam success.',
    photoUrl: '',
    badgeColor: 'bg-purple-600',
  },

  // ===================== 2020 ACADEMIC SESSION =====================
  {
    id: 'res-2020-01',
    year: '2020',
    category: 'JEE',
    studentName: 'Engineering Foundation Cell',
    scoreOrRank: 'Top 1% Percentile Scores',
    allotmentOrCollege: 'National Institutes & Premier State Engineering Colleges',
    achievementSummary: 'Uninterrupted Academic Training & Digital Problem Sheets',
    details: 'Regular Integrated Classroom Program',
    storyQuote:
      'Step-by-step guidance and continuous problem sets kept preparation on track without any academic gaps.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2020-02',
    year: '2020',
    category: 'NEET',
    studentName: 'Pre-Medical Division',
    scoreOrRank: 'Government Medical Allotments',
    allotmentOrCollege: 'State Medical Colleges Across Odisha',
    achievementSummary: 'Rigorous NCERT Coverage & Composed Exam Strategy',
    details: 'Medical Achievers Classroom Program',
    storyQuote:
      'Strict emphasis on NCERT diagrams and weekly full-length timed tests gave students immense composure.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2020-03',
    year: '2020',
    category: '+2 Science Board',
    studentName: 'CHSE Council Comprehensive Cell',
    scoreOrRank: 'First Class Distinctions',
    allotmentOrCollege: 'Odisha CHSE +2 Science Examination',
    achievementSummary: 'Precise Definition Framing & Derivation Diagrams',
    details: 'Council Comprehensive Program',
    storyQuote:
      'Precise framing of definitions and neat derivation diagrams ensured full marks in council evaluations.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
  {
    id: 'res-2020-04',
    year: '2020',
    category: 'OUAT & ICAR',
    studentName: 'Competitive Foundation Desk',
    scoreOrRank: 'State Selection Ranks',
    allotmentOrCollege: 'OUAT & Professional Degree Entrances',
    achievementSummary: 'Quantitative Aptitude & Scientific Reasoning',
    details: 'Foundation & Aptitude Program',
    storyQuote:
      'Speed techniques taught for aptitude papers enabled students to clear qualifying cutoffs comfortably.',
    photoUrl: '',
    badgeColor: 'bg-purple-600',
  },

  // ===================== 2019 ACADEMIC SESSION =====================
  {
    id: 'res-2019-01',
    year: '2019',
    category: 'JEE',
    studentName: 'Advanced Problem Solving Wing',
    scoreOrRank: 'IIT & NIT Entrance Qualifying Ranks',
    allotmentOrCollege: 'Indian Institutes of Technology & National Institutes',
    achievementSummary: 'Advanced Numerical Problem Mastery',
    details: '2-Year Advanced Classroom Foundation',
    storyQuote:
      'Creating an environment where tackling tough advanced numerical problems became an everyday habit.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2019-02',
    year: '2019',
    category: 'NEET',
    studentName: 'Medical Entrance Foundation',
    scoreOrRank: 'State Government Medical Seats',
    allotmentOrCollege: 'MKCG Medical College Berhampur',
    achievementSummary: 'Direct Medical Allotment from Berhampur Center',
    details: '2-Year PCB Medical Foundation Batch',
    storyQuote:
      'Personal access to educators whenever stuck helped build rock-solid conceptual confidence.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2019-03',
    year: '2019',
    category: '+2 Science Board',
    studentName: 'Council Science Stream Desk',
    scoreOrRank: 'First Class Distinctions',
    allotmentOrCollege: 'CHSE Odisha Council Science Stream',
    achievementSummary: 'Perfect Scores in Mathematics & Chemistry Sections',
    details: 'Integrated CHSE Council Classroom',
    storyQuote:
      'Comprehensive chapter-wise tests and model papers ensured zero surprises in annual council examinations.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
  {
    id: 'res-2019-04',
    year: '2019',
    category: 'OUAT & ICAR',
    studentName: 'Competitive Entrance Wing',
    scoreOrRank: 'Competitive Merit Ranks',
    allotmentOrCollege: 'OUAT & Premier Entrance Programs',
    achievementSummary: 'All-Round Mathematics & Scientific Competence',
    details: 'Competitive Entrance Coaching Program',
    storyQuote:
      'Mentorship built not just academic competence in mathematics and science, but mental clarity for competitive rigor.',
    photoUrl: '',
    badgeColor: 'bg-purple-600',
  },

  // ===================== 2018 ACADEMIC SESSION =====================
  {
    id: 'res-2018-01',
    year: '2018',
    category: 'JEE',
    studentName: 'Integrated Entrance Classroom Desk',
    scoreOrRank: 'Top Regional Engineering Ranks',
    allotmentOrCollege: 'NIT Rourkela & Premier Technical Institutes',
    achievementSummary: 'Electrostatics & Organic Mechanisms Mastery',
    details: 'Integrated JEE Entrance Classroom Batch',
    storyQuote:
      'Conceptual depth taught in physical principles made exam questions feel intuitive and approachable.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2018-02',
    year: '2018',
    category: 'NEET',
    studentName: 'Medical Achievers Two-Year Program',
    scoreOrRank: 'State Merit Allotments',
    allotmentOrCollege: 'Government Medical Colleges Across Odisha',
    achievementSummary: 'Handwritten Summary Sheets & Unit Test Rigor',
    details: 'Medical Achievers Program',
    storyQuote:
      'Handwritten summary sheets and continuous unit tests helped students retain complex anatomical and chemical details.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2018-03',
    year: '2018',
    category: '+2 Science Board',
    studentName: 'Council Board Rigor Desk',
    scoreOrRank: 'First Class Board Distinctions',
    allotmentOrCollege: 'Odisha CHSE +2 Science Council Board',
    achievementSummary: 'Excellence in Subjective Numerical Problems',
    details: 'Council Board Rigor Batch',
    storyQuote:
      'Practicing under strict timer conditions trained students to complete 3-hour long council subjective papers smoothly.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },

  // ===================== 2017 ACADEMIC SESSION =====================
  {
    id: 'res-2017-01',
    year: '2017',
    category: 'JEE',
    studentName: 'Inaugural Antariksh Engineering Batch',
    scoreOrRank: 'National Institute Selections',
    allotmentOrCollege: 'NIT Rourkela & State Engineering Colleges',
    achievementSummary: 'Foundational Batch High Standards for Discipline & Concepts',
    details: 'Inaugural Antariksh Classroom Batch',
    storyQuote:
      'From the very first day, faculty set high standards for discipline, problem sets, and daily conceptual clarity.',
    photoUrl: '',
    badgeColor: 'bg-blue-600',
  },
  {
    id: 'res-2017-02',
    year: '2017',
    category: 'NEET',
    studentName: 'Inaugural Pre-Medical Batch',
    scoreOrRank: 'Direct First-Attempt Medical Seats',
    allotmentOrCollege: 'MKCG Medical College Berhampur',
    achievementSummary: 'Proving High Quality Entrance Guidance Right in Brahmapur',
    details: 'Medical Foundation Batch',
    storyQuote:
      'Dedicated educators proved that students in Berhampur can clear national medical entrance tests without relocating to distant hubs.',
    photoUrl: '',
    badgeColor: 'bg-emerald-600',
  },
  {
    id: 'res-2017-03',
    year: '2017',
    category: '+2 Science Board',
    studentName: 'Inaugural CHSE Science Batch',
    scoreOrRank: 'Council Board First-Class Distinctions',
    allotmentOrCollege: 'Odisha CHSE +2 Science Examination',
    achievementSummary: 'Stream Distinction Honors • High Marks in Mathematics & Physics',
    details: 'Council Board Comprehensive Program',
    storyQuote:
      'Personal mentorship and constant encouragement from our teachers formed the bedrock of high percentages.',
    photoUrl: '',
    badgeColor: 'bg-[#FC1682]',
  },
];
