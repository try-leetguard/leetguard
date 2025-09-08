// Goal synchronization for LeetGuard extension

class GoalSync {
  constructor(auth) {
    this.auth = auth;
    this.userGoal = null;
  }

  // Get user's goal from API
  async fetchUserGoal() {
    if (!this.auth.isAuthenticated()) {
      console.log('User not authenticated, using default goal');
      return this.getDefaultGoal();
    }

    try {
      const response = await this.auth.apiRequest('/api/me/goal');
      this.userGoal = response;
      
      // Store in local storage for offline access
      await chrome.storage.local.set({ user_goal: this.userGoal });
      
      console.log('Fetched user goal:', this.userGoal);
      return this.userGoal;
    } catch (error) {
      console.error('Failed to fetch user goal:', error);
      
      // Fall back to cached goal or default
      const cached = await this.getCachedGoal();
      return cached || this.getDefaultGoal();
    }
  }

  // Get cached goal from storage
  async getCachedGoal() {
    const result = await chrome.storage.local.get(['user_goal']);
    return result.user_goal || null;
  }

  // Clear cached goal from storage
  async clearCachedGoal() {
    this.userGoal = null;
    await chrome.storage.local.remove(['user_goal']);
    console.log('Cached goal cleared');
  }

  // Get default goal for guest users
  getDefaultGoal() {
    return {
      target_daily: 1,
      progress_today: 0,
      progress_date: new Date().toISOString().split('T')[0]
    };
  }

  // Get current effective goal (user's if authenticated, default otherwise)
  async getCurrentGoal() {
    if (this.auth.isAuthenticated()) {
      if (!this.userGoal) {
        return await this.fetchUserGoal();
      }
      return this.userGoal;
    }
    
    return this.getDefaultGoal();
  }

  // Sync goal periodically
  async syncGoal() {
    if (this.auth.isAuthenticated()) {
      try {
        await this.fetchUserGoal();
        console.log('Goal synced successfully');
      } catch (error) {
        console.error('Failed to sync goal:', error);
      }
    }
  }
}

// Initialize goal sync
let goalSync = null;

// Initialize after auth is ready
async function initializeGoalSync() {
  await extensionAuth.init();
  goalSync = new GoalSync(extensionAuth);
  
  // Initial sync
  await goalSync.syncGoal();
}

// Initialize when script loads
initializeGoalSync();
