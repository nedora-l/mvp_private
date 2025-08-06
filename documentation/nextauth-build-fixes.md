# NextAuth Build and SignOut Issues - Fix Guide

## Issues Identified

1. **Build Cache Corruption**: `app-paths-manifest.json` missing causing Next.js errors
2. **NextAuth Route Handler**: Incorrect import path for NextAuth handlers
3. **SignOut Redirect Issues**: Improper logout handling causing 500 errors
4. **Middleware Import**: Wrong auth import path in middleware

## Fixes Applied

### 1. Fixed NextAuth Route Handler
**File**: `app/api/auth/[...nextauth]/route.ts`
```typescript
// Before (incorrect)
import { GET, POST } from "@/lib/auth/nextauth"

// After (correct)
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

### 2. Enhanced Logout Function
**File**: `components/contexts/auth-context.tsx`
```typescript
const logout = () => {
  console.log("🚪 Auth Context logout called - using NextAuth signOut");
  // Clear local state first
  setAccessTokenState(null)
  setRefreshTokenState(null)
  setCurrentLoggedUserState(null)
  authService.logout()
  
  // Then sign out with NextAuth with proper redirect
  signOut({ 
    callbackUrl: '/auth/login',
    redirect: true 
  })
}
```

### 3. Updated Top Navigation
**File**: `components/top-nav.tsx`
```typescript
const handleLogout = () => {
  logout() // This now handles the redirect automatically
}
```

### 4. Fixed Middleware Import
**File**: `middleware.ts`
```typescript
// Before
import { auth } from "./lib/auth/nextauth"

// After
import { auth } from "./auth"
```

### 5. Added Clean Scripts
**File**: `package.json`
```json
{
  "scripts": {
    "clean": "rimraf .next node_modules/.cache",
    "clean:dev": "npm run clean && npm run dev"
  }
}
```

## How to Fix the Current Issues

### Step 1: Clean Build Cache
Run one of these commands to clean the corrupted build cache:

```bash
# Option 1: Use npm script
npm run clean:dev

# Option 2: Manual cleanup
rm -rf .next
rm -rf node_modules/.cache
npm run dev

# Option 3: Use PowerShell script (Windows)
.\scripts\clean-and-start.ps1
```

### Step 2: Verify NextAuth Configuration
Ensure your environment variables are set:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 3: Test Authentication Flow
1. Visit `/[locale]/auth/login`
2. Login with credentials or Google
3. Visit `/[locale]/auth/test` to verify session data
4. Test logout functionality

## Error Explanations

### `app-paths-manifest.json` Error
This occurs when Next.js build cache becomes corrupted. The manifest file contains route information that Next.js uses for routing. Cleaning the `.next` directory resolves this.

### SignOut 500 Error
The 500 error on `/api/auth/signout` was caused by:
1. Incorrect import path in the NextAuth route handler
2. Missing proper redirect handling in the signOut call
3. Race conditions between local state clearing and NextAuth signOut

### Session Compilation Issues
The session compilation taking 57.9s suggests:
1. Large number of modules being processed (2475 modules)
2. Possible circular dependencies or inefficient imports
3. TypeScript compilation overhead

## Prevention Tips

1. **Regular Cache Cleanup**: Run `npm run clean` if you encounter build issues
2. **Proper Import Paths**: Always use the main auth configuration file (`@/auth`)
3. **Logout Handling**: Let NextAuth handle redirects rather than manual routing
4. **Development**: Use `npm run clean:dev` when switching between authentication providers

## Verification Checklist

- [ ] NextAuth route handler imports from correct file
- [ ] Logout function uses proper NextAuth signOut with redirect
- [ ] Middleware imports auth from main configuration
- [ ] Build cache is clean (no `.next` directory issues)
- [ ] Environment variables are properly set
- [ ] Authentication flow works end-to-end
- [ ] Session debug page shows all user data correctly

After applying these fixes, your authentication system should work smoothly without the build cache and signout errors.
