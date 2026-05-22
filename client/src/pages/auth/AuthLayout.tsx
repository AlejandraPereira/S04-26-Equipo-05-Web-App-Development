import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <Outlet />
      </div>
    </div>
  );
}

const styles: any = {
  wrapper: {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "fixed",   
    top: 0,
    left: 0,
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
  },
};