"use client"

import React, { useState, useEffect } from 'react';
import { ProjectDto, ProjectRequestDto, ProjectMemberDto, AddProjectMemberRequestDto, ProjectRoleDto } from '@/lib/services/client/projects';
import { useProjectsApi } from '@/lib/hooks/useProjectsApi';
import { directoryApiClient } from '@/lib/services/client/directory/directory.client.service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { CalendarIcon, Plus, Pencil, Trash2, Building, DollarSign, Calendar, Users, Search, Loader2, Shield, UserPlus, X, RefreshCw, ExternalLink, Link2, Download, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiResponse, AppEmployee, HateoasResponse, mockProjectFinancialSummary } from "@/lib/interfaces/apis";
import { useI18n } from '@/lib/i18n/use-i18n';
import { Dictionary } from '@/locales/dictionary';
import { ProjectAtimeusIndicatorsCard } from './ProjectAtimeusIndicatorsCard';
import { AtimeusSvgLogo } from './AtimeusLogo';

// Helper function to generate initials from project title
const getProjectInitials = (title: string): string => {
  return title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

interface ProjectsApiDemoProps {
  dictionary: Dictionary;
}

export const ProjectsApiDemo: React.FC<ProjectsApiDemoProps> = ({ dictionary }) => {
  const { t } = useI18n(dictionary);

  const { apiClient, isAuthenticated, session } = useProjectsApi();
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);
  //Atimeus
  const [isAtimeusDialogOpen, setIsAtimeusDialogOpen] = useState(false);
  const [atimeusProject, setAtimeusProject] = useState<ProjectDto | null>(null);
  const [formData, setFormData] = useState<ProjectRequestDto>({
    title: '',
    description: '',
    startsAt: '',
    endsAt: '',
    isActive: true,
    isArchived: false,
    budget: 0
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Project preview and member management state
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<ProjectDto | null>(null);
  const [projectMembers, setProjectMembers] = useState<ProjectMemberDto[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [memberFormData, setMemberFormData] = useState<AddProjectMemberRequestDto>({
    memberId: 0,
    roleId: ''
  });
  
  // Employees selection state
  const [employees, setEmployees] = useState<AppEmployee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  // Project roles selection state
  const [projectRoles, setProjectRoles] = useState<ProjectRoleDto[]>([]);
  const [loadingProjectRoles, setLoadingProjectRoles] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  // SSO Connection state
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'generating' | 'ready' | 'completed'>('generating');
  const [ssoUrl, setSsoUrl] = useState<string>('');
  const [generatingProgress, setGeneratingProgress] = useState(0);

  // Load projects on component mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    } else {
      setLoading(false);
      setProjects([]);
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getProjects({
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        query: searchQuery || undefined
      });
      
      console.log('API Response:', response);
      console.log('Response structure:', {
        hasData: !!response?.data,
        hasEmbedded: !!response?.data?._embedded,
        embeddedKeys: response?.data?._embedded ? Object.keys(response.data._embedded) : [],
        embeddedContent: response?.data?._embedded
      });
      
      // Handle the API response structure
      if (response && response.data) {
        if (response.data.content && response.data.content.length > 0) {
          const projectsList = response.data.content as ProjectDto[];
          console.log('Found projects in content :', projectsList);
          setProjects(projectsList || []);
        } else if (response.data._embedded && response.data._embedded.projects) {
          // HATEOAS response structure with projects property
          const projectsList = response.data._embedded.projects as ProjectDto[];
          console.log('Found projects in HATEOAS structure:', projectsList);
          setProjects(projectsList || []);
        } else if (response.data._embedded) {
          // HATEOAS response structure - try to get first value
          const firstEmbeddedValue = Object.values(response.data._embedded)[0];
          if (Array.isArray(firstEmbeddedValue)) {
            console.log('Found projects in first embedded value:', firstEmbeddedValue);
            setProjects(firstEmbeddedValue as ProjectDto[]);
          } else {
            console.log('First embedded value is not an array:', firstEmbeddedValue);
            setProjects([]);
          }
        } else if (Array.isArray(response.data)) {
          // Direct array response
          console.log('Found projects as direct array:', response.data);
          setProjects(response.data);
        } else {
          // Single project or other structure
          console.log('No projects found in response structure');
          setProjects([]);
        }
      } else {
        console.log('No response data found');
        setProjects([]);
      }
    } catch (err: any) {
      console.error('Failed to load projects:', err);
      setError(err.message || t('projects.errors.loadProjects'));
      setProjects([]);
      toast.error(t('projects.errors.loadProjects'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!formData.title.trim()) {
      toast.error(t('projects.errors.titleRequired'));
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.createProject(formData);
      console.log('Created project:', response);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        startsAt: '',
        endsAt: '',
        isActive: true,
        isArchived: false,
        budget: 0
      });
      setIsCreateDialogOpen(false);
      
      // Reload the projects list
      await loadProjects();
      
      toast.success(t('projects.success.projectCreated'));
    } catch (err: any) {
      console.error('Failed to create project:', err);
      toast.error(err.message || t('projects.errors.createProject'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = async () => {
    if (!editingProject || !formData.title.trim()) {
      toast.error(t('projects.errors.titleRequired'));
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.updateProject(editingProject.id, formData);
      console.log('Updated project:', response);
      
      setIsEditDialogOpen(false);
      setEditingProject(null);
      
      // Reload the projects list
      await loadProjects();
      
      toast.success(t('projects.success.projectUpdated'));
    } catch (err: any) {
      console.error('Failed to update project:', err);
      toast.error(err.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (project: ProjectDto) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      startsAt: project.startsAt || '',
      endsAt: project.endsAt || '',
      isActive: project.isActive ?? true,
      isArchived: project.isArchived ?? false,
      budget: project.budget || 0
    });
    setIsEditDialogOpen(true);
  };

  const openAtimeusDialog = (project: ProjectDto) => {
    setAtimeusProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      startsAt: project.startsAt || '',
      endsAt: project.endsAt || '',
      isActive: project.isActive ?? true,
      isArchived: project.isArchived ?? false,
      budget: project.budget || 0
    });
    setIsAtimeusDialogOpen(true);
  };

  const handleDeleteProject = async (projectId: string, projectTitle: string) => {
    if (!window.confirm(`${t('projects.confirmations.deleteProject')} "${projectTitle}"${t('projects.confirmations.deleteProjectSuffix')} ${t('projects.confirmations.actionCannotBeUndone')}`)) {
      return;
    }

    try {
      await apiClient.deleteProject(projectId);
      console.log('Deleted project:', projectId);
      
      // Reload the projects list
      await loadProjects();
      
      toast.success(t('projects.success.projectDeleted'));
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      toast.error(err.message || 'Failed to delete project');
    }
  };

  const openProjectPreview = async (project: ProjectDto) => {
    setPreviewProject(project);
    setIsPreviewDialogOpen(true);
    // Load project members, employees, and project roles data
    await Promise.all([
      loadProjectMembers(project.id),
      fetchEmployees(),
      fetchProjectRoles()
    ]);
  };

  const loadProjectMembers = async (projectId: string) => {
    try {
      setLoadingMembers(true);
      const response = await apiClient.getProjectMembers(projectId, {
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      
      console.log('Project members response:', response);
      console.log('Project members response content:', response.data.content);

      // Handle the API response structure for members
      if (response && response.data.content) {
        // If the response has a content array, use it directly
        if (Array.isArray(response.data.content)) {
          console.log('Found project members in content array:', response.data.content);
          setProjectMembers(response.data.content as ProjectMemberDto[]);
            console.log('projectMembers array:', projectMembers);

        } else {
          console.log('No project members found in content array');
          setProjectMembers([]);
        }
      }
      
    } catch (err: any) {
      console.error('Failed to load project members:', err);
      setProjectMembers([]);
      toast.error('Failed to load project members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAddMember = async () => {
    if (!previewProject || !memberFormData.memberId || !memberFormData.roleId.trim()) {
      toast.error('Please select an employee and a project role');
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.addProjectMember(previewProject.id, memberFormData);
      console.log('Added member:', response);
      
      // Reset form
      setSelectedEmployeeId('');
      setSelectedRoleId('');
      setMemberFormData({
        memberId: 0,
        roleId: ''
      });
      setIsAddMemberDialogOpen(false);
      
      // Reload the members list
      await loadProjectMembers(previewProject.id);
      
      toast.success('Member added successfully!');
    } catch (err: any) {
      console.error('Failed to add member:', err);
      toast.error(err.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!previewProject) return;
    
    if (!window.confirm(`Are you sure you want to remove "${memberName}" from this project?`)) {
      return;
    }

    try {
      await apiClient.removeProjectMember(previewProject.id, memberId);
      console.log('Removed member:', memberId);
      
      // Reload the members list
      await loadProjectMembers(previewProject.id);
      
      toast.success('Member removed successfully!');
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      toast.error(err.message || 'Failed to remove member');
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const results: ApiResponse<HateoasResponse<AppEmployee>> = await directoryApiClient.getEmployees({
        query: "",
        page: 0,
        size: 100
      });
      
      if (results.status === 200 && results.data) {
        setEmployees(results.data._embedded?.userEmployeeDtoList || []);
      } else if (results.error) {
        console.error('Failed to fetch employees:', results.error);
        toast.error('Failed to load employees');
      }
    } catch (err: any) {
      console.error('Failed to fetch employees:', err);
      toast.error('Failed to load employees');
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchProjectRoles = async () => {
    try {
      setLoadingProjectRoles(true);
      const response = await apiClient.getProjectRoles({
        page: 0,
        size: 100,
        sortBy: 'title',
        sortDirection: 'asc'
      });
      
      console.log('Project roles response:', response);
      
      // Handle the API response structure for project roles
      if (response && response.content && Array.isArray(response.content)) {
          console.log('Found project roles in content array:', response.content);
          setProjectRoles(response.content as ProjectRoleDto[]);
        } else if (response && response.data) {
        // First try the direct content array (which is what the API returns)
        if (response.data.content && Array.isArray(response.data.content)) {
          console.log('Found project roles in content array:', response.data.content);
          setProjectRoles(response.data.content as ProjectRoleDto[]);
        } else  if (response.data.content && Array.isArray(response.data.content)) {
          console.log('Found project roles in content array:', response.data.content);
          setProjectRoles(response.data.content as ProjectRoleDto[]);
        } else if (response.data._embedded && response.data._embedded.projectRoles) {
          setProjectRoles(response.data._embedded.projectRoles as ProjectRoleDto[]);
        } else if (response.data._embedded) {
          const firstEmbeddedValue = Object.values(response.data._embedded)[0];
          if (Array.isArray(firstEmbeddedValue)) {
            setProjectRoles(firstEmbeddedValue as ProjectRoleDto[]);
          } else {
            setProjectRoles([]);
          }
        } else if (Array.isArray(response.data)) {
          setProjectRoles(response.data);
        } else {
          console.log('No project roles found in response structure');
          setProjectRoles([]);
        }
      } else {
        console.log('No response data found');
        setProjectRoles([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch project roles:', err);
      toast.error('Failed to load project roles');
      setProjectRoles([]);
    } finally {
      setLoadingProjectRoles(false);
    }
  };

  const handleAddMemberFormOpen = () => {
    setIsAddMemberDialogOpen(true);
    // Reset form data
    setSelectedEmployeeId('');
    setSelectedRoleId('');
    setMemberFormData({
      memberId: 0,
      roleId: ''
    });
    // Fetch employees and project roles when dialog opens
    Promise.all([
      fetchEmployees(),
      fetchProjectRoles()
    ]);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    const selectedEmployee = employees.find(emp => emp.id?.toString() === employeeId);
    if (selectedEmployee && selectedEmployee.id) {
      setSelectedEmployeeId(employeeId);
      setMemberFormData({ 
        ...memberFormData, 
        memberId: typeof selectedEmployee.id === 'string' ? parseInt(selectedEmployee.id, 10) : selectedEmployee.id 
      });
    }
  };

  const handleRoleSelect = (roleId: string) => {
    const selectedRole = projectRoles.find(role => role.id === roleId);
    if (selectedRole) {
      setSelectedRoleId(roleId);
      setMemberFormData({ 
        ...memberFormData, 
        roleId: selectedRole.id 
      });
    }
  };

  const handleConnectToOrg = () => {
    setIsConnectDialogOpen(true);
    setConnectionStep('generating');
    setGeneratingProgress(0);
    setSsoUrl('');
    
    // Mock the SSO URL generation process
    const generateSsoUrl = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 10; // Random increment between 10-30
        
        if (progress >= 100) {
          setGeneratingProgress(100);
          setTimeout(() => {
            setSsoUrl('https://login.salesforce.com');
            setConnectionStep('ready');
          }, 500);
          clearInterval(interval);
        } else {
          setGeneratingProgress(Math.min(progress, 95));
        }
      }, 300);
    };
    
    // Start generation after a brief delay
    setTimeout(generateSsoUrl, 300);
  };

  const handleSsoRedirect = () => {
    if (ssoUrl) {
      // In a real implementation, this would open the SSO URL
      toast.success("Redirecting to organization login...");
      setConnectionStep('completed');
      
      // Close the dialog after a brief delay
      setTimeout(() => {
        setIsConnectDialogOpen(false);
        // Reset state for next time
        setTimeout(() => {
          setConnectionStep('generating');
          setGeneratingProgress(0);
          setSsoUrl('');
        }, 300);
      }, 2000);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('projects.title')}</h1>
        </div>
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            {t('projects.auth.signInMessage')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('projects.title')}</h1>
        </div>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('projects.loading.projects')}</span>
        </div>
      </div>
    );
  } 
 
  return (
    <div className="space-y-6 p-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('projects.title')}</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('projects.actions.newProject')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('projects.dialogs.createProject')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">{t('projects.form.titleRequired')}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t('projects.form.placeholders.title')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{t('projects.form.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('projects.form.placeholders.description')}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startsAt">{t('projects.form.startDate')}</Label>
                  <Input
                    id="startsAt"
                    type="date"
                    value={formData.startsAt}
                    onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endsAt">{t('projects.form.endDate')}</Label>
                  <Input
                    id="endsAt"
                    type="date"
                    value={formData.endsAt}
                    onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">{t('projects.form.budget')}</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                  />
                  <Label htmlFor="isActive">{t('projects.form.active')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isArchived"
                    checked={formData.isArchived}
                    onCheckedChange={(checked) => setFormData({ ...formData, isArchived: checked as boolean })}
                  />
                  <Label htmlFor="isArchived">{t('projects.form.archived')}</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('projects.actions.cancel')}
              </Button>
              <Button onClick={handleCreateProject} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('projects.actions.creating')}
                  </>
                ) : (
                  t('projects.actions.create')
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>Error: {error}</span>
            <Button variant="outline" size="sm" onClick={loadProjects}>
              {t('projects.actions.retry')}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('projects.search.placeholder')} 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={loadProjects}>
          {t('projects.actions.refresh')}
        </Button>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">{t('projects.views.gridView')}</TabsTrigger>
          <TabsTrigger value="list">{t('projects.views.listView')}</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">{t('projects.empty.noProjects')}</p>
                <p className="text-sm text-muted-foreground">{t('projects.empty.noProjectsSubtitle')}</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={project.avatarUrl} alt={project.title} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                          {getProjectInitials(project.title)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                          <div className="flex space-x-1 ml-2 flex-shrink-0">
                            <Badge variant={project.isActive ? "default" : "secondary"}>
                              {project.isActive ? t('projects.status.active') : t('projects.status.inactive')}
                            </Badge>
                            {project.isArchived && (
                              <Badge variant="outline">{t('projects.status.archived')}</Badge>
                            )}
                          </div>
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {project.startsAt && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{t('projects.labels.start')} {new Date(project.startsAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {project.endsAt && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{t('projects.labels.end')} {new Date(project.endsAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {project.budget && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>${project.budget.toLocaleString()}</span>
                          </div>
                        )}
                        {project.createdAt && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{t('projects.labels.created')} {new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {session?.user?.id?.toString() === project.createdById?.toString() && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => openEditDialog(project)}
                            >
                                <Pencil className="h-4 w-4 mr-1" />
                                {t('projects.actions.edit')}
                            </Button>
                        )} 
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => openProjectPreview(project)}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          {t('projects.actions.details')}
                        </Button>
                        {session?.user?.id?.toString() === project.createdById?.toString() && project.externalId && (
                          <Button 
                            size="sm" 
                            className="w-10"
                            onClick={() => openAtimeusDialog(project)}
                            >
                              <AtimeusSvgLogo />
                            </Button>
                        )} 
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>{t('projects.views.projectsList')}</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('projects.empty.noProjects')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={project.avatarUrl} alt={project.title} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {getProjectInitials(project.title)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold truncate">{project.title}</h3>
                            <Badge variant={project.isActive ? "default" : "secondary"}>
                              {project.isActive ? t('projects.status.active') : t('projects.status.inactive')}
                            </Badge>
                            {project.isArchived && (
                              <Badge variant="outline">{t('projects.status.archived')}</Badge>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>{t('projects.labels.created')} {new Date(project.createdAt).toLocaleDateString()}</span>
                            {project.startsAt && <span>{t('projects.labels.starts')} {project.startsAt}</span>}
                            {project.endsAt && <span>{t('projects.labels.ends')} {project.endsAt}</span>}
                            {project.budget && <span>{t('projects.labels.budget')} ${project.budget.toLocaleString()}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {session?.user?.id?.toString() === project.createdById?.toString() && (
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(project)}
                                >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => openProjectPreview(project)}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('projects.dialogs.editProject')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">{t('projects.form.titleRequired')}</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('projects.form.placeholders.title')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">{t('projects.form.description')}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('projects.form.placeholders.description')}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startsAt">{t('projects.form.startDate')}</Label>
                <Input
                  id="edit-startsAt"
                  type="date"
                  value={formData.startsAt}
                  onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endsAt">{t('projects.form.endDate')}</Label>
                <Input
                  id="edit-endsAt"
                  type="date"
                  value={formData.endsAt}
                  onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-budget">{t('projects.form.budget')}</Label>
              <Input
                id="edit-budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                  />
                  <Label htmlFor="edit-isActive">{t('projects.form.active')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-isArchived"
                    checked={formData.isArchived}
                    onCheckedChange={(checked) => setFormData({ ...formData, isArchived: checked as boolean })}
                  />
                  <Label htmlFor="edit-isArchived">{t('projects.form.archived')}</Label>
                </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('projects.actions.cancel')}
            </Button>
            <Button onClick={handleEditProject} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('projects.actions.updating')}
                </>
              ) : (
                t('projects.actions.update')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('projects.dialogs.projectDetails')}</DialogTitle>
          </DialogHeader>
          
          {previewProject && (
            <div className="space-y-6 py-4">
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
                  {session?.user?.id?.toString() === previewProject.createdById?.toString() && (
                     
                  <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={handleAddMemberFormOpen}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        {t('projects.members.addMember')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle>{t('projects.dialogs.addMember')}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="employeeSelect">{t('projects.form.selectEmployee')}</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={fetchEmployees}
                              disabled={loadingEmployees}
                            >
                              <RefreshCw className={`h-4 w-4 ${loadingEmployees ? 'animate-spin' : ''}`} />
                            </Button>
                          </div>
                          {loadingEmployees ? (
                            <div className="flex items-center justify-center p-3 border rounded-md">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm text-muted-foreground">{t('projects.loading.employees')}</span>
                            </div>
                          ) : employees.length === 0 ? (
                            <div className="flex items-center justify-center p-3 border rounded-md">
                              <span className="text-sm text-muted-foreground">{t('projects.empty.noEmployees')}</span>
                            </div>
                          ) : (
                            <Combobox
                              options={employees.map(emp => ({ 
                                value: emp.id.toString(), 
                                label: `${emp.name} (${emp.email})` 
                              }))}
                              value={selectedEmployeeId}
                              onChange={handleEmployeeSelect}
                              placeholder={t('projects.form.placeholders.employee')}
                              searchPlaceholder={t('projects.form.placeholders.searchEmployees')}
                              emptyText={t('projects.form.emptyText.noEmployee')}
                            />
                          )}
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="roleSelect">{t('projects.form.selectProjectRole')}</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={fetchProjectRoles}
                              disabled={loadingProjectRoles}
                            >
                              <RefreshCw className={`h-4 w-4 ${loadingProjectRoles ? 'animate-spin' : ''}`} />
                            </Button>
                          </div>
                          {loadingProjectRoles ? (
                            <div className="flex items-center justify-center p-3 border rounded-md">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm text-muted-foreground">{t('projects.loading.projectRoles')}</span>
                            </div>
                          ) : projectRoles.length === 0 ? (
                            <div className="flex items-center justify-center p-3 border rounded-md">
                              <span className="text-sm text-muted-foreground">{t('projects.empty.noProjectRoles')}</span>
                            </div>
                          ) : (
                            <Combobox
                              options={projectRoles.map(role => ({ 
                                value: role.id, 
                                label: `${role.title}${role.description ? ` - ${role.description}` : ''}` 
                              }))}
                              value={selectedRoleId}
                              onChange={handleRoleSelect}
                              placeholder={t('projects.form.placeholders.projectRole')}
                              searchPlaceholder={t('projects.form.placeholders.searchProjectRoles')}
                              emptyText={t('projects.form.emptyText.noProjectRole')}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                          {t('projects.actions.cancel')}
                        </Button>
                        <Button onClick={handleAddMember} disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t('projects.actions.adding')}
                            </>
                          ) : (
                            t('projects.actions.addMember')
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                    )}
                </div>

                {loadingMembers ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">{t('projects.loading.members')}</span>
                  </div>
                ) : projectMembers.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{t('projects.empty.noMembers')}</p>
                    <p className="text-sm">{t('projects.empty.noMembersSubtitle')}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projectMembers.map((member) => {
                      // Try to find the employee name from the employees list
                      const employee = employees.find(emp => emp.id === member.memberId);
                      const displayName = employee ? `${employee.name} (${employee.email})` : `Member ID: ${member.memberId.toString()}`;
                      
                      // Try to find the role name from the project roles list
                      const role = projectRoles.find(r => r.id === member.roleId);
                      const roleName = role ? role.title : (member.roleName || member.roleId);
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium">{displayName}</h5>
                              <Badge variant="outline">{roleName}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t('projects.labels.added')} {new Date(member.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {session?.user?.id?.toString() === previewProject.createdById?.toString() && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveMember(member.id, displayName)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Access Control and Action Buttons */}
              {(() => {
                if (!session?.user?.id || !previewProject) return null;
                
                const currentUserId = session.user.id.toString();
                const isCreator = currentUserId === previewProject.createdById?.toString();
                const isMember = projectMembers.some(member => member.memberId.toString() === currentUserId);
                const hasAccess = isCreator || isMember;

                if (loadingMembers) {
                  // Don't show anything while members are loading
                  return null;
                }

                if (!hasAccess) {
                  return (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-center p-6 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="text-center">
                          <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <h4 className="font-medium text-orange-800 mb-1">{t('projects.accessControl.restrictedTitle')}</h4>
                          <p className="text-sm text-orange-600">
                            {t('projects.accessControl.restrictedMessage')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4 pt-4 border-t">
                    {/* Project Actions */}
                    <div>
                      <h4 className="text-md font-semibold mb-3">{t('projects.accessControl.projectActions')}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        
                        <Button 
                          variant="outline" 
                          className="justify-start"
                          onClick={handleConnectToOrg}
                        >
                          <Link2 className="mr-2 h-4 w-4" />
                          {t('projects.actions.connectToOrg')}
                        </Button>
                        <Button 
                            size="sm" 
                            className="w-10"
                            onClick={() => openAtimeusDialog(previewProject)}
                            >
                              <AtimeusSvgLogo />
                          </Button>
                        {/* Add more actions as needed
                         <Button 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => {
                            toast.success("Opening project detail page...");
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Detail Page
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => {
                            toast.success("Downloading project specification...");
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Spec
                        </Button>*/}
                      </div>
                    </div>

                    {/* Creator-only Actions */}
                    {isCreator && (
                      <div>
                        <h4 className="text-md font-semibold mb-3">{t('projects.accessControl.projectManagement')}</h4>
                        <div className="flex justify-between">
                          <Button 
                            variant="outline"
                            onClick={() => {
                              if (previewProject) {
                                setIsPreviewDialogOpen(false);
                                openEditDialog(previewProject);
                              }
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('projects.actions.editProject')}
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              if (previewProject) {
                                setIsPreviewDialogOpen(false);
                                handleDeleteProject(previewProject.id, previewProject.title);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('projects.actions.deleteProject')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
              
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Project Preview Dialog */}
      <Dialog open={isAtimeusDialogOpen} onOpenChange={setIsAtimeusDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('projects.dialogs.projectDetails')} Atimeus</DialogTitle>
          </DialogHeader>
          
          {atimeusProject && (
            <div className="space-y-6 py-4">
              <ProjectAtimeusIndicatorsCard dictionary={dictionary} previewProject={atimeusProject} externalProjectId={atimeusProject.externalId} atimeusProject={mockProjectFinancialSummary} />
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* Connect to ORG Dialog */}
      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Link2 className="h-5 w-5" />
              <span>{t('projects.sso.title')}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {connectionStep === 'generating' && (
              <div className="text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div 
                    className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
                    style={{
                      animationDuration: '1s'
                    }}
                  ></div>
                  <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center">
                    <Link2 className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Generating SSO Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating secure connection to your organization...
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${generatingProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(generatingProgress)}% Complete
                  </p>
                </div>
              </div>
            )}

            {connectionStep === 'ready' && (
              <div className="text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-700">Connection Ready!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your SSO connection URL has been generated successfully.
                  </p>
                </div>
                
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium">SSO Connection URL:</Label>
                  <div className="flex items-center space-x-2 p-3 bg-white border rounded-md">
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <code className="text-sm text-blue-600 flex-1 truncate">{ssoUrl}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(ssoUrl);
                        toast.success('URL copied to clipboard!');
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSsoRedirect}
                  className="w-full"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect to Organization
                </Button>
              </div>
            )}

            {connectionStep === 'completed' && (
              <div className="text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-700">Redirecting...</h3>
                  <p className="text-sm text-muted-foreground">
                    Taking you to the organization login page.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {connectionStep === 'ready' && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
