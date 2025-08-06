import React from 'react';
import { Users, Code, TrendingUp, Palette, Calculator, Cog, Scale, Headphones } from 'lucide-react';
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from "@/lib/i18n/use-i18n";
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";

interface AppDepartmentsProps extends AppComponentDictionaryProps {
    title: string;
    description: string;
}

const AppDepartments: React.FC<AppDepartmentsProps> = ({ title, description, dictionary, locale }) => {
  const { t } = useI18n(dictionary);
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto p-6">
        <IntroductionSection t={t} />
        <DepartmentOverviewSection t={t} />
        <HumanResourcesSection t={t} />
        <DevelopmentSection t={t} />
        <SalesMarketingSection t={t} />
        <FinanceOperationsSection t={t} />
        <LegalCustomerSupportSection t={t} />
      </main>
    </div>
  );
};

const IntroductionSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="text-center py-12">
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16 px-6 rounded-lg shadow-xl mb-12">
      <h1 className="text-5xl font-bold mb-4">{t('departments.title')}</h1>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        {t('departments.description')}
      </p>
      <div className="flex justify-center items-center space-x-4 text-purple-100">
        <Users className="w-6 h-6" />
        <span className="text-lg">Empowering every team to excel</span>
      </div>
    </div>

    <section className="bg-white p-8 rounded-lg shadow-md mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">One Team, Many Specializations</h2>
      <p className="text-lg text-gray-700 mb-6">
        Each department has unique needs, processes, and challenges. Find the resources, 
        tools, and guidance specific to your team's success.
      </p>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="text-center p-4">
          <Code className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Technical</h3>
          <p className="text-gray-600">Development, IT, and engineering resources</p>
        </div>
        <div className="text-center p-4">
          <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Business</h3>
          <p className="text-gray-600">Sales, marketing, and growth strategies</p>
        </div>
        <div className="text-center p-4">
          <Calculator className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Operations</h3>
          <p className="text-gray-600">Finance, HR, and administrative support</p>
        </div>
        <div className="text-center p-4">
          <Scale className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Support</h3>
          <p className="text-gray-600">Legal, compliance, and customer service</p>
        </div>
      </div>
    </section>
  </section>
);

const DepartmentOverviewSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Department Overview
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DepartmentCard 
        icon={<Users className="w-8 h-8 text-blue-600" />}
        title="Human Resources"
        description="Employee relations, benefits, and organizational development"
        members="8 team members"
        contact="hr@da-tech.ma"
      />
      <DepartmentCard 
        icon={<Code className="w-8 h-8 text-green-600" />}
        title="Development"
        description="Software engineering, architecture, and technical innovation"
        members="25 developers"
        contact="dev@da-tech.ma"
      />
      <DepartmentCard 
        icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
        title="Sales"
        description="Client acquisition, relationship management, and revenue growth"
        members="15 sales professionals"
        contact="sales@da-tech.ma"
      />
      <DepartmentCard 
        icon={<Palette className="w-8 h-8 text-pink-600" />}
        title="Marketing"
        description="Brand management, digital marketing, and content creation"
        members="12 marketing specialists"
        contact="marketing@da-tech.ma"
      />
      <DepartmentCard 
        icon={<Calculator className="w-8 h-8 text-purple-600" />}
        title="Finance"
        description="Financial planning, analysis, and accounting operations"
        members="6 finance professionals"
        contact="finance@da-tech.ma"
      />
      <DepartmentCard 
        icon={<Cog className="w-8 h-8 text-gray-600" />}
        title="Operations"
        description="Process optimization, vendor management, and facilities"
        members="10 operations staff"
        contact="ops@da-tech.ma"
      />
      <DepartmentCard 
        icon={<Scale className="w-8 h-8 text-indigo-600" />}
        title="Legal"
        description="Contract management, compliance, and risk assessment"
        members="4 legal experts"
        contact="legal@da-tech.ma"
      />
      <DepartmentCard 
        icon={<Headphones className="w-8 h-8 text-teal-600" />}
        title="Customer Support"
        description="Client success, technical support, and service excellence"
        members="18 support agents"
        contact="support@da-tech.ma"
      />
    </div>
  </section>
);

const DepartmentCard = ({ icon, title, description, members, contact }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  members: string;
  contact: string;
}) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-inner hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-bold ml-3">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="text-xs text-gray-500">
      <p className="mb-1">{members}</p>
      <p>{contact}</p>
    </div>
  </div>
);

const HumanResourcesSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Human Resources
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-3" />
          Employee Services
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Benefits & Compensation</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Benefits enrollment and changes</li>
              <li>• 401(k) plan management</li>
              <li>• Salary review and adjustments</li>
              <li>• Performance bonus programs</li>
              <li>• Stock option plans</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Employee Relations</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Conflict resolution</li>
              <li>• Grievance procedures</li>
              <li>• Employee engagement surveys</li>
              <li>• Exit interviews</li>
              <li>• Workplace investigations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Key Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <ResourceCard 
            title="Employee Handbook"
            description="Complete guide to company policies and procedures"
            link="/handbook"
          />
          <ResourceCard 
            title="Benefits Portal"
            description="Manage your health, dental, and retirement benefits"
            link="/benefits"
          />
          <ResourceCard 
            title="Time Off System"
            description="Request vacation, sick leave, and personal days"
            link="/timeoff"
          />
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Common Forms</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Employee Forms</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Emergency contact updates</li>
              <li>• Direct deposit changes</li>
              <li>• Tax withholding adjustments</li>
              <li>• Name/address changes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Leave Forms</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Family Medical Leave Act (FMLA)</li>
              <li>• Short-term disability</li>
              <li>• Bereavement leave</li>
              <li>• Jury duty notification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ResourceCard = ({ title, description, link }: {
  title: string;
  description: string;
  link: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <a href={link} className="text-green-600 hover:text-green-800 text-sm font-medium">
      Access Resource →
    </a>
  </div>
);

const DevelopmentSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Development Team
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
          <Code className="w-6 h-6 mr-3" />
          Development Standards
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Coding Standards</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• TypeScript/JavaScript ESLint rules</li>
              <li>• Python PEP 8 compliance</li>
              <li>• Code review requirements</li>
              <li>• Documentation standards</li>
              <li>• Testing coverage requirements (80%+)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Development Process</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Agile/Scrum methodology</li>
              <li>• Sprint planning and retrospectives</li>
              <li>• Git workflow and branching strategy</li>
              <li>• CI/CD pipeline requirements</li>
              <li>• Production deployment procedures</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Development Tools</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <ToolCard 
            title="GitHub Enterprise"
            description="Code repositories and collaboration"
            category="Version Control"
          />
          <ToolCard 
            title="Jira"
            description="Project management and issue tracking"
            category="Project Management"
          />
          <ToolCard 
            title="Azure DevOps"
            description="CI/CD pipelines and deployments"
            category="DevOps"
          />
          <ToolCard 
            title="Docker"
            description="Containerization and orchestration"
            category="Infrastructure"
          />
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Environment Setup</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Development Environment</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Local development setup guide</li>
              <li>• Docker development containers</li>
              <li>• Database connection strings</li>
              <li>• API keys and environment variables</li>
              <li>• IDE configuration and extensions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Deployment Environments</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Development: dev.da-tech.ma</li>
              <li>• Staging: staging.da-tech.ma</li>
              <li>• Production: www.da-tech.ma</li>
              <li>• Emergency rollback procedures</li>
              <li>• Monitoring and alerting setup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ToolCard = ({ title, description, category }: {
  title: string;
  description: string;
  category: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="text-xs text-blue-600 font-medium mb-2">{category}</div>
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const SalesMarketingSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Sales & Marketing
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-orange-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3" />
          Sales Resources
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">CRM & Lead Management</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Salesforce CRM best practices</li>
              <li>• Lead qualification process</li>
              <li>• Pipeline management</li>
              <li>• Customer data management</li>
              <li>• Sales reporting and analytics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Sales Process</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Sales methodology and stages</li>
              <li>• Proposal and contract templates</li>
              <li>• Pricing guidelines and approvals</li>
              <li>• Client onboarding procedures</li>
              <li>• Account management strategies</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-pink-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-pink-800 mb-4 flex items-center">
          <Palette className="w-6 h-6 mr-3" />
          Marketing Resources
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Brand Guidelines</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Logo usage and brand colors</li>
              <li>• Typography and design standards</li>
              <li>• Marketing material templates</li>
              <li>• Photography and image guidelines</li>
              <li>• Voice and tone guidelines</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Digital Marketing</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Website content management</li>
              <li>• Social media strategies</li>
              <li>• Email marketing campaigns</li>
              <li>• SEO and content optimization</li>
              <li>• Analytics and performance tracking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">Campaign Management</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <CampaignCard 
            title="Lead Generation"
            description="Inbound and outbound strategies"
            metrics="Track: CTR, conversion rate, cost per lead"
          />
          <CampaignCard 
            title="Content Marketing"
            description="Blog posts, whitepapers, case studies"
            metrics="Track: engagement, downloads, shares"
          />
          <CampaignCard 
            title="Event Marketing"
            description="Trade shows, webinars, conferences"
            metrics="Track: attendance, leads generated, ROI"
          />
        </div>
      </div>
    </div>
  </section>
);

const CampaignCard = ({ title, description, metrics }: {
  title: string;
  description: string;
  metrics: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <p className="text-indigo-600 text-xs font-medium">{metrics}</p>
  </div>
);

const FinanceOperationsSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Finance & Operations
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
          <Calculator className="w-6 h-6 mr-3" />
          Financial Management
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Budgeting & Planning</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Annual budget planning process</li>
              <li>• Quarterly financial reviews</li>
              <li>• Department budget allocations</li>
              <li>• Capital expenditure approvals</li>
              <li>• Financial forecasting models</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Accounting & Reporting</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Monthly financial statements</li>
              <li>• Expense report procedures</li>
              <li>• Invoice processing and payments</li>
              <li>• Tax preparation and filing</li>
              <li>• Audit support and compliance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Cog className="w-6 h-6 mr-3" />
          Operations Management
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Process Optimization</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Workflow analysis and improvement</li>
              <li>• Standard operating procedures</li>
              <li>• Quality management systems</li>
              <li>• Performance metrics and KPIs</li>
              <li>• Continuous improvement initiatives</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Vendor Management</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Vendor selection and evaluation</li>
              <li>• Contract negotiation and management</li>
              <li>• Purchase order processing</li>
              <li>• Vendor performance monitoring</li>
              <li>• Risk assessment and mitigation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-yellow-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-yellow-800 mb-4">Key Processes</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <ProcessCard 
            title="Purchase Requests"
            description="Approval workflow for purchases over $500"
            steps="3 approval levels"
          />
          <ProcessCard 
            title="Invoice Processing"
            description="Automated invoice processing and payment"
            steps="5-7 business days"
          />
          <ProcessCard 
            title="Budget Variance"
            description="Monthly budget vs actual reporting"
            steps="Monthly review"
          />
          <ProcessCard 
            title="Expense Reimbursement"
            description="Employee expense processing"
            steps="2-3 business days"
          />
        </div>
      </div>
    </div>
  </section>
);

const ProcessCard = ({ title, description, steps }: {
  title: string;
  description: string;
  steps: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="text-yellow-600 text-xs font-medium">{steps}</div>
  </div>
);

const LegalCustomerSupportSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Legal & Customer Support
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
          <Scale className="w-6 h-6 mr-3" />
          Legal Department
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Contract Management</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Contract templates and standards</li>
              <li>• Legal review and approval process</li>
              <li>• Contract negotiation guidelines</li>
              <li>• Digital signature procedures</li>
              <li>• Contract renewal tracking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Compliance & Risk</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Regulatory compliance monitoring</li>
              <li>• Risk assessment procedures</li>
              <li>• Legal incident reporting</li>
              <li>• Intellectual property protection</li>
              <li>• Data privacy compliance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-teal-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-teal-800 mb-4 flex items-center">
          <Headphones className="w-6 h-6 mr-3" />
          Customer Support
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Support Procedures</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Ticket management system</li>
              <li>• Escalation procedures</li>
              <li>• Response time standards</li>
              <li>• Customer satisfaction metrics</li>
              <li>• Knowledge base management</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Client Success</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Onboarding new clients</li>
              <li>• Account health monitoring</li>
              <li>• Renewal and expansion strategies</li>
              <li>• Client feedback collection</li>
              <li>• Success story documentation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Support Resources</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <SupportResource 
            title="Legal Templates"
            description="Standard contracts and agreements"
            access="Legal team only"
          />
          <SupportResource 
            title="Support Portal"
            description="Customer support ticket system"
            access="Support team access"
          />
          <SupportResource 
            title="Knowledge Base"
            description="Internal and customer documentation"
            access="All employees"
          />
        </div>
      </div>
    </div>
  </section>
);

const SupportResource = ({ title, description, access }: {
  title: string;
  description: string;
  access: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="text-green-600 text-xs font-medium">{access}</div>
  </div>
);

export default AppDepartments;
