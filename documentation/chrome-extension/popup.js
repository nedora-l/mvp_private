document.addEventListener('DOMContentLoaded', function() {
  const siteDomainElement = document.getElementById('site-domain');
  const credentialsListElement = document.getElementById('credentials-list');
  const noCredentialsElement = document.getElementById('no-credentials');
  const checkSiteBtn = document.getElementById('check-site-btn');
  const openManagerBtn = document.getElementById('open-manager-btn');
  const connectionStatus = document.getElementById('connection-status');
  
  // Get the current tab's URL
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    // Check if we're on a webpage
    if (currentTab && currentTab.url && currentTab.url.startsWith('http')) {
      const url = new URL(currentTab.url);
      const domain = url.hostname;
      
      // Display the current site
      siteDomainElement.textContent = domain;
      
      // Check for credentials automatically
      checkCredentials(domain);
      
      // Add button event listeners
      checkSiteBtn.addEventListener('click', function() {
        addLoadingAnimation(checkSiteBtn);
        checkCredentials(domain, true); // Pass true to bypass cache
      });
    } else {
      // Not on a webpage
      siteDomainElement.textContent = "Not a website";
      noCredentialsElement.textContent = "Navigate to a website to check for saved credentials.";
      noCredentialsElement.classList.remove('hidden');
      checkSiteBtn.disabled = true;
    }
    
    // Add open manager button listener
    openManagerBtn.addEventListener('click', function() {
      // Open the password manager in a new tab
      chrome.tabs.create({url: 'https://da-workspace-mvp.vercel.app/password-manager'});
    });
    
    // Check API connection
    checkApiConnection();
  });
  
  // Function to check API connection
  function checkApiConnection() {
    fetch('https://da-workspace-mvp.vercel.app/api/password-manager/credentials?domain=test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token'
      }
    })
    .then(response => {
      if (response.ok) {
        // API is connected
        connectionStatus.className = 'status connected';
        connectionStatus.querySelector('.status-text').textContent = 'Connected to DAWS';
      } else {
        // API returned an error
        showDisconnectedState();
      }
    })
    .catch(error => {
      // API couldn't be reached
      showDisconnectedState();
    });
  }
  
  // Function to show disconnected state
  function showDisconnectedState() {
    connectionStatus.className = 'status disconnected';
    connectionStatus.querySelector('.status-text').textContent = 'Disconnected from DAWS';
  }
  
  // Function to check for credentials for the current site
  function checkCredentials(domain, bypassCache = false) {
    // Clear previous credentials
    credentialsListElement.innerHTML = '';
    
    // Show loading state
    credentialsListElement.innerHTML = '<div class="loading">Checking for saved credentials...</div>';
    
    // Send message to background script to check for credentials
    chrome.runtime.sendMessage(
      { 
        action: "checkCredentials", 
        domain: domain,
        bypassCache: bypassCache 
      },
      function(response) {
        // Clear loading state
        credentialsListElement.innerHTML = '';
        removeLoadingAnimation(checkSiteBtn);
        
        if (response && response.success && response.credentials.length > 0) {
          // Hide "no credentials" message
          noCredentialsElement.classList.add('hidden');
          
          // Display credentials
          response.credentials.forEach(credential => {
            const credentialElement = document.createElement('div');
            credentialElement.className = 'credential-item';
            credentialElement.setAttribute('data-id', credential.id);
            
            credentialElement.innerHTML = `
              <div class="credential-info">
                <div class="credential-title">${credential.title}</div>
                <div class="credential-username">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  ${credential.username}
                </div>
              </div>
              <button class="use-btn" data-username="${credential.username}">
                <span>Use</span>
              </button>
            `;
            
            credentialsListElement.appendChild(credentialElement);
            
            // Add hover animation
            addHoverEffect(credentialElement);
          });
          
          // Add event listeners to "Use" buttons
          const useButtons = document.querySelectorAll('.use-btn');
          useButtons.forEach(button => {
            button.addEventListener('click', function() {
              const username = this.getAttribute('data-username');
              
              // Show a brief "filling" state
              this.innerHTML = '<span class="loading-spinner"></span> <span>Filling...</span>';
              this.disabled = true;
              
              // Send message to content script to fill the username field
              chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.runtime.sendMessage({
                  action: "fillCredential",
                  username: username
                });
              });
              
              // Close the popup after a short delay to show the filling state
              setTimeout(() => {
                window.close();
              }, 500);
            });
          });
        } else {
          // Show "no credentials" message
          noCredentialsElement.classList.remove('hidden');
        }
      }
    );
  }
  
  // Function to add loading animation to a button
  function addLoadingAnimation(button) {
    const originalContent = button.innerHTML;
    button.setAttribute('data-original-content', originalContent);
    button.innerHTML = '<span class="loading-spinner"></span> Checking...';
    button.disabled = true;
  }
  
  // Function to remove loading animation from a button
  function removeLoadingAnimation(button) {
    const originalContent = button.getAttribute('data-original-content');
    if (originalContent) {
      button.innerHTML = originalContent;
      button.disabled = false;
    }
  }
  
  // Function to add hover effect to credential items
  function addHoverEffect(element) {
    element.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-1px)';
      this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  }
});