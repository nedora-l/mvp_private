// lib/services/api-client.ts

// Determine the base URL based on the environment
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side, use a relative path that the browser will resolve against the current origin.
    // This assumes your Next.js app serves your API routes from the same domain.
    return '/api/v1';
  }
  // Server-side, construct an absolute URL.
  // It's good practice to use an environment variable for your application's public URL.
  // For local development, this will default to http://localhost:3000 (or the port your app runs on).
  // In production (e.g., on Vercel), NEXT_PUBLIC_APP_URL should be set to your canonical app URL.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`;
  return `${appUrl}/api/v1`;
};

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  token?: string; // For authenticated requests
  params?: Record<string, any>; // Added to support URL query parameters
}

async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers: customHeaders, token, params, ...restOptions } = options;
  const baseUrl = getApiBaseUrl(); // Determine base URL inside the function
  let url = `${baseUrl}${endpoint}`;

  // Construct URL with query parameters if params are provided
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) { // Ensure value is not undefined or null
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, String(v)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
  }

  // Use the Headers class for proper header management
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  // Add custom headers if any
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      if (value !== undefined) { // Ensure value is not undefined before setting
        headers.set(key, value as string);
      }
    });
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`); // Use .set() method
  }

  const config: RequestInit = {
    method,
    headers, // Pass the Headers object
    ...restOptions,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(response.statusText || `HTTP error! status: ${response.status}`);
    }
    const errorMessage = errorData?.message || errorData?.error?.message || `API Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export default apiClient;
