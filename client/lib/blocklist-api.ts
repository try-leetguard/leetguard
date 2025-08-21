// Blocklist API service for LeetGuard
import { apiClient } from './api';

export interface BlocklistItem {
  website: string;
}

export interface BlocklistResponse {
  websites: string[];
}

export class BlocklistAPI {
  private static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  /**
   * Get user's blocklist from the backend
   */
  static async getUserBlocklist(): Promise<string[]> {
    const token = this.getAccessToken();
    if (!token) {
      console.warn('No access token found, user not authenticated');
      return [];
    }

    try {
      const response = await apiClient.request<BlocklistResponse>('/api/blocklist', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.websites || [];
    } catch (error) {
      console.error('Failed to fetch user blocklist:', error);
      // Return empty array if user has no blocklist or API fails
      return [];
    }
  }

  /**
   * Add a website to user's blocklist
   */
  static async addWebsite(website: string): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    if (!website || !website.trim()) {
      throw new Error('Website URL is required');
    }

    const cleanWebsite = website.trim().toLowerCase();

    try {
      await apiClient.request('/api/blocklist/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website: cleanWebsite }),
      });
    } catch (error) {
      console.error('Failed to add website to blocklist:', error);
      throw error;
    }
  }

  /**
   * Remove a website from user's blocklist
   */
  static async removeWebsite(website: string): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      await apiClient.request('/api/blocklist/remove', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website }),
      });
    } catch (error) {
      console.error('Failed to remove website from blocklist:', error);
      throw error;
    }
  }

  /**
   * Check if a specific website is in user's blocklist
   */
  static async isWebsiteBlocked(website: string): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    try {
      const response = await apiClient.request<{ website: string; is_blocked: boolean }>(
        `/api/blocklist/check/${encodeURIComponent(website)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.is_blocked;
    } catch (error) {
      console.error('Failed to check if website is blocked:', error);
      return false;
    }
  }

  /**
   * Bulk update user's blocklist
   */
  static async bulkUpdateBlocklist(websites: string[]): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    // For now, we'll implement this by clearing and re-adding
    // In the future, we could add a dedicated bulk update endpoint
    try {
      // Get current blocklist
      const currentList = await this.getUserBlocklist();
      
      // Remove websites that are no longer in the new list
      const toRemove = currentList.filter(site => !websites.includes(site));
      for (const website of toRemove) {
        await this.removeWebsite(website);
      }
      
      // Add websites that are new
      const toAdd = websites.filter(site => !currentList.includes(site));
      for (const website of toAdd) {
        await this.addWebsite(website);
      }
    } catch (error) {
      console.error('Failed to bulk update blocklist:', error);
      throw error;
    }
  }

  /**
   * Get default blocklist for new users or fallback
   */
  static getDefaultBlocklist(): string[] {
    return [
      'facebook.com',
      'reddit.com',
      'youtube.com',
      'instagram.com',
      'x.com',
      'twitter.com',
      'netflix.com',
      'tiktok.com'
    ];
  }
}

export default BlocklistAPI;
