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
      
      // Store goal and keep daily_progress in sync
      await this.persistGoal(this.userGoal);
      
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
    await chrome.storage.local.remove(['user_goal', 'daily_progress']);
    console.log('Cached goal cleared');
  }

  // Persist goal to storage with unified progress counter
  async persistGoal(goal) {
    const progressToday = goal.progress_today ?? 0;
    await chrome.storage.local.set({
      user_goal: goal,
      daily_progress: progressToday,
    });
  }

  // Apply goal from web app payload (skip network)
  async applyGoalPayload(payloadData) {
    this.userGoal = payloadData.goal;
    await this.persistGoal(this.userGoal);
    console.log('Goal synced from payload:', this.userGoal);
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

  // Sync goal — payload-driven push or network fallback
  async syncGoal(payloadData = null) {
    if (!this.auth.isAuthenticated()) {
      return;
    }

    try {
      if (payloadData && payloadData.goal && typeof payloadData.goal === 'object') {
        await this.applyGoalPayload(payloadData);
      } else {
        await this.fetchUserGoal();
        console.log('Goal synced successfully');
      }
    } catch (error) {
      console.error('Failed to sync goal:', error);
    }
  }
}

// Initialize goal sync
let goalSync = null;

// Initialize after auth is ready (full snapshot sync runs from background.js)
async function initializeGoalSync() {
  await extensionAuth.init();
  goalSync = new GoalSync(extensionAuth);
}

// Initialize when script loads
initializeGoalSync();
