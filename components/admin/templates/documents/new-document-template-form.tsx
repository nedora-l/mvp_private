"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createDocumentTemplate } from "@/lib/services/client/admin/templates/documents/docs.templates.client.service";
import { Dictionary } from "@/locales/dictionary";
import { CreateDocumentTemplateRequest } from "@/lib/services/server/dyn_document/dynDocument.server.service";

interface NewDocumentTemplateFormProps {
  dictionary: Dictionary;
  locale: string;
}

export function NewDocumentTemplateForm({ dictionary, locale }: NewDocumentTemplateFormProps) {
    
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    description: "",
    category: "",
    content: "",
    format: "HTML", // Default format
    status: "DRAFT"
  } as CreateDocumentTemplateRequest);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await createDocumentTemplate(form);
    setLoading(false);
    router.push(`/${locale}/admin/documents`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Document Template</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <Input name="displayName" placeholder="Display Name" value={form.displayName} onChange={handleChange} required />
          <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <Select value={form.format} onValueChange={v => handleSelect('format', v)}>
            <SelectTrigger><SelectValue placeholder="Format" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
          <Textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
          <Select value={form.status} onValueChange={v => handleSelect('status', v)}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
              <SelectItem value="TESTING">Testing</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>Create</Button>
        </form>
      </CardContent>
    </Card>
  );
}
