// LeetGuard Content Script for LeetCode pages
console.log('🎯 LeetGuard Content Script loaded');

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
      
      // Check if submission is accepted (status_code 10 = Accepted)
      if (statusData && statusData.status_code === 10) {
        console.log("✅ Submission ACCEPTED!");
        
        // Extract problem info from URL
        const urlParts = window.location.pathname.split('/');
        const problemSlug = urlParts[2]; // /problems/two-sum/...
        
        console.log(`🎉 Problem "${problemSlug}" solved successfully!`);
        
        // Show popup
        console.log("🎉 Creating congratulations popup...");
        showLeetGuardPopup(problemSlug);
        
        // Send message to background script
        chrome.runtime.sendMessage({
          type: "SUBMISSION_ACCEPTED",
          slug: problemSlug,
          submissionId: statusData.submission_id,
          timestamp: Date.now(),
          url: window.location.href,
          statusData: statusData
        });
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
  if (event.data && event.data.type === 'BLOCKLIST_UPDATED') {
    chrome.runtime.sendMessage({ type: 'BLOCKLIST_UPDATED' });
  }
});