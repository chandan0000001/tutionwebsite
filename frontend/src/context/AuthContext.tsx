import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

export type UserRole = 'student' | 'teacher' | 'superadmin';

export interface UserProfile {
  _id: string;
  name: string;
  username: string;
  role: UserRole;
  phone?: string;
  email?: string;
  qualification?: string;
  dateOfBirth?: string;
  batch?: string;
  batchCode?: string;
  batchIds?: string[];
  batchCodes?: string[];
  assignedBatches?: string[];
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt?: string;
  updatedAt?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  college?: string;
  fatherName?: string;
  motherName?: string;
}

export type StudentProfile = UserProfile;

interface AuthContextType {
  user: UserProfile | null;
  student: StudentProfile | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message?: string; role?: UserRole; user?: UserProfile }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void | Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'aa_auth_token';
const LEGACY_TOKEN_STORAGE_KEY = 'aa_student_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const logout = useCallback(async () => {
    const currentToken =
      token || localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(LEGACY_TOKEN_STORAGE_KEY);

    // Call backend to revoke session in MongoDB
    if (currentToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${currentToken}`,
            Accept: 'application/json',
          },
        });
      } catch {
        // Fall through safely even if offline
      }
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setError(null);
  }, [token]);

  // Verify session & fetch authenticated user profile
  const refreshProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success && (data.user || data.student)) {
        const resolvedUser: UserProfile = {
          ...(data.user || data.student),
          role: data.role || data.user?.role || (data.student ? 'student' : 'student'),
        };
        setUser(resolvedUser);
      } else {
        logout();
      }
    } catch {
      // Network failure; keep existing session in memory if present
    } finally {
      setIsLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorMsg = data?.message || 'Login failed. Please verify your credentials.';
        setError(errorMsg);
        setIsLoading(false);
        return { success: false, message: errorMsg };
      }

      // Store token
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(LEGACY_TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);

      const resolvedUser: UserProfile = {
        ...(data.user || data.student),
        role: data.role || data.user?.role || (data.student ? 'student' : 'student'),
      };
      setUser(resolvedUser);
      setIsLoading(false);

      return {
        success: true,
        role: resolvedUser.role,
        user: resolvedUser,
      };
    } catch {
      const errorMsg = 'Unable to connect to the authentication service. Please ensure the backend server is running.';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, message: errorMsg };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
  ) => {
    if (!token) {
      return { success: false, message: 'You are not logged in.' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorMsg = data?.message || 'Password update failed. Please try again.';
        setError(errorMsg);
        setIsLoading(false);
        return { success: false, message: errorMsg };
      }

      if (data.token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        localStorage.setItem(LEGACY_TOKEN_STORAGE_KEY, data.token);
        setToken(data.token);
      }
      if (data.user || data.student) {
        const updatedUser: UserProfile = {
          ...(data.user || data.student),
          role: data.role || data.user?.role || user?.role || 'student',
          mustChangePassword: false,
        };
        setUser(updatedUser);
      }

      setIsLoading(false);
      return { success: true, message: data.message };
    } catch {
      const errorMsg = 'Failed to connect to the server. Please check your internet connection.';
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, message: errorMsg };
    }
  };

  const role = user?.role || null;
  const student = role === 'student' ? user : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        role,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        login,
        changePassword,
        logout,
        refreshProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
