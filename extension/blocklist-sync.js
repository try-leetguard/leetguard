// Blocklist synchronization for LeetGuard extension

class BlocklistSync {
  constructor(auth) {
    this.auth = auth;
    this.localBlocklist = [];
  }

  // Get user's blocklist from API
  async fetchUserBlocklist() {
    if (!this.auth.isAuthenticated()) {
      console.log('User not authenticated, using default blocklist');
      return this.getDefaultBlocklist();
    }

    try {
      const response = await this.auth.apiRequest('/api/blocklist');
      this.localBlocklist = response.websites || [];
      
      // Store in local storage for offline access
      await chrome.storage.local.set({ user_blocklist: this.localBlocklist });
      
      console.log('Fetched user blocklist:', this.localBlocklist);
      return this.localBlocklist;
    } catch (error) {
      console.error('Failed to fetch user blocklist:', error);
      
      // Fall back to cached blocklist or default
      const cached = await this.getCachedBlocklist();
      return cached.length > 0 ? cached : this.getDefaultBlocklist();
    }
  }

  // Get cached blocklist from storage
  async getCachedBlocklist() {
    const result = await chrome.storage.local.get(['user_blocklist']);
    return result.user_blocklist || [];
  }

  // Get default hardcoded blocklist
  getDefaultBlocklist() {
    return [
      'facebook.com',
      'reddit.com', 
      'youtube.com',
      'instagram.com',
      'x.com',
      'twitter.com'
    ];
  }

  // Add website to user's blocklist
  async addWebsite(website) {
    if (!this.auth.isAuthenticated()) {
      throw new Error('Must be logged in to customize blocklist');
    }

    try {
      await this.auth.apiRequest('/api/blocklist/add', {
        method: 'POST',
        body: JSON.stringify({ website })
      });

      // Update local cache
      if (!this.localBlocklist.includes(website)) {
        this.localBlocklist.push(website);
        await chrome.storage.local.set({ user_blocklist: this.localBlocklist });
      }

      return true;
    } catch (error) {
      console.error('Failed to add website to blocklist:', error);
      throw error;
    }
  }

  // Remove website from user's blocklist
  async removeWebsite(website) {
    if (!this.auth.isAuthenticated()) {
      throw new Error('Must be logged in to customize blocklist');
    }

    try {
      await this.auth.apiRequest('/api/blocklist/remove', {
        method: 'DELETE',
        body: JSON.stringify({ website })
      });

      // Update local cache
      this.localBlocklist = this.localBlocklist.filter(site => site !== website);
      await chrome.storage.local.set({ user_blocklist: this.localBlocklist });

      return true;
    } catch (error) {
      console.error('Failed to remove website from blocklist:', error);
      throw error;
    }
  }

  // Check if website is blocked
  async isWebsiteBlocked(website) {
    const blocklist = await this.getCurrentBlocklist();
    return blocklist.some(blockedSite => {
      // Simple domain matching
      return website.includes(blockedSite) || blockedSite.includes(website);
    });
  }

  // Get current effective blocklist (user's if authenticated, default otherwise)
  async getCurrentBlocklist() {
    if (this.auth.isAuthenticated()) {
      if (this.localBlocklist.length === 0) {
        return await this.fetchUserBlocklist();
      }
      return this.localBlocklist;
    }
    
    return this.getDefaultBlocklist();
  }

  // Sync blocklist periodically
  async syncBlocklist() {
    if (this.auth.isAuthenticated()) {
      try {
        await this.fetchUserBlocklist();
        console.log('Blocklist synced successfully');
      } catch (error) {
        console.error('Failed to sync blocklist:', error);
      }
    }
  }
}

// Initialize blocklist sync
let blocklistSync = null;

// Initialize after auth is ready
async function initializeBlocklistSync() {
  await extensionAuth.init();
  blocklistSync = new BlocklistSync(extensionAuth);
  
  // Initial sync
  await blocklistSync.syncBlocklist();
  
  // Set up periodic sync (every 5 minutes)
  setInterval(() => {
    blocklistSync.syncBlocklist();
  }, 5 * 60 * 1000);
}

// Initialize when script loads
initializeBlocklistSync();
