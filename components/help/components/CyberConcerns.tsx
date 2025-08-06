import React from 'react';
import { useI18n } from "@/lib/i18n/use-i18n";
import { Dictionary } from '@/locales/dictionary';

// Main App component
const  AppCyberConcerns = ({ title, description,locale, dictionary } : {

        locale: string;
        title: string;
        description: string;
        dictionary: Dictionary;
 }) => {
    const { t } = useI18n(dictionary);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
                <div className="container mx-auto flex flex-wrap justify-between items-center">
                    <a href="#home" className="text-2xl font-bold text-blue-700 cursor-pointer">
                        {title || t('cyberConcerns.title')} 
                    </a>
                    <div className="flex flex-wrap space-x-4 mt-2 md:mt-0">
                        <NavItem title={t('components.cyberSecurity.navigation.bestPractices')} href="#bonnes-pratiques-generales" />
                        <NavItem title={t('components.cyberSecurity.navigation.internet')} href="#internet-vigilance" />
                        <NavItem title={t('components.cyberSecurity.navigation.email')} href="#messagerie" />
                        <NavItem title={t('components.cyberSecurity.navigation.equipment')} href="#materiel-securite" />
                        <NavItem title={t('components.cyberSecurity.navigation.passwords')} href="#mot-de-passe" />
                    </div>
                </div>
            </nav>

            {/* Main Content Area - All sections on one page */}
            <main className="container mx-auto p-6">
                <HomePage t={t} />
                <BonnesPratiquesPage t={t} />
                <InternetVigilancePage t={t} />
                <MessageriePage t={t} />
                <MaterielSecuritePage t={t} />
                <MotDePassePage t={t} />
            </main>

        </div>
    );
};

// Reusable Navigation Item Component
const NavItem = ({ title, href } : { title : string , href: string  }) => (
    <a
        href={href}
        className="text-gray-600 hover:text-blue-700 font-medium px-3 py-2 rounded-md transition duration-300 ease-in-out"
    >
        {title}
    </a>
);

// Home Page Component
const HomePage = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => {
    return (
        <section id="home" className="text-center py-12">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6 rounded-lg shadow-xl mb-12">
                <h2 className="text-5xl font-extrabold mb-4 leading-tight">
                    {t('components.cyberSecurity.welcome.title')}
                </h2>
                <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
                    {t('components.cyberSecurity.welcome.description')}
                </p>
                <div className="bg-white bg-opacity-20 rounded-lg p-6 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold mb-4">{t('components.cyberSecurity.welcome.subtitle')}</h3>
                    {/* SVG for Hero Section - Laptop with Shield */}
                    <div className="mx-auto w-64 h-64 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                            <path fillRule="evenodd" clipRule="evenodd" d="M2 5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V5ZM4 5H20V17H4V5ZM12 7C10.3431 7 9 8.34315 9 10V12H15V10C15 8.34315 13.6569 7 12 7ZM10 12V10C10 9.44772 10.4477 9 11 9H13C13.5523 9 14 9.44772 14 10V12H10ZM12 11C11.4477 11 11 11.4477 11 12V14H13V12C13 11.4477 12.5523 11 12 11Z" fill="currentColor"/>
                            <path d="M12 17.5C12.8284 17.5 13.5 16.8284 13.5 16C13.5 15.1716 12.8284 14.5 12 14.5C11.1716 14.5 10.5 15.1716 10.5 16C10.5 16.8284 11.1716 17.5 12 17.5Z" fill="currentColor"/>
                            <path d="M12 1.5C8.96243 1.5 6.5 3.96243 6.5 7V11.5H17.5V7C17.5 3.96243 15.0376 1.5 12 1.5Z" fill="currentColor"/>
                            <path d="M12 2C9.23858 2 7 4.23858 7 7V11H17V7C17 4.23858 14.7614 2 12 2Z" fill="currentColor"/>
                            <path d="M12 1.5C8.96243 1.5 6.5 3.96243 6.5 7V11.5H17.5V7C17.5 3.96243 15.0376 1.5 12 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 2C9.23858 2 7 4.23858 7 7V11H17V7C17 4.23858 14.7614 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 17.5C12.8284 17.5 13.5 16.8284 13.5 16C13.5 15.1716 12.8284 14.5 12 14.5C11.1716 14.5 10.5 15.1716 10.5 16C10.5 16.8284 11.1716 17.5 12 17.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Introduction Section */}
            <section className="bg-white p-8 rounded-lg shadow-md mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    {t('components.cyberSecurity.sections.bestPractices')}
                </h3>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    {t('cyberConcerns.securityBestPractices.description')}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    {t('cyberConcerns.description')}
                </p>
            </section>

            {/* Call to Action - Contact */}
            <section className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md mb-12">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4">
                    {t('components.cyberSecurity.alerts.whenToReact')}
                </h3>
                <p className="text-lg text-yellow-700 mb-4">
                    {t('cyberConcerns.securityBestPractices.title')}
                </p>
                <p className="text-xl font-semibold text-yellow-900 mb-4">
                    {t('components.cyberSecurity.alerts.whenToReact')}
                </p>
                <ul className="list-disc list-inside text-left text-lg text-yellow-700 space-y-2 mb-6">
                    <li>{t('cyberConcerns.passwordManagement.description')}</li>
                    <li>{t('cyberConcerns.dataProtection.description')}</li>
                    <li>{t('cyberConcerns.incidentReporting.description')}</li>
                    <li>{t('cyberConcerns.remoteWorkSecurity.description')}</li>
                </ul>
                <p className="text-lg text-yellow-700 font-bold">
                    {t('components.cyberSecurity.alerts.urgentAction')}
                </p>
                <p className="text-2xl font-extrabold text-yellow-900 mt-4">
                    {t('components.cyberSecurity.alerts.contactSupport')}
                </p>
            </section>

            {/* Good Practices Overview Section */}
            <section className="py-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    {t('components.cyberSecurity.sections.bestPractices')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PracticeCard
                        title={t('components.cyberSecurity.sections.bestPractices')}
                        description={t('cyberConcerns.securityBestPractices.description')}
                        icon={
                            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002 12c0 2.757 1.125 5.229 2.938 7.037l-1.475 1.475C3.197 20.658 3 21.32 3 22h18c0-.68-.197-1.342-.587-1.928l-1.475-1.475C20.875 17.229 22 14.757 22 12a12.007 12.007 0 00-2.382-7.016z"></path>
                            </svg>
                        }
                        href="#bonnes-pratiques-generales"
                    />
                    <PracticeCard
                        title={t('components.cyberSecurity.sections.internetSafety')}
                        description={t('cyberConcerns.phishingAwareness.description')}
                        icon={
                            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                        }
                        href="#internet-vigilance"
                    />
                    <PracticeCard
                        title={t('components.cyberSecurity.sections.emailSecurity')}
                        description={t('cyberConcerns.phishingAwareness.title')}
                        icon={
                            <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        }
                        href="#messagerie"
                    />
                    <PracticeCard
                        title={t('components.cyberSecurity.sections.equipmentSecurity')}
                        description={t('cyberConcerns.dataProtection.description')}
                        icon={
                            <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                        }
                        href="#materiel-securite"
                    />
                    <PracticeCard
                        title={t('components.cyberSecurity.sections.passwordSecurity')}
                        description={t('cyberConcerns.passwordManagement.description')}
                        icon={
                            <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6a2 2 0 114 0v5"></path>
                            </svg>
                        }
                        href="#mot-de-passe"
                    />
                </div>
            </section>
        </section>
    );
};

// Reusable Practice Card Component
const PracticeCard = ({ title, description, icon, href } : { title : string , description: string , icon: JSX.Element , href: string  }) => (
    <a
        href={href}
        className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
    >
        <div className="mb-4">{icon}</div>
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
        <div
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
            En savoir plus
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
        </div>
    </a>
);

// Bonnes Pratiques Page Component
const BonnesPratiquesPage = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
    <section id="bonnes-pratiques-generales" className="bg-white p-8 rounded-lg shadow-md mt-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            {t('components.cyberSecurity.sections.bestPractices')}
        </h2>

        {/* Section: Mot de passe */}
        <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6a2 2 0 114 0v5"></path>
                </svg>
                Mot de passe : Votre première ligne de défense
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Le mot de passe est la clé de votre identité numérique. Un mot de passe faible est une porte ouverte aux cybercriminels.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Choisissez un mot de passe complexe et unique :</strong> Utilisez au moins 12 caractères, mélangeant majuscules, minuscules, chiffres et symboles. Évitez les informations personnelles (date de naissance, nom, etc.).
                </li>
                <li>
                    <strong>Utilisez un mot de passe différent pour chaque service :</strong> Si un service est compromis, vos autres comptes resteront sécurisés.
                </li>
                <li>
                    <strong>Pensez aux phrases de passe :</strong> Une phrase de passe longue et mémorable est souvent plus sécurisée qu'un mot de passe complexe mais court.
                </li>
                <li>
                    <strong>Utilisez un gestionnaire de mots de passe :</strong> Ces outils génèrent, stockent et remplissent automatiquement des mots de passe complexes et uniques pour vous, en toute sécurité.
                </li>
                <li>
                    <strong>Activez l'authentification à deux facteurs (2FA/MFA) :</strong> Ajoutez une couche de sécurité supplémentaire en exigeant une deuxième vérification (code SMS, application d'authentification) en plus de votre mot de passe.
                </li>
                <li>
                    <strong>Ne partagez jamais vos mots de passe :</strong> Ni avec des collègues, ni avec des amis, ni même avec votre famille.
                </li>
            </ul>
        </div>

        {/* Section: Équipements */}
        <div className="mb-10 p-6 bg-green-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1v-3m-6 0h6m-5-5a1 1 0 11-2 0 1 1 0 012 0zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-6 0h.01M12 10a1 1 0 11-2 0 1 1 0 012 0zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"></path>
                </svg>
                Équipements : Protégez vos outils de travail
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Vos ordinateurs, smartphones et autres appareils contiennent des informations précieuses. Leur sécurité est primordiale.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Mettez à jour régulièrement vos systèmes et applications :</strong> Les mises à jour contiennent souvent des correctifs de sécurité essentiels. Activez les mises à jour automatiques.
                </li>
                <li>
                    <strong>Verrouillez toujours votre écran :</strong> Que ce soit pour une courte absence ou en fin de journée, verrouillez votre session. Utilisez un mot de passe, un code PIN ou une authentification biométrique.
                </li>
                <li>
                    <strong>N'installez que des logiciels autorisés :</strong> Évitez les téléchargements de sources inconnues. Utilisez uniquement les logiciels approuvés par l'entreprise.
                </li>
                <li>
                    <strong>Sauvegardez vos données régulièrement :</strong> En cas de perte, de vol ou de panne, vos données seront en sécurité. Utilisez les solutions de sauvegarde de l'entreprise.
                </li>
                <li>
                    <strong>Chiffrez vos appareils :</strong> Le chiffrement protège vos données même si votre appareil est perdu ou volé.
                </li>
            </ul>
        </div>

        {/* Section: Protection des données */}
        <div className="mb-10 p-6 bg-purple-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Protection des données : La confidentialité avant tout
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                La protection des données est au cœur de la cybersécurité. Il s'agit de garantir leur confidentialité, leur intégrité et leur disponibilité.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Ne partagez les données qu'avec les personnes autorisées :</strong> Respectez le principe du "besoin d'en connaître".
                </li>
                <li>
                    <strong>Utilisez les outils de protection de l'entreprise :</strong> Les outils mis à votre disposition sont conçus pour sécuriser les informations.
                </li>
                <li>
                    <strong>Adoptez un comportement responsable :</strong> Ne laissez pas de documents sensibles sans surveillance, ne discutez pas d'informations confidentielles dans des lieux publics.
                </li>
                <li>
                    <strong>Supprimez les données de manière sécurisée :</strong> Avant de jeter un appareil ou un support de stockage, assurez-vous que les données sont irrécupérables.
                </li>
            </ul>
        </div>

        {/* Section: E-mail */}
        <div className="mb-10 p-6 bg-red-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                E-mail : Faites attention lors de l'envoi ou de la réception
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                L'e-mail est l'un des vecteurs d'attaque les plus courants. La vigilance est de mise.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Vérifiez toujours l'expéditeur :</strong> Méfiez-vous des adresses e-mail inhabituelles ou des noms d'expéditeurs qui semblent légèrement modifiés.
                </li>
                <li>
                    <strong>Méfiez-vous des pièces jointes suspectes :</strong> N'ouvrez jamais une pièce jointe si vous avez le moindre doute sur l'expéditeur ou le contenu.
                </li>
                <li>
                    <strong>Ne cliquez pas sur des liens non vérifiés :</strong> Survolez les liens avec votre souris pour voir l'URL réelle avant de cliquer.
                </li>
                <li>
                    <strong>Soyez vigilant face au phishing :</strong> Ne répondez jamais à une demande d'informations personnelles (mots de passe, coordonnées bancaires) par e-mail.
                </li>
            </ul>
        </div>

        {/* Section: Internet */}
        <div className="mb-10 p-6 bg-yellow-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Internet : Naviguez en toute sécurité
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Internet est une source d'informations immense, mais aussi de menaces. Adoptez les bons réflexes.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Vérifiez que le site est sécurisé (HTTPS) :</strong> L'adresse doit commencer par "https://" et un cadenas doit apparaître dans la barre d'adresse.
                </li>
                <li>
                    <strong>Méfiez-vous des offres trop alléchantes :</strong> Elles cachent souvent des arnaques ou des tentatives de phishing.
                </li>
                <li>
                    <strong>Évitez les réseaux Wi-Fi publics non sécurisés :</strong> Vos données peuvent être facilement interceptées. Utilisez un VPN si nécessaire.
                </li>
                <li>
                    <strong>Ne téléchargez que des fichiers provenant de sources fiables :</strong> Les logiciels piratés ou les téléchargements illégaux sont souvent porteurs de malwares.
                </li>
                <li>
                    <strong>Soyez conscient de votre empreinte numérique :</strong> Ce que vous publiez en ligne peut être utilisé contre vous.
                </li>
            </ul>
        </div>

        {/* Section: Outils de protection */}
        <div className="mb-10 p-6 bg-indigo-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002 12c0 2.757 1.125 5.229 2.938 7.037l-1.475 1.475C3.197 20.658 3 21.32 3 22h18c0-.68-.197-1.342-.587-1.928l-1.475-1.475C20.875 17.229 22 14.757 22 12a12.007 12.007 0 00-2.382-7.016z"></path>
                </svg>
                Outils de protection : Utilisez les ressources à votre disposition
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                L'entreprise met à votre disposition des outils pour renforcer votre sécurité. Utilisez-les judicieusement.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Antivirus et anti-malware :</strong> Assurez-vous que ces logiciels sont actifs et à jour sur tous vos appareils.
                </li>
                <li>
                    <strong>Pare-feu (Firewall) :</strong> Le pare-feu contrôle le trafic réseau entrant et sortant, protégeant votre ordinateur des accès non autorisés.
                </li>
                <li>
                    <strong>VPN (Virtual Private Network) :</strong> Utilisez le VPN de l'entreprise pour accéder aux ressources internes lorsque vous travaillez à distance ou utilisez un réseau public.
                </li>
                <li>
                    <strong>Solutions de sauvegarde :</strong> Familiarisez-vous avec les procédures de sauvegarde des données de l'entreprise.
                </li>
            </ul>
        </div>

        {/* Section: Conformité - Réglementation */}
        <div className="mb-10 p-6 bg-teal-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-teal-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                Conformité - Réglementation : Respectez les règles
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                La conformité aux politiques de sécurité de l'entreprise et aux réglementations est essentielle pour protéger l'organisation.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Politiques GSF :</strong> Familiarisez-vous et respectez les politiques de sécurité de l'information de l'entreprise.
                </li>
                <li>
                    <strong>Réglementations :</strong> Soyez conscient des lois et réglementations en vigueur concernant la protection des données (ex: RGPD).
                </li>
                <li>
                    <strong>Utilisation des ressources :</strong> Utilisez les ressources informatiques de l'entreprise conformément aux directives établies.
                </li>
            </ul>
        </div>

        {/* Section: Ingénierie sociale */}
        <div className="mb-10 p-6 bg-pink-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-pink-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14v7m-4 0h8"></path>
                </svg>
                Ingénierie sociale : Méfiez-vous des manipulations
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                L'ingénierie sociale est une technique de manipulation psychologique utilisée par les cybercriminels pour obtenir des informations confidentielles.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Ne fournissez jamais d'informations à des étrangers :</strong> Soyez très méfiant face aux demandes inattendues d'informations personnelles ou professionnelles, même si la personne semble légitime.
                </li>
                <li>
                    <strong>Vérifiez toujours l'identité :</strong> Si quelqu'un vous contacte en se faisant passer pour un collègue, un fournisseur ou un support technique, vérifiez son identité par un canal de communication indépendant (numéro de téléphone officiel, etc.).
                </li>
                <li>
                    <strong>Méfiez-vous des situations d'urgence :</strong> Les cybercriminels créent souvent un sentiment d'urgence pour vous pousser à agir sans réfléchir.
                </li>
                <li>
                    <strong>Ne vous fiez pas aux apparences :</strong> Un e-mail ou un appel téléphonique peut sembler officiel, mais être une tentative d'arnaque.
                </li>
            </ul>
        </div>
    </section>
);

// Internet Vigilance Page Component
const InternetVigilancePage = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
    <section id="internet-vigilance" className="bg-white p-8 rounded-lg shadow-md mt-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Naviguez sur Internet avec Vigilance
        </h2>

        {/* Section: Vérifiez que votre navigateur est à jour */}
        <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002 12c0 2.757 1.125 5.229 2.938 7.037l-1.475 1.475C3.197 20.658 3 21.32 3 22h18c0-.68-.197-1.342-.587-1.928l-1.475-1.475C20.875 17.229 22 14.757 22 12a12.007 12.007 0 00-2.382-7.016z"></path>
                </svg>
                Vérifiez que votre navigateur est à jour
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Un navigateur qui n'est pas à jour est un système particulièrement vulnérable aux attaques sur Internet. Les mises à jour corrigent les failles de sécurité.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Activez les mises à jour automatiques :</strong> La plupart des navigateurs modernes proposent cette option.
                </li>
                <li>
                    <strong>Redémarrez votre navigateur régulièrement :</strong> Cela permet d'appliquer les mises à jour en attente.
                </li>
                <li>
                    <strong>Utilisez un navigateur réputé :</strong> Chrome, Firefox, Edge, Safari sont régulièrement mis à jour pour la sécurité.
                </li>
            </ul>
        </div>

        {/* Section: Consultez uniquement des sites en accès sécurisés */}
        <div className="mb-10 p-6 bg-green-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z"></path>
                </svg>
                Consultez uniquement des sites en accès sécurisés (HTTPS)
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Lorsque vous naviguez sur Internet, assurez-vous toujours que le site utilise une connexion sécurisée.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Vérifiez le "HTTPS" :</strong> L'adresse du site doit commencer par "https://" et non "http://". Le 's' signifie "secure".
                </li>
                <li>
                    <strong>Recherchez le cadenas :</strong> Un petit cadenas fermé doit apparaître dans la barre d'adresse de votre navigateur. Cliquez dessus pour voir les détails du certificat de sécurité.
                </li>
                <li>
                    <strong>Méfiez-vous des avertissements de sécurité :</strong> Si votre navigateur vous avertit qu'un site n'est pas sécurisé, ne continuez pas.
                </li>
            </ul>
        </div>

        {/* Section: Attention aux liens et contenus téléchargeables */}
        <div className="mb-10 p-6 bg-purple-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101m-4.899.758l-.101.102M12 12l.101-.101"></path>
                </svg>
                Attention aux liens et contenus téléchargeables
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Les liens malveillants et les téléchargements infectés sont des vecteurs courants d'attaques.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Survolez les liens avant de cliquer :</strong> Passez votre souris sur un lien sans cliquer pour voir l'URL réelle dans le coin inférieur de votre navigateur. Si elle semble suspecte, ne cliquez pas.
                </li>
                <li>
                    <strong>Téléchargez uniquement depuis des sources fiables :</strong> N'installez des logiciels ou des fichiers que depuis les sites officiels ou des plateformes de confiance.
                </li>
                <li>
                    <strong>Méfiez-vous des pop-ups de téléchargement inattendus :</strong> Ils peuvent tenter de vous faire télécharger des logiciels malveillants.
                </li>
                <li>
                    <strong>Scannez les téléchargements :</strong> Utilisez un antivirus à jour pour scanner tous les fichiers téléchargés avant de les ouvrir.
                </li>
            </ul>
        </div>

        {/* Section: Séparer vos usages pro et perso */}
        <div className="mb-10 p-6 bg-red-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.134-.01-.267-.03-.4M2 19.999V18c0-.134.01-.267.03-.4m0 0a1.987 1.987 0 01.29-.644M18.97 16.956A1.988 1.988 0 0122 18v2h-3M2 19.999h14v-2h-14v2zM12 10a4 4 0 11-8 0 4 4 0 018 0zM12 14a4 4 0 100-8 4 4 0 000 8z"></path>
                </svg>
                Séparer vos usages pro et perso
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Mélanger vos activités professionnelles et personnelles sur les mêmes appareils ou réseaux peut créer des vulnérabilités.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Utilisez des comptes distincts :</strong> Ayez des comptes e-mail, de réseaux sociaux et de services cloud séparés pour le travail et la vie personnelle.
                </li>
                <li>
                    <strong>Évitez les usages personnels sur les appareils professionnels :</strong> Dans la mesure du possible, utilisez vos appareils personnels pour vos activités personnelles et les appareils professionnels pour le travail.
                </li>
                <li>
                    <strong>Ne connectez pas d'appareils personnels non sécurisés au réseau de l'entreprise :</strong> Cela peut introduire des malwares.
                </li>
            </ul>
        </div>

        {/* Section: Protéger vos données et soyez prudent avant de les transmettre */}
        <div className="mb-10 p-6 bg-yellow-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Protéger vos données et soyez prudent avant de les transmettre
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                La transmission de données en ligne, surtout sensibles, doit être faite avec la plus grande prudence.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Lisez la politique de confidentialité du site web :</strong> Avant de saisir des informations, assurez-vous de comprendre comment vos données seront utilisées et protégées.
                </li>
                <li>
                    <strong>Ne transmettez jamais d'éléments personnels sensibles :</strong> Évitez de partager des informations comme votre numéro de sécurité sociale, coordonnées bancaires, ou mots de passe via des formulaires non sécurisés ou des e-mails non chiffrés.
                </li>
                <li>
                    <strong>Utilisez des méthodes de transmission sécurisées :</strong> Pour les informations très sensibles, utilisez les outils de partage de fichiers sécurisés de l'entreprise ou des plateformes chiffrées.
                </li>
            </ul>
        </div>
    </section>
);

// Messagerie Page Component
const MessageriePage = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
    <section id="messagerie" className="bg-white p-8 rounded-lg shadow-md mt-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Messagerie : Les Points de Vigilance
        </h2>

        {/* Section: L'e-mail est le canal privilégié par les cyber-délinquants */}
        <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                L'e-mail est le canal privilégié par les cyber-délinquants
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Environ 90% des incidents de cybercriminalité ont l'e-mail comme point d'entrée. Le phishing, le SPAM, et la fraude sont les menaces les plus courantes.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Phishing :</strong> Tentatives d'hameçonnage pour voler vos identifiants ou informations personnelles.
                </li>
                <li>
                    <strong>SPAM :</strong> Courriers indésirables, souvent porteurs de liens malveillants ou de publicités frauduleuses.
                </li>
                <li>
                    <strong>Fraude au Président / Fraude au virement :</strong> Des escroqueries sophistiquées où les cybercriminels se font passer pour un dirigeant ou un fournisseur pour obtenir un virement frauduleux.
                </li>
            </ul>
        </div>

        {/* Section: N'ayez pas une confiance aveugle dans le nom de l'expéditeur */}
        <div className="mb-10 p-6 bg-green-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 1.657-4 4-4 4s4 2.343 4 4 4-4 4-4-4-2.343-4-4z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11V6a2 2 0 114 0v5"></path>
                </svg>
                N'ayez pas une confiance aveugle dans le nom de l'expéditeur
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Les cybercriminels peuvent facilement usurper l'identité d'expéditeurs légitimes.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Répondez seulement aux e-mails ayant un expéditeur connu et de confiance :</strong> Si vous ne connaissez pas l'expéditeur, soyez vigilant.
                </li>
                <li>
                    <strong>Soyez attentif à tout indice mettant en doute l'origine réelle du courriel :</strong> Fautes d'orthographe, grammaire approximative, logo de mauvaise qualité, adresse e-mail qui ne correspond pas au nom de l'expéditeur.
                </li>
                <li>
                    <strong>La messagerie comporte une signature ou des liens :</strong> Vérifiez si la signature est cohérente et si les liens pointent vers des domaines légitimes.
                </li>
                <li>
                    <strong>Une incohérence de forme ou de fond entre le message reçu et vous que votre interlocuteur légitime vous envoie d'habitude :</strong> Un ton inhabituel, une demande pressante.
                </li>
                <li>
                    <strong>En cas de doute, contactez votre interlocuteur pour vérifier qu'il est à l'origine du message :</strong> Utilisez un canal de communication différent (téléphone, message interne) pour confirmer.
                </li>
            </ul>
        </div>

        {/* Section: Méfiez-vous des pièces jointes */}
        <div className="mb-10 p-6 bg-purple-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.414 6.414a2 2 0 102.828 2.828l6.586-6.586"></path>
                </svg>
                Méfiez-vous des pièces jointes
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Elles peuvent contenir des virus ou des espiongiciels (malwares).
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Ouvrez uniquement les pièces jointes provenant de sources connues et dignes de confiance.</strong>
                </li>
                <li>
                    <strong>Soyez particulièrement vigilant avec les types de fichiers exécutables :</strong> (.exe, .zip, .js, .vbs, .docm, .xlsm, .pptm, etc.).
                </li>
                <li>
                    <strong>Si une pièce jointe vous semble anormale (taille, nom, extension), contactez l'expéditeur par un autre moyen.</strong>
                </li>
            </ul>
        </div>

        {/* Section: Ne répondez pas à une demande d'informations confidentielles */}
        <div className="mb-10 p-6 bg-red-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
                Ne répondez pas à une demande d'informations confidentielles
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Ne fournissez jamais d'informations confidentielles (identifiants, mots de passe, coordonnées bancaires, etc.) par e-mail.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Aucune entité légitime ne vous demandera ces informations par e-mail.</strong>
                </li>
                <li>
                    <strong>Si vous recevez une telle demande, signalez-la immédiatement au service D&A.</strong>
                </li>
                <li>
                    <strong>Méfiez-vous des liens dans les e-mails qui vous redirigent vers des pages de connexion :</strong> Saisissez toujours l'adresse du site directement dans votre navigateur.
                </li>
            </ul>
        </div>

        {/* Section: Soyez vigilants sur le contenu envoyé */}
        <div className="mb-10 p-6 bg-yellow-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Soyez vigilants sur le contenu envoyé
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Avant d'envoyer un e-mail, surtout s'il contient des informations sensibles, vérifiez toujours son contenu.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Envoyez des messages dont le contenu ne porte pas atteinte à l'image de GSF ni à sa réputation.</strong>
                </li>
                <li>
                    <strong>Vérifiez l'identité des destinataires :</strong> Assurez-vous d'envoyer l'e-mail aux bonnes personnes, surtout en cas de listes de diffusion. Une erreur de destinataire peut entraîner une fuite de données.
                </li>
            </ul>
        </div>
    </section>
);

// Materiel Securite Page Component
const MaterielSecuritePage = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
    <section id="materiel-securite" className="bg-white p-8 rounded-lg shadow-md mt-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Ne laissez pas votre matériel s'envoler !
        </h2>

        {/* Section: Protégez vos équipements informatiques */}
        <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Protégez vos équipements informatiques
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Que vous travailliez sur un ordinateur portable ou avec un téléphone portable professionnel, ces matériels contiennent des données confidentielles qui, en de mauvaises mains, peuvent mettre à mal GSF. Il est donc nécessaire d'adopter les bons réflexes pour minimiser le risque de vol.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Ne laissez jamais votre matériel sans surveillance :</strong> Que ce soit au bureau, dans un café, à l'aéroport ou à la maison, ne quittez jamais des yeux vos appareils.
                </li>
                <li>
                    <strong>Utilisez des dispositifs de sécurité physique :</strong> Câbles antivol, cadenas pour sacoches, etc.
                </li>
                <li>
                    <strong>Rangez votre matériel en sécurité :</strong> Dans un tiroir fermé à clé, une armoire sécurisée, ou un sac discret lorsque vous ne l'utilisez pas.
                </li>
            </ul>
        </div>

        {/* Section: Si vous ne pouvez pas prendre vos appareils avec vous */}
        <div className="mb-10 p-6 bg-green-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z"></path>
                </svg>
                Si vous ne pouvez pas prendre vos appareils avec vous
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Dans certaines situations, il peut être impossible de garder un œil constant sur votre matériel.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Assurez-vous qu'il soit sécurisé :</strong> Utilisez des câbles de sécurité, des coffres-forts, ou des tiroirs verrouillés.
                </li>
                <li>
                    <strong>Ne laissez jamais d'appareils dans votre voiture :</strong> Les véhicules sont des cibles faciles pour les voleurs. Si vous devez le faire, assurez-vous qu'ils soient hors de vue et verrouillés.
                </li>
                <li>
                    <strong>Activez le chiffrement de disque :</strong> En cas de vol, le chiffrement empêchera l'accès à vos données.
                </li>
            </ul>
        </div>

        {/* Section: Si vous devez vous absenter, verrouillez votre écran */}
        <div className="mb-10 p-6 bg-purple-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                </svg>
                Si vous devez vous absenter, verrouillez votre écran
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Même pour une courte absence, verrouiller votre écran est un réflexe essentiel.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Verrouillage rapide :</strong> Sur Windows, utilisez `Win + L`. Sur macOS, utilisez `Cmd + Ctrl + Q`.
                </li>
                <li>
                    <strong>Protection contre l'accès non autorisé :</strong> Cela empêche quiconque d'accéder à votre session et à vos données en votre absence.
                </li>
                <li>
                    <strong>Sécurité en télétravail :</strong> Même à la maison, verrouillez votre écran si d'autres personnes ont accès à votre espace de travail.
                </li>
            </ul>
        </div>

        {/* Section: En cas de perte ou de vol */}
        <div className="mb-10 p-6 bg-red-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                En cas de perte ou de vol
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Agissez rapidement si votre matériel professionnel est perdu ou volé.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Signalez immédiatement au service D&A :</strong> Ils pourront prendre les mesures nécessaires (blocage à distance, effacement des données).
                </li>
                <li>
                    <strong>Changez tous vos mots de passe :</strong> Surtout ceux des services auxquels vous avez accédé depuis l'appareil perdu/volé.
                </li>
                <li>
                    <strong>Utilisez les fonctionnalités de localisation et d'effacement à distance :</strong> Pour les smartphones et certains ordinateurs portables.
                </li>
            </ul>
        </div>
    </section>
);

// Mot de Passe Page Component
const MotDePassePage = ({ t }: { t: (key: string, variables?: Record<string, string | number>) => any }) => (
    <section id="mot-de-passe" className="bg-white p-8 rounded-lg shadow-md mt-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Mot de passe : Votre Première Ligne de Défense
        </h2>

        {/* Section: Les mots de passe sont le point faible de la SI */}
        <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6a2 2 0 114 0v5"></path>
                </svg>
                Les mots de passe sont le point faible de la Sécurité Informatique
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                De nombreux incidents de sécurité sont liés à des mots de passe faibles, réutilisés ou compromis.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Principaux risques :</strong> Accès frauduleux aux systèmes, usurpation d'identité, vol de données sensibles, fraudes et détournements.
                </li>
                <li>
                    <strong>Attention aux attaques par force brute :</strong> Les cybercriminels utilisent des programmes pour tester des millions de combinaisons de mots de passe par seconde.
                </li>
                <li>
                    <strong>Le "credential stuffing" :</strong> Utilisation de paires identifiant/mot de passe volées sur un site pour tenter de se connecter à d'autres services.
                </li>
            </ul>
        </div>

        {/* Section: Séparer vos environnements PRO et PERSO */}
        <div className="mb-10 p-6 bg-green-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.134-.01-.267-.03-.4M2 19.999V18c0-.134.01-.267.03-.4m0 0a1.987 1.987 0 01.29-.644M18.97 16.956A1.988 1.988 0 0122 18v2h-3M2 19.999h14v-2h-14v2zM12 10a4 4 0 11-8 0 4 4 0 018 0zM12 14a4 4 0 100-8 4 4 0 000 8z"></path>
                </svg>
                Séparer vos environnements PRO et PERSO
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Il est important de définir des mots de passe différents entre vos usages professionnels et personnels.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Facilitez la tâche des pirates :</strong> Si vous utilisez le même mot de passe partout, la compromission d'un compte personnel peut entraîner l'accès à vos comptes professionnels.
                </li>
                <li>
                    <strong>Exemple :</strong> Un mot de passe pour vos comptes personnels (réseaux sociaux, shopping en ligne) et un autre, plus robuste, pour vos comptes professionnels (e-mail d'entreprise, applications métier).
                </li>
            </ul>
        </div>

        {/* Section: Renouvelez régulièrement vos mots de passe ! */}
        <div className="mb-10 p-6 bg-purple-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 12c0 2.21.81 4.201 2.18 5.79l-4.24 4.24m9.9-9.9l4.24 4.24C17.19 18.19 19.18 19 21 19c2.21 0 4-1.79 4-4s-1.79-4-4-4h-5V4"></path>
                </svg>
                Renouvelez régulièrement vos mots de passe !
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Même les mots de passe forts peuvent être compromis avec le temps.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Conseil :</strong> Changez vos mots de passe importants tous les 3 à 6 mois.
                </li>
                <li>
                    <strong>En cas de suspicion de compromission :</strong> Changez-le immédiatement.
                </li>
            </ul>
        </div>

        {/* Section: Choisissez un mot de passe complexe ! Évitez les structures classiques... */}
        <div className="mb-10 p-6 bg-red-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Choisissez un mot de passe complexe ! Évitez les structures classiques...
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                La complexité est la clé de la robustesse d'un mot de passe.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Longueur minimum :</strong> 12 caractères. Plus c'est long, mieux c'est.
                </li>
                <li>
                    <strong>Complexité :</strong> 4 types de caractères minimum (majuscule, minuscule, chiffre, caractères spéciaux).
                </li>
                <li>
                    <strong>Évitez les références à des informations personnelles :</strong> Date de naissance, prénom, nom de famille, noms d'animaux, équipes sportives, etc.
                </li>
                <li>
                    <strong>Exemple de mot de passe faible :</strong> `MonMotDePasse123!`
                </li>
                <li>
                    <strong>Exemple de mot de passe fort (phrase de passe) :</strong> `J'AimeLesChatsBleusQuiDansentSurLesToits!`
                </li>
            </ul>
        </div>

        {/* Section: Ne partagez jamais vos identifiants, un mot de passe est personnel ! */}
        <div className="mb-10 p-6 bg-yellow-50 rounded-lg shadow-inner">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Ne partagez jamais vos identifiants, un mot de passe est personnel !
            </h3>
            <p className="text-lg text-gray-700 mb-4">
                Votre mot de passe est strictement personnel et ne doit jamais être communiqué.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                <li>
                    <strong>Ne communiquez ou ne partagez jamais vos mots de passe.</strong>
                </li>
                <li>
                    <strong>Évitez les post-it, les carnets, les fichiers non sécurisés :</strong> Ne notez pas vos mots de passe dans des endroits facilement accessibles.
                </li>
                <li>
                    <strong>Méfiez-vous des demandes de mots de passe :</strong> Aucune personne légitime (support technique, administrateur) ne vous demandera votre mot de passe complet.
                </li>
            </ul>
        </div>
    </section>
);

export default AppCyberConcerns;
