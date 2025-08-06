import { NextRequest, NextResponse } from 'next/server';

// Mock database of saved passwords
const mockPasswordDatabase = [
  {
    id: "1",
    title: "Company Email",
    username: "user@company.com",
    password: "CompanySecure123!",
    website: "company.com",
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
    password: "CodeRepository456!",
    website: "github.com",
    platform: "github",
    category: "development",
    isFavorite: true,
    lastUpdated: "2025-04-10T14:25:00Z",
    strength: "strong"
  },
  {
    id: "5",
    title: "Salesforce Admin",
    username: "admin@company.com",
    password: "Salesf0rce@dmin!",
    website: "company.com",
    platform: "salesforce",
    category: "work",
    isFavorite: false,
    lastUpdated: "2025-02-20T11:15:00Z",
    strength: "strong"
  },
  {
    id: "6",
    title: "Gmail Personal",
    username: "john.smith.personal@gmail.com",
    password: "Personal3mail!",
    website: "gmail.com",
    platform: "google",
    category: "personal",
    isFavorite: true,
    lastUpdated: "2025-03-05T08:40:00Z",
    strength: "medium"
  },
  {
    id: "7",
    title: "Amazon Shopping",
    username: "jsmith@email.com",
    password: "Shop@Amazon123",
    website: "amazon.com",
    platform: "amazon",
    category: "shopping",
    isFavorite: false,
    lastUpdated: "2025-04-18T16:55:00Z",
    strength: "medium"
  },
  {
    id: "8",
    title: "Netflix",
    username: "smith.family",
    password: "Str3@ming!",
    website: "netflix.com",
    platform: "netflix",
    category: "entertainment",
    isFavorite: true,
    lastUpdated: "2025-01-30T19:20:00Z",
    strength: "weak"
  },
  {
    id: "9",
    title: "Facebook",
    username: "john.smith.1984",
    password: "S0cialM3dia!",
    website: "facebook.com",
    platform: "facebook",
    category: "social",
    isFavorite: false,
    lastUpdated: "2025-02-12T13:10:00Z",
    strength: "medium"
  },
  {
    id: "10",
    title: "Company GitHub",
    username: "company-dev",
    password: "C0mp@nyC0de!",
    website: "github.com",
    platform: "github",
    category: "work",
    isFavorite: true,
    lastUpdated: "2025-04-05T10:15:00Z",
    strength: "strong"
  }
];

export async function GET(request: NextRequest) {
  // Get domain from the query string
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get('domain');
  
  if (!domain) {
    return NextResponse.json(
      { error: 'Domain parameter is required' },
      { status: 400 }
    );
  }
  
  // In a real implementation, you would:
  // 1. Authenticate the request
  // 2. Verify the user has permission to access these credentials
  // 3. Query your actual database
  
  // For this mock API, filter the database for matching websites
  const matchingCredentials = mockPasswordDatabase.filter(entry => {
    // Extract domain from website field for comparison
    const entryDomain = extractDomain(entry.website);
    return entryDomain === domain;
  });
  
  // Return only necessary fields (no passwords!)
  const safeCredentials = matchingCredentials.map(({ id, title, username }) => ({
    id,
    title,
    username
  }));
  
  return NextResponse.json(safeCredentials);
}

// Helper function to extract domain from URL
function extractDomain(url: string): string {
  // Handle URLs without protocol
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }
  
  try {
    const hostname = new URL(url).hostname;
    return hostname;
  } catch (error) {
    // If URL parsing fails, return the original string
    return url;
  }
}