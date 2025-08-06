"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import Link from "next/link";
import { useI18n } from "@/lib/i18n/use-i18n";
import { AppComponentDictionaryProps, BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import AddTopicModal, { availableIcons } from "./AddTopicModal";
import { toast } from "sonner";

import { useSession } from "next-auth/react"
import { helpCenterTopics } from "@/lib/data/help-center-data";

interface DirectoriesTabsClientProps extends AppComponentDictionaryProps {
  
}



export interface topicData { 
  slug: string;
  title: string;
  description: string;
  iconName: string; // Adjust type as needed
}


const HelpCenterComponentPage = ({ 
  dictionary, 
  locale   
}: DirectoriesTabsClientProps) => {
  const { t } = useI18n(dictionary);
  // Toast via sonner (imported above)
  const [topics, setTopics] = useState(helpCenterTopics);

  const { data: session, status } = useSession();
  const currentUser = session?.user || null;

  const isAdmin:boolean = currentUser?.roles?.includes("ROLE_ADMIN") || false;

  return (
    <div className="bg-[#F6F6F7] dark:bg-slate-900 text-foreground min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <header className="relative bg-[#404EED] text-white rounded-2xl overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
          >
             <svg className="absolute -bottom-1 left-0 w-full h-auto text-white" fill="currentColor" viewBox="0 0 1440 120"><path d="M1440 120H0V0c0 66.27 53.73 120 120 120h1200c66.27 0 120-53.73 120-120v120z"></path></svg>
          </div>
          <div className="container mx-auto px-4 py-20 relative z-10">
           
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t('header.title')}</h1>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder={t('search.placeholder')}
                className="w-full pl-12 pr-4 py-6 text-lg rounded-md bg-white text-gray-900 border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#404EED] focus:ring-white"
              />
            </div>
          </div>
          </div>
        </header>

        {/* Topics Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-4">{t('topics.title')}</h2>
            <p className="text-center text-muted-foreground mb-10">
              {t('topics.description')}
              <br/>{t('topics.newUserHelp')} 
              <Link href="#"  className="text-primary hover:underline">{t('topics.beginnersGuide')}</Link>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {topics.map((topic, index) => (
                <Link href={`/${locale}/apps/helpcenter/${topic.slug}`} key={index} className="group">
                  <Card className="text-center bg-white hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-center items-center p-6 border border-gray-200 rounded-lg">
                      <div className="mb-4"><topic.icon className="h-8 w-8 text-indigo-500" /></div>
                      <h3 className="text-xl font-semibold mb-2 text-primary">{  t(topic.key) || topic.title }</h3>
                      <p className="text-muted-foreground text-sm">{ t(topic.keyDesc) || topic.description }</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        
        {/* Contact Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">{t('contact.title')}</h2>
            <Link href={`/${locale}/apps/helpcenter/contact`}>
              <Button size="lg" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5">{t('contact.submitRequest')}</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenterComponentPage;

        {/* Header Section <div className="flex justify-between items-start mb-8">
            <div className="flex-1"></div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={refreshTopics}
              >
                {t('admin.refresh')}
              </Button>
              {isAdmin && (
                <AddTopicModal onAddTopic={handleAddTopic} />
              )}
            </div>
          </div>*/}
          
        {/* Featured Articles Section<section className="py-16 bg-white rounded-2xl">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Featured articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article, index) => (
                   <Link href={`/${locale}/apps/helpcenter/${article.topicSlug}/${article.articleSlug}`} key={index} className="group">
                      <Card className="shadow-none hover:shadow-lg transition-shadow duration-300 h-full border-0">
                          <CardContent className="p-6">
                              <p className="text-sm text-primary font-semibold mb-2">{article.category}</p>
                              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{article.title}</h3>
                          </CardContent>
                      </Card>
                   </Link>
              ))}
            </div>
          </div>
        </section>
 */}
  /**
   * 
  const [topicsDb, setTopicsDb] = useState<topicData[]>([]);
  const saveTopicToDatabase = async (topicData: {
    slug: string;
    title: string;
    description: string;
    icon: any;
  }) => {
    try {
      // Use the specialized help center data service
      const savedRecord = await HelpCenterDataService.saveCategory({
        slug: topicData.slug,
        title: topicData.title,
        description: topicData.description,
        iconName: topicData.icon.name || 'default-icon',
        isPublic: true,
        metadata: {
          createdBy: currentUser?.id || 'system',
          createdAt: new Date().toISOString(),
          source: 'help-center-ui'
        }
      });

      console.log('Topic saved successfully:', savedRecord);
      
      toast({
        title: t('messages.topicSaved'),
        description: t('messages.topicSavedDescription', { title: topicData.title }),
      });

      // Refresh the topics list to include the new record
      await refreshTopics();
      
      return savedRecord;
    } catch (error) {
      console.error("Error saving topic:", error);
      
      toast({
        title: t('messages.saveError'),
        description: t('messages.saveErrorDescription', { error: error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite' }),
        variant: "destructive"
      });
      
      throw error;
    }
  };
  const handleAddTopic = async (newTopic: {
    slug: string;
    title: string;
    description: string;
    icon: any;
  }) => {
    try {
      // First save to database
      const savedRecord = await saveTopicToDatabase(newTopic);
      
      // Then update local state
      const topicWithArticles = {
        ...newTopic,
        id: savedRecord.id, // Include the database ID
        articles: []
      };
      setTopics(prev => [...prev, topicWithArticles]);
      
      toast({
        title: t('messages.topicAdded'),
        description: t('messages.topicAddedDescription', { title: newTopic.title }),
      });
    } catch (error) {
      // Error handling is done in saveTopicToDatabase
      console.error("Failed to add topic:", error);
    }
  };
  const refreshTopics = async () => {
    try {
      const responseOQL = await executeOqlQueryClientApi('SELECT iconName, slug, title, description FROM HelpCenter_Category__c');
      console.log("responseOQL.data");
      console.log(responseOQL,responseOQL.data);
      const oqlData  = responseOQL.data;
      if (!oqlData || Object.keys(oqlData).length === 0) {
        console.warn("No data found in OQL response");
        return;
      }
      else {
        console.log("OQL data fetched successfully");
        console.log(oqlData);
        const dbTopics: topicData[] = []; 
        for(const key in oqlData) {
          if (oqlData.hasOwnProperty(key)) {
            const record = oqlData[key];
            dbTopics.push({
              slug: record.data?.slug || "",
              title: record.data?.title || "",
              description: record.data?.description || "",
              iconName: record.data?.iconName || ""
            });
          }
        }
        setTopicsDb(dbTopics);
      }
    
    } catch (error) {
        console.error("Error fetching topics:", error);
    }
  };

  const featuredArticles = [];

   */
