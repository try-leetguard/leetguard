// Authentication utilities for LeetGuard extension
const API_BASE_URL = 'http://localhost:8000';

class ExtensionAuth {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
  }

  // Note: localStorage checking removed - extension now uses chrome.storage.local as source of truth

  // Initialize authentication state from extension storage
  async init() {
    // Check extension storage (works from any tab)
    const result = await chrome.storage.local.get(['access_token', 'refresh_token', 'user']);
    
    console.log('Auth init - checking extension storage:', {
      hasAccessToken: !!result.access_token,
      hasRefreshToken: !!result.refresh_token,
      hasUser: !!result.user,
      user: result.user
    });
    
    if (result.access_token && result.user) {
      this.accessToken = result.access_token;
      this.refreshToken = result.refresh_token;
      this.user = result.user;
      console.log('Auth state loaded from extension storage');
    } else {
      // No tokens in extension storage, user is not authenticated
      console.log('No auth tokens found in extension storage');
      await this.clearAuth();
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const authenticated = !!this.accessToken && !!this.user;
    console.log('isAuthenticated check:', {
      hasAccessToken: !!this.accessToken,
      hasUser: !!this.user,
      authenticated: authenticated
    });
    return authenticated;
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
      console.log('Handling OAuth callback with tokens:', tokens);
      
      // Set tokens first
      this.accessToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      
      // Get user info using the new token
      const user = await this.getCurrentUser();
      
      // Store everything in extension storage
      await this.setAuth(this.accessToken, this.refreshToken, user);
      
      console.log('OAuth callback handled successfully, user:', user);
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
