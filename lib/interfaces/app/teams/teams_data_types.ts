

export type AppTeam = {
    id: string|number;
    name: string;
    description: string;
    members: number;
    projects: number;
    avatar: string;
};

export type AppProject = {
  id: string|number;
  name: string;
  team: string;
  progress: number;
  status: string;
  dueDate: string;
  priority: string;
};



export const mockData_teamsData_en:AppTeam[] =  [
  {
    id: 1,
    name: "Product Development",
    description: "Responsible for designing and developing new products",
    members: 12,
    projects: 5,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
  },
  {
    id: 2,
    name: "Marketing",
    description: "Handles all marketing and promotional activities",
    members: 8,
    projects: 3,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
  },
  {
    id: 3,
    name: "Customer Support",
    description: "Provides assistance and support to customers",
    members: 15,
    projects: 2,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
  },
  {
    id: 4,
    name: "Finance",
    description: "Manages financial planning and reporting",
    members: 6,
    projects: 4,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
  },
  {
    id: 5,
    name: "HR & Recruitment",
    description: "Handles hiring and employee relations",
    members: 7,
    projects: 3,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
  },
  {
    id: 6,
    name: "Research & Innovation",
    description: "Explores new technologies and market opportunities",
    members: 9,
    projects: 6,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
  },
];
export const mockData_teamsData_fr:AppTeam[] = [
  {
    id: 1,
    name: "Développement de Produits",
    description: "Responsable de la conception et du développement de nouveaux produits",
    members: 12,
    projects: 5,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
  },
  {
    id: 2,
    name: "Marketing",
    description: "Gère toutes les activités de marketing et de promotion",
    members: 8,
    projects: 3,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
  },
  {
    id: 3,
    name: "Service Client",
    description: "Fournit assistance et support aux clients",
    members: 15,
    projects: 2,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
  },
  {
    id: 4,
    name: "Finance",
    description: "Gère la planification financière et les rapports",
    members: 6,
    projects: 4,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
  },
  {
    id: 5,
    name: "RH & Recrutement",
    description: "Gère l'embauche et les relations avec les employés",
    members: 7,
    projects: 3,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
  },
  {
    id: 6,
    name: "Recherche & Innovation",
    description: "Explore les nouvelles technologies et opportunités de marché",
    members: 9,
    projects: 6,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
  },
];
export const mockData_teamsData_ar:AppTeam[] =  [
  {
    id: 1,
    name: "تطوير المنتجات",
    description: "مسؤول عن تصميم وتطوير منتجات جديدة",
    members: 12,
    projects: 5,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
  },
  {
    id: 2,
    name: "التسويق",
    description: "يتعامل مع جميع أنشطة التسويق والترويج",
    members: 8,
    projects: 3,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
  },
  {
    id: 3,
    name: "دعم العملاء",
    description: "يقدم المساعدة والدعم للعملاء",
    members: 15,
    projects: 2,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
  },
  {
    id: 4,
    name: "المالية",
    description: "يدير التخطيط المالي وإعداد التقارير",
    members: 6,
    projects: 4,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
  },
  {
    id: 5,
    name: "الموارد البشرية والتوظيف",
    description: "يتعامل مع التوظيف وعلاقات الموظفين",
    members: 7,
    projects: 3,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
  },
  {
    id: 6,
    name: "البحث والابتكار",
    description: "يستكشف التقنيات الجديدة وفرص السوق",
    members: 9,
    projects: 6,
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
  },
];

// Localized team data based on the current locale
export const mockData_teamsData: { en: AppTeam[], fr: AppTeam[], ar: AppTeam[] } = {
    en: mockData_teamsData_en,
    fr: mockData_teamsData_fr,
    ar: mockData_teamsData_ar,
};


export const mockData_projectsData_en:AppProject[] = [
  {
    id: 1,
    name: "Website Redesign",
    team: "Marketing",
    progress: 75,
    status: "In Progress",
    dueDate: "Aug 15, 2023",
    priority: "High",
  },
  {
    id: 2,
    name: "Q3 Financial Report",
    team: "Finance",
    progress: 40,
    status: "In Progress",
    dueDate: "Sep 30, 2023",
    priority: "Medium",
  },
  {
    id: 3,
    name: "New Product Launch",
    team: "Product Development",
    progress: 90,
    status: "In Progress",
    dueDate: "Jul 30, 2023",
    priority: "High",
  },
  {
    id: 4,
    name: "Customer Satisfaction Survey",
    team: "Customer Support",
    progress: 60,
    status: "In Progress",
    dueDate: "Aug 10, 2023",
    priority: "Medium",
  },
  {
    id: 5,
    name: "Employee Onboarding Improvement",
    team: "HR & Recruitment",
    progress: 30,
    status: "In Progress",
    dueDate: "Sep 15, 2023",
    priority: "Low",
  },
  {
    id: 6,
    name: "AI Integration Research",
    team: "Research & Innovation",
    progress: 50,
    status: "In Progress",
    dueDate: "Oct 1, 2023",
    priority: "High",
  },
];
export const mockData_projectsData_fr:AppProject[] =  [
  {
    id: 1,
    name: "Refonte du Site Web",
    team: "Marketing",
    progress: 75,
    status: "En cours",
    dueDate: "15 août 2023",
    priority: "High",
  },
  {
    id: 2,
    name: "Rapport Financier T3",
    team: "Finance",
    progress: 40,
    status: "En cours",
    dueDate: "30 sept. 2023",
    priority: "Medium",
  },
  {
    id: 3,
    name: "Lancement de Nouveau Produit",
    team: "Développement de Produits",
    progress: 90,
    status: "En cours",
    dueDate: "30 juil. 2023",
    priority: "High",
  },
  {
    id: 4,
    name: "Enquête de Satisfaction Client",
    team: "Service Client",
    progress: 60,
    status: "En cours",
    dueDate: "10 août 2023",
    priority: "Medium",
  },
  {
    id: 5,
    name: "Amélioration de l'Intégration des Employés",
    team: "RH & Recrutement",
    progress: 30,
    status: "En cours",
    dueDate: "15 sept. 2023",
    priority: "Low",
  },
  {
    id: 6,
    name: "Recherche sur l'Intégration de l'IA",
    team: "Recherche & Innovation",
    progress: 50,
    status: "En cours",
    dueDate: "1 oct. 2023",
    priority: "High",
  },
] ;
export const mockData_projectsData_ar:AppProject[] =  [
  {
    id: 1,
    name: "إعادة تصميم الموقع الإلكتروني",
    team: "التسويق",
    progress: 75,
    status: "قيد التنفيذ",
    dueDate: "15 أغسطس 2023",
    priority: "High",
  },
  {
    id: 2,
    name: "التقرير المالي للربع الثالث",
    team: "المالية",
    progress: 40,
    status: "قيد التنفيذ",
    dueDate: "30 سبتمبر 2023",
    priority: "Medium",
  },
  {
    id: 3,
    name: "إطلاق منتج جديد",
    team: "تطوير المنتجات",
    progress: 90,
    status: "قيد التنفيذ",
    dueDate: "30 يوليو 2023",
    priority: "High",
  },
  {
    id: 4,
    name: "استطلاع رضا العملاء",
    team: "دعم العملاء",
    progress: 60,
    status: "قيد التنفيذ",
    dueDate: "10 أغسطس 2023",
    priority: "Medium",
  },
  {
    id: 5,
    name: "تحسين تهيئة الموظفين الجدد",
    team: "الموارد البشرية والتوظيف",
    progress: 30,
    status: "قيد التنفيذ",
    dueDate: "15 سبتمبر 2023",
    priority: "Low",
  },
  {
    id: 6,
    name: "بحث في تكامل الذكاء الاصطناعي",
    team: "البحث والابتكار",
    progress: 50,
    status: "قيد التنفيذ",
    dueDate: "1 أكتوبر 2023",
    priority: "High",
  },
] ;


// Localized project data based on the current locale
export const mockData_projectsData: { en: AppProject[], fr: AppProject[], ar: AppProject[] } = {
    en: mockData_projectsData_en ,
    fr: mockData_projectsData_fr ,
    ar: mockData_projectsData_ar ,
};
