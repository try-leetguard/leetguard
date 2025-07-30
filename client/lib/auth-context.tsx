"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, User, AuthResponse } from "./api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    needsVerification?: boolean;
    message?: string;
  }>;
  signup: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  verifyEmail: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; message: string }>;
  resendVerificationCode: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token management
  const getAccessToken = () => localStorage.getItem("access_token");
  const getRefreshToken = () => localStorage.getItem("refresh_token");
  const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  };
  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        try {
          const userData = await apiClient.getCurrentUser(accessToken);
          setUser(userData);
        } catch (error) {
          // Token might be expired, try to refresh
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              const newTokens = await apiClient.refreshToken(refreshToken);
              setTokens(newTokens.access_token, newTokens.refresh_token);
              const userData = await apiClient.getCurrentUser(
                newTokens.access_token
              );
              setUser(userData);
            } catch (refreshError) {
              // Refresh failed, clear tokens
              clearTokens();
            }
          } else {
            clearTokens();
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ username: email, password });

      // Check if response is AuthResponse (successful login)
      if ("access_token" in response) {
        const authResponse = response as AuthResponse;
        setTokens(authResponse.access_token, authResponse.refresh_token);
        const userData = await apiClient.getCurrentUser(
          authResponse.access_token
        );
        setUser(userData);
        return { success: true };
      } else {
        // User needs email verification
        return {
          success: false,
          needsVerification: true,
          message: response.message,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await apiClient.signup({ email, password });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Signup failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    clearTokens();

    // Dispatch a custom event to notify other components about logout
    window.dispatchEvent(new CustomEvent("userLoggedOut"));
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await apiClient.verifyEmail({ email, code });
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Email verification failed",
      };
    }
  };

  const resendVerificationCode = async (email: string, code: string) => {
    try {
      const response = await apiClient.resendVerificationCode({ email, code });
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to resend verification code",
      };
    }
  };

  const refreshUser = async () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      try {
        const userData = await apiClient.getCurrentUser(accessToken);
        setUser(userData);
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    verifyEmail,
    resendVerificationCode,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
