import React from 'react';
import { Monitor, Users, Mail, Database, Palette, Code, Cloud, BarChart3 } from 'lucide-react';
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from "@/lib/i18n/use-i18n";
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";

interface AppToolsSoftwareProps extends AppComponentDictionaryProps {
    title: string;
    description: string;
}

const AppToolsSoftware: React.FC<AppToolsSoftwareProps> = ({ title, description, locale, dictionary }) => {
  const { t } = useI18n(dictionary);
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto p-6">
        <IntroductionSection t={t} />
        <ToolsOverviewSection t={t} />
        <SalesforceSection t={t} />
        <JiraSection t={t} />
        <MicrosoftOfficeSection t={t} />
        <CommunicationToolsSection t={t} />
        <DevelopmentToolsSection t={t} />
        <AnalyticsReportingSection t={t} />
      </main>
    </div>
  );
};

const IntroductionSection = () => (
  <section className="text-center py-12">
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16 px-6 rounded-lg shadow-xl mb-12">
      <h1 className="text-5xl font-bold mb-4">Tools & Software</h1>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        Master the tools that power our productivity and drive our success. From CRM to development environments.
      </p>
      <div className="flex justify-center items-center space-x-4 text-emerald-100">
        <Monitor className="w-6 h-6" />
        <span className="text-lg">Empowering efficiency through technology</span>
      </div>
    </div>

    <section className="bg-white p-8 rounded-lg shadow-md mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Digital Toolkit</h2>
      <p className="text-lg text-gray-700 mb-6">
        Learn to leverage our comprehensive suite of tools designed to streamline workflows, 
        enhance collaboration, and maximize productivity across all departments.
      </p>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="text-center p-4">
          <Database className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">CRM & Sales</h3>
          <p className="text-gray-600">Customer relationship management tools</p>
        </div>
        <div className="text-center p-4">
          <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
          <p className="text-gray-600">Team communication and project management</p>
        </div>
        <div className="text-center p-4">
          <Code className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Development</h3>
          <p className="text-gray-600">Code repositories and deployment tools</p>
        </div>
        <div className="text-center p-4">
          <BarChart3 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p className="text-gray-600">Data analysis and reporting platforms</p>
        </div>
      </div>
    </section>
  </section>
);

const ToolsOverviewSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Essential Tools Overview
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ToolCard 
        icon={<Database className="w-8 h-8 text-blue-600" />}
        title="Salesforce CRM"
        description="Customer relationship management and sales pipeline"
        usage="Sales, Marketing, Customer Success"
        access="Department-specific licenses"
      />
      <ToolCard 
        icon={<Monitor className="w-8 h-8 text-green-600" />}
        title="Jira"
        description="Project management and issue tracking"
        usage="Development, QA, Project Management"
        access="All technical teams"
      />
      <ToolCard 
        icon={<Mail className="w-8 h-8 text-purple-600" />}
        title="Microsoft 365"
        description="Email, documents, and collaboration suite"
        usage="All employees"
        access="Company-wide license"
      />
      <ToolCard 
        icon={<Users className="w-8 h-8 text-orange-600" />}
        title="Slack"
        description="Team communication and instant messaging"
        usage="All departments"
        access="Free and paid channels"
      />
      <ToolCard 
        icon={<Cloud className="w-8 h-8 text-indigo-600" />}
        title="Azure DevOps"
        description="CI/CD pipelines and cloud deployment"
        usage="Development, DevOps"
        access="Developer accounts"
      />
      <ToolCard 
        icon={<BarChart3 className="w-8 h-8 text-pink-600" />}
        title="Power BI"
        description="Business intelligence and data visualization"
        usage="Management, Analytics"
        access="Dashboard viewers and creators"
      />
    </div>
  </section>
);

const ToolCard = ({ icon, title, description, usage, access }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  usage: string;
  access: string;
}) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-inner hover:shadow-lg transition-shadow">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-bold ml-3">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <div className="text-xs space-y-1">
      <div className="flex">
        <span className="text-gray-500 w-16">Usage:</span>
        <span className="text-gray-700">{usage}</span>
      </div>
      <div className="flex">
        <span className="text-gray-500 w-16">Access:</span>
        <span className="text-gray-700">{access}</span>
      </div>
    </div>
  </div>
);

const SalesforceSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Salesforce CRM
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
          <Database className="w-6 h-6 mr-3" />
          Getting Started with Salesforce
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Initial Setup</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Access: https://datechnologies.salesforce.com</li>
              <li>• Use company email for login</li>
              <li>• Complete profile setup</li>
              <li>• Download Salesforce Mobile App</li>
              <li>• Set up two-factor authentication</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Navigation Basics</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• App Launcher: Access different modules</li>
              <li>• Home: Dashboard and recent items</li>
              <li>• Search: Global search functionality</li>
              <li>• Chatter: Social collaboration</li>
              <li>• Setup: Admin and customization</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Core Modules</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <ModuleCard 
            title="Leads"
            description="Manage potential customers and prospects"
            features={["Lead capture", "Qualification", "Conversion to opportunities"]}
          />
          <ModuleCard 
            title="Accounts"
            description="Customer and company information"
            features={["Account hierarchy", "Contact management", "Activity tracking"]}
          />
          <ModuleCard 
            title="Opportunities"
            description="Sales pipeline and deal management"
            features={["Sales stages", "Forecasting", "Quote generation"]}
          />
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Best Practices</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Data Management</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Keep all customer data up-to-date</li>
              <li>• Use standard naming conventions</li>
              <li>• Avoid duplicate records</li>
              <li>• Regular data cleanup activities</li>
              <li>• Consistent field population</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Activity Tracking</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Log all customer interactions</li>
              <li>• Schedule follow-up activities</li>
              <li>• Use email integration</li>
              <li>• Track meeting outcomes</li>
              <li>• Update opportunity stages regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ModuleCard = ({ title, description, features }: {
  title: string;
  description: string;
  features: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <ul className="text-gray-700 text-xs space-y-1">
      {features.map((feature, index) => (
        <li key={index}>• {feature}</li>
      ))}
    </ul>
  </div>
);

const JiraSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Jira Project Management
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
          <Monitor className="w-6 h-6 mr-3" />
          Jira Fundamentals
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Project Structure</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Projects:</strong> Container for issues and workflows</li>
              <li>• <strong>Issues:</strong> Work items (stories, bugs, tasks)</li>
              <li>• <strong>Components:</strong> Subsections of a project</li>
              <li>• <strong>Versions:</strong> Release tracking</li>
              <li>• <strong>Sprints:</strong> Time-boxed iterations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Issue Types</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Epic:</strong> Large work items</li>
              <li>• <strong>Story:</strong> User-focused features</li>
              <li>• <strong>Task:</strong> General work items</li>
              <li>• <strong>Bug:</strong> Defects and issues</li>
              <li>• <strong>Sub-task:</strong> Breakdown of larger items</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Agile Workflows</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <WorkflowCard 
            title="Scrum Board"
            description="Sprint-based development"
            steps={["Backlog", "Sprint Planning", "In Progress", "Review", "Done"]}
          />
          <WorkflowCard 
            title="Kanban Board"
            description="Continuous flow"
            steps={["To Do", "In Progress", "Review", "Done"]}
          />
          <WorkflowCard 
            title="Bug Tracking"
            description="Defect management"
            steps={["Open", "In Progress", "Testing", "Resolved", "Closed"]}
          />
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Advanced Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">JQL (Jira Query Language)</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <code>project = "PROJ" AND assignee = currentUser()</code></li>
              <li>• <code>status = "In Progress" AND priority = High</code></li>
              <li>• <code>created = -1w AND reporter = currentUser()</code></li>
              <li>• <code>labels = "frontend" AND sprint is not EMPTY</code></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Reporting & Analytics</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Burndown charts</li>
              <li>• Velocity tracking</li>
              <li>• Time tracking reports</li>
              <li>• Custom dashboards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WorkflowCard = ({ title, description, steps }: {
  title: string;
  description: string;
  steps: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="text-xs">
      <div className="text-gray-500 mb-1">Workflow:</div>
      <div className="text-gray-700 space-y-1">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {step}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MicrosoftOfficeSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Microsoft 365 Suite
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
          <Mail className="w-6 h-6 mr-3" />
          Core Applications
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Productivity Apps</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Outlook:</strong> Email, calendar, contacts</li>
              <li>• <strong>Word:</strong> Document creation and editing</li>
              <li>• <strong>Excel:</strong> Spreadsheets and data analysis</li>
              <li>• <strong>PowerPoint:</strong> Presentations</li>
              <li>• <strong>OneNote:</strong> Note-taking and organization</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Collaboration Tools</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Teams:</strong> Chat, video calls, file sharing</li>
              <li>• <strong>SharePoint:</strong> Document management</li>
              <li>• <strong>OneDrive:</strong> Cloud storage</li>
              <li>• <strong>Planner:</strong> Task management</li>
              <li>• <strong>Stream:</strong> Video content</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Email & Calendar Best Practices</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Email Management</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Use clear, descriptive subject lines</li>
              <li>• Set up rules for automated sorting</li>
              <li>• Use categories for organization</li>
              <li>• Enable out-of-office replies</li>
              <li>• Regular inbox cleanup</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Calendar Management</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Block time for focused work</li>
              <li>• Use room booking for meetings</li>
              <li>• Share calendars with team members</li>
              <li>• Set up recurring meetings</li>
              <li>• Include agenda in meeting invites</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">File Collaboration</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <CollaborationCard 
            title="OneDrive"
            description="Personal cloud storage"
            features={["1TB storage", "Sync across devices", "Version history"]}
          />
          <CollaborationCard 
            title="SharePoint"
            description="Team document libraries"
            features={["Team sites", "Document approval", "Co-authoring"]}
          />
          <CollaborationCard 
            title="Teams Integration"
            description="Chat and file sharing"
            features={["File tabs", "Real-time editing", "Screen sharing"]}
          />
        </div>
      </div>
    </div>
  </section>
);

const CollaborationCard = ({ title, description, features }: {
  title: string;
  description: string;
  features: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <ul className="text-gray-700 text-xs space-y-1">
      {features.map((feature, index) => (
        <li key={index}>• {feature}</li>
      ))}
    </ul>
  </div>
);

const CommunicationToolsSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Communication Tools
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-orange-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-3" />
          Slack Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Channel Structure</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>#general:</strong> Company-wide announcements</li>
              <li>• <strong>#dev-team:</strong> Development discussions</li>
              <li>• <strong>#sales-updates:</strong> Sales team coordination</li>
              <li>• <strong>#random:</strong> Casual conversations</li>
              <li>• <strong>#project-[name]:</strong> Project-specific channels</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Communication Etiquette</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Use threads for follow-up discussions</li>
              <li>• @mention for urgent attention</li>
              <li>• Use status messages for availability</li>
              <li>• Keep discussions in relevant channels</li>
              <li>• Use emoji reactions for quick responses</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Microsoft Teams</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Teams Structure</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Department-based teams</li>
              <li>• Project-specific teams</li>
              <li>• Cross-functional teams</li>
              <li>• Channel organization within teams</li>
              <li>• Private vs public channels</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Meeting Features</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Screen sharing and recording</li>
              <li>• Breakout rooms for sub-groups</li>
              <li>• Whiteboard collaboration</li>
              <li>• Live captions and transcription</li>
              <li>• Meeting notes and action items</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Video Conferencing Best Practices</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <BestPracticeCard 
            title="Before the Meeting"
            tips={[
              "Test audio/video setup",
              "Prepare agenda",
              "Join 2-3 minutes early",
              "Ensure good lighting"
            ]}
          />
          <BestPracticeCard 
            title="During the Meeting"
            tips={[
              "Mute when not speaking",
              "Use video when possible",
              "Stay engaged and focused",
              "Take notes on key points"
            ]}
          />
          <BestPracticeCard 
            title="After the Meeting"
            tips={[
              "Share meeting notes",
              "Follow up on action items",
              "Schedule follow-up meetings",
              "Update project status"
            ]}
          />
        </div>
      </div>
    </div>
  </section>
);

const BestPracticeCard = ({ title, tips }: {
  title: string;
  tips: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h4 className="font-semibold text-lg mb-3">{title}</h4>
    <ul className="text-gray-700 text-sm space-y-1">
      {tips.map((tip, index) => (
        <li key={index} className="flex items-start">
          <span className="text-blue-500 mr-2">•</span>
          {tip}
        </li>
      ))}
    </ul>
  </div>
);

const DevelopmentToolsSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Development Tools
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Code className="w-6 h-6 mr-3" />
          Development Environment
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Version Control</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>GitHub Enterprise:</strong> Code repositories</li>
              <li>• <strong>Git workflows:</strong> Feature branching</li>
              <li>• <strong>Pull requests:</strong> Code review process</li>
              <li>• <strong>Branch protection:</strong> Main branch rules</li>
              <li>• <strong>Actions:</strong> CI/CD automation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">IDE & Editors</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>VS Code:</strong> Primary editor</li>
              <li>• <strong>IntelliJ IDEA:</strong> Java development</li>
              <li>• <strong>PyCharm:</strong> Python development</li>
              <li>• <strong>Extensions:</strong> Approved plugin list</li>
              <li>• <strong>Settings sync:</strong> Consistent configurations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">CI/CD Pipeline</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <PipelineStage 
            title="Source"
            description="Code push triggers pipeline"
            tools={["GitHub", "Webhooks"]}
          />
          <PipelineStage 
            title="Build"
            description="Compile and package application"
            tools={["Azure DevOps", "Docker"]}
          />
          <PipelineStage 
            title="Test"
            description="Run automated tests"
            tools={["Jest", "Selenium", "SonarQube"]}
          />
          <PipelineStage 
            title="Deploy"
            description="Deploy to environments"
            tools={["Azure", "Kubernetes"]}
          />
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Database Tools</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <DatabaseCard 
            title="SQL Server"
            description="Primary database platform"
            tools={["SSMS", "Azure Data Studio", "SQL Server Profiler"]}
          />
          <DatabaseCard 
            title="PostgreSQL"
            description="Open-source database"
            tools={["pgAdmin", "DBeaver", "Postico"]}
          />
          <DatabaseCard 
            title="MongoDB"
            description="NoSQL document database"
            tools={["MongoDB Compass", "Studio 3T", "Robo 3T"]}
          />
        </div>
      </div>
    </div>
  </section>
);

const PipelineStage = ({ title, description, tools }: {
  title: string;
  description: string;
  tools: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm text-center">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="text-xs text-indigo-600">
      {tools.join(", ")}
    </div>
  </div>
);

const DatabaseCard = ({ title, description, tools }: {
  title: string;
  description: string;
  tools: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="text-xs text-green-600">
      {tools.join(", ")}
    </div>
  </div>
);

const AnalyticsReportingSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Analytics & Reporting
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-pink-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-pink-800 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3" />
          Power BI Dashboard
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Key Metrics</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Sales performance and pipeline</li>
              <li>• Customer acquisition and retention</li>
              <li>• Financial KPIs and budgets</li>
              <li>• Project progress and timelines</li>
              <li>• Team productivity metrics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Dashboard Access</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Executive dashboard (C-level)</li>
              <li>• Department dashboards</li>
              <li>• Project-specific reports</li>
              <li>• Individual performance metrics</li>
              <li>• Custom report creation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Google Analytics</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Website Analytics</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Traffic sources and user behavior</li>
              <li>• Conversion tracking and goals</li>
              <li>• A/B testing results</li>
              <li>• Mobile vs desktop usage</li>
              <li>• Geographic user distribution</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Marketing Attribution</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Campaign performance tracking</li>
              <li>• ROI measurement</li>
              <li>• Customer journey analysis</li>
              <li>• Lead source attribution</li>
              <li>• Content performance metrics</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Reporting Schedule</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <ReportCard 
            title="Daily Reports"
            description="Real-time operational metrics"
            reports={["Sales pipeline", "Support tickets", "System monitoring"]}
          />
          <ReportCard 
            title="Weekly Reports"
            description="Team performance and progress"
            reports={["Project status", "Team productivity", "Budget tracking"]}
          />
          <ReportCard 
            title="Monthly Reports"
            description="Strategic business insights"
            reports={["Financial summary", "Marketing ROI", "Customer satisfaction"]}
          />
        </div>
      </div>
    </div>
  </section>
);

const ReportCard = ({ title, description, reports }: {
  title: string;
  description: string;
  reports: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <ul className="text-gray-700 text-xs space-y-1">
      {reports.map((report, index) => (
        <li key={index}>• {report}</li>
      ))}
    </ul>
  </div>
);

export default AppToolsSoftware;
