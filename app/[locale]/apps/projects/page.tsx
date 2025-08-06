
import ProjectsDashboardClient from "@/components/projects/ProjectsDashboardClient";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";

export default function ProjectsDashboardPage({ params }: BasePageProps ) {
  return <ProjectsDashboardClient params={params} />;
}
