// Import sync modules
importScripts('auth.js', 'blocklist-sync.js', 'goal-sync.js');
// importScripts('activity-logger.js'); // DISABLED for now

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

  return blocklist.map((site, idx) => {
    // Strip protocols, www, and whitespace
    const cleanSite = site.replace(/^(https?:\/\/)?(www\.)?/, '').trim();

    return {
      id: generation * 10000 + (idx + 1),
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          url: 'http://localhost:3000/'
        }
      },
      condition: {
        // No trailing /* — anchors naked domains (e.g. https://x.com) and subroutes
        urlFilter: `||${cleanSite}`,
        resourceTypes: ['main_frame', 'sub_frame']
      }
    };
  });
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
    const guestResult = await chrome.storage.local.get(['guest_progress']);
    const guestGoal = guestResult.guest_progress || { target_daily: 1, progress_today: 0 };
    guestGoal.progress_today = 0;

    // New day - reset blocking, progress cache, and solve dedup trackers
    await chrome.storage.local.set({
      extension_blocking_enabled: true,
      extension_last_reset_date: today,
      daily_progress: 0,
      guest_progress: guestGoal,
      processed_submission_ids: [],
      daily_solved_slugs: [],
    });
    console.log('Background: New day detected, resetting extension, progress, and solve trackers');
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

  // Notify web app tabs of toggle state change
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.url && (tab.url.includes('localhost:3000') || tab.url.includes('leetguard.com'))) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_STATE_CHANGED',
          enabled: enabled
        }).catch(error => {
          // Tab might not have content script, that's okay
          console.log('Could not send toggle state to tab:', tab.id, error.message);
        });
      }
    }
    console.log('Background: Notified web app tabs of toggle state change:', { enabled });
  } catch (error) {
    console.error('Failed to notify web app tabs:', error);
  }

  console.log('Background: Blocking state updated:', { enabled });
}

// Idempotent transaction filter for LeetCode solve events
async function processSubmissionAccepted(message) {
  const submissionId = message.submissionId;
  const slug = message.slug;

  if (!submissionId || !slug) {
    console.warn('Background: SUBMISSION_ACCEPTED missing submissionId or slug, ignoring');
    return;
  }

  const result = await chrome.storage.local.get([
    'processed_submission_ids',
    'daily_solved_slugs',
  ]);
  const processedIds = result.processed_submission_ids || [];
  const solvedSlugs = result.daily_solved_slugs || [];

  // Guard 1 (anti-spam): drop duplicate /check/ poll cycles for the same submission
  if (processedIds.includes(submissionId)) {
    console.log('Background: Duplicate submissionId, dropping poll cycle:', submissionId);
    return;
  }

  // Guard 2 (anti-cheating): same problem slug already credited today
  if (solvedSlugs.includes(slug)) {
    console.log('Background: Problem already solved today, no progress increment:', slug);
    // Still record submissionId so repeated /check/ polls for this re-submit are dropped
    await chrome.storage.local.set({
      processed_submission_ids: [...processedIds, submissionId],
    });
    return;
  }

  // Both guards clear — record transaction before incrementing progress
  await chrome.storage.local.set({
    processed_submission_ids: [...processedIds, submissionId],
    daily_solved_slugs: [...solvedSlugs, slug],
  });

  await chrome.storage.local.set({ leetguardSolved: true, focusMode: false });
  await updateProgressOnProblemSolved();
}

function isGoalCompleted(goal) {
  if (!goal) {
    return false;
  }

  const progressToday = Number(goal.progress_today ?? 0);
  const targetDaily = Number(goal.target_daily ?? 0);
  return (
    goal.is_goal_completed === true ||
    (targetDaily > 0 && progressToday >= targetDaily)
  );
}

async function reconcileGoalCompletion(goal, context = 'goal sync') {
  if (!isGoalCompleted(goal)) {
    return false;
  }

  const { extension_blocking_enabled } = await chrome.storage.local.get([
    'extension_blocking_enabled',
  ]);

  if (extension_blocking_enabled !== false) {
    console.log(
      `Goal completed via ${context}! Automatically disabling extension blocking.`
    );
    await updateBlockingStorage(false);
  }

  return true;
}

// Update progress when a problem is solved
async function updateProgressOnProblemSolved() {
  try {
    try {
      await waitForSyncModules();
      if (extensionAuth) {
        await extensionAuth.init();
      }
    } catch (error) {
      console.warn(
        'Progress update continuing before sync modules are ready:',
        error
      );
    }

    // Get current goal data
    const goal = await getCurrentGoalData();

    // Increment progress
    const newProgress = (goal.progress_today || 0) + 1;
    let latestGoal = {
      ...goal,
      progress_today: newProgress,
      is_goal_completed:
        goal.is_goal_completed === true || newProgress >= goal.target_daily,
    };

    // Update local storage
    await chrome.storage.local.set({
      daily_progress: newProgress,
      progress_updated_at: Date.now()
    });

    // Update guest goal if in guest mode
    if (!extensionAuth || !extensionAuth.isAuthenticated()) {
      await chrome.storage.local.set({ guest_progress: latestGoal });
    } else if (goalSync) {
      await goalSync.applyGoalPayload({ goal: latestGoal });
    }

    // If user is authenticated, update backend
    if (extensionAuth && extensionAuth.isAuthenticated()) {
      try {
        const backendGoal = await extensionAuth.apiRequest(
          '/api/me/goal/progress',
          {
            method: 'POST',
            body: JSON.stringify({ delta: 1 })
          }
        );
        if (goalSync) {
          latestGoal =
            await goalSync.applyGoalPayload({ goal: backendGoal }) ||
            backendGoal;
        } else {
          latestGoal = backendGoal;
        }
        console.log('Progress updated on backend');
      } catch (error) {
        console.error('Failed to update progress on backend:', error);
        // Store for later sync
        await chrome.storage.local.set({
          pending_progress_update: newProgress
        });
      }
    }

    // Check if goal is completed and automatically disable blocking
    const goalCompleted = await reconcileGoalCompletion(
      latestGoal,
      'problem solved'
    );

    // Notify popup of progress update
    chrome.runtime.sendMessage({
      type: 'PROGRESS_UPDATED',
      progress: latestGoal.progress_today ?? newProgress,
      goal: latestGoal.target_daily ?? goal.target_daily,
      isGoalCompleted: goalCompleted
    }).catch(error => {
      // Popup might not be open, that's okay
      console.log('Could not send progress update to popup:', error.message);
    });

    console.log(
      `Progress updated: ${latestGoal.progress_today}/${latestGoal.target_daily}`
    );

  } catch (error) {
    console.error('Failed to update progress:', error);
  }
}

// Serialize concurrent full-sync requests
let syncEverythingChain = Promise.resolve();

async function waitForSyncModules(maxWaitMs = 5000) {
  const start = Date.now();
  while (!blocklistSync || !goalSync) {
    if (Date.now() - start > maxWaitMs) {
      throw new Error('Sync modules not ready');
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
}

// Fetch a complete authenticated user snapshot from the backend in parallel
async function syncEverything() {
  await waitForSyncModules();
  await extensionAuth.init();

  syncEverythingChain = syncEverythingChain.then(async () => {
    try {
      if (extensionAuth.isAuthenticated() && blocklistSync && goalSync) {
        const [, goal] = await Promise.all([
          blocklistSync.fetchUserBlocklist(),
          goalSync.fetchUserGoal(),
        ]);

        await chrome.storage.local.set({
          user_blocklist: blocklistSync.localBlocklist,
          user_goal: goal,
          daily_progress: goal?.progress_today ?? 0,
        });
        await reconcileGoalCompletion(goal, 'full sync');

        console.log('Background: syncEverything complete', {
          blocklistCount: blocklistSync.localBlocklist.length,
          targetDaily: goal?.target_daily,
          progressToday: goal?.progress_today,
        });
      } else {
        console.log('Background: syncEverything skipped (not authenticated)');
      }

      const { extension_blocking_enabled } = await chrome.storage.local.get([
        'extension_blocking_enabled',
      ]);
      if (extension_blocking_enabled !== false) {
        await enableBlocking();
      } else {
        await disableBlocking();
      }
    } catch (error) {
      console.error('Background: syncEverything failed:', error);
      const { extension_blocking_enabled } = await chrome.storage.local.get([
        'extension_blocking_enabled',
      ]);
      if (extension_blocking_enabled !== false) {
        await enableBlocking();
      }
    }
  });

  return syncEverythingChain;
}

async function runStartupRoutine() {
  console.log('Background: Running startup routine...');
  await initializeBlockingFromStorage();
  await syncEverything();
}

// Get current goal data (authenticated or guest)
async function getCurrentGoalData() {
  if (extensionAuth && extensionAuth.isAuthenticated() && goalSync) {
    return await goalSync.getCurrentGoal();
  } else {
    // Guest mode - get from storage or use default
    const result = await chrome.storage.local.get(['guest_progress']);
    const guestGoal = result.guest_progress || { target_daily: 1, progress_today: 0 };

    // Update guest goal in storage if it doesn't exist
    if (!result.guest_progress) {
      await chrome.storage.local.set({ guest_progress: guestGoal });
    }

    return guestGoal;
  }
}

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Background received message:', message);

  (async () => {
    try {
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

      // Problem solved — idempotent transaction filter before progress increment
      if (message && message.type === 'SUBMISSION_ACCEPTED') {
        console.log('Background: Submission accepted', {
          submissionId: message.submissionId,
          slug: message.slug,
        });

        // Log the activity - DISABLED for now
        // if (activityLogger) {
        //   activityLogger.logActivity({
        //     ...message.problemInfo,
        //     submissionId: message.submissionId
        //   }).catch(error => {
        //     console.error('Failed to log activity:', error);
        //   });
        // }

        await processSubmissionAccepted(message);
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
        if (!extensionAuth || !message.tokens) {
          console.error('Missing extensionAuth or tokens in OAuth callback');
          sendResponse({ success: false, error: 'Missing auth state or tokens' });
          return;
        }

        const success = await extensionAuth.handleOAuthCallback(message.tokens);
        if (success) {
          console.log('OAuth callback handled successfully');
          await syncEverything();
          // if (activityLogger) activityLogger.syncLocalActivities(); // DISABLED for now
        } else {
          console.error('OAuth callback handling failed');
        }

        sendResponse({ success });
        return;
      }

      // Blocklist updated from web app - trigger immediate sync and rule refresh
      if (message && message.type === 'BLOCKLIST_UPDATED') {
        console.log('Background: BLOCKLIST_UPDATED received', {
          hasPayload: !!message.payload,
        });
        if (blocklistSync) {
          await blocklistSync.syncBlocklist(message.payload ?? null);
        }
      }

      // Goal updated from web app — payload-driven sync or network fallback
      if (message && message.type === 'GOAL_UPDATED') {
        console.log('Background: GOAL_UPDATED received', {
          hasPayload: !!message.payload,
        });
        await waitForSyncModules();
        const goal = await goalSync.syncGoal(message.payload ?? null);
        await reconcileGoalCompletion(goal, 'goal sync');
      }

      // Logout handling
      if (message && message.type === 'USER_LOGOUT') {
        console.log('Background: Handling user logout');
        if (extensionAuth) {
          await extensionAuth.clearAuth();
        }

        if (blocklistSync) await blocklistSync.clearCachedBlocklist();
        if (goalSync) await goalSync.clearCachedGoal();
        if (typeof activityLogger !== 'undefined' && activityLogger) {
          await activityLogger.clearPendingActivities();
        }

        const { extension_blocking_enabled } = await chrome.storage.local.get([
          'extension_blocking_enabled',
        ]);
        if (extension_blocking_enabled !== false) {
          await enableBlocking();
        } else {
          await disableBlocking();
        }

        console.log('User logout handled successfully');
        sendResponse({ success: true });
        return;
      }

      // Note: localStorage auth change detection removed - extension now checks localStorage on-demand
      sendResponse({ success: true });
    } catch (error) {
      console.error('Background message handling failed:', error);
      sendResponse({ success: false, error: error?.message || String(error) });
    }
  })();

  return true;
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

chrome.runtime.onStartup.addListener(() => {
  console.log('Background: Extension startup');
  runStartupRoutine().catch((error) => {
    console.error('Background: Startup routine failed:', error);
  });
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Background: Extension installed');
  runStartupRoutine().catch((error) => {
    console.error('Background: Install startup routine failed:', error);
  });
});

// Service worker cold start (not covered by onStartup alone)
waitForSyncModules()
  .then(() => runStartupRoutine())
  .catch((error) => {
    console.error('Background: Cold start routine failed:', error);
  });
