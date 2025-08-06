import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { TOKEN_STORAGE_KEY, DEFAULT_LOCALE, SUPPORTED_LOCALES } from './lib/constants/global'
import { auth } from "./auth" // Import auth from main auth configuration
import { getRequiredRoles, hasRequiredRole } from './lib/config/route-permissions'

// List your supported locales
export const locales = SUPPORTED_LOCALES
export const defaultLocale = DEFAULT_LOCALE
// This middleware intercepts requests and handles internationalization

// Token name used for authentication

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, locales, defaultLocale)
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  // Skip if this request is for an asset, API route, public folder, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/logo') ||   // Add logo directory
    pathname.startsWith('/public') || // Add public directory
    pathname.includes('.')           // Include all files with extensions
  ) {
    return
  }
  // Check if pathname starts with our locales
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  // Handle auth protection for app routes
  if (pathnameHasLocale) {
    // Check if the pathname is for a protected route (any route under /[locale]/app/)
    const isProtectedRoute = /^\/(en|fr|ar)\/app(?:\/.*)?$/.test(pathname) && 
    !pathname.endsWith('/auth/login') && 
    !pathname.endsWith('/auth/exchange');
    
    // If this is a protected route, check for authentication
    if (isProtectedRoute) {
      // Check if user is authenticated with NextAuth
      const session = await auth();
      
      // If not authenticated with NextAuth, fall back to custom token
      if (!session) {
        // Get token from cookies
        const token = request.cookies.get(TOKEN_STORAGE_KEY)?.value;
        // If no token found, redirect to login page
        if (!token) {
          // Get the locale from the pathname (first segment)
          const locale = pathname.split('/')[1];
          // Create URL for login page with the correct locale
          const loginUrl = new URL(`/${locale}/auth/login`, request.url);
          // Add the original URL as redirect parameter for redirecting after login
          loginUrl.searchParams.set('redirect', pathname);
          // Redirect to login page
          return NextResponse.redirect(loginUrl);
        }
      } else {
        // User is authenticated, now check role-based access
        const requiredRoles = getRequiredRoles(pathname);
        
        if (requiredRoles) {
          const userRoles = session.user?.roles as string[] | undefined;
          
          if (!hasRequiredRole(userRoles, requiredRoles)) {
            // User doesn't have required role, redirect to access denied or dashboard
            const locale = pathname.split('/')[1];
            const accessDeniedUrl = new URL(`/${locale}/app/access-denied`, request.url);
            // Add the original URL as parameter for better UX
            accessDeniedUrl.searchParams.set('attempted', pathname);
            accessDeniedUrl.searchParams.set('required', requiredRoles.join(','));
            return NextResponse.redirect(accessDeniedUrl);
          }
        }
      }
    }
    // If it has locale and is either authenticated or not a protected route, continue
    return
  }

  // At this point, we know the pathname doesn't have a locale
  // Redirect to locale path
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}