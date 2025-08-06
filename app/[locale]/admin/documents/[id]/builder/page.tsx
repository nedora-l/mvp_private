import DocTemplateGrapesJSBuilder from "@/components/admin/templates/documents/doc-template-grapesjs-builder";

type DocumentTemplateDetailPageProps = {
  params: {
    locale: string;
    id: string;
  };
  searchParams?: { edit?: string };
}; 
export default async function HtmlTemplateBuilderPage({ params, searchParams }: DocumentTemplateDetailPageProps) {
    const resolvedParams = await params;
    
    return (
        <div className="space-y-6">
            <DocTemplateGrapesJSBuilder id={resolvedParams.id} locale={resolvedParams.locale} />
        </div>
    );
}
