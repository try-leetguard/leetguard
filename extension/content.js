// LeetGuard Content Script for LeetCode pages
console.log('🎯 LeetGuard Content Script loaded');

// Listen for messages from web app
window.addEventListener('message', (event) => {
  if (event.data?.type === 'EXTENSION_TOGGLE') {
    console.log('Content script received toggle message from web app:', event.data.enabled);
    // Forward to background script
    chrome.runtime.sendMessage({
      type: 'EXTENSION_TOGGLE',
      enabled: event.data.enabled
    }).catch(error => {
      console.error('Failed to forward toggle message to background:', error);
    });
  } else if (event.data?.type === 'REQUEST_TOGGLE_STATE') {
    console.log('Content script received toggle state request from web app');
    // Get current state from storage and send back
    chrome.storage.local.get(['extension_blocking_enabled'], (result) => {
      const enabled = result.extension_blocking_enabled !== false; // Default to true
      window.postMessage({
        type: 'TOGGLE_STATE_CHANGED',
        enabled: enabled
      }, '*');
      console.log('Content script sent current toggle state to web app:', enabled);
    });
  }
});

// Listen for storage changes from extension
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.extension_blocking_enabled) {
    const enabled = changes.extension_blocking_enabled.newValue !== false; // Default to true
    console.log('Content script detected storage change:', enabled);
    // Notify web app of state change
    window.postMessage({
      type: 'TOGGLE_STATE_CHANGED',
      enabled: enabled
    }, '*');
  }
});

// Note: localStorage monitoring removed - extension now checks localStorage on-demand

// Inject script file into page context
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
script.onload = function() {
  this.remove();
};
script.onerror = function() {
  console.error("❌ Failed to load injected script");
};
document.documentElement.appendChild(script);

// Inject CSS for popup if not already present
function injectLeetGuardPopupCSS() {
  if (!document.getElementById('leetguard-popup-style')) {
    const style = document.createElement('link');
    style.id = 'leetguard-popup-style';
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.runtime.getURL('styles.css');
    document.head.appendChild(style);
  }
}

// Popup function to show when a problem is solved
function showLeetGuardPopup(problemSlug) {
  console.log("🎉 showLeetGuardPopup called with problemSlug:", problemSlug);
  
  injectLeetGuardPopupCSS();
  
  // Remove existing popup if present
  const existing = document.getElementById('leetguard-congrats-popup');
  if (existing) {
    console.log("🎉 Removing existing popup");
    existing.remove();
  }

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'leetguard-congrats-popup';
  popup.innerHTML = `🎉 Congratulations! You solved <b>${problemSlug}</b>! <span class="close-btn">✖</span>`;
  
  console.log("🎉 Popup HTML created:", popup.innerHTML);

  // Add close event
  popup.querySelector('.close-btn').onclick = () => {
    console.log("🎉 Close button clicked");
    popup.remove();
  };

  document.body.appendChild(popup);
  console.log("🎉 Popup added to body");

  // Auto-remove after 10 seconds
  setTimeout(() => {
    console.log("🎉 Auto-removing popup after 10 seconds");
    popup.remove();
  }, 10000);
}

// Listen for messages from the injected script
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data && event.data.source === "leetguard-injected") {
    console.log("Content script received message:", event.data);
    
    // Handle submission POST request
    if (event.data.type === "submission") {
      // Extract submission ID from response
      const submissionId = event.data.responseData?.submission_id;
      if (submissionId) {
        console.log("🆔 Submission ID:", submissionId);
      }
    }
    
    // Handle status check responses
    if (event.data.type === "status_check") {
      const statusData = event.data.responseData;
      console.log("📊 Status check response:", statusData);
      
      // Check if this is a real submission (not a test run)
      if (statusData && 
          statusData.status_code === 10 && 
          statusData.task_name === "judger.judgetask.Judge" &&
          statusData.question_id &&
          statusData.finished === true &&
          !statusData.submission_id.startsWith("runcode_")) {
        
        console.log("✅ Real submission ACCEPTED!");
        
        // Extract problem info from URL
        const urlParts = window.location.pathname.split('/');
        const problemSlug = urlParts[2]; // /problems/two-sum/...
        
        console.log(`🎉 Problem "${problemSlug}" solved successfully!`);
        
        // Show popup
        console.log("🎉 Creating congratulations popup...");
        showLeetGuardPopup(problemSlug);
        
        // Extract additional problem info from the page
        const titleElement = document.querySelector('[data-cy="question-title"]');
        const difficultyElement = document.querySelector('[diff]');
        
        const problemInfo = {
          problemSlug,
          url: window.location.href,
          problem_name: titleElement?.textContent?.trim() || problemSlug,
          difficulty: difficultyElement?.getAttribute('diff') || 'Unknown',
          timestamp: Date.now()
        };
        
        // Send message to background script
        chrome.runtime.sendMessage({
          type: "SUBMISSION_ACCEPTED",
          slug: problemSlug,
          submissionId: statusData.submission_id,
          timestamp: Date.now(),
          url: window.location.href,
          statusData: statusData,
          problemInfo: problemInfo
        });
      } else if (statusData && statusData.status_code === 10) {
        console.log("🧪 Test run detected (not a real submission)");
        console.log("Task name:", statusData.task_name);
        console.log("Submission ID:", statusData.submission_id);
      }
    }
  }
});

// Handle OAuth callback from web app
if (window.location.href.includes('extension-auth-callback')) {
  // Extract tokens from URL parameters or postMessage
  window.addEventListener('message', (event) => {
    if (event.origin !== 'http://localhost:3000') return;
    
    if (event.data.type === 'OAUTH_SUCCESS' && event.data.tokens) {
      // Send tokens to background script
      chrome.runtime.sendMessage({
        type: 'OAUTH_CALLBACK',
        tokens: event.data.tokens
      });
    }
  });
}

// Listen for blocklist updates from the web app and forward to background
window.addEventListener('message', (event) => {
  const allowedOrigins = new Set([
    'http://localhost:3000',
    'https://leetguard.com'
  ]);
  if (!allowedOrigins.has(event.origin)) return;
  if (!event.data) return;

  // Blocklist updated notification
  if (event.data.type === 'BLOCKLIST_UPDATED') {
    chrome.runtime.sendMessage({ type: 'BLOCKLIST_UPDATED' });
  }

  // Goal updated notification
  if (event.data.type === 'GOAL_UPDATED') {
    chrome.runtime.sendMessage({ type: 'GOAL_UPDATED' });
  }

  // Login/auth sync from web app
  if (event.data.type === 'LEETGUARD_AUTH_SYNC' && event.data.tokens) {
    chrome.runtime.sendMessage({
      type: 'OAUTH_CALLBACK',
      tokens: event.data.tokens,
      user: event.data.user
    });
  }

  // Logout from web app
  if (event.data.type === 'LEETGUARD_LOGOUT') {
    chrome.runtime.sendMessage({ type: 'USER_LOGOUT' });
  }
});