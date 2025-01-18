import React, { createContext, useState, ReactNode } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (auth: boolean) => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
