import React from 'react';
import { FileText, Users, DollarSign, Scale, Home, TrendingUp, Clock, Shield } from 'lucide-react';
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from "@/lib/i18n/use-i18n";
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";

interface AppCompanyPoliciesProps extends AppComponentDictionaryProps {
    locale: string;
    title: string;
    description: string;
    dictionary: Dictionary;
}

const AppCompanyPolicies: React.FC<AppCompanyPoliciesProps> = ({ title, description, dictionary, locale }) => {
  const { t } = useI18n(dictionary);
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto p-6">
        <IntroductionSection t={t} />
        <EmployeeHandbookSection t={t} />
        <LeaveVacationSection t={t} />
        <ExpenseReportingSection t={t} />
        <CodeOfConductSection t={t} />
        <RemoteWorkSection t={t} />
        <PerformanceReviewSection t={t} />
        <ComplianceSection t={t} />
      </main>
    </div>
  );
};

const IntroductionSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="text-center py-12">
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6 rounded-lg shadow-xl mb-12">
      <h1 className="text-5xl font-bold mb-4">{t('companyPolicies.title')}</h1>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        {t('companyPolicies.description')}
      </p>
      <div className="flex justify-center items-center space-x-4 text-blue-100">
        <Scale className="w-6 h-6" />
        <span className="text-lg">Building a foundation of trust and transparency</span>
      </div>
    </div>

    <section className="bg-white p-8 rounded-lg shadow-md mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment to You</h2>
      <p className="text-lg text-gray-700 mb-6">
        These policies are designed to protect both employees and the company, ensuring everyone understands 
        their rights, responsibilities, and the standards we uphold together.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-4">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Protection</h3>
          <p className="text-gray-600">Policies that safeguard your rights and well-being</p>
        </div>
        <div className="text-center p-4">
          <Scale className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fairness</h3>
          <p className="text-gray-600">Equal treatment and opportunities for all</p>
        </div>
        <div className="text-center p-4">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Clarity</h3>
          <p className="text-gray-600">Clear expectations and guidelines</p>
        </div>
      </div>
    </section>
  </section>
);

const EmployeeHandbookSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Employee Handbook Highlights
    </h2>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-3" />
            Employment Basics
          </h3>
          <ul className="text-gray-700 space-y-3">
            <li>• <strong>Equal Opportunity:</strong> We're committed to fair employment practices</li>
            <li>• <strong>Employment At-Will:</strong> Understanding your employment status</li>
            <li>• <strong>Background Checks:</strong> Required for all positions</li>
            <li>• <strong>Confidentiality:</strong> Protecting company and client information</li>
            <li>• <strong>Conflict of Interest:</strong> Avoiding situations that compromise judgment</li>
          </ul>
        </div>

        <div className="p-6 bg-green-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
            <DollarSign className="w-6 h-6 mr-3" />
            Compensation & Benefits
          </h3>
          <ul className="text-gray-700 space-y-3">
            <li>• <strong>Pay Schedule:</strong> Bi-weekly payroll every other Friday</li>
            <li>• <strong>Overtime Policy:</strong> Time-and-a-half for hours over 40/week</li>
            <li>• <strong>Benefits Enrollment:</strong> Health, dental, vision, 401(k)</li>
            <li>• <strong>Paid Time Off:</strong> Vacation, sick leave, and personal days</li>
            <li>• <strong>Holidays:</strong> 10 company holidays plus floating holidays</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
            <Clock className="w-6 h-6 mr-3" />
            Work Environment
          </h3>
          <ul className="text-gray-700 space-y-3">
            <li>• <strong>Dress Code:</strong> Business casual, casual Fridays</li>
            <li>• <strong>Workplace Safety:</strong> Reporting hazards and incidents</li>
            <li>• <strong>Technology Use:</strong> Acceptable use of company resources</li>
            <li>• <strong>Social Media:</strong> Guidelines for personal and professional use</li>
            <li>• <strong>Parking:</strong> Assigned spaces and visitor parking</li>
          </ul>
        </div>

        <div className="p-6 bg-orange-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3" />
            Growth & Development
          </h3>
          <ul className="text-gray-700 space-y-3">
            <li>• <strong>Performance Reviews:</strong> Annual formal evaluations</li>
            <li>• <strong>Training Opportunities:</strong> Professional development programs</li>
            <li>• <strong>Career Advancement:</strong> Internal promotion preferences</li>
            <li>• <strong>Mentorship:</strong> Pairing junior and senior employees</li>
            <li>• <strong>Continuing Education:</strong> Tuition reimbursement program</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const LeaveVacationSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Leave & Vacation Policies
    </h2>

    <div className="space-y-8">
      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Paid Time Off (PTO)</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Accrual Schedule</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>0-2 years:</strong> 15 days annually (1.25 days/month)</li>
              <li>• <strong>3-5 years:</strong> 20 days annually (1.67 days/month)</li>
              <li>• <strong>6+ years:</strong> 25 days annually (2.08 days/month)</li>
              <li>• <strong>Maximum carryover:</strong> 40 hours to next year</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Request Process</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Submit requests at least 2 weeks in advance</li>
              <li>• Use company portal for all requests</li>
              <li>• Manager approval required</li>
              <li>• Holiday periods may require earlier notice</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Sick Leave</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Entitlement</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• 10 days annually for full-time employees</li>
              <li>• Prorated for part-time employees</li>
              <li>• Can be used for family members</li>
              <li>• Medical appointments included</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Usage Guidelines</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Notify supervisor as soon as possible</li>
              <li>• Medical documentation may be required</li>
              <li>• Cannot be cashed out at termination</li>
              <li>• FMLA may apply for extended illness</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Special Leave Types</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <LeaveTypeCard 
            title="Bereavement"
            duration="3-5 days"
            description="Immediate family members"
          />
          <LeaveTypeCard 
            title="Jury Duty"
            duration="As needed"
            description="Paid leave for civic duty"
          />
          <LeaveTypeCard 
            title="Military Leave"
            duration="Per regulations"
            description="Active duty requirements"
          />
        </div>
      </div>
    </div>
  </section>
);

const LeaveTypeCard = ({ title, duration, description }: {
  title: string;
  duration: string;
  description: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-purple-600 font-medium mb-2">{duration}</p>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const ExpenseReportingSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Expense Reporting & Reimbursement
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Reimbursable Expenses</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Travel & Transportation</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Airfare (economy class)</li>
              <li>• Hotel accommodations</li>
              <li>• Rental cars and gas</li>
              <li>• Taxi, rideshare, public transit</li>
              <li>• Mileage: $0.65 per mile</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Meals & Entertainment</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Business meals with clients</li>
              <li>• Conference and training meals</li>
              <li>• Team building activities</li>
              <li>• Daily limits: $75 (domestic)</li>
              <li>• Alcohol with manager approval</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Submission Process</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <ProcessStep 
            number="1"
            title="Collect Receipts"
            description="Keep all receipts and documentation"
          />
          <ProcessStep 
            number="2"
            title="Use Expense App"
            description="Submit through company portal"
          />
          <ProcessStep 
            number="3"
            title="Manager Review"
            description="Supervisor approval required"
          />
          <ProcessStep 
            number="4"
            title="Reimbursement"
            description="Payment in next payroll cycle"
          />
        </div>
      </div>

      <div className="p-6 bg-yellow-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-yellow-800 mb-4">Important Guidelines</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• Submit expenses within 30 days</li>
          <li>• Receipts required for amounts over $25</li>
          <li>• Personal expenses are not reimbursable</li>
          <li>• Pre-approval required for expenses over $500</li>
          <li>• Credit card statements alone are not sufficient</li>
        </ul>
      </div>
    </div>
  </section>
);

const ProcessStep = ({ number, title, description }: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
      {number}
    </div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const CodeOfConductSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Code of Conduct & Ethics
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-red-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-red-800 mb-4">Core Values</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Respect & Dignity</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Treat all colleagues with respect</li>
              <li>• Value diverse perspectives and backgrounds</li>
              <li>• Maintain professional behavior</li>
              <li>• Foster an inclusive work environment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Integrity & Honesty</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Be truthful in all communications</li>
              <li>• Report unethical behavior</li>
              <li>• Avoid conflicts of interest</li>
              <li>• Maintain confidentiality</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Prohibited Conduct</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <ProhibitedItem 
            title="Harassment"
            description="Any form of harassment based on protected characteristics"
          />
          <ProhibitedItem 
            title="Discrimination"
            description="Unfair treatment based on race, gender, age, religion, etc."
          />
          <ProhibitedItem 
            title="Retaliation"
            description="Negative action against those who report violations"
          />
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Reporting Mechanisms</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Internal Channels</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Direct supervisor</li>
              <li>• HR Department</li>
              <li>• Employee Relations</li>
              <li>• Ethics hotline: 1-800-ETHICS</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Anonymous Reporting</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Online portal available 24/7</li>
              <li>• Third-party ethics hotline</li>
              <li>• Suggestion boxes in common areas</li>
              <li>• No retaliation policy enforced</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProhibitedItem = ({ title, description }: {
  title: string;
  description: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
    <h4 className="font-semibold text-lg mb-2 text-red-800">{title}</h4>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const RemoteWorkSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Remote Work Guidelines
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
          <Home className="w-6 h-6 mr-3" />
          Eligibility & Requirements
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Who Can Work Remotely</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Employees with 6+ months tenure</li>
              <li>• Roles that don't require physical presence</li>
              <li>• Satisfactory performance reviews</li>
              <li>• Manager approval required</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Home Office Requirements</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Dedicated workspace</li>
              <li>• Reliable internet connection</li>
              <li>• Quiet environment for calls</li>
              <li>• Ergonomic setup recommended</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Work Schedule & Availability</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Core Hours</h4>
            <p className="text-gray-700 text-sm">Available 10 AM - 3 PM local time for meetings and collaboration</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Communication</h4>
            <p className="text-gray-700 text-sm">Respond to messages within 4 hours during business hours</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Meetings</h4>
            <p className="text-gray-700 text-sm">Video on for team meetings and client calls</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PerformanceReviewSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Performance Review Process
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Review Cycle</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <ReviewStep 
            title="Goal Setting"
            period="January"
            description="Set objectives and key results for the year"
          />
          <ReviewStep 
            title="Mid-Year Check"
            period="June"
            description="Progress review and goal adjustment"
          />
          <ReviewStep 
            title="Self-Assessment"
            period="November"
            description="Employee completes self-evaluation"
          />
          <ReviewStep 
            title="Final Review"
            period="December"
            description="Manager review and rating discussion"
          />
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Evaluation Criteria</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Performance Areas</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Job-specific technical skills</li>
              <li>• Quality of work delivered</li>
              <li>• Meeting deadlines and goals</li>
              <li>• Innovation and problem-solving</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Behavioral Competencies</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Communication and collaboration</li>
              <li>• Leadership and initiative</li>
              <li>• Adaptability and learning</li>
              <li>• Customer focus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ReviewStep = ({ title, period, description }: {
  title: string;
  period: string;
  description: string;
}) => (
  <div className="text-center">
    <div className="bg-purple-600 text-white rounded-lg p-3 mb-3">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-purple-100 text-sm">{period}</p>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const ComplianceSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Compliance & Legal Requirements
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Regulatory Compliance</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Data Protection</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• GDPR compliance for EU data</li>
              <li>• CCPA compliance for California residents</li>
              <li>• SOX compliance for financial reporting</li>
              <li>• HIPAA compliance for health information</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Employment Law</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Equal Employment Opportunity</li>
              <li>• Americans with Disabilities Act</li>
              <li>• Family and Medical Leave Act</li>
              <li>• Fair Labor Standards Act</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-yellow-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-yellow-800 mb-4">Training Requirements</h3>
        <p className="text-gray-700 mb-4">All employees must complete the following training annually:</p>
        <ul className="text-gray-700 space-y-2">
          <li>• Information Security Awareness</li>
          <li>• Anti-Harassment and Discrimination</li>
          <li>• Code of Conduct and Ethics</li>
          <li>• Data Privacy and Protection</li>
          <li>• Emergency Response Procedures</li>
        </ul>
      </div>
    </div>
  </section>
);

export default AppCompanyPolicies;
