// Import sync modules
importScripts('auth.js', 'blocklist-sync.js', 'activity-logger.js');

// Extension blocking state - now managed via storage
// No longer need isBlockingEnabled variable

// Default blocklist for guest users and fallback scenarios
const DEFAULT_BLOCKLIST = [
  'facebook.com',
  'reddit.com', 
  'youtube.com',
  'instagram.com',
  'x.com',
  'twitter.com'
];

// Note: Cross-tab auth detection removed - extension now checks localStorage on-demand

// Note: notifyAuthStateChange function removed - no longer needed with on-demand auth checking

// Generation counter and single-flight queue for dynamic rule updates
let rulesGeneration = 0; // monotonically increasing generation number
let rulesUpdateChain = Promise.resolve(); // serialize updates

function enqueueRuleUpdate(task) {
  rulesUpdateChain = rulesUpdateChain.then(() => task()).catch((e) => {
    console.error('Rule update task failed:', e);
  });
  return rulesUpdateChain;
}

// Generate blocking rules for each site, using generation-scoped unique IDs
async function getBlockRules(generation) {
  // Get current blocklist (user's if authenticated, default otherwise)
  let blocklist = DEFAULT_BLOCKLIST;
  
  if (blocklistSync) {
    try {
      blocklist = await blocklistSync.getCurrentBlocklist();
    } catch (error) {
      console.log('Using default blocklist (user not authenticated or sync failed):', error.message);
      blocklist = DEFAULT_BLOCKLIST;
    }
  }
    
  return blocklist.map((site, idx) => ({
    id: generation * 10000 + (idx + 1),
    priority: 1,
    action: {
      type: 'redirect',
      redirect: {
        url: 'http://localhost:3000/'
      }
    },
    condition: {
      urlFilter: `||${site}/*`,
      resourceTypes: ['main_frame', 'sub_frame']
    }
  }));
}

// Debug-friendly wrapper for updating dynamic rules
async function updateDynamicRules(rules) {
  try {
    // Log DNR rule limits
    const limits = chrome.declarativeNetRequest.MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES;
    console.log('Rule limits:', limits);

    console.log('🔄 Starting updateDynamicRules with:', rules);
    
    // Check current state
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    console.log('📋 Existing rules before update:', existingRules);
    
    const ruleIdsToRemove = existingRules.map(rule => rule.id);
    
    // Perform the update
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: rules
    });
    
    console.log('✅ updateDynamicRules completed successfully');
    
    // Verify the update worked
    const finalRules = await chrome.declarativeNetRequest.getDynamicRules();
    console.log('🔍 Final rules after update:', finalRules);
    
    if (finalRules.length === 0 && rules.length > 0) {
      console.error('⚠️ WARNING: Rules were supposed to be added but none are active!');
    }
    
  } catch (error) {
    console.error('❌ updateDynamicRules failed:', error);
    console.error('Error details:', error.message, error.stack);
  }
}

async function enableBlocking() {
  const generation = ++rulesGeneration;
  return enqueueRuleUpdate(async () => {
    const rules = await getBlockRules(generation);
    await updateDynamicRules(rules);
  });
}

async function disableBlocking() {
  return enqueueRuleUpdate(async () => {
    await updateDynamicRules([]);
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
      extensionAuth.handleOAuthCallback(message.tokens).then(async success => {
        if (success) {
          console.log('OAuth callback handled successfully');
          // Trigger sync after successful authentication
          if (blocklistSync) await blocklistSync.syncBlocklist();
          // Immediately refresh rules to apply latest blocklist
          await enableBlocking();
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

  // Blocklist updated from web app - trigger immediate sync and rule refresh
  if (message && message.type === 'BLOCKLIST_UPDATED') {
    console.log('Background: BLOCKLIST_UPDATED received, syncing and refreshing rules');
    try {
      if (blocklistSync) await blocklistSync.syncBlocklist();
      await enableBlocking();
    } catch (e) {
      console.error('Failed to sync/refresh after blocklist update:', e);
    }
  }
  
  // Logout handling
  if (message && message.type === 'USER_LOGOUT') {
    console.log('Background: Handling user logout');
    if (extensionAuth) {
      extensionAuth.clearAuth().then(async () => {
        console.log('User logout handled successfully');
        // Clear any cached data
        if (blocklistSync) blocklistSync.clearCachedBlocklist();
        if (activityLogger) activityLogger.clearPendingActivities();
        // Apply default blocklist immediately by refreshing rules
        try {
          await enableBlocking();
        } catch (e) {
          console.error('Failed to refresh rules after logout:', e);
        }
      });
    }
  }
  
  // Note: localStorage auth change detection removed - extension now checks localStorage on-demand
});

// Debug: Log when a tab navigates to a potentially blocked URL
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    const url = changeInfo.url || tab?.url;
    if (!url) return;

    // Only consider http(s) main-frame navigations
    if (!url.startsWith('http://') && !url.startsWith('https://')) return;

    // Determine if URL is on a known blocked domain without triggering auth checks
    const isBlocked = DEFAULT_BLOCKLIST.some(site => url.includes(site));

    if (!isBlocked) return;

    // Gather context for debugging
    const [existingRules, storage] = await Promise.all([
      chrome.declarativeNetRequest.getDynamicRules(),
      chrome.storage.local.get(['extension_blocking_enabled'])
    ]);

    console.log('🧭 Navigation to blocked URL detected:', {
      tabId,
      url,
      extensionEnabled: storage.extension_blocking_enabled !== false,
      dynamicRuleCount: existingRules.length,
      sampleRule: existingRules[0] || null
    });

    // After a short delay, check where the tab ended up to infer redirect success
    setTimeout(async () => {
      try {
        const latestTab = await chrome.tabs.get(tabId);
        const finalUrl = latestTab?.url || null;
        const redirected = !!finalUrl && (
          finalUrl.startsWith('http://localhost:3000/') ||
          finalUrl.startsWith('https://localhost:3000/') ||
          finalUrl.startsWith('https://leetguard.com/')
        );

        console.log('🚦 Redirect result:', {
          tabId,
          from: url,
          to: finalUrl,
          redirected
        });
      } catch (e) {
        console.error('Failed to verify redirect result:', e);
      }
    }, 600);
  } catch (error) {
    console.error('Navigation debug logging failed:', error);
  }
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