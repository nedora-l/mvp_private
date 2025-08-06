"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getDocumentTemplateById, updateDocumentTemplate } from "@/lib/services/client/admin/templates/documents/docs.templates.client.service";
import { DocumentTemplateDto } from "@/lib/services/server/dyn_document/dynDocument.server.service";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

export default function DocTemplateGrapesJSBuilder({ id, locale }: { id: string; locale: string }) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<DocumentTemplateDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchTemplate() {
      setLoading(true);
      const response = await getDocumentTemplateById(Number(id));
      if (response.data) {
        setTemplate(response.data);
      }
      setLoading(false);
    }
    fetchTemplate();
  }, [id]);

  useEffect(() => {
    if (!containerRef.current || !template) return;
    if (editorRef.current) return;
    editorRef.current = grapesjs.init({
      container: containerRef.current as HTMLElement,
      fromElement: false,
      height: "900px",
      width: "auto",
      storageManager: false,
      plugins: [],
      components: template.content || "",
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'A4 Paper',
            width: '210mm',
            height: '297mm',
            widthMedia: '210mm',
          },
        ],
        default: 'A4 Paper',
      },
    });
    // Add ready-to-use blocks
    const blockManager = editorRef.current.BlockManager;
    blockManager.add('header', {
      label: 'Header',
      category: 'Sections',
      content: '<section style="padding:24px;text-align:center;background:linear-gradient(90deg,#e0e7ff,#f0abfc);font-size:2rem;font-weight:bold;">Header Title</section>'
    });
    blockManager.add('footer', {
      label: 'Footer',
      category: 'Sections',
      content: '<footer style="padding:16px;text-align:center;background:#f3f4f6;font-size:1rem;">Footer text</footer>'
    });
    blockManager.add('text', {
      label: 'Text',
      category: 'Basic',
      content: '<div style="padding:8px;">Insert your text here...</div>'
    });
    blockManager.add('table', {
      label: 'Table',
      category: 'Basic',
      content: '<table style="width:100%;border-collapse:collapse;"><tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Cell 1</td><td>Cell 2</td></tr></table>'
    });
    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [template]);

  // Device switcher UI
  const handleDeviceChange = (device: string) => {
    if (editorRef.current) {
      editorRef.current.setDevice(device);
    }
  };

  const handleSave = async () => {
    if (!template || !editorRef.current) return;
    setSaving(true);
    const html = editorRef.current.getHtml();
    await updateDocumentTemplate(template.id, { ...template, content: html });
    setSaving(false);
    window.location.href = `/${locale}/admin/documents/${template.id}`;
  };

  if (loading) return <div>Loading template...</div>;

  return (
    <div className="mx-auto py-8 space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-white rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">Template Builder</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleDeviceChange('Desktop')}>Desktop</Button>
          <Button variant="outline" onClick={() => handleDeviceChange('A4 Paper')}>A4 Paper</Button>
        </div>
      </div>
      <div ref={containerRef} className="border-2 border-purple-200 rounded-xl bg-white shadow-md" style={{ minHeight: 900 }} />
      <div className="flex gap-2 mt-4">
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold shadow-md">{saving ? "Saving..." : "Save"}</Button>
        <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </div>
  );
}
