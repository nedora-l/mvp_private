// Hook for authenticated Projects API client
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { ProjectsApiClient } from '@/lib/services/client/projects/projects.client';

export function useProjectsApi() {
  const { data: session } = useSession();
  
  const apiClient = useMemo(() => {
    const client = new ProjectsApiClient();
    
    // Set access token if available from session
    if (session?.user?.accessToken) {
      client.setAccessToken(session.user.accessToken);
    }
    
    return client;
  }, [session?.user?.accessToken]);

  return {
    apiClient,
    isAuthenticated: !!session?.user?.accessToken,
    session
  };
}
