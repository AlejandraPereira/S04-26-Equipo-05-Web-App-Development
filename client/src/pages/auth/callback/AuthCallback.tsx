import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import { api } from "../../../lib/api";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const redirect = params.get("redirect") ?? "/dashboard";

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("access_token", token);

    api.get<{ id: string; email: string; fullName: string; role: string }>("/auth/me")
      .then((user) => {
        setUser(user as any);
        navigate(redirect);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        navigate("/login");
      });
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0b0f19", color: "#fff", fontSize: 18 }}>
      Iniciando sesión...
    </div>
  );
}
