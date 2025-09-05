// Import sync modules
importScripts('auth.js', 'blocklist-sync.js', 'activity-logger.js');

// Extension blocking state - now managed via storage
// No longer need isBlockingEnabled variable

// Note: Cross-tab auth detection removed - extension now checks localStorage on-demand

// Note: notifyAuthStateChange function removed - no longer needed with on-demand auth checking

// Generate blocking rules for each site
async function getBlockRules() {
  // Get current blocklist (user's if authenticated, default otherwise)
  const blocklist = blocklistSync ? 
    await blocklistSync.getCurrentBlocklist() : 
    ['facebook.com', 'reddit.com', 'youtube.com', 'instagram.com', 'x.com', 'twitter.com'];
    
  return blocklist.map((site, idx) => ({
    id: idx + 1,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: site,
      resourceTypes: ['main_frame']
    }
  }));
}

async function enableBlocking() {
  const rules = await getBlockRules();
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules,
    removeRuleIds: rules.map((_, idx) => idx + 1)
  });
}

async function disableBlocking() {
  const rules = await getBlockRules();
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [],
    removeRuleIds: rules.map((_, idx) => idx + 1)
  });
}

// Initialize blocking state from storage
async function initializeBlockingFromStorage() {
  console.log('Background: Initializing blocking state from storage...');
  
  const result = await chrome.storage.local.get(['extension_blocking_enabled', 'extension_last_reset_date']);
  
  // Check if we need to reset for new day
  const today = new Date().toISOString().split('T')[0];
  if (result.extension_last_reset_date !== today) {
    // New day - reset to enabled
    await chrome.storage.local.set({
      extension_blocking_enabled: true,
      extension_last_reset_date: today
    });
    console.log('Background: New day detected, resetting extension to enabled');
  }
  
  // Apply blocking based on storage state
  const isEnabled = result.extension_blocking_enabled !== false; // Default to true
  if (isEnabled) {
    await enableBlocking();
  } else {
    await disableBlocking();
  }
  
  console.log('Background: Blocking state initialized:', { isEnabled });
}

// Update blocking state in storage and apply changes
async function updateBlockingStorage(enabled) {
  await chrome.storage.local.set({ extension_blocking_enabled: enabled });
  
  if (enabled) {
    await enableBlocking();
  } else {
    await disableBlocking();
  }
  
  console.log('Background: Blocking state updated:', { enabled });
}

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener(async (message) => {
  console.log('Background received message:', message);
  
  // Extension toggle control
  if (message && message.type === 'EXTENSION_TOGGLE') {
    console.log('Background: Extension toggle to', message.enabled);
    await updateBlockingStorage(message.enabled);
  }
  
  // Focus mode toggle (now just for tracking, blocking is controlled by timer)
  if (message && message.type === 'FOCUS_MODE_TOGGLE') {
    console.log('Background: Focus mode toggled to', message.focusMode);
    // Blocking is now controlled by timer state, not focus mode
  }
  
  // Problem solved
  if (message && message.type === 'SUBMISSION_ACCEPTED') {
    console.log('Background: Submission accepted');
    // Turn off focus mode but keep timer running
    chrome.storage.local.set({ leetguardSolved: true, focusMode: false });
    
    // Log the activity
    if (activityLogger) {
      const problemInfo = activityLogger.extractProblemInfo(message.slug, message.url);
      activityLogger.logActivity({
        ...problemInfo,
        submissionId: message.submissionId,
        statusData: message.statusData
      }).catch(error => {
        console.error('Failed to log activity:', error);
      });
    }
  }
  
  // Storage sync messages
  if (message && message.type === 'SYNC_FROM_STORAGE') {
    console.log('Background: Received storage sync request');
    await initializeBlockingFromStorage();
  }
  
  // OAuth callback handling - webapp sends tokens to extension
  if (message && message.type === 'OAUTH_CALLBACK') {
    console.log('Background: Handling OAuth callback:', {
      hasExtensionAuth: !!extensionAuth,
      hasTokens: !!message.tokens,
      hasUser: !!message.user
    });
    if (extensionAuth && message.tokens) {
      extensionAuth.handleOAuthCallback(message.tokens).then(success => {
        if (success) {
          console.log('OAuth callback handled successfully');
          // Trigger sync after successful authentication
          if (blocklistSync) blocklistSync.syncBlocklist();
          if (activityLogger) activityLogger.syncLocalActivities();
        } else {
          console.error('OAuth callback handling failed');
        }
      }).catch(error => {
        console.error('OAuth callback handling error:', error);
      });
    } else {
      console.error('Missing extensionAuth or tokens in OAuth callback');
    }
  }
  
  // Logout handling
  if (message && message.type === 'USER_LOGOUT') {
    console.log('Background: Handling user logout');
    if (extensionAuth) {
      extensionAuth.clearAuth().then(() => {
        console.log('User logout handled successfully');
        // Clear any cached data
        if (blocklistSync) blocklistSync.clearCachedBlocklist();
        if (activityLogger) activityLogger.clearPendingActivities();
      });
    }
  }
  
  // Note: localStorage auth change detection removed - extension now checks localStorage on-demand
});

// Initialize sync modules when background script starts
chrome.runtime.onStartup.addListener(async () => {
  console.log('Background: Extension startup, initializing sync...');
  if (blocklistSync) await blocklistSync.syncBlocklist();
  if (activityLogger) await activityLogger.syncPendingActivities();
});

// On install or browser start, initialize blocking from storage
chrome.runtime.onStartup.addListener(() => {
  console.log('Background: Extension startup, initializing blocking from storage...');
  initializeBlockingFromStorage();
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Background: Extension installed, initializing blocking from storage...');
  initializeBlockingFromStorage();
}); 