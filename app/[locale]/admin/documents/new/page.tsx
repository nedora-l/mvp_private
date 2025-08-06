import { getDictionary } from "@/locales/dictionaries";
import { NewDocumentTemplateForm } from "@/components/admin/templates/documents/new-document-template-form";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";

export default async function NewDocumentTemplatePage({ params }: BasePageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dictionary = await getDictionary(locale, ["common", "admin"]);

  return (
    <div className="space-y-6">
      <NewDocumentTemplateForm dictionary={dictionary} locale={locale} />
    </div>
  );
}
