"use client"

import React, { useState, useEffect } from 'react';
import { ProjectDto } from '@/lib/services/client/projects';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
 
import { useI18n } from '@/lib/i18n/use-i18n';
import { Dictionary } from '@/locales/dictionary';
 

interface ProjectsApiDemoProps {
  previewProject: ProjectDto;
  dictionary: Dictionary;
}

export const ProjectsApiDemo: React.FC<ProjectsApiDemoProps> = ({ dictionary, previewProject }) => {
  const { t } = useI18n(dictionary);

  const [error, setError] = useState<string | null>(null); 
  
  return (
          <div className="space-y-6 py-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex justify-between items-center">
                  <span>Error: {error}</span>
                  <Button variant="outline" size="sm" >
                    {t('projects.actions.retry')}
                  </Button>
                </div>
              </div>
            )}
              {/* Project Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{previewProject.title}</h3>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant={previewProject.isActive ? "default" : "secondary"}>
                      {previewProject.isActive ? t('projects.status.active') : t('projects.status.inactive')}
                    </Badge>
                    {previewProject.isArchived && (
                      <Badge variant="outline">{t('projects.status.archived')}</Badge>
                    )}
                  </div>
                </div>
                
                {previewProject.description && (
                  <div>
                    <Label className="text-sm font-medium">{t('projects.labels.description')}</Label>
                    <p className="text-sm text-muted-foreground mt-1">{previewProject.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {previewProject.startsAt && (
                    <div>
                      <Label className="text-sm font-medium">{t('projects.labels.startDate')}</Label>
                      <p className="text-muted-foreground">{new Date(previewProject.startsAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  {previewProject.endsAt && (
                    <div>
                      <Label className="text-sm font-medium">{t('projects.labels.endDate')}</Label>
                      <p className="text-muted-foreground">{new Date(previewProject.endsAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  {previewProject.budget && (
                    <div>
                      <Label className="text-sm font-medium">{t('projects.labels.budget_label')}</Label>
                      <p className="text-muted-foreground">${previewProject.budget.toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium">{t('projects.labels.created_label')}</Label>
                    <p className="text-muted-foreground">{new Date(previewProject.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Project Members Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-semibold">{t('projects.members.title')}</h4>
                </div>
              </div>
            </div>
  );
};
