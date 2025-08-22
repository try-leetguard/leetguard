const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface SignupResponse {
  user: {
    id: number;
    email: string;
  };
  email_sent: boolean;
  message: string;
}

export interface LoginVerificationResponse {
  message: string;
  email_sent: boolean;
  verification_url: string;
}

export interface EmailVerificationRequest {
  email: string;
  code: string;
}

export interface User {
  id: number;
  email: string;
  display_name?: string;
}

export interface UserUpdateRequest {
  display_name?: string;
}

export interface OAuthRequest {
  code: string;
  redirect_uri: string;
}

export interface OAuthUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface OAuthResponse extends AuthResponse {
  user: OAuthUserInfo;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Authentication endpoints
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return this.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse | LoginVerificationResponse> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    return this.request<AuthResponse | LoginVerificationResponse>('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData as any),
    });
  }

  async verifyEmail(data: EmailVerificationRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/verify-email-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendVerificationCode(data: EmailVerificationRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/resend-verification-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.request<User>('/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateProfile(token: string, data: UserUpdateRequest): Promise<User> {
    return this.request<User>('/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  // OAuth endpoints
  async googleOAuth(data: OAuthRequest): Promise<OAuthResponse> {
    return this.request<OAuthResponse>('/auth/oauth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async githubOAuth(data: OAuthRequest): Promise<OAuthResponse> {
    return this.request<OAuthResponse>('/auth/oauth/github', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Activity endpoints
  async getActivities(token: string, limit: number = 100, offset: number = 0): Promise<{ activities: any[] }> {
    return this.request<{ activities: any[] }>(`/api/activity?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addActivity(token: string, activityData: any): Promise<{ message: string; activity_id: number }> {
    return this.request<{ message: string; activity_id: number }>('/api/activity', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });
  }

  async getActivity(token: string, activityId: number): Promise<any> {
    return this.request<any>(`/api/activity/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateActivity(token: string, activityId: number, updates: any): Promise<any> {
    return this.request<any>(`/api/activity/${activityId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
  }

  async deleteActivity(token: string, activityId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/activity/${activityId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getActivityStats(token: string): Promise<any> {
    return this.request<any>('/api/activity/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Blocklist endpoints
  async getBlocklist(token: string): Promise<{ websites: string[] }> {
    return this.request<{ websites: string[] }>('/api/blocklist', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async addWebsite(token: string, website: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/blocklist/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ website }),
    });
  }

  async removeWebsite(token: string, website: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/blocklist/remove', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ website }),
    });
  }

  async checkWebsite(token: string, website: string): Promise<{ website: string; is_blocked: boolean }> {
    return this.request<{ website: string; is_blocked: boolean }>(`/api/blocklist/check?website=${encodeURIComponent(website)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 