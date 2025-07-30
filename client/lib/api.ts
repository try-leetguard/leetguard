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
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
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

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 