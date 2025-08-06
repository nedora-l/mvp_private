import React from 'react';
import { GraduationCap, TrendingUp, Users, Award, BookOpen, Target, Lightbulb, Star } from 'lucide-react';
import { Dictionary } from '@/locales/dictionary';

interface AppProfessionalDevelopmentProps {
    locale: string;
    title: string;
    description: string;
    dictionary: Dictionary;
}

const AppProfessionalDevelopment: React.FC<AppProfessionalDevelopmentProps> = ({ title, description, locale, dictionary }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto p-6">
        <IntroductionSection />
        <DevelopmentPathwaysSection />
        <TrainingProgramsSection />
        <CertificationSection />
        <MentorshipSection />
        <PerformanceGrowthSection />
        <ExternalEducationSection />
        <LeadershipDevelopmentSection />
      </main>
    </div>
  );
};

const IntroductionSection = () => (
  <section className="text-center py-12">
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16 px-6 rounded-lg shadow-xl mb-12">
      <h1 className="text-5xl font-bold mb-4">Professional Development</h1>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        Invest in your future. Grow your skills, advance your career, and achieve your professional goals.
      </p>
      <div className="flex justify-center items-center space-x-4 text-indigo-100">
        <GraduationCap className="w-6 h-6" />
        <span className="text-lg">Your growth is our priority</span>
      </div>
    </div>

    <section className="bg-white p-8 rounded-lg shadow-md mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Continuous Learning Culture</h2>
      <p className="text-lg text-gray-700 mb-6">
        At D&A Technologies, we believe that continuous learning is key to both personal fulfillment and business success. 
        We're committed to providing you with the resources, opportunities, and support you need to thrive.
      </p>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="text-center p-4">
          <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Learn</h3>
          <p className="text-gray-600">Access to courses, workshops, and training programs</p>
        </div>
        <div className="text-center p-4">
          <Target className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Grow</h3>
          <p className="text-gray-600">Structured career development pathways</p>
        </div>
        <div className="text-center p-4">
          <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connect</h3>
          <p className="text-gray-600">Mentorship and networking opportunities</p>
        </div>
        <div className="text-center p-4">
          <Award className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Achieve</h3>
          <p className="text-gray-600">Recognition and career advancement</p>
        </div>
      </div>
    </section>
  </section>
);

const DevelopmentPathwaysSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Career Development Pathways
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3" />
          Technical Career Track
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <PathwayCard 
            title="Software Engineer"
            levels={["Junior Developer", "Senior Developer", "Staff Engineer", "Principal Engineer"]}
            skills={["Programming", "System Design", "Architecture", "Technical Leadership"]}
            bgColor="bg-blue-50"
          />
          <PathwayCard 
            title="Data Scientist"
            levels={["Data Analyst", "Data Scientist", "Senior Data Scientist", "Principal Data Scientist"]}
            skills={["Statistics", "Machine Learning", "Data Engineering", "AI/ML Strategy"]}
            bgColor="bg-green-50"
          />
          <PathwayCard 
            title="DevOps Engineer"
            levels={["DevOps Engineer", "Senior DevOps", "DevOps Architect", "Platform Engineer"]}
            skills={["CI/CD", "Cloud Platforms", "Infrastructure", "Security"]}
            bgColor="bg-purple-50"
          />
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Management Career Track</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <PathwayCard 
            title="People Management"
            levels={["Team Lead", "Manager", "Senior Manager", "Director"]}
            skills={["Team Building", "Performance Management", "Strategic Planning", "Executive Leadership"]}
            bgColor="bg-orange-50"
          />
          <PathwayCard 
            title="Product Management"
            levels={["Product Owner", "Product Manager", "Senior PM", "VP Product"]}
            skills={["Product Strategy", "Market Research", "Roadmap Planning", "Cross-functional Leadership"]}
            bgColor="bg-pink-50"
          />
          <PathwayCard 
            title="Project Management"
            levels={["Project Coordinator", "PM", "Senior PM", "PMO Director"]}
            skills={["Agile/Scrum", "Risk Management", "Stakeholder Management", "Portfolio Management"]}
            bgColor="bg-teal-50"
          />
        </div>
      </div>
    </div>
  </section>
);

const PathwayCard = ({ title, levels, skills, bgColor }: {
  title: string;
  levels: string[];
  skills: string[];
  bgColor: string;
}) => (
  <div className={`${bgColor} p-6 rounded-lg shadow-inner`}>
    <h4 className="font-semibold text-lg mb-4">{title}</h4>
    <div className="mb-4">
      <h5 className="font-medium text-sm mb-2">Career Levels:</h5>
      <ul className="text-sm text-gray-700 space-y-1">
        {levels.map((level, index) => (
          <li key={index} className="flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            {level}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h5 className="font-medium text-sm mb-2">Key Skills:</h5>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill, index) => (
          <span key={index} className="text-xs bg-white px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const TrainingProgramsSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Training Programs
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
          <BookOpen className="w-6 h-6 mr-3" />
          Internal Training Programs
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Technical Skills</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Programming languages (Python, JavaScript, Java)</li>
              <li>• Cloud platforms (AWS, Azure, Google Cloud)</li>
              <li>• Database management and optimization</li>
              <li>• Software architecture and design patterns</li>
              <li>• DevOps and CI/CD practices</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Soft Skills</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Communication and presentation skills</li>
              <li>• Leadership and team management</li>
              <li>• Time management and productivity</li>
              <li>• Problem-solving and critical thinking</li>
              <li>• Emotional intelligence and empathy</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Learning Formats</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <LearningFormatCard 
            title="Workshops"
            description="Hands-on interactive sessions"
            duration="Half-day to full-day"
            frequency="Monthly"
          />
          <LearningFormatCard 
            title="Online Courses"
            description="Self-paced learning modules"
            duration="1-4 hours per module"
            frequency="On-demand"
          />
          <LearningFormatCard 
            title="Lunch & Learn"
            description="Informal learning sessions"
            duration="45 minutes"
            frequency="Bi-weekly"
          />
          <LearningFormatCard 
            title="Webinars"
            description="Expert-led presentations"
            duration="1 hour"
            frequency="Weekly"
          />
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Upcoming Training Calendar</h3>
        <div className="space-y-4">
          <TrainingEvent 
            title="Advanced JavaScript Frameworks"
            date="Next Monday, 10:00 AM"
            instructor="Sarah Johnson, Senior Developer"
            description="Deep dive into React, Vue, and Angular best practices"
          />
          <TrainingEvent 
            title="Leadership Fundamentals"
            date="Wednesday, 2:00 PM"
            instructor="Mike Chen, Director of Engineering"
            description="Essential skills for technical team leads"
          />
          <TrainingEvent 
            title="Cloud Architecture on AWS"
            date="Friday, 9:00 AM"
            instructor="Alex Rodriguez, Cloud Architect"
            description="Designing scalable cloud solutions"
          />
        </div>
      </div>
    </div>
  </section>
);

const LearningFormatCard = ({ title, description, duration, frequency }: {
  title: string;
  description: string;
  duration: string;
  frequency: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="text-xs text-gray-500 space-y-1">
      <div><strong>Duration:</strong> {duration}</div>
      <div><strong>Frequency:</strong> {frequency}</div>
    </div>
  </div>
);

const TrainingEvent = ({ title, date, instructor, description }: {
  title: string;
  date: string;
  instructor: string;
  description: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-lg">{title}</h4>
      <span className="text-sm text-gray-500">{date}</span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{instructor}</p>
    <p className="text-sm text-gray-700">{description}</p>
  </div>
);

const CertificationSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Certification Programs
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-yellow-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
          <Award className="w-6 h-6 mr-3" />
          AI Certification Program
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Program Overview</h4>
            <p className="text-gray-700 mb-4">
              Our comprehensive AI certification program is designed to prepare you for the future of technology. 
              Learn machine learning, deep learning, and AI applications in business contexts.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• 12-week intensive program</li>
              <li>• Hands-on projects with real data</li>
              <li>• Industry-recognized certification</li>
              <li>• Mentorship from AI experts</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Learning Modules</h4>
            <div className="space-y-2">
              <CertificationModule 
                title="Machine Learning Fundamentals"
                weeks="Weeks 1-3"
                status="Available"
              />
              <CertificationModule 
                title="Deep Learning & Neural Networks"
                weeks="Weeks 4-6"
                status="Available"
              />
              <CertificationModule 
                title="Natural Language Processing"
                weeks="Weeks 7-9"
                status="Available"
              />
              <CertificationModule 
                title="AI Ethics & Business Applications"
                weeks="Weeks 10-12"
                status="Available"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Industry Certifications</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <CertificationCard 
            title="AWS Certified Solutions Architect"
            provider="Amazon Web Services"
            level="Associate/Professional"
            reimbursement="100% coverage"
            prep="Internal prep course available"
          />
          <CertificationCard 
            title="Microsoft Azure Developer"
            provider="Microsoft"
            level="Associate"
            reimbursement="100% coverage"
            prep="Study group meets weekly"
          />
          <CertificationCard 
            title="Google Cloud Professional"
            provider="Google Cloud"
            level="Professional"
            reimbursement="100% coverage"
            prep="Training materials provided"
          />
        </div>
      </div>

      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">Certification Benefits</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Financial Support</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• 100% exam fee reimbursement</li>
              <li>• Study materials and courses covered</li>
              <li>• Paid study time allocation</li>
              <li>• Certification bonus upon completion</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Career Benefits</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Salary increase consideration</li>
              <li>• Internal promotion opportunities</li>
              <li>• Recognition in company directory</li>
              <li>• Enhanced project assignments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CertificationModule = ({ title, weeks, status }: {
  title: string;
  weeks: string;
  status: string;
}) => (
  <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
    <div className="flex justify-between items-center">
      <h5 className="font-semibold text-sm">{title}</h5>
      <span className="text-xs text-gray-500">{weeks}</span>
    </div>
    <span className="text-xs text-green-600 font-medium">{status}</span>
  </div>
);

const CertificationCard = ({ title, provider, level, reimbursement, prep }: {
  title: string;
  provider: string;
  level: string;
  reimbursement: string;
  prep: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <div className="text-sm text-gray-600 space-y-1">
      <div><strong>Provider:</strong> {provider}</div>
      <div><strong>Level:</strong> {level}</div>
      <div><strong>Reimbursement:</strong> {reimbursement}</div>
      <div><strong>Prep:</strong> {prep}</div>
    </div>
  </div>
);

const MentorshipSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Mentorship Program
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-teal-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-teal-800 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-3" />
          Mentor-Mentee Matching
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">How It Works</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Complete mentorship application</li>
              <li>• Specify your goals and interests</li>
              <li>• Get matched with suitable mentor</li>
              <li>• Schedule regular meetings</li>
              <li>• Track progress and outcomes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Mentorship Types</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Technical skill development</li>
              <li>• Career advancement guidance</li>
              <li>• Leadership development</li>
              <li>• Industry networking</li>
              <li>• Work-life balance coaching</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Mentorship Benefits</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">For Mentees</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Personalized career guidance</li>
              <li>• Skill development support</li>
              <li>• Industry insights and knowledge</li>
              <li>• Expanded professional network</li>
              <li>• Increased confidence and clarity</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">For Mentors</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Leadership skill development</li>
              <li>• Fresh perspectives and ideas</li>
              <li>• Personal satisfaction and fulfillment</li>
              <li>• Enhanced communication skills</li>
              <li>• Recognition and visibility</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Success Stories</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <SuccessStory 
            mentee="Jessica Park"
            mentor="David Kim"
            role="Software Engineer → Senior Developer"
            outcome="Promoted within 8 months with mentorship support"
            quote="My mentor helped me identify skill gaps and provided guidance on technical leadership."
          />
          <SuccessStory 
            mentee="Michael Torres"
            mentor="Sarah Wilson"
            role="Product Manager → Senior PM"
            outcome="Successfully launched 3 major product features"
            quote="The mentorship program gave me the confidence to take on bigger challenges."
          />
        </div>
      </div>
    </div>
  </section>
);

const SuccessStory = ({ mentee, mentor, role, outcome, quote }: {
  mentee: string;
  mentor: string;
  role: string;
  outcome: string;
  quote: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h4 className="font-semibold text-lg mb-2">{mentee} & {mentor}</h4>
    <div className="text-sm text-gray-600 mb-3">
      <div><strong>Progression:</strong> {role}</div>
      <div><strong>Outcome:</strong> {outcome}</div>
    </div>
    <blockquote className="text-sm italic text-gray-700 border-l-4 border-green-500 pl-4">
      "{quote}"
    </blockquote>
  </div>
);

const PerformanceGrowthSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Performance & Growth Planning
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-orange-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
          <Target className="w-6 h-6 mr-3" />
          Goal Setting & OKRs
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Objective Setting</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Quarterly goal setting sessions</li>
              <li>• SMART goals framework</li>
              <li>• Alignment with company objectives</li>
              <li>• Regular progress check-ins</li>
              <li>• Quarterly review and adjustment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Key Results Tracking</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Measurable outcomes definition</li>
              <li>• Progress tracking dashboard</li>
              <li>• Performance metrics analysis</li>
              <li>• Milestone celebration</li>
              <li>• Continuous improvement focus</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">Performance Improvement Plans</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <PICard 
            title="Skills Gap Analysis"
            description="Identify areas for improvement"
            actions={["Skill assessment", "Gap identification", "Development plan"]}
          />
          <PICard 
            title="Development Activities"
            description="Targeted improvement initiatives"
            actions={["Training programs", "Stretch assignments", "Skill practice"]}
          />
          <PICard 
            title="Progress Monitoring"
            description="Track improvement over time"
            actions={["Regular check-ins", "Milestone reviews", "Outcome measurement"]}
          />
        </div>
      </div>

      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">Career Advancement</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Promotion Criteria</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Consistent high performance</li>
              <li>• Demonstrated leadership skills</li>
              <li>• Technical expertise growth</li>
              <li>• Positive team contribution</li>
              <li>• Innovation and initiative</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Career Planning</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Annual career discussions</li>
              <li>• Individual development plans</li>
              <li>• Skill roadmap creation</li>
              <li>• Networking opportunities</li>
              <li>• Succession planning involvement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PICard = ({ title, description, actions }: {
  title: string;
  description: string;
  actions: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <ul className="text-gray-700 text-xs space-y-1">
      {actions.map((action, index) => (
        <li key={index}>• {action}</li>
      ))}
    </ul>
  </div>
);

const ExternalEducationSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      External Education Support
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-pink-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-pink-800 mb-4 flex items-center">
          <GraduationCap className="w-6 h-6 mr-3" />
          Tuition Reimbursement
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Eligible Programs</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Bachelor's degree programs</li>
              <li>• Master's degree programs</li>
              <li>• Professional certifications</li>
              <li>• Industry-specific courses</li>
              <li>• Online degree programs</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Reimbursement Details</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Up to $5,000 per year</li>
              <li>• 80% reimbursement for A/B grades</li>
              <li>• 60% reimbursement for C grades</li>
              <li>• Pre-approval required</li>
              <li>• 2-year commitment post-graduation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">Conference & Events</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <EventCard 
            title="Industry Conferences"
            description="Annual tech conferences and summits"
            budget="$3,000 per person"
            examples={["AWS re:Invent", "Google I/O", "Microsoft Build"]}
          />
          <EventCard 
            title="Professional Workshops"
            description="Skill-focused intensive sessions"
            budget="$1,500 per person"
            examples={["Design Thinking", "Agile Coaching", "Data Science"]}
          />
          <EventCard 
            title="Networking Events"
            description="Industry meetups and gatherings"
            budget="$500 per person"
            examples={["Local meetups", "Professional associations", "User groups"]}
          />
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Learning Platforms</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Subscriptions Provided</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• LinkedIn Learning (company-wide)</li>
              <li>• Pluralsight (technical roles)</li>
              <li>• Coursera for Business</li>
              <li>• O'Reilly Online Learning</li>
              <li>• Udemy for Business</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Access Guidelines</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• 24/7 access to all content</li>
              <li>• Mobile app availability</li>
              <li>• Progress tracking and certificates</li>
              <li>• Department-specific recommendations</li>
              <li>• Learning path suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const EventCard = ({ title, description, budget, examples }: {
  title: string;
  description: string;
  budget: string;
  examples: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="text-sm mb-3">
      <strong>Budget:</strong> <span className="text-green-600">{budget}</span>
    </div>
    <div className="text-xs">
      <strong>Examples:</strong>
      <ul className="text-gray-700 mt-1 space-y-1">
        {examples.map((example, index) => (
          <li key={index}>• {example}</li>
        ))}
      </ul>
    </div>
  </div>
);

const LeadershipDevelopmentSection = () => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Leadership Development
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-yellow-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
          <Star className="w-6 h-6 mr-3" />
          Leadership Academy
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Program Structure</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• 6-month intensive program</li>
              <li>• Monthly leadership workshops</li>
              <li>• Executive coaching sessions</li>
              <li>• Peer learning circles</li>
              <li>• 360-degree feedback process</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Core Competencies</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Strategic thinking and planning</li>
              <li>• Team building and motivation</li>
              <li>• Communication and influence</li>
              <li>• Decision-making and problem-solving</li>
              <li>• Change management</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-indigo-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">Leadership Tracks</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <LeadershipTrack 
            title="Emerging Leaders"
            target="Individual contributors showing potential"
            duration="3 months"
            focus={["Self-awareness", "Communication", "Team collaboration"]}
          />
          <LeadershipTrack 
            title="New Managers"
            target="Recently promoted managers"
            duration="6 months"
            focus={["People management", "Performance coaching", "Team dynamics"]}
          />
          <LeadershipTrack 
            title="Senior Leaders"
            target="Directors and VPs"
            duration="12 months"
            focus={["Strategic leadership", "Organizational change", "Executive presence"]}
          />
        </div>
      </div>

      <div className="p-6 bg-teal-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-teal-800 mb-4">Leadership Resources</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-3">Learning Resources</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Executive leadership library</li>
              <li>• Harvard Business Review access</li>
              <li>• Leadership podcast recommendations</li>
              <li>• Case study library</li>
              <li>• Leadership assessment tools</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Development Opportunities</h4>
            <ul className="text-gray-700 space-y-2">
              <li>• Cross-functional project leadership</li>
              <li>• Mentoring junior employees</li>
              <li>• Speaking at company events</li>
              <li>• Industry conference presentations</li>
              <li>• Board or committee participation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const LeadershipTrack = ({ title, target, duration, focus }: {
  title: string;
  target: string;
  duration: string;
  focus: string[];
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500">
    <h4 className="font-semibold text-lg mb-2">{title}</h4>
    <div className="text-sm text-gray-600 mb-3">
      <div><strong>Target:</strong> {target}</div>
      <div><strong>Duration:</strong> {duration}</div>
    </div>
    <div className="text-xs">
      <strong>Focus Areas:</strong>
      <ul className="text-gray-700 mt-1 space-y-1">
        {focus.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default AppProfessionalDevelopment;
