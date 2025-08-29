// Import sync modules
importScripts('auth.js', 'blocklist-sync.js', 'activity-logger.js');

// Goal-based blocking variables
let isBlockingEnabled = false;

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

// Goal-based blocking functions
async function checkGoalAndUpdateBlocking() {
  console.log('Background: Checking goal completion state...');
  
  // Check if user is authenticated
  if (typeof extensionAuth !== 'undefined') {
    await extensionAuth.init();
  }
  
  if (typeof extensionAuth !== 'undefined' && extensionAuth.isAuthenticated()) {
    // Authenticated user - check goal via API
    try {
      const goalData = await extensionAuth.apiRequest('/api/me/goal');
      const shouldBlock = goalData.progress_today < goalData.target_daily;
      
      console.log('Background: Authenticated user goal state:', {
        progress: goalData.progress_today,
        target: goalData.target_daily,
        shouldBlock: shouldBlock
      });
      
      if (shouldBlock && !isBlockingEnabled) {
        await enableBlocking();
        isBlockingEnabled = true;
      } else if (!shouldBlock && isBlockingEnabled) {
        await disableBlocking();
        isBlockingEnabled = false;
      }
    } catch (error) {
      console.error('Background: Failed to check authenticated user goal:', error);
    }
  } else {
    // Guest user - check guest progress
    const result = await chrome.storage.local.get(['guest_progress']);
    if (result.guest_progress) {
      const guestProgress = result.guest_progress;
      const shouldBlock = guestProgress.progress_today < guestProgress.target_daily;
      
      console.log('Background: Guest user goal state:', {
        progress: guestProgress.progress_today,
        target: guestProgress.target_daily,
        shouldBlock: shouldBlock
      });
      
      if (shouldBlock && !isBlockingEnabled) {
        await enableBlocking();
        isBlockingEnabled = true;
      } else if (!shouldBlock && isBlockingEnabled) {
        await disableBlocking();
        isBlockingEnabled = false;
      }
    } else {
      // No guest progress found, enable blocking by default
      if (!isBlockingEnabled) {
        await enableBlocking();
        isBlockingEnabled = true;
      }
    }
  }
}

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message) => {
  console.log('Background received message:', message);
  
  // Extension toggle control
  if (message && message.type === 'EXTENSION_TOGGLE') {
    console.log('Background: Extension toggle to', message.enabled);
    if (message.enabled) {
      enableBlocking();
    } else {
      disableBlocking();
    }
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
  
  // Goal-based blocking messages
  if (message && message.type === 'CHECK_GOAL_AND_UPDATE') {
    console.log('Background: Received goal check request');
    checkGoalAndUpdateBlocking();
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

// On install or browser start, check goal state for blocking
function checkAndBlock() {
  console.log('Background: Checking goal state on startup...');
  checkGoalAndUpdateBlocking();
}

chrome.runtime.onStartup.addListener(() => {
  checkAndBlock();
});
chrome.runtime.onInstalled.addListener(() => {
  checkAndBlock();
});