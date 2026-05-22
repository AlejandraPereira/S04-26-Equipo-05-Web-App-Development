import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  name: string;
  initials: string;
};

type Notification = {
  id: number;
  message: string;
  read: boolean;
};

type AppContextType = {
  user: User;
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>({
    name: "Alejandra Pereira",
    initials: "AP",
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Nuevo curso recomendado para ti", read: false },
    { id: 2, message: "Tu progreso fue actualizado", read: false },
    { id: 3, message: "Certificado disponible", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <AppContext.Provider
      value={{ user, notifications, unreadCount, markAllAsRead }}
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