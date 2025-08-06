import {
    Plus,
  MessageSquare,
  FileText,
  BarChart,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

import { AppUser } from "../../users/user";

export type AppActivity = {
    id: string|number;
    action: string;
    target: string;
    time: string;
    type: string;
    user: AppUser;
    icon?: React.ReactNode;
    iconColor?: string;
};

export const mockData_activityData_en = [
    {
      user: {
        name: "Alex Rivera",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      action: "completed task",
      target: "Update product specifications",
      project: "New Product Launch",
      team: "Product Development",
      time: "10 minutes ago",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      user: {
        name: "Jennifer Smith",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
      },
      action: "added file",
      target: "Q3 Marketing Strategy.pdf",
      project: "Website Redesign",
      team: "Marketing",
      time: "1 hour ago",
      icon: FileText,
      iconColor: "text-blue-500",
    },
    {
      user: {
        name: "David Wilson",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
      },
      action: "commented on",
      target: "Budget allocation for Q4",
      project: "Q3 Financial Report",
      team: "Finance",
      time: "2 hours ago",
      icon: MessageSquare,
      iconColor: "text-purple-500",
    },
    {
      user: {
        name: "Lisa Brown",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
      },
      action: "created task",
      target: "Develop customer feedback form",
      project: "Customer Satisfaction Survey",
      team: "Customer Support",
      time: "3 hours ago",
      icon: Plus,
      iconColor: "text-indigo-500",
    },
    {
      user: {
        name: "Michael Chen",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
      },
      action: "updated milestone",
      target: "Research phase completion",
      project: "AI Integration Research",
      team: "Research & Innovation",
      time: "5 hours ago",
      icon: BarChart,
      iconColor: "text-yellow-500",
    },
    {
      user: {
        name: "Sarah Johnson",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
      },
      action: "flagged issue",
      target: "Onboarding documentation outdated",
      project: "Employee Onboarding Improvement",
      team: "HR & Recruitment",
      time: "Yesterday",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
];
export const mockData_activityData_fr = [
    {
      user: {
        name: "Alex Rivera",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      action: "a terminé la tâche",
      target: "Mettre à jour les spécifications du produit",
      project: "Lancement de Nouveau Produit",
      team: "Développement de Produits",
      time: "il y a 10 minutes",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      user: {
        name: "Jennifer Smith",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
      },
      action: "a ajouté le fichier",
      target: "Stratégie Marketing T3.pdf",
      project: "Refonte du Site Web",
      team: "Marketing",
      time: "il y a 1 heure",
      icon: FileText,
      iconColor: "text-blue-500",
    },
    {
      user: {
        name: "David Wilson",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
      },
      action: "a commenté sur",
      target: "Allocation budgétaire pour T4",
      project: "Rapport Financier T3",
      team: "Finance",
      time: "il y a 2 heures",
      icon: MessageSquare,
      iconColor: "text-purple-500",
    },
    {
      user: {
        name: "Lisa Brown",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
      },
      action: "a créé la tâche",
      target: "Développer le formulaire de feedback client",
      project: "Enquête de Satisfaction Client",
      team: "Service Client",
      time: "il y a 3 heures",
      icon: Plus,
      iconColor: "text-indigo-500",
    },
    {
      user: {
        name: "Michael Chen",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
      },
      action: "a mis à jour le jalon",
      target: "Achèvement de la phase de recherche",
      project: "Recherche sur l'Intégration de l'IA",
      team: "Recherche & Innovation",
      time: "il y a 5 heures",
      icon: BarChart,
      iconColor: "text-yellow-500",
    },
    {
      user: {
        name: "Sarah Johnson",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
      },
      action: "a signalé un problème",
      target: "Documentation d'intégration obsolète",
      project: "Amélioration de l'Intégration des Employés",
      team: "RH & Recrutement",
      time: "Hier",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
];
export const mockData_activityData_ar =  [
    {
      user: {
        name: "أليكس ريفيرا",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
      },
      action: "أكمل المهمة",
      target: "تحديث مواصفات المنتج",
      project: "إطلاق منتج جديد",
      team: "تطوير المنتجات",
      time: "منذ 10 دقائق",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      user: {
        name: "جينيفر سميث",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
      },
      action: "أضاف ملف",
      target: "استراتيجية التسويق للربع الثالث.pdf",
      project: "إعادة تصميم الموقع الإلكتروني",
      team: "التسويق",
      time: "منذ ساعة",
      icon: FileText,
      iconColor: "text-blue-500",
    },
    {
      user: {
        name: "ديفيد ويلسون",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
      },
      action: "علق على",
      target: "تخصيص الميزانية للربع الرابع",
      project: "التقرير المالي للربع الثالث",
      team: "المالية",
      time: "منذ ساعتين",
      icon: MessageSquare,
      iconColor: "text-purple-500",
    },
    {
      user: {
        name: "ليزا براون",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
      },
      action: "أنشأ مهمة",
      target: "تطوير نموذج ملاحظات العملاء",
      project: "استطلاع رضا العملاء",
      team: "دعم العملاء",
      time: "منذ 3 ساعات",
      icon: Plus,
      iconColor: "text-indigo-500",
    },
    {
      user: {
        name: "مايكل تشين",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
      },
      action: "حدث المعلم",
      target: "اكتمال مرحلة البحث",
      project: "بحث في تكامل الذكاء الاصطناعي",
      team: "البحث والابتكار",
      time: "منذ 5 ساعات",
      icon: BarChart,
      iconColor: "text-yellow-500",
    },
    {
      user: {
        name: "سارة جونسون",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
      },
      action: "أشار إلى مشكلة",
      target: "وثائق التأهيل قديمة",
      project: "تحسين تهيئة الموظفين الجدد",
      team: "الموارد البشرية والتوظيف",
      time: "أمس",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
];

// Localized activity data based on the current locale
export const mockData_activityData = {
    en: mockData_activityData_en ,
    fr: mockData_activityData_fr ,
    ar: mockData_activityData_ar,
}; 