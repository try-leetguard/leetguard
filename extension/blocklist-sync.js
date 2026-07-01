// Blocklist synchronization for LeetGuard extension

class BlocklistSync {
  constructor(auth) {
    this.auth = auth;
    this.localBlocklist = [];
    this.hasFetchedBlocklist = false;
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
      this.hasFetchedBlocklist = true;

      // Store in local storage for offline access
      await chrome.storage.local.set({ user_blocklist: this.localBlocklist });

      console.log('Fetched user blocklist:', this.localBlocklist);
      return this.localBlocklist;
    } catch (error) {
      console.error('Failed to fetch user blocklist:', error);
      
      // Authenticated users should only use account data. If the API fails and
      // no cached list exists, block nothing instead of guest defaults.
      const cached = await this.getCachedBlocklist();
      this.localBlocklist = cached;
      this.hasFetchedBlocklist = true;
      return cached;
    }
  }

  // Get cached blocklist from storage
  async getCachedBlocklist() {
    const result = await chrome.storage.local.get(['user_blocklist']);
    return result.user_blocklist || [];
  }

  // Clear cached blocklist from storage
  async clearCachedBlocklist() {
    this.localBlocklist = [];
    this.hasFetchedBlocklist = false;
    await chrome.storage.local.remove(['user_blocklist']);
    console.log('Cached blocklist cleared');
  }

  // Get default hardcoded blocklist
  getDefaultBlocklist() {
    return [
      'facebook.com',
      'reddit.com', 
      'youtube.com',
      'instagram.com',
      'x.com'
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
        this.hasFetchedBlocklist = true;
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
      this.hasFetchedBlocklist = true;
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
      // Proper domain matching - check for exact match or subdomain
      const websiteDomain = this.extractDomain(website);
      const blockedDomain = this.extractDomain(blockedSite);
      
      // Exact domain match
      if (websiteDomain === blockedDomain) {
        return true;
      }
      
      // Subdomain match (e.g., www.example.com matches example.com)
      return websiteDomain.endsWith('.' + blockedDomain);
    });
  }

  // Extract domain from URL
  extractDomain(url) {
    try {
      // Remove protocol if present
      let domain = url.replace(/^https?:\/\//, '');
      // Remove www. prefix
      domain = domain.replace(/^www\./, '');
      // Remove path and query parameters
      domain = domain.split('/')[0].split('?')[0].split('#')[0];
      return domain.toLowerCase();
    } catch (error) {
      return url.toLowerCase();
    }
  }

  // Get current effective blocklist (account data if authenticated, guest default otherwise)
  async getCurrentBlocklist() {
    if (this.auth.isAuthenticated()) {
      if (!this.hasFetchedBlocklist) {
        return await this.fetchUserBlocklist();
      }
      return this.localBlocklist;
    }

    return this.getDefaultBlocklist();
  }

  // Apply DNR rules when running inside the background service worker
  async refreshBlockingRules() {
    if (typeof enableBlocking === 'function') {
      await enableBlocking();
    }
  }

  // Apply blocklist from web app payload (skip network)
  async applyBlocklistPayload(payloadData) {
    this.localBlocklist = payloadData.websites;
    this.hasFetchedBlocklist = true;
    await chrome.storage.local.set({ user_blocklist: this.localBlocklist });
    console.log('Blocklist synced from payload:', this.localBlocklist);
    await this.refreshBlockingRules();
  }

  // Sync blocklist — payload-driven push or network fallback
  async syncBlocklist(payloadData = null) {
    if (!this.auth.isAuthenticated()) {
      return;
    }

    try {
      if (payloadData && Array.isArray(payloadData.websites)) {
        await this.applyBlocklistPayload(payloadData);
      } else {
        await this.fetchUserBlocklist();
        await this.refreshBlockingRules();
        console.log('Blocklist synced successfully');
      }
    } catch (error) {
      console.error('Failed to sync blocklist:', error);
    }
  }
}

// Initialize blocklist sync
let blocklistSync = null;

// Initialize after auth is ready (full snapshot sync runs from background.js)
async function initializeBlocklistSync() {
  await extensionAuth.init();
  blocklistSync = new BlocklistSync(extensionAuth);
}

// Initialize when script loads
initializeBlocklistSync();
