import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../utils/auth";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { username, password });

      // ----------------------
      // Save JWT and user locally
      // ----------------------
      localStorage.setItem("jwtToken", res.data.token);

      // If backend does not send user object, we can decode from token
      // For now, assuming backend returns user info
      const user = res.data.user || { username, role: username === "admin" ? "Admin" : "Owner" };
      setCurrentUser(user);

      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="card" style={{ maxWidth: "320px", margin: "5rem auto" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={{ width: "100%" }}>Login</button>
      </form>
    </div>
  );
}
