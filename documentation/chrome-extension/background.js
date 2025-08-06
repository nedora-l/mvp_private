// Background script for handling communication between content scripts and the API

// Global store of cached credentials to reduce API calls
const cachedCredentials = {};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkCredentials") {
    // Check if we have cached credentials for this domain
    if (cachedCredentials[request.domain] && Date.now() - cachedCredentials[request.domain].timestamp < 60000) {
      // Use cached credentials if they are less than 1 minute old
      sendResponse({ 
        success: true, 
        credentials: cachedCredentials[request.domain].data,
        fromCache: true 
      });
    } else {
      // Fetch fresh credentials from API
      fetchCredentials(request.domain)
        .then(credentials => {
          // Cache the credentials with a timestamp
          cachedCredentials[request.domain] = {
            data: credentials,
            timestamp: Date.now()
          };
          
          sendResponse({ success: true, credentials });
        })
        .catch(error => {
          sendResponse({ success: false, error: error.message });
        });
    }
    
    // Return true to indicate we'll respond asynchronously
    return true;
  } else if (request.action === "fillCredential") {
    // Forward the fill credential request to the active tab's content script
    // This is used by the popup to trigger a fill action
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, request);
      }
    });
    return false;
  }
});

// Function to fetch credentials from your password manager API
async function fetchCredentials(domain) {
  // Use local development server for testing
  try {
    const response = await fetch(`https://da-workspace-mvp.vercel.app/api/password-manager/credentials?domain=${encodeURIComponent(domain)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        'Authorization': 'Bearer test_token'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching credentials:', error);
    
    // For testing without an API, return mock data
    return mockCredentialsData(domain);
  }
}

// Mock data function for testing without an API
function mockCredentialsData(domain) {
  const mockData = {
    'github.com': [
      { username: 'devjsmith', title: 'GitHub', id: '4' },
      { username: 'company-dev', title: 'Company GitHub', id: '10' }
    ],
    'gmail.com': [
      { username: 'john.smith.personal@gmail.com', title: 'Gmail Personal', id: '6' }
    ],
    'amazon.com': [
      { username: 'jsmith@email.com', title: 'Amazon Shopping', id: '7' }
    ],
    'facebook.com': [
      { username: 'john.smith.1984', title: 'Facebook', id: '9' }
    ],
    'linkedin.com': [
      { username: 'john.smith@email.com', title: 'LinkedIn', id: '3' }
    ],
    'company.com': [
      { username: 'user@company.com', title: 'Company Email', id: '1' },
      { username: 'admin@company.com', title: 'Salesforce Admin', id: '5' }
    ]
  };
  
  return mockData[domain] || [];
}