"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dictionary } from "@/locales/dictionary"
import {
  CreditCard,
  Key,
  FolderLock,
  CircleUser,
  ClipboardCheck,
  Copy,
  Eye,
  EyeOff,
  Clock,
  LogIn,
  RefreshCw,
  FileKey,
  ServerCog,
  Command,
  MoreHorizontal,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { EmptyPasswordState } from "./empty-password-state"
import { PasswordVerificationDialog } from "./password-security-utils"

// Mock data for secrets and app access
const mockSecrets = [
  {
    id: "1",
    title: "AWS Access Keys",
    type: "api_key",
    category: "cloud",
    key: "AWSACCESSKEYEXAMPLE123456789",
    value: "awssecretexamplekey987654321abcdefghijk",
    notes: "Development account access keys",
    expiresAt: "2025-12-31T23:59:59Z",
    lastUsed: "2025-05-01T14:30:22Z",
    isSensitive: true
  },
  {
    id: "2",
    title: "GitHub Personal Access Token",
    type: "access_token",
    category: "development",
    key: "ghp_token",
    value: "ghp_examplepersonalaccesstoken123456789abcdefg",
    notes: "Scopes: repo, user, workflow",
    expiresAt: "2025-08-15T00:00:00Z",
    lastUsed: "2025-05-02T09:15:44Z",
    isSensitive: true
  },
  {
    id: "3",
    title: "Stripe API Key (Test)",
    type: "api_key",
    category: "payment",
    key: "STRIPE_API_KEY",
    value: "sk_test_examplestripetestkey98765432123456789",
    notes: "Test environment only",
    expiresAt: null,
    lastUsed: "2025-05-03T16:22:10Z",
    isSensitive: true
  },
  {
    id: "4",
    title: "Database Connection String",
    type: "connection_string",
    category: "database",
    key: "DATABASE_URL",
    value: "postgresql://user:password@localhost:5432/mydb",
    notes: "Local development database",
    expiresAt: null,
    lastUsed: "2025-05-01T11:45:30Z",
    isSensitive: true
  },
  {
    id: "5",
    title: "SendGrid API Key",
    type: "api_key",
    category: "communication",
    key: "SENDGRID_API_KEY",
    value: "SG.examplesendgridapikey123456789abcdefghijklm",
    notes: "For transactional emails",
    expiresAt: "2026-01-10T00:00:00Z",
    lastUsed: "2025-04-28T08:30:15Z",
    isSensitive: true
  }
];

// Secret form schema
const secretFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  type: z.string(),
  category: z.string(),
  key: z.string().min(1, {
    message: "Key is required.",
  }),
  value: z.string().min(1, {
    message: "Value is required.",
  }),
  notes: z.string().optional(),
  expiresAt: z.string().optional().nullable(),
  isSensitive: z.boolean().default(true),
});

// Secret type icons
const secretTypeIcons: Record<string, React.ReactNode> = {
  "api_key": <Key className="h-4 w-4" />,
  "access_token": <LogIn className="h-4 w-4" />,
  "connection_string": <ServerCog className="h-4 w-4" />,
  "certificate": <FileKey className="h-4 w-4" />,
  "secret_key": <Lock className="h-4 w-4" />,
  "credential": <CircleUser className="h-4 w-4" />,
  "environment_variable": <Command className="h-4 w-4" />,
};

// Secret category colors
const getCategoryColor = (category: string) => {
  const categoryColors: Record<string, string> = {
    "cloud": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "development": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "payment": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "database": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "communication": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    "security": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "infrastructure": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    "other": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  };
  
  return categoryColors[category] || categoryColors.other;
};

interface SecretFormProps {
  dictionary: Dictionary
  isOpen: boolean
  onClose: () => void
  onSave: (data: z.infer<typeof secretFormSchema>) => void
  editData?: z.infer<typeof secretFormSchema>
}

// Secret form component
function SecretForm({
  dictionary,
  isOpen,
  onClose,
  onSave,
  editData
}: SecretFormProps) {
  const dict = dictionary.passwordManager;
  const [showValue, setShowValue] = useState(false);
  
  // Form definition
  const form = useForm<z.infer<typeof secretFormSchema>>({
    resolver: zodResolver(secretFormSchema),
    defaultValues: editData || {
      title: "",
      type: "api_key",
      category: "other",
      key: "",
      value: "",
      notes: "",
      expiresAt: null,
      isSensitive: true,
    },
  });
  
  // Form submission handler
  const onSubmit = (data: z.infer<typeof secretFormSchema>) => {
    onSave(data);
    onClose();
    toast({
      title: editData ? "Secret updated" : "Secret created",
      description: editData ? "Your secret has been updated successfully" : "Your secret has been saved securely",
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderLock className="h-5 w-5 text-primary" />
            {editData ? "Edit Secret" : "Add New Secret"}
          </DialogTitle>
          <DialogDescription>
            {editData 
              ? "Update your stored secret details below." 
              : "Store API keys, access tokens, and other sensitive information securely."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AWS Access Keys" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Type field */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="access_token">Access Token</SelectItem>
                      <SelectItem value="secret_key">Secret Key</SelectItem>
                      <SelectItem value="connection_string">Connection String</SelectItem>
                      <SelectItem value="certificate">Certificate/PEM</SelectItem>
                      <SelectItem value="credential">Credential</SelectItem>
                      <SelectItem value="environment_variable">Environment Variable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Category field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cloud">Cloud Services</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Key field */}
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Key Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. API_KEY or Environment variable name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Variable name, key identifier, or environment variable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Value field */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Secret Value <span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="flex">
                    <FormControl>
                      <div className="relative flex-1">
                        <Input 
                          type={showValue ? "text" : "password"} 
                          placeholder="••••••••••••" 
                          className="pr-10 font-mono" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowValue(!showValue)}
                        >
                          {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">
                            {showValue ? "Hide value" : "Show value"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                  </div>
                  <FormDescription>
                    The actual secret value to be stored securely
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Expiry date field */}
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expiry Date <span className="text-muted-foreground text-xs">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const date = e.target.value;
                        field.onChange(date ? new Date(date).toISOString() : null);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Set an expiry date if this secret has a limited validity period
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Notes field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes <span className="text-muted-foreground text-xs">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add usage notes, scopes, or other important information..." 
                      className="resize-none h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Sensitive toggle */}
            <FormField
              control={form.control}
              name="isSensitive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                      Treat as sensitive
                    </FormLabel>
                    <FormDescription>
                      Require additional verification before viewing or copying this secret
                    </FormDescription>
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
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editData ? "Update Secret" : "Save Secret"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Single secret card component
interface SecretCardProps {
  secret: typeof mockSecrets[0];
  dictionary: Dictionary;
  onEdit: (secret: typeof mockSecrets[0]) => void;
  onDelete: (id: string) => void;
}

function SecretCard({ secret, dictionary, onEdit, onDelete }: SecretCardProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [verificationType, setVerificationType] = useState<"password" | "passkey" | "mfa">("password");
  
  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  // Copy secret to clipboard
  const copyToClipboard = (text: string) => {
    if (secret.isSensitive && !showSecret) {
      // If sensitive and not revealed, require verification first
      setVerificationType(Math.random() > 0.5 ? "password" : "passkey");
      setIsVerificationDialogOpen(true);
      return;
    }
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Secret value has been copied to your clipboard",
    });
  };
  
  // Toggle secret visibility
  const toggleSecretVisibility = () => {
    if (!showSecret && secret.isSensitive) {
      // If not shown and sensitive, require verification first
      setVerificationType(Math.random() > 0.5 ? "password" : "mfa");
      setIsVerificationDialogOpen(true);
      return;
    }
    
    setShowSecret(!showSecret);
  };
  
  // Handle verification result
  const handleVerification = (success: boolean) => {
    if (success) {
      setShowSecret(true);
      toast({
        title: "Verification successful",
        description: "You can now view the secret value",
      });
    }
  };
  
  // Check if the secret is expired
  const isExpired = secret.expiresAt && new Date(secret.expiresAt) < new Date();
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
              {secretTypeIcons[secret.type] || <Key className="h-4 w-4" />}
            </div>
            {secret.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(secret)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(secret.id)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center gap-1 mt-1">
          <Badge 
            variant="outline" 
            className={`text-xs py-0 h-5 ${getCategoryColor(secret.category)}`}
          >
            {secret.category}
          </Badge>
          {isExpired && (
            <Badge variant="outline" className="text-xs py-0 h-5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
              Expired
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground flex items-center">
            {secret.key}
          </p>
          <div className="flex items-center">
            <div className="flex-1 text-sm bg-muted/30 rounded px-2 py-1 font-mono truncate overflow-hidden">
              {showSecret ? secret.value : "••••••••••••••••••••••••••••••"}
            </div>
            <div className="flex gap-1 ml-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                onClick={toggleSecretVisibility}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">
                  {showSecret ? "Hide secret" : "Show secret"}
                </span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                onClick={() => copyToClipboard(secret.value)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            </div>
          </div>
        </div>
        
        {secret.notes && (
          <p className="text-sm text-muted-foreground">
            {secret.notes}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Last used: {formatDate(secret.lastUsed)}
          </div>
          {secret.expiresAt && (
            <div className={`flex items-center gap-1 ${isExpired ? "text-red-500" : ""}`}>
              {isExpired ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Expires: {formatDate(secret.expiresAt)}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Verification dialog */}
      <PasswordVerificationDialog
        isOpen={isVerificationDialogOpen}
        onClose={() => setIsVerificationDialogOpen(false)}
        onVerify={handleVerification}
        verificationType={verificationType}
        dictionary={dictionary}
        actionType="view"
      />
    </Card>
  );
}

interface SecretVaultProps {
  dictionary: Dictionary;
  locale: string;
}

// Main SecretVault component
export function SecretVault({ dictionary, locale }: SecretVaultProps) {
  const dict = dictionary.passwordManager;
  const [secrets, setSecrets] = useState(mockSecrets);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSecret, setEditingSecret] = useState<typeof mockSecrets[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Filter secrets based on search and category
  const filteredSecrets = secrets.filter(secret => {
    if (activeCategory !== "all" && secret.category !== activeCategory) {
      return false;
    }
    
    if (searchQuery) {
      return (
        secret.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        secret.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (secret.notes && secret.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return true;
  });
  
  // Handle adding a new secret
  const handleSaveSecret = (data: z.infer<typeof secretFormSchema>) => {
    if (editingSecret) {
      // Update existing secret
      setSecrets(secrets.map(s => 
        s.id === editingSecret.id ? { ...s, ...data, lastUsed: new Date().toISOString() } : s
      ));
      setEditingSecret(null);
    } else {
      // Add new secret
      setSecrets([
        ...secrets,
        {
          id: Math.random().toString(36).substring(2, 9),
          ...data,
          lastUsed: new Date().toISOString(),
          expiresAt: data.expiresAt || null
        }
      ]);
    }
  };
  
  // Handle editing a secret
  const handleEditSecret = (secret: typeof mockSecrets[0]) => {
    setEditingSecret(secret);
    setIsAddDialogOpen(true);
  };
  
  // Handle deleting a secret
  const handleDeleteSecret = (id: string) => {
    if (confirm("Are you sure you want to delete this secret? This action cannot be undone.")) {
      setSecrets(secrets.filter(s => s.id !== id));
      toast({
        title: "Secret deleted",
        description: "The secret has been permanently removed",
      });
    }
  };
  
  // Categories for the tabs
  const categories = [
    { id: "all", label: "All Secrets" },
    { id: "cloud", label: "Cloud Services" },
    { id: "development", label: "Development" },
    { id: "payment", label: "Payment" },
    { id: "database", label: "Database" },
    { id: "communication", label: "Communication" },
    { id: "security", label: "Security" },
    { id: "infrastructure", label: "Infrastructure" }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search secrets..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Secret
        </Button>
      </div>
      
      {/* Categories Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto pb-1 hide-scrollbar">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeCategory === category.id 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Secrets grid */}
      {filteredSecrets.length === 0 ? (
        <EmptyPasswordState 
          dictionary={dictionary} 
          title="No secrets found" 
          description="Add your first secret to start managing your sensitive information securely."
          buttonText="Add Secret"
          onAction={() => setIsAddDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSecrets.map(secret => (
            <SecretCard
              key={secret.id}
              secret={secret}
              dictionary={dictionary}
              onEdit={handleEditSecret}
              onDelete={handleDeleteSecret}
            />
          ))}
        </div>
      )}
      
      {/* Add/Edit secret dialog */}
      <SecretForm
        dictionary={dictionary}
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingSecret(null);
        }}
        onSave={handleSaveSecret}
        editData={editingSecret || undefined}
      />
    </div>
  );
}