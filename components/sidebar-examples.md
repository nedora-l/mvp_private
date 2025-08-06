// Example usage of themed sidebars in different apps

// Default app (main DAWS)
import { Sidebar } from "@/components/sidebar"

// Security app 
import { SidebarSecurity } from "@/components/sidebar-security"

// HR app
import { SidebarHR } from "@/components/sidebar-hr"

// Usage examples:

// In your main app layout:
<Sidebar dictionary={dictionary} />

// In your security app layout:
<SidebarSecurity dictionary={dictionary} />

// In your HR app layout:
<SidebarHR dictionary={dictionary} />

// Custom themed sidebar example:
import { SidebarDynamic } from "@/components/sidebar.dynamic"

<SidebarDynamic
  logoComponent={<YourCustomLogo />}
  configType="default" // or "security" or "hr"
  dictionary={dictionary}
  compact={true} // for compact design
/>

/*
Available color themes:
- default: Blue to Purple gradient (main app)
- security: Red to Orange gradient (security features)
- hr: Green to Emerald gradient (HR portal)

Features:
- Compact design with smaller spacing and icons
- Themed colors per app/context
- Glassmorphism effects with backdrop blur
- Smooth transitions and hover effects
- Mobile responsive with overlay
- Collapsible with persistent state
- Tooltip support for collapsed state
*/
