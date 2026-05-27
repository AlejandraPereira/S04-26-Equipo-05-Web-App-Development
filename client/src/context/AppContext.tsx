import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { api } from "../lib/api";

type UserRole = "profesional" | "empresa";

type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

type Notification = {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

type AppContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, expectedRole?: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { setIsLoading(false); return; }
    api.get<AuthUser>("/auth/me")
      .then(u => { setUser(u); })
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setIsLoading(false));
  }, []);

  const refreshNotifications = useCallback(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    api.get<Notification[]>("/notifications/mine")
      .then(setNotifications)
      .catch(() => {});
  }, []);

  // Cargar notificaciones cuando el usuario está autenticado
  useEffect(() => {
    if (!user) return;
    refreshNotifications();
    // Polling cada 30 segundos
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, refreshNotifications]);

  async function login(email: string, password: string, expectedRole?: string) {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", { email, password, expectedRole });
    localStorage.setItem("access_token", res.token);
    setUser(res.user);
  }

  async function register(fullName: string, email: string, password: string, role: UserRole) {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/register", {
      fullName, email, password, role,
    });
    localStorage.setItem("access_token", res.token);
    setUser(res.user);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setUser(null);
    setNotifications([]);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all", {});
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (_) {
      // fallback local
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <AppContext.Provider
      value={{
        user, isAuthenticated: !!user, isLoading,
        login, register, logout, setUser,
        notifications, unreadCount, markAllAsRead, refreshNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
