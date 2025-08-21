// Activity API service for LeetCode submissions tracking
import { apiClient } from './api';

export interface ActivityData {
  problem_name: string;
  problem_url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Unknown';
  topic_tags: string[];
  status: 'completed' | 'attempted' | 'in_progress';
  completed_at?: string;
  submission_id?: string;
}

export interface Activity {
  id: number;
  problem_name: string;
  problem_url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Unknown';
  topic_tags: string[];
  status: 'completed' | 'attempted' | 'in_progress';
  completed_at: string | null;
}

export interface ActivitiesResponse {
  activities: Activity[];
}

export interface ActivityStats {
  total_problems: number;
  completed_problems: number;
  easy_problems: number;
  medium_problems: number;
  hard_problems: number;
  recent_activity: Activity[];
}

export class ActivityAPI {
  private static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  /**
   * Get user's activity/submission history
   */
  static async getUserActivities(limit: number = 100, offset: number = 0): Promise<Activity[]> {
    const token = this.getAccessToken();
    if (!token) {
      console.warn('No access token found, user not authenticated');
      return [];
    }

    try {
      const response = await apiClient.request<ActivitiesResponse>('/api/activity', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.activities || [];
    } catch (error) {
      console.error('Failed to fetch user activities:', error);
      return [];
    }
  }

  /**
   * Add a new activity/submission
   */
  static async addActivity(activityData: ActivityData): Promise<{ activity_id: number } | null> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await apiClient.request<{ message: string; activity_id: number }>('/api/activity', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      });

      return { activity_id: response.activity_id };
    } catch (error) {
      console.error('Failed to add activity:', error);
      throw error;
    }
  }

  /**
   * Get a specific activity by ID
   */
  static async getActivity(activityId: number): Promise<Activity | null> {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await apiClient.request<Activity>(`/api/activity/${activityId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      return null;
    }
  }

  /**
   * Update an existing activity
   */
  static async updateActivity(
    activityId: number, 
    updates: Partial<Pick<ActivityData, 'status' | 'completed_at'>>
  ): Promise<Activity | null> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await apiClient.request<Activity>(`/api/activity/${activityId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      return response;
    } catch (error) {
      console.error('Failed to update activity:', error);
      throw error;
    }
  }

  /**
   * Delete an activity
   */
  static async deleteActivity(activityId: number): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      await apiClient.request(`/api/activity/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Failed to delete activity:', error);
      throw error;
    }
  }

  /**
   * Get user's activity statistics
   */
  static async getActivityStats(): Promise<ActivityStats | null> {
    const token = this.getAccessToken();
    if (!token) {
      console.warn('No access token found, user not authenticated');
      return null;
    }

    try {
      const response = await apiClient.request<ActivityStats>('/api/activity/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch activity stats:', error);
      return null;
    }
  }

  /**
   * Get recent activities for dashboard
   */
  static async getRecentActivities(limit: number = 5): Promise<Activity[]> {
    const activities = await this.getUserActivities(limit, 0);
    return activities.slice(0, limit);
  }

  /**
   * Parse LeetCode problem data from URL
   */
  static parseLeetCodeProblem(url: string): Partial<ActivityData> {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      
      if (pathParts[1] === 'problems' && pathParts[2]) {
        const problemSlug = pathParts[2];
        const problemName = problemSlug.replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        
        return {
          problem_name: problemName,
          problem_url: url,
          difficulty: 'Unknown',
          topic_tags: [],
          status: 'completed',
          completed_at: new Date().toISOString(),
        };
      }
      
      return {
        problem_name: 'Unknown Problem',
        problem_url: url,
        difficulty: 'Unknown',
        topic_tags: [],
        status: 'completed',
        completed_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to parse LeetCode problem URL:', error);
      return {
        problem_name: 'Unknown Problem',
        problem_url: url,
        difficulty: 'Unknown',
        topic_tags: [],
        status: 'completed',
        completed_at: new Date().toISOString(),
      };
    }
  }

  /**
   * Generate mock activity data for development
   */
  static generateMockActivities(count: number = 10): Activity[] {
    const problems = [
      { name: 'Two Sum', difficulty: 'Easy' as const, tags: ['Array', 'Hash Table'] },
      { name: 'Add Two Numbers', difficulty: 'Medium' as const, tags: ['Linked List', 'Math'] },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' as const, tags: ['Hash Table', 'String', 'Sliding Window'] },
      { name: 'Median of Two Sorted Arrays', difficulty: 'Hard' as const, tags: ['Array', 'Binary Search'] },
      { name: 'Longest Palindromic Substring', difficulty: 'Medium' as const, tags: ['String', 'Dynamic Programming'] },
      { name: 'ZigZag Conversion', difficulty: 'Medium' as const, tags: ['String'] },
      { name: 'Reverse Integer', difficulty: 'Easy' as const, tags: ['Math'] },
      { name: 'String to Integer (atoi)', difficulty: 'Medium' as const, tags: ['String'] },
      { name: 'Palindrome Number', difficulty: 'Easy' as const, tags: ['Math'] },
      { name: 'Regular Expression Matching', difficulty: 'Hard' as const, tags: ['String', 'Dynamic Programming', 'Recursion'] },
    ];

    return Array.from({ length: Math.min(count, problems.length) }, (_, i) => {
      const problem = problems[i];
      const daysAgo = Math.floor(Math.random() * 30);
      const completedAt = new Date();
      completedAt.setDate(completedAt.getDate() - daysAgo);

      return {
        id: i + 1,
        problem_name: problem.name,
        problem_url: `https://leetcode.com/problems/${problem.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}/`,
        difficulty: problem.difficulty,
        topic_tags: problem.tags,
        status: 'completed' as const,
        completed_at: completedAt.toISOString(),
      };
    });
  }
}

export default ActivityAPI;
