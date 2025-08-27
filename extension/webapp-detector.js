// LeetGuard Extension - Web App Detection Script
// This script runs on the web app to enable extension detection

console.log('🔌 LeetGuard Extension: Web app detector loaded');

// Detect if extension is in developer mode
const isDeveloperMode = () => {
  // Check if extension is unpacked (developer mode)
  return !('update_url' in chrome.runtime.getManifest());
};

// Get extension metadata
const getExtensionInfo = () => {
  const manifest = chrome.runtime.getManifest();
  return {
    version: manifest.version,
    name: manifest.name,
    isDeveloperMode: isDeveloperMode(),
    id: chrome.runtime.id
  };
};

// Inject extension detection marker into DOM
const injectDetectionMarker = () => {
  const marker = document.createElement('div');
  marker.id = 'leetguard-extension-installed';
  marker.style.display = 'none';
  
  const extensionInfo = getExtensionInfo();
  
  // Add extension metadata as data attributes
  marker.setAttribute('data-version', extensionInfo.version);
  marker.setAttribute('data-name', extensionInfo.name);
  marker.setAttribute('data-dev-mode', extensionInfo.isDeveloperMode.toString());
  marker.setAttribute('data-extension-id', extensionInfo.id);
  marker.setAttribute('data-detected-at', Date.now().toString());
  
  document.documentElement.appendChild(marker);
  console.log('🔌 LeetGuard Extension: Detection marker injected', extensionInfo);
};

// Add extension info to window object (backup detection method)
const injectWindowProperty = () => {
  const extensionInfo = getExtensionInfo();
  
  window.leetguardExtension = {
    installed: true,
    version: extensionInfo.version,
    name: extensionInfo.name,
    isDeveloperMode: extensionInfo.isDeveloperMode,
    extensionId: extensionInfo.id,
    detectedAt: Date.now(),
    features: [
      'blocklist-sync',
      'activity-tracking',
      'focus-timer',
      'leetcode-detection'
    ]
  };
  
  console.log('🔌 LeetGuard Extension: Window property injected', window.leetguardExtension);
};

// Listen for ping messages from web app
const setupMessageListener = () => {
  window.addEventListener('message', (event) => {
    // Only respond to messages from same origin
    if (event.origin !== window.location.origin) {
      return;
    }
    
    if (event.data?.type === 'LEETGUARD_PING') {
      console.log('🔌 LeetGuard Extension: Received ping from web app');
      
      const extensionInfo = getExtensionInfo();
      
      // Send response with extension info
      window.postMessage({
        type: 'LEETGUARD_PONG',
        version: extensionInfo.version,
        name: extensionInfo.name,
        isDeveloperMode: extensionInfo.isDeveloperMode,
        extensionId: extensionInfo.id,
        features: [
          'blocklist-sync',
          'activity-tracking', 
          'focus-timer',
          'leetcode-detection'
        ],
        timestamp: Date.now()
      }, '*');
      
      console.log('🔌 LeetGuard Extension: Sent pong response');
    }
  });
  
  console.log('🔌 LeetGuard Extension: Message listener setup complete');
};

// Note: Auth sync listener removed - extension now checks localStorage on-demand

// Initialize detection when DOM is ready
const initialize = () => {
  try {
    injectDetectionMarker();
    injectWindowProperty();
    setupMessageListener();
    
    // Notify web app that extension is ready
    window.dispatchEvent(new CustomEvent('leetguardExtensionReady', {
      detail: getExtensionInfo()
    }));
    
    console.log('🔌 LeetGuard Extension: Web app detection initialized successfully');
  } catch (error) {
    console.error('🔌 LeetGuard Extension: Failed to initialize web app detection:', error);
  }
};

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
