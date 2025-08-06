"use client"

import { useState } from "react"
import { Dictionary } from "@/locales/dictionary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, Plus, Grid2X2, List, SlidersHorizontal, Key, 
  Edit, Trash, Star, Shield, Building, Mail,
  Github, Facebook, Twitch, CreditCard, ShoppingBag, Briefcase
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { EmptyPasswordState } from "./empty-password-state"
import { AddPasswordModal } from "./add-password-modal"
import Image from "next/image"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { usePasswordReveal, usePasswordCopy } from "./password-security-utils"
import { formatDate } from "@/lib/i18n/utils"

// Platform icons mapping - for platforms without a Lucide icon
const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'github': <GitHubLogoIcon className="h-4 w-4" />,
    'gmail': <Mail className="h-4 w-4" />,
    'company': <Building className="h-4 w-4" />,
    'bank': <CreditCard className="h-4 w-4" />,
    'linkedin': <BrandIcon src="https://www.salesforce.com/news/wp-content/uploads/sites/3/2020/08/Slack-small-logo-wclearspaceRGB.png?w=1024&h=399" alt="LinkedIn" />,
    'salesforce': <BrandIcon src="https://www.salesforce.com/news/wp-content/uploads/sites/3/2021/05/Salesforce-logo.jpg?w=1024&h=576" alt="Salesforce" />,
    'amazon': <ShoppingBag className="h-4 w-4" />,
    'slack': <BrandIcon src="https://www.salesforce.com/news/wp-content/uploads/sites/3/2020/08/Slack-small-logo-wclearspaceRGB.png?w=1024&h=399" alt="LinkedIn" />,
    'facebook': <Facebook  className="h-4 w-4" />,
    'work': <Briefcase className="h-4 w-4" />,
    'default': <Key className="h-4 w-4" />
  };

  return (
    <>
      {iconMap[platform.toLowerCase()] || iconMap.default}
    </>
  );
};

// Component for external SVG brand icons
const BrandIcon = ({ src, alt }: { src: string, alt: string }) => {
  return (
    <div className="h-4 w-4 relative">
      <Image src={src} alt={alt} fill sizes="1rem" className="object-contain" />
    </div>
  );
};

// Enhanced mock data with more platforms and passwords
const mockPasswords = [
  {
    id: "1",
    title: "Company Email",
    username: "user@company.com",
    password: "CompanySecure123!",
    website: "mail.company.com",
    platform: "company",
    category: "work",
    isFavorite: true,
    lastUpdated: "2025-04-28T10:30:00Z",
    strength: "strong"
  },
  {
    id: "2",
    title: "Personal Banking",
    username: "jsmith2023",
    password: "Bank$Ultra$Secure456",
    website: "bank.com",
    platform: "bank",
    category: "finance",
    isFavorite: true,
    lastUpdated: "2025-05-01T15:45:00Z",
    strength: "strong"
  },
  {
    id: "3",
    title: "LinkedIn",
    username: "john.smith@email.com",
    password: "Professional789",
    website: "linkedin.com",
    platform: "linkedin",
    category: "social",
    isFavorite: false,
    lastUpdated: "2025-03-15T09:20:00Z",
    strength: "medium"
  },
  {
    id: "4",
    title: "GitHub",
    username: "devjsmith",
    password: "CodeMaster2023#",
    website: "github.com",
    platform: "github",
    category: "work",
    isFavorite: false,
    lastUpdated: "2025-04-10T14:15:00Z",
    strength: "strong"
  },
  {
    id: "5",
    title: "Salesforce Admin",
    username: "admin@company.com",
    password: "CloudAdmin456!",
    website: "company.salesforce.com",
    platform: "salesforce",
    category: "work",
    isFavorite: true,
    lastUpdated: "2025-05-02T09:15:00Z",
    strength: "strong"
  },
  {
    id: "6",
    title: "Gmail Personal",
    username: "john.smith.personal@gmail.com",
    password: "Personal789!@#",
    website: "gmail.com",
    platform: "gmail",
    category: "personal",
    isFavorite: true,
    lastUpdated: "2025-05-01T08:20:00Z",
    strength: "strong"
  },
  {
    id: "7",
    title: "Amazon Shopping",
    username: "jsmith@email.com",
    password: "Shop2023!",
    website: "amazon.com",
    platform: "amazon",
    category: "shopping",
    isFavorite: false,
    lastUpdated: "2025-03-20T14:30:00Z",
    strength: "medium"
  },
  {
    id: "8",
    title: "Slack",
    username: "john_family",
    password: "WorkChat789!",
    website: "slack.com",
    platform: "slack",
    category: "work",
    isFavorite: true,
    lastUpdated: "2025-04-15T19:45:00Z",
    strength: "medium"
  },
  {
    id: "9",
    title: "Facebook",
    username: "john.smith.1984",
    password: "SocialPass123",
    website: "facebook.com",
    platform: "facebook",
    category: "social",
    isFavorite: false,
    lastUpdated: "2025-02-10T11:25:00Z",
    strength: "weak"
  }
];

// Helper function to get strength badge color
const getStrengthColor = (strength: string) => {
  switch (strength) {
    case "strong": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "weak": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Individual password card component
const PasswordCard = ({ 
  password, 
  dictionary, 
  locale,
  view 
}: { 
  password: typeof mockPasswords[0], 
  dictionary: Dictionary,
  locale: string,
  view: "grid" | "list" 
}) => {
  const dict = dictionary.passwordManager;
  
  // Use our custom hooks for password security
  const { isPasswordVisible, PasswordRevealButton } = usePasswordReveal(dictionary);
  const { PasswordCopyButton } = usePasswordCopy(dictionary);
  
  return (
    <Card 
      className={`${view === "list" ? "flex flex-col sm:flex-row overflow-hidden" : ""} transition-all duration-200 hover:shadow-md`}
    >
      <CardHeader className={view === "list" ? "flex-1 py-2 sm:py-3" : "pb-2 px-3 sm:px-6"}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-medium truncate max-w-[75%]">
            <div className="p-1.5 rounded-full bg-primary/10 text-primary shrink-0">
              <PlatformIcon platform={password.platform} />
            </div>
            <span className="truncate">{password.title}</span>
          </CardTitle>
          <Button variant="ghost" size="icon" className="text-yellow-500 h-8 w-8 shrink-0">
            <Star className={`h-4 w-4 ${password.isFavorite ? "fill-current" : ""}`} />
            <span className="sr-only">
              {password.isFavorite ? dict.actions.unfavorite : dict.actions.favorite}
            </span>
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1 mt-1 text-xs sm:text-sm">
          <span className="truncate max-w-[150px] sm:max-w-none">{password.website}</span>
          <Badge 
            variant="outline" 
            className={`text-[10px] font-medium ml-1 py-0 h-4 shrink-0 ${getStrengthColor(password.strength)}`}
          >
            {password.strength}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className={view === "list" ? "flex-1 py-2 sm:py-3 px-3 sm:px-6" : "pt-0 px-3 sm:px-6"}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[80%]">{password.username}</div>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 text-xs sm:text-sm bg-muted/30 rounded px-2 py-1 font-mono truncate overflow-hidden">
              {isPasswordVisible ? password.password : "••••••••••••"}
            </div>
            <div className="flex gap-1 ml-auto shrink-0">
              <PasswordRevealButton password={password.password} />
              <PasswordCopyButton password={password.password} />
            </div>
          </div>
          
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap overflow-hidden">
              <Badge variant="outline" className="text-xs capitalize px-2 py-0 h-5 shrink-0">
                {dict.categories[password.category as keyof typeof dict.categories]}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(new Date(password.lastUpdated), locale, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex gap-1 ml-auto shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                <Edit className="h-4 w-4" />
                <span className="sr-only">{dict.actions.edit}</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
                <Trash className="h-4 w-4" />
                <span className="sr-only">{dict.actions.delete}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PasswordVaultProps {
  dictionary: Dictionary,
  locale: string
}

export function PasswordVault({ dictionary, locale }: PasswordVaultProps) {
  const dict = dictionary.passwordManager;
  const [view, setView] = useState<"grid" | "list">("grid");
  const [passwords, setPasswords] = useState(mockPasswords);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddPasswordModalOpen, setIsAddPasswordModalOpen] = useState(false);

  // Handle adding a new password
  const handleAddPassword = (newPassword: any) => {
    setPasswords([
      {
        ...newPassword,
        // Ensure the new password has all required fields
        id: `${passwords.length + 1}`,
        isFavorite: false,
        lastUpdated: new Date().toISOString()
      },
      ...passwords
    ]);
    setIsAddPasswordModalOpen(false);
  };

  // Enhanced filtering with category and search
  const filteredPasswords = passwords.filter(p => {
    // First filter by category
    if (activeTab === "favorites") {
      if (!p.isFavorite) return false;
    } else if (activeTab !== "all" && p.category !== activeTab) {
      return false;
    }
    
    // Then filter by search query if present
    if (searchQuery) {
      return (
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.website.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });

  // Categories for the tabs
  const categories = [
    { id: "all", label: dict.categories.all },
    { id: "favorites", label: dict.categories.favorites },
    { id: "work", label: dict.categories.work },
    { id: "personal", label: dict.categories.personal },
    { id: "finance", label: dict.categories.finance },
    { id: "social", label: dict.categories.social },
    { id: "shopping", label: dict.categories.shopping },
    { id: "entertainment", label: dict.categories.entertainment }
  ];

  // Format date to be more user-friendly
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={dict.search}
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <TabsList className="grid grid-cols-2 h-9 w-16">
            <TabsTrigger value="grid" onClick={() => setView("grid")} className={view === "grid" ? "bg-primary text-primary-foreground" : ""}>
              <Grid2X2 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list" onClick={() => setView("list")} className={view === "list" ? "bg-primary text-primary-foreground" : ""}>
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button onClick={() => setIsAddPasswordModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">{dict.newPassword}</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto pb-1 hide-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-3 sm:px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === category.id 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Password List/Grid */}
      {filteredPasswords.length === 0 ? (
        <EmptyPasswordState dictionary={dictionary} />
      ) : (
        <div className={
          view === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5" 
            : "space-y-3"
        }>
          {filteredPasswords.map((password) => (
            <PasswordCard 
              key={password.id} 
              password={password} 
              dictionary={dictionary}
              locale={locale}
              view={view} 
            />
          ))}
        </div>
      )}

      {/* Add Password Modal */}
      <AddPasswordModal 
        dictionary={dictionary}
        onAddPassword={handleAddPassword}
        isOpen={isAddPasswordModalOpen}
        onOpenChange={setIsAddPasswordModalOpen}
      />
    </div>
  )
}