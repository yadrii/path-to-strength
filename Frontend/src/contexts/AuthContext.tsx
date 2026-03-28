import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  apiClient,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from '@/services/apiClient';

const DISTRICT_KEY = 'sahara_user_district';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'ngo';
  district?: string;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<'user' | 'ngo'>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: 'user' | 'ngo',
    phoneNumber?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateDistrict: (district: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => 'user',
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
  updateDistrict: () => {},
  clearError: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateDistrict = useCallback((district: string) => {
    try {
      localStorage.setItem(DISTRICT_KEY, district);
    } catch {
      /* ignore */
    }
    setUser((u) => (u ? { ...u, district } : null));
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
          apiClient.setTokens(accessToken, refreshToken);
          const response = await apiClient.getCurrentUser();

          if (response.success && response.data) {
            const userData = response.data;
            setUser({
              id: userData._id || userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              isEmailVerified: userData.isEmailVerified,
              district: userData.district,
            });
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        apiClient.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AuthResponse = await apiClient.login({
        email,
        password,
      });

      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        apiClient.setTokens(accessToken, refreshToken);

        const authUser: AuthUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isEmailVerified: userData.isEmailVerified,
          district: userData.district,
        };

        setUser(authUser);
        return userData.role;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'user' | 'ngo',
    phoneNumber?: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: RegisterRequest = {
        name,
        email,
        password,
        role,
        phoneNumber,
      };

      const response: AuthResponse = await apiClient.register(payload);

      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        apiClient.setTokens(accessToken, refreshToken);

        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isEmailVerified: userData.isEmailVerified,
          district: userData.district,
        });
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.logout();
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setUser(null);
      apiClient.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.updateProfile(data);

      if (response.success && response.data) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: response.data.name,
                email: response.data.email,
              }
            : null,
        );
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.changePassword(currentPassword, newPassword);

      if (!response.success) {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Password change failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        updateDistrict,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
