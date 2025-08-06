"use client";
import { ProjectsProvider } from "@/contexts/projects-context";
import NextAuthProvider from "@/components/auth/next-auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProjectsProvider>
        <NextAuthProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </NextAuthProvider>
      </ProjectsProvider>
    </ThemeProvider>
  );
}
