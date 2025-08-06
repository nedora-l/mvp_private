// Content script that runs on web pages to detect login forms

// Function to extract domain from current URL
function extractDomain(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

// Global variables
let currentCredentials = [];
let currentDropdown = null;
let currentUserField = null;
let currentPasswordField = null;
let activeIndex = -1;

// Function to detect login forms on the page
function detectLoginForms() {
  // Common selectors for username/email fields by autocomplete attribute first (preferred method)
  const usernameSelectors = [
    'input[autocomplete="username"]',
    'input[autocomplete="email"]',
    'input[type="email"]',
    'input[type="text"][name*="email"]',
    'input[type="text"][name*="user"]',
    'input[type="text"][id*="email"]',
    'input[type="text"][id*="user"]',
    'input[name="username"]',
    'input[id="username"]'
  ];
  
  // Common selectors for password fields
  const passwordSelectors = [
    'input[autocomplete="current-password"]',
    'input[type="password"]'
  ];
  
  // Find all potential username fields
  const potentialUsernameFields = [];
  usernameSelectors.forEach(selector => {
    const fields = document.querySelectorAll(selector);
    fields.forEach(field => {
      // Only add if not already in the array
      if (!potentialUsernameFields.includes(field)) {
        potentialUsernameFields.push(field);
      }
    });
  });
  
  // Find all potential password fields
  const potentialPasswordFields = [];
  passwordSelectors.forEach(selector => {
    const fields = document.querySelectorAll(selector);
    fields.forEach(field => {
      if (!potentialPasswordFields.includes(field)) {
        potentialPasswordFields.push(field);
      }
    });
  });
  
  if (potentialUsernameFields.length > 0) {
    // For each username field, add event listeners and find its paired password field
    potentialUsernameFields.forEach(usernameField => {
      // Find the closest password field (likely in the same form)
      let closestPasswordField = null;
      
      // Check if the username field is in a form
      if (usernameField.form) {
        // Find password fields in the same form
        const passwordInForm = Array.from(potentialPasswordFields).find(
          field => field.form === usernameField.form
        );
        
        if (passwordInForm) {
          closestPasswordField = passwordInForm;
        }
      } 
      
      // If no password field found in the same form, find the closest one on the page
      if (!closestPasswordField && potentialPasswordFields.length > 0) {
        closestPasswordField = potentialPasswordFields[0];
      }
      
      // Add focus event listener to show dropdown when user interacts with the field
      usernameField.addEventListener('focus', () => {
        // Store current active fields
        currentUserField = usernameField;
        currentPasswordField = closestPasswordField;
        
        // Check for credentials
        checkCredentialsForField(usernameField);
      });
      
      // Add click listener as well (sometimes focus doesn't trigger on mobile or certain browsers)
      usernameField.addEventListener('click', () => {
        if (currentUserField !== usernameField) {
          currentUserField = usernameField;
          currentPasswordField = closestPasswordField;
          checkCredentialsForField(usernameField);
        }
      });
      
      // Add input event to filter credentials if user starts typing
      usernameField.addEventListener('input', () => {
        if (currentCredentials.length > 0 && currentDropdown) {
          // Filter credentials based on what user has typed
          const inputValue = usernameField.value.toLowerCase();
          if (inputValue) {
            const filteredCredentials = currentCredentials.filter(
              cred => cred.username.toLowerCase().includes(inputValue)
            );
            // Update the dropdown with filtered results
            if (filteredCredentials.length > 0) {
              updateDropdownCredentials(filteredCredentials);
              showDropdown();
            } else {
              hideDropdown();
            }
          } else {
            // If field is empty, show all credentials
            updateDropdownCredentials(currentCredentials);
            showDropdown();
          }
        }
      });
      
      // Add keyboard navigation for dropdown
      usernameField.addEventListener('keydown', handleKeyNavigation);
    });
  }
}

// Function to handle keyboard navigation in dropdown
function handleKeyNavigation(e) {
  // Only process if dropdown is showing and we have credentials
  if (!currentDropdown || !currentCredentials.length) return;
  
  // Get credential items from dropdown
  const items = currentDropdown.querySelectorAll('.daws-credential-item');
  if (!items.length) return;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      highlightItem(items, activeIndex);
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      highlightItem(items, activeIndex);
      break;
      
    case 'Enter':
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        // Simulate click on the selected item
        const username = items[activeIndex].getAttribute('data-username');
        fillCredential(username);
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      hideDropdown();
      break;
  }
}

// Function to highlight a selected item in the dropdown
function highlightItem(items, index) {
  // Remove highlight from all items
  items.forEach(item => {
    item.classList.remove('daws-active');
  });
  
  // Add highlight to selected item if valid
  if (index >= 0 && index < items.length) {
    items[index].classList.add('daws-active');
    // Ensure the item is visible in the dropdown (scroll if needed)
    items[index].scrollIntoView({ block: 'nearest' });
  }
}

// Function to check for credentials and show dropdown
function checkCredentialsForField(field) {
  const domain = extractDomain(window.location.href);
  
  // Send message to background script to check for credentials
  chrome.runtime.sendMessage(
    { action: "checkCredentials", domain: domain },
    (response) => {
      if (response && response.success && response.credentials.length > 0) {
        // Store credentials for later use
        currentCredentials = response.credentials;
        
        // Show inline dropdown with credentials
        showCredentialDropdown(response.credentials, field);
      }
    }
  );
}

// Function to show an inline dropdown with available credentials
function showCredentialDropdown(credentials, targetField) {
  // Hide any existing dropdown
  hideDropdown();
  
  // Create dropdown element
  const dropdown = document.createElement('div');
  dropdown.className = 'daws-credentials-dropdown';
  
  // Get field position for dropdown positioning
  const fieldRect = targetField.getBoundingClientRect();
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  
  // Position dropdown below the field
  dropdown.style.position = 'absolute';
  dropdown.style.left = `${fieldRect.left + scrollX}px`;
  dropdown.style.top = `${fieldRect.bottom + scrollY}px`;
  dropdown.style.width = `${Math.max(fieldRect.width, 280)}px`;
  
  // Create dropdown content
  dropdown.innerHTML = `
    <div class="daws-dropdown-header">
      <img src="${chrome.runtime.getURL('icons/icon48.png')}" alt="DAWS Password Manager">
      <span>Saved credentials for this site</span>
    </div>
    <ul class="daws-credential-items">
      ${credentials.map((cred, index) => `
        <li class="daws-credential-item" data-username="${cred.username}" data-index="${index}">
          <div class="daws-cred-info">
            <div class="daws-cred-title">${cred.title}</div>
            <div class="daws-cred-username">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ${cred.username}
            </div>
          </div>
          <button class="daws-fill-btn" data-username="${cred.username}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            Fill
          </button>
        </li>
      `).join('')}
    </ul>
  `;
  
  // Store current dropdown globally
  currentDropdown = dropdown;
  
  // Reset active index for keyboard navigation
  activeIndex = -1;
  
  // Add to page
  document.body.appendChild(dropdown);
  
  // Add event listeners to fill buttons
  const fillButtons = dropdown.querySelectorAll('.daws-fill-btn');
  fillButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const username = button.getAttribute('data-username');
      fillCredential(username);
    });
  });
  
  // Add event listeners to credential items (click on item to fill)
  const credentialItems = dropdown.querySelectorAll('.daws-credential-item');
  credentialItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Only fill if click wasn't on the button (which has its own handler)
      if (!e.target.closest('.daws-fill-btn')) {
        const username = item.getAttribute('data-username');
        fillCredential(username);
      }
    });
    
    // Add hover effect to update active index
    item.addEventListener('mouseenter', () => {
      activeIndex = parseInt(item.getAttribute('data-index'));
      highlightItem(credentialItems, activeIndex);
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', closeDropdownOnOutsideClick);
  
  // Add slight animation
  setTimeout(() => {
    dropdown.classList.add('daws-show');
  }, 10);
}

// Function to fill credential in form
function fillCredential(username) {
  if (!currentUserField) return;
  
  // Find credential details
  const credential = currentCredentials.find(cred => cred.username === username);
  if (!credential) return;
  
  // Fill username field
  currentUserField.value = credential.username;
  currentUserField.dispatchEvent(new Event('input', { bubbles: true }));
  currentUserField.dispatchEvent(new Event('change', { bubbles: true }));
  
  // Add filled animation
  currentUserField.classList.add('daws-field-filled');
  setTimeout(() => {
    currentUserField.classList.remove('daws-field-filled');
  }, 1500);
  
  // If we have a password field, focus it next
  if (currentPasswordField) {
    currentPasswordField.focus();
  }
  
  // Hide dropdown
  hideDropdown();
}

// Function to update dropdown with filtered credentials
function updateDropdownCredentials(credentials) {
  if (!currentDropdown) return;
  
  const credList = currentDropdown.querySelector('.daws-credential-items');
  if (!credList) return;
  
  credList.innerHTML = credentials.map((cred, index) => `
    <li class="daws-credential-item" data-username="${cred.username}" data-index="${index}">
      <div class="daws-cred-info">
        <div class="daws-cred-title">${cred.title}</div>
        <div class="daws-cred-username">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          ${cred.username}
        </div>
      </div>
      <button class="daws-fill-btn" data-username="${cred.username}">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
        Fill
      </button>
    </li>
  `).join('');
  
  // Add event listeners to new items
  const fillButtons = currentDropdown.querySelectorAll('.daws-fill-btn');
  fillButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const username = button.getAttribute('data-username');
      fillCredential(username);
    });
  });
  
  const credentialItems = currentDropdown.querySelectorAll('.daws-credential-item');
  credentialItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.daws-fill-btn')) {
        const username = item.getAttribute('data-username');
        fillCredential(username);
      }
    });
    
    item.addEventListener('mouseenter', () => {
      activeIndex = parseInt(item.getAttribute('data-index'));
      highlightItem(credentialItems, activeIndex);
    });
  });
}

// Close dropdown when clicking outside
function closeDropdownOnOutsideClick(e) {
  if (currentDropdown && !currentDropdown.contains(e.target) && 
      (!currentUserField || !currentUserField.contains(e.target))) {
    hideDropdown();
  }
}

// Function to show dropdown (with animation)
function showDropdown() {
  if (currentDropdown) {
    currentDropdown.classList.add('daws-show');
  }
}

// Function to hide dropdown
function hideDropdown() {
  if (currentDropdown) {
    currentDropdown.classList.remove('daws-show');
    setTimeout(() => {
      if (currentDropdown && currentDropdown.parentNode) {
        currentDropdown.parentNode.removeChild(currentDropdown);
        document.removeEventListener('click', closeDropdownOnOutsideClick);
        currentDropdown = null;
      }
    }, 150);
  }
}

// Function to show a notification with available credentials (legacy method, keeping as fallback)
function showCredentialNotification(credentials, targetField) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'daws-password-manager-notification';
  notification.innerHTML = `
    <div class="daws-notification-header">
      <img src="${chrome.runtime.getURL('icons/icon48.png')}" alt="DAWS Password Manager">
      <h3>DAWS Password Manager</h3>
      <button class="daws-close-btn">×</button>
    </div>
    <div class="daws-notification-content">
      <p>${credentials.length} saved account${credentials.length > 1 ? 's' : ''} found for this website:</p>
      <ul class="daws-credential-list">
        ${credentials.map(cred => `
          <li class="daws-credential-item" data-username="${cred.username}">
            <span>${cred.title}</span>
            <span class="daws-username">${cred.username}</span>
            <button class="daws-fill-btn">Fill</button>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
  
  // Add styles
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.width = '300px';
  notification.style.backgroundColor = '#fff';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '9999';
  notification.style.fontFamily = 'Arial, sans-serif';
  notification.style.fontSize = '14px';
  notification.style.border = '1px solid #ddd';
  
  // Add to page
  document.body.appendChild(notification);
  
  // Close button handler
  const closeBtn = notification.querySelector('.daws-close-btn');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(notification);
  });
  
  // Fill credential handlers
  const credentialItems = notification.querySelectorAll('.daws-credential-item');
  credentialItems.forEach(item => {
    const fillBtn = item.querySelector('.daws-fill-btn');
    fillBtn.addEventListener('click', () => {
      const username = item.getAttribute('data-username');
      // Fill the username field
      if (targetField) {
        targetField.value = username;
        // Trigger input event to notify the page of changes
        targetField.dispatchEvent(new Event('input', { bubbles: true }));
        targetField.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // Remove notification
      document.body.removeChild(notification);
    });
  });
}

// Run detection when page is fully loaded
window.addEventListener('load', detectLoginForms);

// Also run when the DOM content is loaded (may be faster on some sites)
document.addEventListener('DOMContentLoaded', detectLoginForms);

// Add CSS for the notification and new dropdown
const style = document.createElement('style');
style.textContent = `
  /* Legacy notification styles */
  .daws-notification-header {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    background: #f8f9fa;
    border-radius: 8px 8px 0 0;
  }
  
  .daws-notification-header img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  
  .daws-notification-header h3 {
    margin: 0;
    flex-grow: 1;
    font-size: 16px;
  }
  
  .daws-close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }
  
  .daws-notification-content {
    padding: 10px;
  }
  
  .daws-credential-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .daws-credential-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #eee;
    justify-content: space-between;
  }
  
  .daws-credential-item:last-child {
    border-bottom: none;
  }
  
  .daws-username {
    color: #666;
    font-size: 12px;
    margin: 0 8px;
  }
  
  .daws-fill-btn {
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
  }
  
  /* New inline dropdown styles */
  .daws-credentials-dropdown {
    position: absolute;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08);
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 13px;
    z-index: 99999;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-5px);
    transition: all 0.15s ease-out;
  }
  
  .daws-credentials-dropdown.daws-show {
    max-height: 320px;
    opacity: 1;
    transform: translateY(0);
  }
  
  .daws-dropdown-header {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: linear-gradient(to right, #f8f9fa, #f3f4f6);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 8px 8px 0 0;
  }
  
  .daws-dropdown-header img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  
  .daws-dropdown-header span {
    font-size: 12px;
    font-weight: 500;
    color: #4b5563;
  }
  
  .daws-credential-items {
    list-style: none;
    padding: 6px;
    margin: 0;
    max-height: 250px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }
  
  .daws-credential-items::-webkit-scrollbar {
    width: 6px;
  }
  
  .daws-credential-items::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 6px;
  }
  
  .daws-credential-items::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 6px;
    border: 2px solid #f1f5f9;
  }
  
  .daws-credential-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }
  
  .daws-credential-item:hover, .daws-credential-item.daws-active {
    background-color: #f3f4f6;
  }
  
  .daws-credential-item:active {
    background-color: #e5e7eb;
  }
  
  .daws-cred-info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-right: 12px;
  }
  
  .daws-cred-title {
    font-weight: 600;
    font-size: 13px;
    color: #1f2937;
    margin-bottom: 3px;
  }
  
  .daws-cred-username {
    font-size: 12px;
    color: #6b7280;
    display: flex;
    align-items: center;
  }
  
  .daws-cred-username svg {
    margin-right: 4px;
    color: #9ca3af;
  }
  
  .daws-fill-btn {
    background: linear-gradient(135deg, #4f46e5, #4338ca);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: all 0.15s ease;
  }
  
  .daws-fill-btn:hover {
    background: linear-gradient(135deg, #4338ca, #3730a3);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  
  .daws-fill-btn:active {
    transform: translateY(0);
  }
  
  .daws-fill-btn svg {
    margin-right: 4px;
  }
  
  /* Animation for filled fields */
  @keyframes fieldFilled {
    0%, 100% { box-shadow: 0 0 0 rgba(79, 70, 229, 0); }
    50% { box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3); }
  }
  
  .daws-field-filled {
    animation: fieldFilled 1.5s ease;
    border-color: #4f46e5 !important;
    transition: border-color 0.3s ease;
  }
`;
document.head.appendChild(style);