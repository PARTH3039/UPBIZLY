import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ user, handleLogout }) {
  const location = useLocation();

  if (!user) return null; // prevents render flicker

  const link = (path) => ({
    padding: "10px",
    display: "block",
    borderRadius: "6px",
    textDecoration: "none",
    color: location.pathname === path ? "#0f766e" : "#374151",
    background: location.pathname === path ? "#ecfdf5" : "transparent",
    fontWeight: location.pathname === path ? "600" : "400",
    marginBottom: "6px"
  });

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        position: "fixed",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: "1rem"
      }}
    >
      <h3 style={{ color: "#0f766e", marginBottom: "1.5rem" }}>
        UpBizly
      </h3>

      <Link to="/dashboard" style={link("/dashboard")}>Dashboard</Link>
      <Link to="/businesses" style={link("/businesses")}>Businesses</Link>
      <Link to="/products" style={link("/products")}>Products</Link>

      {user.role === "Admin" && (
        <Link to="/users" style={link("/users")}>Users</Link>
      )}

      <div style={{ position: "absolute", bottom: "1rem", width: "180px" }}>
        <hr />
        <p style={{ fontSize: "12px", marginBottom: "0.5rem" }}>
          {user.username} ({user.role})
        </p>
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            width: "100%",
            borderRadius: "6px"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
