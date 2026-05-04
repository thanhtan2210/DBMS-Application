import React, { createContext, useContext, ReactNode } from "react";
import { useAuthStore } from "../store/useAuthStore";

import { UserInfo } from "../types";

/**
 * AUTH ADAPTER
 * Connects the UI to the actual Zustand Auth Store.
 */

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const loading = false; // Zustand persistence is synchronous on mount

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
