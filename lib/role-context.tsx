"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Role } from "@/types";

interface ActiveUser {
  role: Role;
  name: string;
  id: string; // profile id from Supabase, once we wire real profiles
}

interface RoleContextValue {
  user: ActiveUser | null;
  loginAs: (user: ActiveUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = "skillbridge_active_user";

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ActiveUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // corrupted storage, ignore and start fresh
    } finally {
      setIsLoading(false);
    }
  }, []);

  function loginAs(newUser: ActiveUser) {
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <RoleContext.Provider value={{ user, loginAs, logout, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}