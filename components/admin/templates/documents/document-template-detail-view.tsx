"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDocumentTemplateById } from "@/lib/services/client/admin/templates/documents/docs.templates.client.service";
import { Dictionary } from "@/locales/dictionary";

interface DocumentTemplateDetailViewProps {
  templateId: string;
  dictionary: Dictionary;
  locale: string;
}

export function DocumentTemplateDetailView({ templateId, dictionary, locale }: DocumentTemplateDetailViewProps) {
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTemplate() {
      setLoading(true);
      const response = await getDocumentTemplateById(Number(templateId));
      setTemplate(response.data);
      setLoading(false);
    }
    fetchTemplate();
  }, [templateId]);

  if (loading) return <div>Loading...</div>;
  if (!template) return <div>Template not found.</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.displayName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-muted-foreground">{template.description}</div>
        <div><b>Category:</b> {template.category || 'General'}</div>
        <div><b>Status:</b> {template.status}</div>
        <div><b>Format:</b> {template.format}</div>
        <div className="mt-4">
          <b>Content:</b>
          <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">{template.content}</pre>
        </div>
        <div className="mt-6 flex gap-2">
          <Button onClick={() => router.push(`/${locale}/admin/documents/${template.id}?edit=true`)}>Edit</Button>
          <Button variant="outline" onClick={() => router.push(`/${locale}/admin/documents`)}>Back</Button>
        </div>
      </CardContent>
    </Card>
  );
}
