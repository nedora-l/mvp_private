import { getDictionary } from "@/locales/dictionaries";
import { DocumentTemplateDetailView } from "@/components/admin/templates/documents/document-template-detail-view";
import { EditDocumentTemplateForm } from "@/components/admin/templates/documents/edit-document-template-form";

type EmailTemplateDetailPageProps = {
  params: {
    locale: string;
    id: string;
  };
  searchParams: { edit?: string };
};
export default async function DocumentTemplatePage({ params, searchParams }: EmailTemplateDetailPageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dictionary = await getDictionary(locale, ["common", "admin"]);
  const templateId = resolvedParams.id;
  const isEdit = searchParams?.edit === "true";

  return (
    <div className="space-y-6">
      {isEdit ? (
        <EditDocumentTemplateForm templateId={templateId} dictionary={dictionary} locale={locale} />
      ) : (
        <DocumentTemplateDetailView templateId={templateId} dictionary={dictionary} locale={locale} />
      )}
    </div>
  );
}
