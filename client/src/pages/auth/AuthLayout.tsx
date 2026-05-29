import { Outlet } from "react-router-dom";

// Login y Register manejan su propio layout full-page
export default function AuthLayout() {
  return <Outlet />;
}