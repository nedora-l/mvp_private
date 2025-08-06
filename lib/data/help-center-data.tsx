import AppCyberConcerns from '@/components/help/components/CyberConcerns';
import AppGettingStarted from '@/components/help/components/GettingStarted';
import AppCompanyPolicies from '@/components/help/components/CompanyPolicies';
import AppDepartments from '@/components/help/components/Departments';
import AppToolsSoftware from '@/components/help/components/ToolsSoftware';
import AppProfessionalDevelopment from '@/components/help/components/ProfessionalDevelopment';
import { Smile, Building, Shield, Users2, Wrench, GraduationCap } from 'lucide-react';
import { Dictionary } from '@/locales/dictionary';

export const helpCenterTopics = [
  {
    key: 'gettingStarted.title',
    keyDesc: 'gettingStarted.description',
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Onboarding, accounts, and first steps.',
    icon: Smile,
    component: (title:string ,description:string , dict: Dictionary, locale: string) => <AppGettingStarted dictionary={dict}  title={title} description={description} locale={locale} />,
  },
  {
    key: 'companyPolicies.title',
    keyDesc: 'companyPolicies.description',
    slug: 'company-policies',
    title: 'Company Policies',
    description: 'HR, legal, and company guidelines.',
    icon: Building,
    component: (title:string ,description:string , dict: Dictionary, locale: string) => <AppCompanyPolicies dictionary={dict} title={title} description={description} locale={locale} />,
  },
  {
    key: 'cyberConcerns.title',
    keyDesc: 'cyberConcerns.description',
    slug: 'it-and-security',
    title: 'IT & Security',
    description: 'Support, best practices, and security awareness.',
    icon: Shield,
    component: (title:string ,description:string , dict: Dictionary, locale: string) => <AppCyberConcerns title={title} description={description} dictionary={dict} locale={locale} />,
  },
  {
    key: 'departments.title',
    keyDesc: 'departments.description',
    slug: 'departments',
    title: 'Departments',
    description: 'Resources for HR, Dev, Sales, and more.',
    icon: Users2,
    component: (title:string ,description:string , dict: Dictionary, locale: string) => <AppDepartments title={title} description={description} dictionary={dict} locale={locale} />,
  },
  {
    key: 'toolsSoftware.title',
    keyDesc: 'toolsSoftware.description',
    slug: 'tools-and-software',
    title: 'Tools & Software',
    description: 'Guides for Salesforce, Jira, and other tools.',
    icon: Wrench,
    component: (title:string ,description:string , dict: Dictionary, locale: string) => <AppToolsSoftware dictionary={dict} title={title} description={description} locale={locale} />,
  },
  {
    key: 'professionalDevelopment.title',
    keyDesc: 'professionalDevelopment.description',
    slug: 'professional-development',
    title: 'Professional Development',
    description: 'Training, certifications, and career growth.',
    icon: GraduationCap,
    component: (title:string ,description:string , dict: Dictionary, locale: string) => <AppProfessionalDevelopment dictionary={dict} title={title} description={description} locale={locale} />,
  },
];

export const featuredArticles = [
  {
    topicSlug: 'getting-started',
    articleSlug: 'onboarding-guide',
    title: 'Your First Week at D&A Technologies',
    category: 'Getting Started',
  },
  {
    topicSlug: 'company-policies',
    articleSlug: 'expense-report',
    title: 'How to Submit an Expense Report',
    category: 'Company Policies',
  },
  {
    topicSlug: 'tools-and-software',
    articleSlug: 'salesforce-integration',
    title: 'Salesforce Integration Best Practices',
    category: 'Tools & Software',
  },
  {
    topicSlug: 'it-and-security',
    articleSlug: 'cybersecurity-awareness',
    title: 'Cybersécurité, tous concernés !',
    category: 'IT & Security',
  },
  {
    topicSlug: 'it-and-security',
    articleSlug: 'password-security',
    title: 'Mots de passe - Votre première ligne de défense',
    category: 'IT & Security',
  },
  {
    topicSlug: 'departments',
    articleSlug: 'developer-onboarding',
    title: 'Developer Onboarding: Setting up your Environment',
    category: 'Departments',
  },
  {
    topicSlug: 'professional-development',
    articleSlug: 'ai-certification',
    title: 'Enroll in our AI Certification Program',
    category: 'Professional Development',
  },
];
