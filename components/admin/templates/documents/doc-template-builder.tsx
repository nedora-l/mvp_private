"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDocumentTemplateById, updateDocumentTemplate } from "@/lib/services/client/admin/templates/documents/docs.templates.client.service";
import { DocumentTemplateDto } from "@/lib/services/server/dyn_document/dynDocument.server.service";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

const FREEMARKER_VARIABLES = [
  "${customerName}",
  "${totalAmount}",
  "${report.clientName}",
  "${report.reportDate}",
  "<#if condition>",
  "</#if>",
  "<#list items as item>",
  "</#list>",
  "${item.name}",
];

const FREEMARKER_SNIPPETS = [
  {
    label: "If/Else Block",
    snippet: `<#if condition>\n  ...\n<#else>\n  ...\n</#if>`
  },
  {
    label: "List Loop",
    snippet:  "<#list items as item>\n   ${item}\n</#list>"
  },
  {
    label: "Variable",
    snippet: "${variableName}"
  }
];

type DocumentTemplateDetailPageProps = {
  params: {
    locale: string;
    id: string;
  };
  searchParams?: { edit?: string };
};
export default function HtmlTemplateBuilderComponent({ params, searchParams }: DocumentTemplateDetailPageProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<DocumentTemplateDto | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sampleData, setSampleData] = useState({
    customerName: "John Doe",
    totalAmount: "$123.45",
    "report.clientName": "Acme Corp",
    "report.reportDate": "2025-06-27",
    item: { name: "Widget" },
  });

  useEffect(() => {
    async function fetchTemplate() {
      setLoading(true);
      const response = await getDocumentTemplateById(Number(params.id));
      if (response.data) {
        setTemplate(response.data);
        setContent(response.data.content || "");
      }
      setLoading(false);
    }
    fetchTemplate();
  }, [params.id]);

  const handleInsertVariable = (variable: string) => {
    setContent((prev) => prev + variable);
  };

  const handleInsertSnippet = (snippet: string) => {
    setContent((prev) => prev + snippet);
  };

  const renderPreview = (html: string) => {
    let rendered = html;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\\{${key.replace(/\./g, '\\.')}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    });
    return rendered;
  };

  const handleSave = async () => {
    if (!template) return;
    setSaving(true);
    await updateDocumentTemplate(template.id, { ...template, content });
    setSaving(false);
    router.push(`/${params.locale}/admin/documents/${template.id}`);
  };

  if (loading) return <div>Loading template...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">HTML Template Builder</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        {FREEMARKER_VARIABLES.map((v) => (
          <Button key={v} variant="outline" size="sm" onClick={() => handleInsertVariable(v)}>
            {v}
          </Button>
        ))}
        {FREEMARKER_SNIPPETS.map((s) => (
          <Button key={s.label} variant="secondary" size="sm" onClick={() => handleInsertSnippet(s.snippet)}>
            {s.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <ReactQuill value={content} onChange={setContent} theme="snow" className="bg-white" />
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Button variant={showPreview ? "default" : "outline"} size="sm" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? "Hide Preview" : "Show Live Preview"}
            </Button>
          </div>
          {showPreview && (
            <div className="border rounded bg-gray-50 p-4 overflow-auto" style={{ minHeight: 300 }}>
              <div dangerouslySetInnerHTML={{ __html: renderPreview(content) }} />
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </div>
  );
}
