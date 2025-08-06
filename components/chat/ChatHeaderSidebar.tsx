"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {  MessageSquare, Palette, FileText } from 'lucide-react'; // Added X for mobile close
import { Dictionary } from '@/locales/dictionary';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from '@/lib/i18n/use-i18n'; // Import useI18n
import { ChatSessionResponseDto } from '@/lib/interfaces/apis/chat';


interface ChatPageSidebarProps {
   locale: string;
   dictionary: Dictionary;
   sessionId?: string; 
   chatSession: ChatSessionResponseDto | null; 
}

const ChatHeaderSidebar: React.FC<ChatPageSidebarProps> = ({ dictionary, locale, sessionId, chatSession }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n(dictionary); 
  return (
    <div className="p-4 flex flex-col gap-6 h-full">
        <div className="flex items-center gap-2">
          <MessageSquare size={24} className="text-primary" />
          <h2 className="text-xl font-semibold">{t('chat.page.settingsTitle') || "AI Chat Settings"}</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              <Palette size={18} />
              {t('chat.page.modelTitle') || "Model Configuration"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-model">{t('chat.page.modelLabel') || "AI Model"}</Label>
              <Select defaultValue="gemini-pro">
                <SelectTrigger id="ai-model" aria-label={t('chat.page.modelLabel') || "Select AI Model"}>
                  <SelectValue placeholder={t('chat.page.selectModelPlaceholder') || "Select a model"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">{t('chat.page.temperatureLabel') || "Temperature"}</Label>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                defaultValue={[0.7]}
                aria-label={t('chat.page.temperatureLabel') || "Adjust Temperature"}
                className="my-3" // Added margin for better spacing
              />
              <p className="text-xs text-muted-foreground pt-1">
                {t('chat.page.temperatureDescription') || "Controls randomness. Lower is more deterministic."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              <FileText size={18} />
              {t('chat.page.contextFilesLabel') || "Context & Attachments"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-grow flex flex-col">
            <Button variant="outline" size="sm" className="w-full">
              {t('chat.page.uploadFileButton') || "Upload File"}
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              {t('chat.page.fileSizeLimit') || "Max file size: 5MB"}
            </div>
            <ScrollArea className="flex-grow mt-2 p-2 border rounded-md h-20">
              <div className="text-xs text-muted-foreground">
                {t('chat.page.noFilesUploaded') || "No files uploaded yet. Drag and drop or click upload."}
              </div>
              {/* Example of uploaded files list - can be dynamic */}
              <ul className="text-xs space-y-1 mt-1">
                <li>📄 document1.pdf</li>
                <li>📄 notes_final.txt</li>
              </ul> 
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
  );
};

export default ChatHeaderSidebar;
