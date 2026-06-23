"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { HeroUIProvider } from "@heroui/react";

import { AuthContext, type AuthContextValue } from "@/context/auth-context";
import { ScheduleContext, type ScheduleContextValue } from "@/context/schedule-context";
import type {
  AuditLogRecord,
  CreateSchedulePayload,
  CreateUserPayload,
  NotificationState,
  FavoritesPayload,
  ScheduleRecord,
  SessionUser,
  UpdateSchedulePayload,
  UpdateUserPayload,
  UserRecord,
} from "@/types/app";

interface AppContextValue extends AuthContextValue {
  users: UserRecord[];
  schedules: ScheduleRecord[];
  auditLogs: AuditLogRecord[];
  refreshDashboard: () => Promise<void>;
  createUser: (payload: CreateUserPayload) => Promise<void>;
  updateUser: (id: string, payload: UpdateUserPayload) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
  createSchedule: (payload: CreateSchedulePayload) => Promise<void>;
  updateSchedule: (id: string, payload: UpdateSchedulePayload) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected request error.";
}

async function requestData<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    data?: T;
    error?: { message?: string };
  };

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error?.message ?? "Request failed.");
  }

  return payload.data as T;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const bootstrapped = useRef(false);

  async function bootstrap() {
    if (bootstrapped.current) {
      return;
    }

    bootstrapped.current = true;

    try {
      const data = await requestData<{ user: SessionUser }>("/api/auth/me");
      startTransition(() => setSession(data.user));
      await loadFavorites();
    } catch {
      try {
        const data = await requestData<{ user: SessionUser }>("/api/auth/refresh", {
          method: "POST",
        });
        startTransition(() => setSession(data.user));
        await loadFavorites();
      } catch {
        startTransition(() => {
          setSession(null);
          setFavoriteSlugs([]);
        });
      }
    } finally {
      setBootstrapping(false);
    }
  }

  async function loadFavorites() {
    const data = await requestData<FavoritesPayload>("/api/favorites");
    setFavoriteSlugs(data.favoriteSlugs);
  }

  useEffect(() => {
    void bootstrap();
  }, []);

  async function login(email: string, password: string) {
    setBusy(true);

    try {
      const data = await requestData<{ user: SessionUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(data.user);
      await loadFavorites();
      setNotification({ tone: "success", message: "Session started successfully." });
    } catch (error) {
      setNotification({ tone: "error", message: getErrorMessage(error) });
      throw error;
    } finally {
      setBusy(false);
    }
  }

  async function register(name: string, email: string, password: string) {
    setBusy(true);

    try {
      await requestData<{ user: SessionUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setNotification({
        tone: "success",
        message: "Account created. We sent a welcome email.",
      });
    } catch (error) {
      setNotification({ tone: "error", message: getErrorMessage(error) });
      throw error;
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);

    try {
      await requestData<{ success: boolean }>("/api/auth/logout", { method: "POST" });
    } finally {
      setSession(null);
      setFavoriteSlugs([]);
      setNotification({ tone: "info", message: "Session closed." });
      setBusy(false);
    }
  }

  const notAvailable = async () => {
    setNotification({ tone: "info", message: "This recipe app does not use the old schedule tools." });
  };

  async function toggleFavorite(slug: string) {
    if (!session) {
      setNotification({ tone: "info", message: "Sign in to save favorite recipes." });
      return;
    }

    const favorite = !favoriteSlugs.includes(slug);
    const data = await requestData<FavoritesPayload>(`/api/favorites/${slug}`, {
      method: "PUT",
      body: JSON.stringify({ favorite }),
    });

    setFavoriteSlugs(data.favoriteSlugs);
  }

  const value: AppContextValue = {
    session,
    bootstrapping,
    busy,
    notification,
    favoriteSlugs,
    login,
    register,
    logout,
    toggleFavorite,
    clearNotification: () => setNotification(null),
    users: [],
    schedules: [],
    auditLogs: [],
    refreshDashboard: async () => bootstrap(),
    createUser: async () => notAvailable(),
    updateUser: async () => notAvailable(),
    deactivateUser: async () => notAvailable(),
    createSchedule: async () => notAvailable(),
    updateSchedule: async () => notAvailable(),
    deleteSchedule: async () => notAvailable(),
  };

  const authValue: AuthContextValue = {
    session,
    bootstrapping,
    busy,
    notification,
    favoriteSlugs,
    login,
    register,
    logout,
    toggleFavorite,
    clearNotification: value.clearNotification,
  };

  const scheduleValue: ScheduleContextValue = {
    users: [],
    schedules: [],
    auditLogs: [],
    refreshDashboard: value.refreshDashboard,
    createUser: value.createUser,
    updateUser: value.updateUser,
    deactivateUser: value.deactivateUser,
    createSchedule: value.createSchedule,
    updateSchedule: value.updateSchedule,
    deleteSchedule: value.deleteSchedule,
  };

  return (
    <HeroUIProvider>
      <AuthContext.Provider value={authValue}>
        <ScheduleContext.Provider value={scheduleValue}>
          <AppContext.Provider value={value}>{children}</AppContext.Provider>
        </ScheduleContext.Provider>
      </AuthContext.Provider>
    </HeroUIProvider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider.");
  }

  return context;
}
