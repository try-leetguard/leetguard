// Import sync modules
importScripts('auth.js', 'blocklist-sync.js', 'activity-logger.js');

// Timer variables
let countdownInterval;
let remainingTime = 0;
let isPaused = false;
let currentTime = 25;

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

// Timer functions
function startCountdownTimer(initialTime, timeSetting) {
  console.log('Background: Starting countdown timer', initialTime, timeSetting);
  remainingTime = initialTime;
  currentTime = timeSetting;
  isPaused = false;
  
  // Enable blocking when timer starts
  enableBlocking();
  
  if (countdownInterval) clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    if (!isPaused) {
      remainingTime--;
      console.log('Background: Timer tick, remaining:', remainingTime);
      
      // Save state to storage
      chrome.storage.local.set({
        countdownActive: true,
        remainingTime: remainingTime,
        isPaused: isPaused,
        currentTime: currentTime
      });
      
      // Notify popup if it's open
      chrome.runtime.sendMessage({
        type: 'TIMER_UPDATE',
        remainingTime: remainingTime
      }).catch(err => {
        console.log('Background: Popup not open, message not sent');
      });
      
      if (remainingTime <= 0) {
        console.log('Background: Timer complete');
        clearInterval(countdownInterval);
        chrome.storage.local.remove(['countdownActive', 'remainingTime', 'isPaused']);
        chrome.runtime.sendMessage({ type: 'TIMER_COMPLETE' }).catch(err => {
          console.log('Background: Popup not open for completion message');
        });
        
        // Disable blocking when timer completes
        disableBlocking();
      }
    }
  }, 1000);
}

function togglePauseTimer(pauseState) {
  isPaused = pauseState;
  chrome.storage.local.set({
    countdownActive: true,
    remainingTime: remainingTime,
    isPaused: isPaused,
    currentTime: currentTime
  });
  
  // Keep blocking active even when paused - timer is still active
  console.log('Background: Timer paused, keeping sites blocked');
}

function resetTimer() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  isPaused = false;
  remainingTime = 0;
  chrome.storage.local.remove(['countdownActive', 'remainingTime', 'isPaused']);
  
  // Disable blocking when timer is reset
  disableBlocking();
  console.log('Background: Timer reset, sites unblocked');
}

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message) => {
  console.log('Background received message:', message);
  
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
  
  // Timer messages
  if (message && message.type === 'START_COUNTDOWN') {
    console.log('Background: Starting countdown with', message.remainingTime, message.currentTime);
    startCountdownTimer(message.remainingTime, message.currentTime);
  }
  
  if (message && message.type === 'TOGGLE_PAUSE') {
    console.log('Background: Toggling pause to', message.isPaused);
    togglePauseTimer(message.isPaused);
  }
  
  if (message && message.type === 'RESET_TIMER') {
    console.log('Background: Resetting timer');
    resetTimer();
  }
  
  // Note: OAuth callback handling removed - extension now checks localStorage on-demand
  
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

// On install or browser start, check timer state for blocking
function checkAndBlock() {
  chrome.storage.local.get(['countdownActive', 'remainingTime'], (data) => {
    if (data.countdownActive && data.remainingTime > 0) {
      enableBlocking();
      console.log('Background: Active timer found, sites blocked');
    } else {
      disableBlocking();
      console.log('Background: No active timer, sites unblocked');
    }
  });
}

// Restore timer state on startup
function restoreTimerState() {
  chrome.storage.local.get(['countdownActive', 'remainingTime', 'isPaused', 'currentTime'], (data) => {
    if (data.countdownActive && data.remainingTime > 0) {
      console.log('Background: Restoring timer state', data);
      remainingTime = data.remainingTime;
      isPaused = data.isPaused;
      if (data.currentTime) currentTime = data.currentTime;
      
      // Enable blocking if timer is active (even if paused)
      enableBlocking();
      console.log('Background: Timer restored, sites blocked');
      
      if (!isPaused) {
        startCountdownTimer(remainingTime, currentTime);
      }
    } else {
      // No active timer, ensure sites are unblocked
      disableBlocking();
      console.log('Background: No active timer, sites unblocked');
    }
  });
}

chrome.runtime.onStartup.addListener(() => {
  checkAndBlock();
  restoreTimerState();
});
chrome.runtime.onInstalled.addListener(() => {
  checkAndBlock();
  restoreTimerState();
});