import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BusinessList from "./pages/BusinessList";
import ProductList from "./pages/ProductList";
import Users from "./pages/Users";
import Sidebar from "./components/Sidebar";

import { getCurrentUser, removeCurrentUser } from "./utils/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Load user from localStorage on mount
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    removeCurrentUser();
    setUser(null);
    window.location.href = "/";
  };

  const ProtectedRoute = ({ children, roles }) => {
    if (!user) return <Navigate to="/" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
    return children;
  };

  return (
    <Router>
      {user && <Sidebar user={user} handleLogout={handleLogout} />}
      <div style={{ marginLeft: user ? "220px" : "0", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/businesses" element={<ProtectedRoute roles={["Admin"]}><BusinessList /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute roles={["Admin","Owner"]}><ProductList user={user} /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={["Admin"]}><Users /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={2500} />
    </Router>
  );
}

export default App;
