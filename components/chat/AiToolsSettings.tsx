"use client";

import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Trash2, Save, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dictionary } from '@/locales/dictionary';
import { useI18n } from '@/lib/i18n/use-i18n';



interface AiToolsSettingsProps {
  dictionary: Dictionary;
}

const AiToolsSettings: React.FC<AiToolsSettingsProps> = ({ dictionary }) => {
  const { t } = useI18n(dictionary);
  const [apiKey, setApiKey] = useState('sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx'); // Mock API key, not for translation
  const [showApiKey, setShowApiKey] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');
  const [autoSuggest, setAutoSuggest] = useState(true);
  const [enableHistory, setEnableHistory] = useState(true);

  const handleSaveSettings = () => {
    console.log('Settings saved:', {
      apiKey,
      temperature,
      selectedModel,
      autoSuggest,
      enableHistory,
    });
    // Add actual save logic here
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings size={24} className="text-primary" />
            <CardTitle>{t('chat.settings.title') || "AI Tools Settings"}</CardTitle>
          </div>
          <CardDescription>{t('chat.settings.description') || "Customize your AI assistant's behavior and preferences."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Setting */}
          <div className="space-y-2">
            <Label htmlFor="api-key">{t('chat.settings.apiKeyLabel') || "API Key"}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('chat.settings.apiKeyPlaceholder') || "Enter your API key"}
              />
              <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)} aria-label={showApiKey ? t('chat.settings.hideApiKeyLabel') || "Hide API Key" : t('chat.settings.showApiKeyLabel') || "Show API Key"}>
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model-select">{t('chat.settings.modelLabel') || "AI Model"}</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="model-select" aria-label={t('chat.settings.modelLabel') || "Select AI Model"}>
                <SelectValue placeholder={t('chat.settings.modelPlaceholder') || "Select a model"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4-turbo">{t('chat.settings.modelGpt4Turbo') || "GPT-4 Turbo"}</SelectItem>
                <SelectItem value="claude-3-opus">{t('chat.settings.modelClaude3Opus') || "Claude 3 Opus"}</SelectItem>
                <SelectItem value="gemini-pro">{t('chat.settings.modelGeminiPro') || "Gemini Pro"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="temperature">{t('chat.settings.temperatureLabel') || "Creativity (Temperature)"}</Label>
              <span className="text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
              aria-label={t('chat.settings.temperatureLabel') || "Adjust Creativity Temperature"}
            />
            <p className="text-xs text-muted-foreground flex items-center">
              <Info size={12} className="mr-1 text-primary" />
              {t('chat.settings.temperatureDescription') || "Lower values are more deterministic, higher values are more creative."}
            </p>
          </div>

          {/* Boolean Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
              <Label htmlFor="auto-suggest" className="flex flex-col space-y-1">
                <span>{t('chat.settings.autoSuggestLabel') || "Enable Auto-Suggestions"}</span>
                <span className="font-normal leading-snug text-muted-foreground text-xs">
                  {t('chat.settings.autoSuggestDescription') || "Get helpful suggestions as you type."}
                </span>
              </Label>
              <Switch
                id="auto-suggest"
                checked={autoSuggest}
                onCheckedChange={setAutoSuggest}
                aria-label={t('chat.settings.autoSuggestLabel') || "Toggle Auto-Suggestions"}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
              <Label htmlFor="enable-history" className="flex flex-col space-y-1">
                <span>{t('chat.settings.enableHistoryLabel') || "Enable Chat History"}</span>
                <span className="font-normal leading-snug text-muted-foreground text-xs">
                  {t('chat.settings.enableHistoryDescription') || "Save your conversations for later reference."}
                </span>
              </Label>
              <Switch
                id="enable-history"
                checked={enableHistory}
                onCheckedChange={setEnableHistory}
                aria-label={t('chat.settings.enableHistoryLabel') || "Toggle Chat History"}
              />
            </div>
          </div>
          
          {/* Advanced Options & Data Management */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground">{t('chat.settings.advancedOptionsTitle') || "Advanced Options"}</h4>
            <Button variant="outline" className="w-full justify-start">
              <Settings size={16} className="mr-2" /> {t('chat.settings.configureToolsButton') || "Configure Integrated Tools"}
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 size={16} className="mr-2" /> {t('chat.settings.clearHistoryButton') || "Clear Chat History"}
            </Button>
             <p className="text-xs text-muted-foreground flex items-center">
              <Info size={12} className="mr-1 text-destructive" />
              {t('chat.settings.clearHistoryWarning') || "This action cannot be undone."}
            </p>
          </div>

          {/* Save Button */}
          <Button onClick={handleSaveSettings} className="w-full mt-4">
            <Save size={18} className="mr-2" /> {t('chat.settings.saveButton') || "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default AiToolsSettings;
