import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
