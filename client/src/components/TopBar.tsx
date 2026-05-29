import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

type Props = {
  placeholder?: string;
  showLogo?: boolean;
};

export default function TopBar({ placeholder = "Buscar...", showLogo = false }: Props) {
  const navigate = useNavigate();
  const { user, notifications, unreadCount, markAllAsRead } = useApp();

  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 25, borderBottom: "1px solid #1f2937", paddingBottom: 20 }}>

      {showLogo && (
        <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", whiteSpace: "nowrap" }}>
          ReConecta45
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* SEARCH */}
      <input
        placeholder={placeholder}
        style={{
          width: 660,
          padding: 12,
          borderRadius: 12,
          border: "1px solid #1f2937",
          background: "#0f172a",
          color: "#fff",
        }}
      />

      <div style={{ flex: 1 }} />

      {/* RIGHT ICONS */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <span style={{ fontSize: 18, cursor: "pointer" }} onClick={() => setOpen(!open)}>
            🔔
          </span>

          {unreadCount > 0 && (
            <div style={{
              position: "absolute", top: -6, right: -6,
              background: "red", color: "#fff", borderRadius: "50%",
              width: 16, height: 16, fontSize: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {unreadCount}
            </div>
          )}

          {open && (
            <div style={{
              position: "absolute", right: 0, top: 30,
              width: 260, background: "#111827",
              border: "1px solid #1f2937", borderRadius: 12,
              padding: 10, zIndex: 999,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <strong>Notificaciones</strong>
                <button onClick={markAllAsRead} style={{ fontSize: 12, background: "transparent", border: "none", color: "#60a5fa" }}>
                  Marcar como leídas
                </button>
              </div>
              {notifications.map((n) => (
                <div key={n.id} style={{
                  padding: 8, borderRadius: 8,
                  background: n.read ? "transparent" : "#1f2937",
                  marginBottom: 6, fontSize: 13,
                }}>
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AVATAR */}
        <div onClick={() => navigate("/profile")} style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#2563eb", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontWeight: 600, cursor: "pointer",
        }}>
          {user ? user.fullName.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "?"}
        </div>
      </div>
    </div>
  );
}