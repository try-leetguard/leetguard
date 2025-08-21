// Activity logging for LeetCode submissions

class ActivityLogger {
  constructor(auth) {
    this.auth = auth;
    this.pendingActivities = [];
  }

  // Log a LeetCode problem submission
  async logActivity(activityData) {
    const activity = {
      problem_name: activityData.problemSlug || 'Unknown Problem',
      problem_url: activityData.url || window.location.href,
      difficulty: activityData.difficulty || 'Unknown',
      topic_tags: activityData.topicTags || [],
      status: 'completed',
      completed_at: new Date().toISOString(),
      submission_id: activityData.submissionId,
      ...activityData
    };

    if (this.auth.isAuthenticated()) {
      try {
        const response = await this.auth.apiRequest('/api/activity', {
          method: 'POST',
          body: JSON.stringify(activity)
        });
        
        console.log('Activity logged successfully:', response);
        return response;
      } catch (error) {
        console.error('Failed to log activity:', error);
        
        // Store for later sync if API call fails
        await this.storePendingActivity(activity);
        throw error;
      }
    } else {
      // Store locally if not authenticated
      await this.storeLocalActivity(activity);
      console.log('Activity stored locally (user not authenticated)');
    }
  }

  // Store activity locally when user is not authenticated
  async storeLocalActivity(activity) {
    const result = await chrome.storage.local.get(['local_activities']);
    const localActivities = result.local_activities || [];
    
    localActivities.push({
      ...activity,
      id: Date.now(), // Temporary local ID
      synced: false
    });

    // Keep only last 100 activities to prevent storage bloat
    if (localActivities.length > 100) {
      localActivities.splice(0, localActivities.length - 100);
    }

    await chrome.storage.local.set({ local_activities: localActivities });
  }

  // Store pending activity for retry
  async storePendingActivity(activity) {
    const result = await chrome.storage.local.get(['pending_activities']);
    const pendingActivities = result.pending_activities || [];
    
    pendingActivities.push({
      ...activity,
      retry_count: 0,
      created_at: Date.now()
    });

    await chrome.storage.local.set({ pending_activities: pendingActivities });
  }

  // Sync pending activities
  async syncPendingActivities() {
    if (!this.auth.isAuthenticated()) {
      return;
    }

    const result = await chrome.storage.local.get(['pending_activities']);
    const pendingActivities = result.pending_activities || [];

    if (pendingActivities.length === 0) {
      return;
    }

    console.log(`Syncing ${pendingActivities.length} pending activities...`);

    const successfullysynced = [];
    const failedActivities = [];

    for (const activity of pendingActivities) {
      try {
        await this.auth.apiRequest('/api/activity', {
          method: 'POST',
          body: JSON.stringify(activity)
        });
        
        successfullysynced.push(activity);
        console.log('Synced pending activity:', activity.problem_name);
      } catch (error) {
        console.error('Failed to sync activity:', error);
        
        // Increment retry count
        activity.retry_count = (activity.retry_count || 0) + 1;
        
        // Remove activities that have failed too many times (> 5 attempts)
        if (activity.retry_count <= 5) {
          failedActivities.push(activity);
        }
      }
    }

    // Update pending activities list
    await chrome.storage.local.set({ pending_activities: failedActivities });
    
    if (successfullysynced.length > 0) {
      console.log(`Successfully synced ${successfullysynced.length} activities`);
    }
  }

  // Sync local activities when user logs in
  async syncLocalActivities() {
    if (!this.auth.isAuthenticated()) {
      return;
    }

    const result = await chrome.storage.local.get(['local_activities']);
    const localActivities = result.local_activities || [];

    const unsynced = localActivities.filter(activity => !activity.synced);
    
    if (unsynced.length === 0) {
      return;
    }

    console.log(`Syncing ${unsynced.length} local activities...`);

    for (const activity of unsynced) {
      try {
        await this.auth.apiRequest('/api/activity', {
          method: 'POST',
          body: JSON.stringify(activity)
        });
        
        // Mark as synced
        activity.synced = true;
        console.log('Synced local activity:', activity.problem_name);
      } catch (error) {
        console.error('Failed to sync local activity:', error);
        // Leave as unsynced for next attempt
      }
    }

    // Update local activities
    await chrome.storage.local.set({ local_activities: localActivities });
  }

  // Get user's activity statistics
  async getActivityStats() {
    if (!this.auth.isAuthenticated()) {
      // Return local stats
      const result = await chrome.storage.local.get(['local_activities']);
      const localActivities = result.local_activities || [];
      
      return {
        total_problems: localActivities.length,
        completed_problems: localActivities.filter(a => a.status === 'completed').length,
        easy_problems: localActivities.filter(a => a.difficulty === 'Easy').length,
        medium_problems: localActivities.filter(a => a.difficulty === 'Medium').length,
        hard_problems: localActivities.filter(a => a.difficulty === 'Hard').length,
        source: 'local'
      };
    }

    try {
      const stats = await this.auth.apiRequest('/api/activity/stats');
      return { ...stats, source: 'api' };
    } catch (error) {
      console.error('Failed to get activity stats:', error);
      return null;
    }
  }

  // Extract problem info from LeetCode page
  extractProblemInfo(problemSlug, url) {
    // Try to extract additional info from the page
    const titleElement = document.querySelector('[data-cy="question-title"]');
    const difficultyElement = document.querySelector('[diff]');
    
    return {
      problemSlug,
      url,
      problem_name: titleElement?.textContent?.trim() || problemSlug,
      difficulty: difficultyElement?.getAttribute('diff') || 'Unknown',
      timestamp: Date.now()
    };
  }
}

// Initialize activity logger
let activityLogger = null;

async function initializeActivityLogger() {
  await extensionAuth.init();
  activityLogger = new ActivityLogger(extensionAuth);
  
  // Sync any pending activities
  await activityLogger.syncPendingActivities();
  
  // Set up periodic sync (every 2 minutes)
  setInterval(() => {
    activityLogger.syncPendingActivities();
  }, 2 * 60 * 1000);
}

// Initialize when script loads
initializeActivityLogger();
