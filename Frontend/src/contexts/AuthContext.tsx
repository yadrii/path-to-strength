import React, { createContext, useContext, useState, useCallback } from 'react';

const DISTRICT_KEY = 'sahara_user_district';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'ngo';
  /** Set at signup (user) or from localStorage — never precise GPS, district only */
  district?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: 'user' | 'ngo') => void;
  signup: (name: string, email: string, password: string, role: 'user' | 'ngo', district?: string) => void;
  logout: () => void;
  updateDistrict: (district: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  updateDistrict: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const updateDistrict = useCallback((district: string) => {
    try {
      localStorage.setItem(DISTRICT_KEY, district);
    } catch {
      /* ignore */
    }
    setUser((u) => (u ? { ...u, district } : null));
  }, []);

  const login = (email: string, _password: string, role: 'user' | 'ngo') => {
    let district: string | undefined;
    try {
      district = localStorage.getItem(DISTRICT_KEY) ?? undefined;
    } catch {
      district = undefined;
    }
    setUser({
      id: '1',
      name: role === 'user' ? 'Sita' : 'Helping Hands NGO',
      email,
      role,
      district: role === 'user' ? district : undefined,
    });
  };

  const signup = (name: string, email: string, _password: string, role: 'user' | 'ngo', district?: string) => {
    if (role === 'user' && district) {
      try {
        localStorage.setItem(DISTRICT_KEY, district);
      } catch {
        /* ignore */
      }
    }
    setUser({
      id: '1',
      name,
      email,
      role,
      district: role === 'user' ? district : undefined,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateDistrict, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
