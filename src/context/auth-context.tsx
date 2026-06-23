"use client";

import { createContext, useContext } from "react";

import type { NotificationState, SessionUser } from "@/types/app";

export interface AuthContextValue {
  session: SessionUser | null;
  bootstrapping: boolean;
  busy: boolean;
  notification: NotificationState | null;
  favoriteSlugs: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (slug: string) => Promise<void>;
  clearNotification: () => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthContext.");
  }

  return context;
}
