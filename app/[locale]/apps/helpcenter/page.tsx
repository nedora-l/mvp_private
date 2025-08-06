import HelpCenterComponentPage from "@/components/help/HelpCenterComponentPage";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { getDictionary } from "@/locales/dictionaries";

    
export default async function HelpCenterPage({ params }: BasePageProps ) {
   // Await params before accessing its properties
     const resolvedParams = await params;
     const locale = resolvedParams.locale;
     // Load translations from multiple namespaces
     const dictionary = await getDictionary(locale, ['common', 'home', 'helpcenter', 'helpCenter', 'sidebar']);
   return (
     <HelpCenterComponentPage
       dictionary={dictionary}
       locale={locale}
     />
  );
};
