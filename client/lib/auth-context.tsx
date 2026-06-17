"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient, User, AuthResponse } from "./api";
import {
  clearAuthState,
  getAccessToken,
  getRefreshToken,
  onAuthCleared,
  setAuthTokens,
  syncAuthWithExtension,
} from "./auth-state";

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
  loginWithGoogle: (
    code: string,
    redirectUri: string
  ) => Promise<{ success: boolean; message?: string }>;
  loginWithGitHub: (
    code: string,
    redirectUri: string
  ) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const unsubscribeAuthCleared = onAuthCleared(() => setUser(null));

    const initializeAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      if (accessToken || refreshToken) {
        try {
          const userData = await apiClient.getCurrentUser(accessToken ?? undefined);
          setUser(userData);

          const currentAccessToken = getAccessToken();
          const currentRefreshToken = getRefreshToken();
          if (currentAccessToken && currentRefreshToken) {
            syncAuthWithExtension(
              { access_token: currentAccessToken, refresh_token: currentRefreshToken },
              userData
            );
          }
        } catch (error) {
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
    return unsubscribeAuthCleared;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ username: email, password });

      // Check if response is AuthResponse (successful login)
      if ("access_token" in response) {
        const authResponse = response as AuthResponse;
        setAuthTokens(authResponse, { syncExtension: false });
        const userData = await apiClient.getCurrentUser(
          authResponse.access_token
        );
        setUser(userData);

        syncAuthWithExtension(authResponse, userData);

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
    clearAuthState();
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

  const resendVerificationCode = async (email: string, _code: string) => {
    try {
      const response = await apiClient.resendVerificationCode({ email });
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

  const loginWithGoogle = async (code: string, redirectUri: string) => {
    try {
      const response = await apiClient.googleOAuth({
        code,
        redirect_uri: redirectUri,
      });
      setAuthTokens(response, { syncExtension: false });
      const userData = await apiClient.getCurrentUser(response.access_token);
      setUser(userData);

      syncAuthWithExtension(response, userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Google login failed",
      };
    }
  };

  const loginWithGitHub = async (code: string, redirectUri: string) => {
    try {
      const response = await apiClient.githubOAuth({
        code,
        redirect_uri: redirectUri,
      });
      setAuthTokens(response, { syncExtension: false });
      const userData = await apiClient.getCurrentUser(response.access_token);
      setUser(userData);

      syncAuthWithExtension(response, userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "GitHub login failed",
      };
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
    loginWithGoogle,
    loginWithGitHub,
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
