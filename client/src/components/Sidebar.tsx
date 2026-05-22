import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./sidebar.css";

type UserType = "profesional" | "empresa";

interface SidebarProps {
  userType?: UserType;
}

const profesionalMenu = [
  { label: "Dashboard",   path: "/dashboard" },
  { label: "Learning",    path: "/learning" },
  { label: "Mi Perfil",   path: "/profile" },
  { label: "Marketplace", path: "/marketplace" },
];

const empresaMenu = [
  { label: "Mi Empresa",  path: "/companyProfile" },
  { label: "Mis Ofertas", path: "/joboffers" },
  { label: "Candidatos",  path: "/candidates" },
];

export default function Sidebar({ userType = "profesional" }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const menu = userType === "empresa" ? empresaMenu : profesionalMenu;

  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      {/* HEADER MOBILE */}
      <div className="sidebar-header">
        <h2 className="logo">ReConecta45</h2>
        <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
      </div>

      {/* MENU */}
      <div className="sidebar-menu">
        {menu.map((item) => (
          <button
            key={item.path}
            className={`sidebar-btn ${isActive(item.path) ? "active" : ""}`}
            onClick={() => handleNavigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <button className="sidebar-btn">⚙️ Settings</button>
        <button className="sidebar-btn logout" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>
    </div>
  );
}