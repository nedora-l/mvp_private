import React from 'react';
import { CheckCircle, Users, Phone, Mail, MapPin, Clock, AlertCircle, Settings } from 'lucide-react';
import { useI18n } from "@/lib/i18n/use-i18n";
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Dictionary } from '@/locales/dictionary';

interface AppGettingStartedProps extends AppComponentDictionaryProps {
    locale: string;
    title: string;
    description: string;
    dictionary: Dictionary;
}

const AppGettingStarted: React.FC<AppGettingStartedProps> = ({ dictionary, locale, title, description }) => {
  const { t } = useI18n(dictionary);
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="container mx-auto p-6">
        <WelcomeSection t={t} />
        <FirstDayChecklistSection t={t} />
        <EssentialContactsSection t={t} />
        <SystemAccessSection t={t} />
        <OfficeOrientationSection t={t} />
        <KeyPoliciesSection t={t} />
        <EmergencyProceduresSection t={t} />
      </main>
    </div>
  );
};

const WelcomeSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="text-center py-12">
    <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 px-6 rounded-lg shadow-xl mb-12">
      <h1 className="text-5xl font-bold mb-4">{t('gettingStarted.welcome.title')}</h1>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        {t('gettingStarted.welcome.description')}
      </p>
      <div className="flex justify-center items-center space-x-4 text-green-100">
        <Users className="w-6 h-6" />
        <span className="text-lg">{t('gettingStarted.welcome.subtitle')}</span>
      </div>
    </div>

    <section className="bg-white p-8 rounded-lg shadow-md mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('gettingStarted.journey.title')}</h2>
      <p className="text-lg text-gray-700 mb-6">
        {t('gettingStarted.journey.description')}
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-4">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('gettingStarted.journey.stepByStep.title')}</h3>
          <p className="text-gray-600">{t('gettingStarted.journey.stepByStep.description')}</p>
        </div>
        <div className="text-center p-4">
          <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('gettingStarted.journey.teamSupport.title')}</h3>
          <p className="text-gray-600">{t('gettingStarted.journey.teamSupport.description')}</p>
        </div>
        <div className="text-center p-4">
          <Settings className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('gettingStarted.journey.resources.title')}</h3>
          <p className="text-gray-600">{t('gettingStarted.journey.resources.description')}</p>
        </div>
      </div>
    </section>
  </section>
);

const FirstDayChecklistSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      {t('gettingStarted.checklist.title')}
    </h2>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-green-800 mb-4">{t('gettingStarted.checklist.morning.title')}</h3>
        <ChecklistItem 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title={t('gettingStarted.checklist.morning.arriveEarly.title')}
          description={t('gettingStarted.checklist.morning.arriveEarly.description')}
        />
        <ChecklistItem 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title={t('gettingStarted.checklist.morning.hrPaperwork.title')}
          description={t('gettingStarted.checklist.morning.hrPaperwork.description')}
        />
        <ChecklistItem 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title={t('gettingStarted.checklist.morning.equipment.title')}
          description={t('gettingStarted.checklist.morning.equipment.description')}
        />
        <ChecklistItem 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title={t('gettingStarted.checklist.morning.officeTour.title')}
          description={t('gettingStarted.checklist.morning.officeTour.description')}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-green-800 mb-4">{t('gettingStarted.checklist.afternoon.title')}</h3>
        <ChecklistItem 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title={t('gettingStarted.checklist.afternoon.meetManager.title')}
          description={t('gettingStarted.checklist.afternoon.meetManager.description')}
        />
        <ChecklistItem 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title={t('gettingStarted.checklist.afternoon.meetTeam.title')}
          description={t('gettingStarted.checklist.afternoon.meetTeam.description')}
        />
        <ChecklistItem 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title={t('gettingStarted.checklist.afternoon.systemSetup.title')}
          description={t('gettingStarted.checklist.afternoon.systemSetup.description')}
        />
        <ChecklistItem 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title={t('gettingStarted.checklist.afternoon.companyHandbook.title')}
          description={t('gettingStarted.checklist.afternoon.companyHandbook.description')}
        />
      </div>
    </div>
  </section>
);

const ChecklistItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
  </div>
);

const EssentialContactsSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      {t('gettingStarted.contacts.title')}
    </h2>

    <div className="grid md:grid-cols-3 gap-6">
      <ContactCard 
        icon={<Users className="w-8 h-8 text-blue-600" />}
        title={t('gettingStarted.contacts.hr.title')}
        phone={t('gettingStarted.contacts.hr.phone')}
        email={t('gettingStarted.contacts.hr.email')}
        description={t('gettingStarted.contacts.hr.description')}
      />
      <ContactCard 
        icon={<Settings className="w-8 h-8 text-purple-600" />}
        title={t('gettingStarted.contacts.it.title')}
        phone={t('gettingStarted.contacts.it.phone')}
        email={t('gettingStarted.contacts.it.email')}
        description={t('gettingStarted.contacts.it.description')}
      />
      <ContactCard 
        icon={<AlertCircle className="w-8 h-8 text-red-600" />}
        title={t('gettingStarted.contacts.emergency.title')}
        phone={t('gettingStarted.contacts.emergency.phone')}
        email={t('gettingStarted.contacts.emergency.email')}
        description={t('gettingStarted.contacts.emergency.description')}
      />
    </div>
  </section>
);

const ContactCard = ({ icon, title, phone, email, description }: {
  icon: React.ReactNode;
  title: string;
  phone: string;
  email: string;
  description: string;
}) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-bold ml-3">{title}</h3>
    </div>
    <div className="space-y-2">
      <div className="flex items-center text-sm">
        <Phone className="w-4 h-4 mr-2 text-gray-500" />
        <span>{phone}</span>
      </div>
      <div className="flex items-center text-sm">
        <Mail className="w-4 h-4 mr-2 text-gray-500" />
        <span>{email}</span>
      </div>
      <p className="text-sm text-gray-600 mt-3">{description}</p>
    </div>
  </div>
);

const SystemAccessSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      {t('gettingStarted.systemAccess.title')}
    </h2>

    <div className="space-y-6">
      <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-blue-800 mb-4">{t('gettingStarted.systemAccess.email.title')}</h3>
        <p className="text-lg text-gray-700 mb-4">
          {t('gettingStarted.systemAccess.email.description')}
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {t('gettingStarted.systemAccess.email.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">{t('gettingStarted.systemAccess.development.title')}</h3>
        <p className="text-lg text-gray-700 mb-4">
          {t('gettingStarted.systemAccess.development.description')}
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {t('gettingStarted.systemAccess.development.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="p-6 bg-green-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-green-800 mb-4">{t('gettingStarted.systemAccess.business.title')}</h3>
        <p className="text-lg text-gray-700 mb-4">
          {t('gettingStarted.systemAccess.business.description')}
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {t('gettingStarted.systemAccess.business.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const OfficeOrientationSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      {t('gettingStarted.office.title')}
    </h2>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">{t('gettingStarted.office.physical.title')}</h3>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            {t('gettingStarted.office.physical.layoutTitle')}
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {t('gettingStarted.office.physical.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-indigo-800 mb-4">{t('gettingStarted.office.amenities.title')}</h3>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {t('gettingStarted.office.amenities.facilitiesTitle')}
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {t('gettingStarted.office.amenities.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const KeyPoliciesSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      {t('gettingStarted.policies.title')}
    </h2>

    <div className="grid md:grid-cols-2 gap-6">
      <PolicyCard 
        title={t('gettingStarted.policies.workHours.title')}
        items={t('gettingStarted.policies.workHours.items')}
        bgColor="bg-blue-50"
        textColor="text-blue-800"
      />
      <PolicyCard 
        title={t('gettingStarted.policies.communication.title')}
        items={t('gettingStarted.policies.communication.items')}
        bgColor="bg-green-50"
        textColor="text-green-800"
      />
      <PolicyCard 
        title={t('gettingStarted.policies.conduct.title')}
        items={t('gettingStarted.policies.conduct.items')}
        bgColor="bg-purple-50"
        textColor="text-purple-800"
      />
      <PolicyCard 
        title={t('gettingStarted.policies.technology.title')}
        items={t('gettingStarted.policies.technology.items')}
        bgColor="bg-orange-50"
        textColor="text-orange-800"
      />
    </div>
  </section>
);

const PolicyCard = ({ title, items, bgColor, textColor }: {
  title: string;
  items: string[];
  bgColor: string;
  textColor: string;
}) => (
  <div className={`p-6 ${bgColor} rounded-lg shadow-inner`}>
    <h3 className={`text-xl font-bold ${textColor} mb-4`}>{title}</h3>
    <ul className="text-gray-700 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const EmergencyProceduresSection = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
  <section className="bg-white p-8 rounded-lg shadow-md mt-12">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      {t('gettingStarted.emergency.title')}
    </h2>

    <div className="grid md:grid-cols-3 gap-6">
      <EmergencyCard 
        icon={<AlertCircle className="w-8 h-8 text-red-600" />}
        title={t('gettingStarted.emergency.fire.title')}
        steps={t('gettingStarted.emergency.fire.steps')}
        bgColor="bg-red-50"
      />
      <EmergencyCard 
        icon={<AlertCircle className="w-8 h-8 text-orange-600" />}
        title={t('gettingStarted.emergency.medical.title')}
        steps={t('gettingStarted.emergency.medical.steps')}
        bgColor="bg-orange-50"
      />
      <EmergencyCard 
        icon={<AlertCircle className="w-8 h-8 text-yellow-600" />}
        title={t('gettingStarted.emergency.security.title')}
        steps={t('gettingStarted.emergency.security.steps')}
        bgColor="bg-yellow-50"
      />
    </div>
  </section>
);

const EmergencyCard = ({ icon, title, steps, bgColor }: {
  icon: React.ReactNode;
  title: string;
  steps: string[];
  bgColor: string;
}) => (
  <div className={`p-6 ${bgColor} rounded-lg shadow-inner`}>
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-bold ml-3">{title}</h3>
    </div>
    <ol className="text-sm text-gray-700 space-y-2">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start">
          <span className="bg-white text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
            {index + 1}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  </div>
);

export default AppGettingStarted;
