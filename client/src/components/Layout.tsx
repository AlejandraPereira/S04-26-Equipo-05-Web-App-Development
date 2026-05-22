import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const USER_TYPE: "profesional" | "empresa" = "empresa";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b0f19",
        color: "#fff",
        fontFamily: "system-ui",
      }}
    >
      <Sidebar userType={USER_TYPE} />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}