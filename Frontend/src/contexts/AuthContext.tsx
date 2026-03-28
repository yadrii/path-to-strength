import React, { createContext, useContext, useState } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'ngo';
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: 'user' | 'ngo') => void;
  signup: (name: string, email: string, password: string, role: 'user' | 'ngo') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string, role: 'user' | 'ngo') => {
    setUser({ id: '1', name: role === 'user' ? 'Sita' : 'Helping Hands NGO', email, role });
  };

  const signup = (name: string, email: string, _password: string, role: 'user' | 'ngo') => {
    setUser({ id: '1', name, email, role });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
