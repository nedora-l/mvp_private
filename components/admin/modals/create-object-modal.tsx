"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Sparkles, 
  Info, 
  Settings, 
  Save, 
  CheckCircle,
  Users,
  Hash,
  Link,
  FileText,
  Database
} from "lucide-react"
import { MetaDataRecordRequestDto } from "@/lib/services/server/dynamicdb/dyn.db.metadata.server.service"

const objectSchema = z.object({
  name: z.string().min(1, "Object name is required").max(80, "Object name must be less than 80 characters"),
  apiName: z.string()
    .min(1, "API name is required")
    .regex(/^[A-Za-z][A-Za-z0-9_]*__c$/, "API name must start with a letter, contain only letters, numbers, and underscores, and end with '__c'"),
  description: z.string().optional(),
  pluralLabel: z.string().min(1, "Plural label is required"),
  recordName: z.string().min(1, "Record name is required"),
  category: z.string().min(1, "Category is required"),
  visibility: z.enum(["public", "protected", "private"]),
  enableReports: z.boolean(),
  enableActivities: z.boolean(),
  enableHistory: z.boolean(),
  enableSearch: z.boolean(),
  enableBulkApi: z.boolean(),
  enableSharing: z.boolean(),
  enableFeeds: z.boolean(),
})

type ObjectFormData = z.infer<typeof objectSchema>

// Helper to safely access nested dictionary properties
const getDictValue = (dict: any, path: string, defaultValue: string = "") => {
  const keys = path.split('.');
  let current = dict;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  return typeof current === 'string' ? current : defaultValue;
};

interface CreateObjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MetaDataRecordRequestDto) => Promise<void>
  mode?: "create" | "edit"
  initialData?: Partial<ObjectFormData> & { id?: string }
  dictionary: any // Add dictionary prop
}

const objectCategories = [
  { value: "business", label: "Business", icon: Users, color: "bg-blue-100 text-blue-700" },
  { value: "financial", label: "Financial", icon: Hash, color: "bg-green-100 text-green-700" },
  { value: "system", label: "System", icon: Settings, color: "bg-gray-100 text-gray-700" },
  { value: "integration", label: "Integration", icon: Link, color: "bg-purple-100 text-purple-700" },
  { value: "reporting", label: "Reporting", icon: FileText, color: "bg-orange-100 text-orange-700" },
  { value: "other", label: "Other", icon: Database, color: "bg-slate-100 text-slate-700" }
]

const visibilityOptions = [
  { 
    value: "public" as const, 
    label: "Public", 
    description: "Accessible to all users with proper permissions",
    color: "bg-green-50 text-green-700 border-green-200"
  },
  { 
    value: "protected" as const, 
    label: "Protected", 
    description: "Accessible to users within the same app",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200"
  },
  { 
    value: "private" as const, 
    label: "Private", 
    description: "Accessible only to administrators",
    color: "bg-red-50 text-red-700 border-red-200"
  }
]


//createMetaDataRecord: (data: MetaDataRecordDto): Promise<ApiResponse<MetaDataRecordRequestDto>> 

export function objectFormToRecordRequest(formData:ObjectFormData ) : MetaDataRecordRequestDto 
{
  return {
    label: formData.name,
    labelInPlural: formData.pluralLabel,
    apiName: formData.apiName,
    description: formData.description,
    //helpText: '',
    //typeId: 1,
    //defaultFieldId: 'name', // Assuming 'name' is the default field
    isActive: true,
    isSearchable: formData.enableSearch,
    isPublic: formData.visibility === "public"
  };
}

export function CreateObjectModal({
  isOpen,
  onClose,
  onSubmit,
  mode = 'create',
  initialData,
  dictionary
}: CreateObjectModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<ObjectFormData>({
    resolver: zodResolver(objectSchema),
    defaultValues: {
      name: initialData?.name || "",
      apiName: initialData?.apiName || "",
      description: initialData?.description || "",
      pluralLabel: initialData?.pluralLabel || "",
      recordName: initialData?.recordName || getDictValue(dictionary, 'objectsManager.createModal.fields.recordName.defaultValue', "Name"),
      category: initialData?.category || "",
      visibility: initialData?.visibility || (getDictValue(dictionary, 'objectsManager.createModal.fields.visibility.defaultValue', "public") as "public" | "protected" | "private"),
      enableReports: initialData?.enableReports ?? true,
      enableActivities: initialData?.enableActivities ?? true,
      enableHistory: initialData?.enableHistory ?? true,
      enableSearch: initialData?.enableSearch ?? true,
      enableBulkApi: initialData?.enableBulkApi ?? true,
      enableSharing: initialData?.enableSharing ?? true,
      enableFeeds: initialData?.enableFeeds ?? false,
    },
  })

  const watchedName = form.watch("name")
  
  const generateApiName = useCallback((name: string) => {
    if (!name) return ""
    return name
      .trim()
      .replace(/[^A-Za-z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/^[^A-Za-z]/, "")
      + "__c"
  }, [])

  const generatePluralLabel = useCallback((name: string) => {
    if (!name) return ""
    if (name.endsWith('y')) return name.slice(0, -1) + 'ies'
    if (name.endsWith('s') || name.endsWith('sh') || name.endsWith('ch') || name.endsWith('x') || name.endsWith('z')) {
      return name + 'es'
    }
    return name + 's'
  }, [])

  // Update API name when object name changes
  useEffect(() => {
    if (watchedName && mode === 'create') {
      const apiName = generateApiName(watchedName)
      form.setValue("apiName", apiName)
    }
  }, [watchedName, mode, form, generateApiName])

  useEffect(() => {
    if (watchedName && mode === 'create') {
      const pluralLabel = generatePluralLabel(watchedName)
      form.setValue("pluralLabel", pluralLabel)
    }
  }, [watchedName, mode, form, generatePluralLabel])

  const handleSubmit = async (data: ObjectFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(
        objectFormToRecordRequest(data)
    )
      toast({
        title: dictionary.toasts?.successTitle || "Success",
        description: dictionary.toasts?.objectSavedSuccess || `Object ${mode === 'create' ? 'created' : 'updated'} successfully`,
      })
      onClose()
      form.reset()
    } catch (error) {
      toast({
        title: dictionary.toasts?.errorTitle || "Error",
        description: dictionary.toasts?.objectSavedError || `Failed to ${mode} object`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset({
      name: "",
      apiName: "",
      description: "",
      pluralLabel: "",
      recordName: getDictValue(dictionary, 'objectsManager.createModal.fields.recordName.defaultValue', "Name"),
      category: "",
      visibility: getDictValue(dictionary, 'objectsManager.createModal.fields.visibility.defaultValue', "public") as "public" | "protected" | "private",
      enableReports: true,
      enableActivities: true,
      enableHistory: true,
      enableSearch: true,
      enableBulkApi: true,
      enableSharing: true,
      enableFeeds: false,
      ...(mode === 'edit' && initialData ? initialData : {})
    })
    onClose()
  }

  const selectedCategoryValue = form.watch("category")
  const selectedVisibilityValue = form.watch("visibility")

  const originalSelectedCategory = objectCategories.find(cat => cat.value === selectedCategoryValue)
  const originalSelectedVisibility = visibilityOptions.find(vis => vis.value === selectedVisibilityValue)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {mode === 'create' 
              ? getDictValue(dictionary, 'objectsManager.createModal.titleCreate', 'Create New Object') 
              : getDictValue(dictionary, 'objectsManager.createModal.titleEdit', 'Edit Object')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? getDictValue(dictionary, 'objectsManager.createModal.descriptionCreate', "Define a new custom object to store your business data with fields and relationships")
              : getDictValue(dictionary, 'objectsManager.createModal.descriptionEdit', "Update the object configuration and settings")
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {getDictValue(dictionary, 'objectsManager.createModal.sections.basicInfo.title', 'Basic Information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getDictValue(dictionary, 'objectsManager.createModal.fields.name.label', 'Object Name')} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={getDictValue(dictionary, 'objectsManager.createModal.fields.name.placeholder', "e.g., Customer, Product, Invoice")}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apiName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getDictValue(dictionary, 'objectsManager.createModal.fields.apiName.label', 'API Name')} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={getDictValue(dictionary, 'objectsManager.createModal.fields.apiName.placeholder', "Customer__c")} 
                            {...field}
                            className="font-mono text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          {getDictValue(dictionary, 'objectsManager.createModal.fields.apiName.description', "Used for API calls and integrations. Must end with '__c'")}
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pluralLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getDictValue(dictionary, 'objectsManager.createModal.fields.pluralLabel.label', 'Plural Label')} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={getDictValue(dictionary, 'objectsManager.createModal.fields.pluralLabel.placeholder', "Customers")} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recordName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getDictValue(dictionary, 'objectsManager.createModal.fields.recordName.label', 'Record Name')} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={getDictValue(dictionary, 'objectsManager.createModal.fields.recordName.placeholder', "Name")}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          {getDictValue(dictionary, 'objectsManager.createModal.fields.recordName.description', "The label for the name field of records")}
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getDictValue(dictionary, 'objectsManager.createModal.fields.description.label', 'Description')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={getDictValue(dictionary, 'objectsManager.createModal.fields.description.placeholder', "Describe what this object represents...")}
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {getDictValue(dictionary, 'objectsManager.createModal.sections.configuration.title', 'Configuration')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getDictValue(dictionary, 'objectsManager.createModal.fields.category.label', 'Category')} *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={getDictValue(dictionary, 'objectsManager.createModal.fields.category.placeholder', "Select a category")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {objectCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center gap-2">
                                  {category.icon && <category.icon className="h-4 w-4" />}
                                  {getDictValue(dictionary, `objectsManager.createModal.categories.${category.value}.label`, category.label)}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {originalSelectedCategory && (
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", originalSelectedCategory.color)}>
                        {originalSelectedCategory.icon && <originalSelectedCategory.icon className="h-3 w-3 mr-1" />}
                        {getDictValue(dictionary, `objectsManager.createModal.categories.${originalSelectedCategory.value}.label`, originalSelectedCategory.label)}
                      </Badge>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getDictValue(dictionary, 'objectsManager.createModal.fields.visibility.label', 'Visibility')} *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={getDictValue(dictionary, 'objectsManager.createModal.fields.visibility.placeholder', "Select visibility")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visibilityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{getDictValue(dictionary, `objectsManager.createModal.visibilityOptions.${option.value}.label`, option.label)}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {getDictValue(dictionary, `objectsManager.createModal.visibilityOptions.${option.value}.description`, option.description)}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {originalSelectedVisibility && (
                    <div className="p-3 rounded-lg border">
                      <Badge className={cn("text-xs", originalSelectedVisibility.color)}>
                        {getDictValue(dictionary, `objectsManager.createModal.visibilityOptions.${originalSelectedVisibility.value}.label`, originalSelectedVisibility.label)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getDictValue(dictionary, `objectsManager.createModal.visibilityOptions.${originalSelectedVisibility.value}.description`, originalSelectedVisibility.description)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Feature Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {getDictValue(dictionary, 'objectsManager.createModal.sections.featureOptions.title', 'Feature Options')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {getDictValue(dictionary, 'objectsManager.createModal.sections.featureOptions.description', "Enable or disable features for this object")}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="enableReports"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableReports.label', 'Allow Reports')}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableReports.description', 'Enable reporting on this object')}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableActivities"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableActivities.label', 'Track Activities')}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableActivities.description', 'Enable activity tracking')}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableHistory"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableHistory.label', 'Track Field History')}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableHistory.description', 'Track changes to fields')}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableSearch"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableSearch.label', 'Allow Search')}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableSearch.description', 'Include in search results')}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableBulkApi"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableBulkApi.label', 'Bulk API')}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableBulkApi.description', 'Enable bulk operations')}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableSharing"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableSharing.label', 'Allow Sharing')}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableSharing.description', 'Enable record sharing')}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableFeeds"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableFeeds.label', 'Enable Feeds')}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {getDictValue(dictionary, 'objectsManager.createModal.features.enableFeeds.description', 'Enable Chatter feeds')}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {getDictValue(dictionary, 'objectsManager.createModal.buttons.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>{getDictValue(dictionary, 'objectsManager.createModal.buttons.creating', 'Creating...')}</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'create' 
                      ? getDictValue(dictionary, 'objectsManager.createModal.buttons.createObject', 'Create Object') 
                      : getDictValue(dictionary, 'objectsManager.createModal.buttons.updateObject', 'Update Object')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
