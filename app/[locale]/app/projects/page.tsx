
import {ProjectsApiDemo} from '@/components/projects/ProjectsApiDemo';
import { BasePageProps } from '@/lib/interfaces/common/dictionary-props-component';
import { getDictionary } from '@/locales/dictionaries';

export default  async function ProjectsListPage({ params }: BasePageProps ) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const curLocale = resolvedParams.locale;
  // Load translations from multiple namespaces
  const dictionary = await getDictionary(curLocale, ['common', 'projects']);
  
  return (
    <div className="w-full">
      <ProjectsApiDemo dictionary={dictionary} />
    </div>
  );
}
