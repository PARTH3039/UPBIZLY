import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Page from "../components/Page";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("Owner");
  const [password, setPassword] = useState("");

  const loadUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const openModal = (u = null) => {
    setEditUser(u);
    setUsername(u?.username || "");
    setRole(u?.role || "Owner");
    setPassword("");
    setModalOpen(true);
  };

  const saveUser = async () => {
    if (!username || (!editUser && !password)) return toast.error("Missing fields");
    try {
      const payload = { username, role, password: password || undefined };
      if (editUser) {
        await API.put(`/users/${editUser.id}`, payload);
        toast.success("User updated");
      } else {
        await API.post("/users", payload);
        toast.success("User added");
      }
      setModalOpen(false);
      loadUsers();
    } catch {
      toast.error("Save failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    try {
      await API.delete(`/users/${id}`);
      toast.success("User deleted");
      loadUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Page>
      <h2>Users</h2>
      <button onClick={() => openModal()}>Add User</button>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr><th>Username</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => openModal(u)}>Edit</button>{" "}
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
        >
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="bg-white p-6 rounded shadow w-96"
          >
            <h3>{editUser ? "Edit" : "Add"} User</h3>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            {!editUser && <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />}
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Owner">Owner</option>
            </select>
            <br />
            <button onClick={saveUser}>Save</button>{" "}
            <button onClick={() => setModalOpen(false)}>Cancel</button>
          </motion.div>
        </motion.div>
      )}
    </Page>
  );
}
