// Authentication utilities for LeetGuard extension
const API_BASE_URL = 'http://localhost:8000';

class ExtensionAuth {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
  }

  // Check localStorage for authentication state (source of truth)
  async checkLocalStorageAuth() {
    try {
      // Get localStorage tokens from the current tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) return { accessToken: null, refreshToken: null };
      
      const currentTab = tabs[0];
      
      // Only check if we're on the web app domain
      if (!currentTab.url.includes('localhost:3000') && !currentTab.url.includes('leetguard.com')) {
        return { accessToken: null, refreshToken: null };
      }
      
      // Execute script to check localStorage
      const results = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: () => {
          return {
            accessToken: localStorage.getItem('access_token'),
            refreshToken: localStorage.getItem('refresh_token')
          };
        }
      });
      
      if (results && results[0] && results[0].result) {
        const { accessToken, refreshToken } = results[0].result;
        return { accessToken, refreshToken };
      }
      
      return { accessToken: null, refreshToken: null };
    } catch (error) {
      console.error('Failed to check localStorage:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  // Clear stale tokens when localStorage is empty
  async clearStaleTokens() {
    console.log('Clearing stale tokens from extension storage');
    await this.clearAuth();
  }

  // Initialize authentication state from storage with localStorage check
  async init() {
    // First check localStorage (source of truth)
    const localStorageAuth = await this.checkLocalStorageAuth();
    
    if (!localStorageAuth.accessToken) {
      // localStorage is empty, user is logged out
      console.log('localStorage empty - user is logged out, clearing extension tokens');
      await this.clearStaleTokens();
      return;
    }
    
    // localStorage has tokens, check if they match extension storage
    const result = await chrome.storage.local.get(['access_token', 'refresh_token', 'user']);
    
    if (result.access_token !== localStorageAuth.accessToken) {
      // Tokens don't match, localStorage is the source of truth
      console.log('Token mismatch detected, syncing with localStorage');
      this.accessToken = localStorageAuth.accessToken;
      this.refreshToken = localStorageAuth.refreshToken;
      
      // Update extension storage to match localStorage
      await chrome.storage.local.set({
        access_token: localStorageAuth.accessToken,
        refresh_token: localStorageAuth.refreshToken
      });
      
      // Try to get user info with the new token
      try {
        await this.getCurrentUser();
      } catch (error) {
        console.error('Failed to get user info with localStorage token:', error);
        // If getting user info fails, the token might be invalid
        await this.clearStaleTokens();
      }
    } else {
      // Tokens match, use extension storage
      this.accessToken = result.access_token;
      this.refreshToken = result.refresh_token;
      this.user = result.user;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.accessToken && !!this.user;
  }

  // Store tokens and user info
  async setAuth(accessToken, refreshToken, user) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
    
    await chrome.storage.local.set({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: user
    });
  }

  // Clear authentication data
  async clearAuth() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    
    await chrome.storage.local.remove(['access_token', 'refresh_token', 'user']);
  }

  // Make authenticated API request
  async apiRequest(endpoint, options = {}) {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh
        const refreshed = await this.refreshTokens();
        if (refreshed) {
          // Retry the request with new token
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers
          });
          
          if (!retryResponse.ok) {
            throw new Error(`API request failed: ${retryResponse.status}`);
          }
          
          return await retryResponse.json();
        } else {
          // Refresh failed, user needs to login again
          await this.clearAuth();
          throw new Error('Authentication expired');
        }
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshTokens() {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: this.refreshToken })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      
      await chrome.storage.local.set({
        access_token: this.accessToken,
        refresh_token: this.refreshToken
      });

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const userData = await this.apiRequest('/me');
      this.user = userData;
      await chrome.storage.local.set({ user: userData });
      return userData;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }

  // Handle OAuth callback from web app
  async handleOAuthCallback(tokens) {
    try {
      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      
      // Get user info
      const user = await this.getCurrentUser();
      
      await this.setAuth(this.accessToken, this.refreshToken, user);
      return true;
    } catch (error) {
      console.error('OAuth callback handling failed:', error);
      return false;
    }
  }
}

// Create global instance
const extensionAuth = new ExtensionAuth();

// Initialize on load
extensionAuth.init();
