"use client";
import { ProjectsProvider } from "@/contexts/projects-context";
import { CollaboratorsProvider } from "@/contexts/collaborators-context";
import { TasksProvider } from "@/contexts/tasks-context";
import { SprintsProvider } from "@/contexts/sprints-context";
import NextAuthProvider from "@/components/auth/next-auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProjectsProvider>
        <CollaboratorsProvider>
          <TasksProvider>
            <SprintsProvider>
              <NextAuthProvider>
                {children}
                <Toaster />
                <Analytics />
                <SpeedInsights />
              </NextAuthProvider>
            </SprintsProvider>
          </TasksProvider>
        </CollaboratorsProvider>
      </ProjectsProvider>
    </ThemeProvider>
  );
}
