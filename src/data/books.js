export const books = [
  {
    id: 1,
    title: "Concepts of Physics Vol. 1",
    author: "H.C. Verma",
    isbn: "9788177091878",
    genre: "jee",
    mrp: 525,
    price: 230,
    condition: "Good",
    language: "English",
    board: "CBSE",
    description: "The definitive Physics textbook for JEE aspirants. Covers mechanics, waves and optics with crystal-clear theory and challenging exercises.",
    conditionReport: "Highlighted sections in chapters 3, 5, 8. Some pencil notes in margins. All pages intact. Cover has minor wear at corners.",
    demandLevel: "high",
    coverColor: "from-blue-500 to-indigo-600",
    tags: ["jee", "physics", "textbook"]
  },
  {
    id: 2,
    title: "Objective NCERT at your Fingertips for NEET - Biology",
    author: "MTG Editorial Board",
    isbn: "9789389590807",
    genre: "neet",
    mrp: 850,
    price: 400,
    condition: "Like New",
    language: "English",
    board: "CBSE",
    description: "Extracted completely from NCERT. Best book for NEET Biology preparation with chapter-wise MCQs.",
    conditionReport: "Practically pristine. No marks, no dog-ears. A perfect copy.",
    demandLevel: "high",
    coverColor: "from-teal-500 to-green-600",
    tags: ["neet", "biology", "mcq"]
  },
  {
    id: 3,
    title: "Quantitative Aptitude for Competitive Examinations",
    author: "R.S. Aggarwal",
    isbn: "9789352534029",
    genre: "banking",
    mrp: 750,
    price: 320,
    condition: "Acceptable",
    language: "English",
    board: null,
    description: "The ultimate quantitative aptitude book for IBPS, SBI PO, and other banking exams.",
    conditionReport: "Heavy pencil use in practice sections. Some edge wear on the cover. Highly readable and usable.",
    demandLevel: "high",
    coverColor: "from-emerald-400 to-teal-600",
    tags: ["banking", "math", "aptitude"]
  },
  {
    id: 4,
    title: "Indian Polity - For Civil Services and Other State Examinations",
    author: "M. Laxmikanth",
    isbn: "9789352603633",
    genre: "upsc",
    mrp: 895,
    price: 450,
    condition: "Good",
    language: "English",
    board: null,
    description: "The 'Bible' for UPSC aspirants for Indian Polity. Comprehensive coverage of constitutional framework and government.",
    conditionReport: "Some passages highlighted in yellow. Binding is strong. Contains original annexures.",
    demandLevel: "high",
    coverColor: "from-stone-500 to-amber-700",
    tags: ["upsc", "polity", "civil-services"]
  },
  {
    id: 5,
    title: "General Knowledge (Lucent's)",
    author: "Dr. Binay Karna",
    isbn: "9788192933566",
    genre: "ssc-railway",
    mrp: 230,
    price: 110,
    condition: "Good",
    language: "English",
    board: null,
    description: "Highly recommended for SSC CGL, CHSL, and RRB NTPC exams. Covers history, geography, science, and static GK comprehensively.",
    conditionReport: "Clear text, pages slightly aged. No missing pages.",
    demandLevel: "high",
    coverColor: "from-blue-400 to-cyan-500",
    tags: ["ssc", "railway", "gk"]
  },
  {
    id: 6,
    title: "Legal Aptitude and Legal Reasoning for the CLAT",
    author: "A.P. Bhardwaj",
    isbn: "9789332507315",
    genre: "clat",
    mrp: 650,
    price: 300,
    condition: "Good",
    language: "English",
    board: null,
    description: "Crucial resource for law aspirants. Detailed coverage of torts, contracts, criminal law, and constitutional law.",
    conditionReport: "A few dog-eared pages. Minimal pencil marks. Excellent reading copy.",
    demandLevel: "medium",
    coverColor: "from-purple-500 to-fuchsia-600",
    tags: ["clat", "law", "reasoning"]
  },
  {
    id: 7,
    title: "Word Power Made Easy",
    author: "Norman Lewis",
    isbn: "9788183071000",
    genre: "banking",
    mrp: 180,
    price: 75,
    condition: "Acceptable",
    language: "English",
    board: null,
    description: "Essential for vocabulary building for Bank PO, SSC, and MBA entrance exams.",
    conditionReport: "Exercises partially filled with pencil. Cover is creased. Still a fantastic learning tool.",
    demandLevel: "high",
    coverColor: "from-red-400 to-pink-500",
    tags: ["vocabulary", "english"]
  },
  {
    id: 8,
    title: "A Brief History of Modern India",
    author: "Rajiv Ahir (Spectrum)",
    isbn: "9788179307212",
    genre: "upsc",
    mrp: 415,
    price: 190,
    condition: "Like New",
    language: "English",
    board: null,
    description: "Standard history text for UPSC civil services preliminary and main examinations.",
    conditionReport: "Like new condition. Crisp pages, no highlights.",
    demandLevel: "high",
    coverColor: "from-yellow-500 to-amber-600",
    tags: ["upsc", "history", "modern-india"]
  },
  {
    id: 9,
    title: "Fast Track Objective Arithmetic",
    author: "Rajesh Verma",
    isbn: "9789350942482",
    genre: "ssc-railway",
    mrp: 450,
    price: 210,
    condition: "Good",
    language: "English",
    board: null,
    description: "Excellent for quick calculation methods required in SSC and Railway exams.",
    conditionReport: "A bit of wear on the spine. Pages are completely clean without marks.",
    demandLevel: "medium",
    coverColor: "from-cyan-500 to-blue-600",
    tags: ["ssc", "math", "arithmetic"]
  },
  {
    id: 10,
    title: "Problems in General Physics",
    author: "I.E. Irodov",
    isbn: "9788183552158",
    genre: "jee",
    mrp: 295,
    price: 140,
    condition: "Good",
    language: "English",
    board: null,
    description: "Advanced physics problems for JEE Advanced preparation. The ultimate test of physics concepts.",
    conditionReport: "Notes and solutions scribbled lightly in the margins of tough problems.",
    demandLevel: "high",
    coverColor: "from-slate-600 to-gray-800",
    tags: ["jee", "advanced", "physics"]
  }
];

export const genres = [
  { id: "ssc-railway", label: "SSC & Railway", icon: "🚆", color: "from-blue-400 to-indigo-600" },
  { id: "banking",     label: "Banking",       icon: "🏦", color: "from-green-400 to-emerald-600" },
  { id: "jee",         label: "JEE Mains/Adv", icon: "⚛️", color: "from-orange-400 to-red-600" },
  { id: "neet",        label: "NEET UG",       icon: "🩺", color: "from-teal-400 to-cyan-600" },
  { id: "upsc",        label: "UPSC CSE",      icon: "🏛️", color: "from-stone-400 to-amber-700" },
  { id: "clat",        label: "CLAT",          icon: "⚖️", color: "from-purple-400 to-fuchsia-600" },
];

export const testimonials = [
  {
    id: 1,
    name: "Ravi Kumar",
    city: "Kota",
    avatar: "RK",
    avatarColor: "from-blue-400 to-indigo-500",
    rating: 5,
    role: "JEE Aspirant",
    text: "Got HC Verma and Irodov for less than half the MRP. The condition was exactly as described — even the marginal notes actually helped!"
  },
  {
    id: 2,
    name: "Anjali Desai",
    city: "Pune",
    avatar: "AD",
    avatarColor: "from-emerald-400 to-teal-500",
    rating: 5,
    role: "Seller",
    text: "Sold my NEET Biology and Chemistry modules after clearing the exam. Got excellent value back and knowing it's helping another student is the best part."
  },
  {
    id: 3,
    name: "Mohit Sharma",
    city: "Delhi",
    avatar: "MS",
    avatarColor: "from-amber-400 to-orange-500",
    rating: 4,
    role: "UPSC Aspirant",
    text: "Found Laxmikanth and Spectrum in practically new condition. PageBack is a lifesaver for UPSC preparation where books change slightly every year."
  }
];

export const whyPageBack = [
  {
    icon: "💰",
    title: "Student Budgets",
    desc: "Competitive exam prep is expensive. We make standard textbooks accessible at 50-70% off MRP."
  },
  {
    icon: "✅",
    title: "Verified Editions",
    desc: "We rigorously verify book editions and condition so you never study from outdated material."
  },
  {
    icon: "♻️",
    title: "Clear Your Desk",
    desc: "Cleared your exam? Sell your stack instantly and help the next batch of aspirants succeed."
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    desc: "We know every day counts before an exam. Get lightning-fast shipping directly to your hostel or home."
  }
];
