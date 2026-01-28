import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ user, handleLogout }) {
  const location = useLocation();

  const link = (path) => ({
    padding: "10px",
    display: "block",
    borderRadius: "6px",
    textDecoration: "none",
    color: location.pathname === path ? "#0f766e" : "#333",
    background: location.pathname === path ? "#ecfdf5" : "transparent",
    fontWeight: location.pathname === path ? "600" : "400",
    marginBottom: "6px"
  });

  return (
    <div className="fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-teal-700 text-xl font-bold mb-6">UpBizly</h3>
        <Link to="/dashboard" style={link("/dashboard")}>Dashboard</Link>
        <Link to="/businesses" style={link("/businesses")}>Businesses</Link>
        <Link to="/products" style={link("/products")}>Products</Link>
        {user.role === "Admin" && <Link to="/users" style={link("/users")}>Users</Link>}
      </div>

      <div className="mt-6">
        <hr />
        <p className="text-sm mt-2">{user.username} ({user.role})</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 w-full mt-2 py-1 rounded text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
