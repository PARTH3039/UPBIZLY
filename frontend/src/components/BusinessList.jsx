import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Page from "../components/Page";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function BusinessList({ user }) {
  const [businesses, setBusinesses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBusiness, setEditBusiness] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Load businesses
  const loadBusinesses = async () => {
    try {
      const res = await API.get("/businesses");
      setBusinesses(res.data);
    } catch {
      toast.error("Failed to load businesses");
    }
  };

  useEffect(() => { loadBusinesses(); }, []);

  const openModal = (b = null) => {
    setEditBusiness(b);
    setName(b?.name || "");
    setDescription(b?.description || "");
    setModalOpen(true);
  };

  const saveBusiness = async () => {
    if (!name) return toast.error("Name required");
    try {
      if (editBusiness) {
        await API.put(`/businesses/${editBusiness.id}`, { name, description });
        toast.success("Business updated");
      } else {
        await API.post("/businesses", { name, description });
        toast.success("Business added");
      }
      setModalOpen(false);
      loadBusinesses();
    } catch {
      toast.error("Save failed");
    }
  };

  const deleteBusiness = async (id) => {
    if (!window.confirm("Delete business?")) return;
    try {
      await API.delete(`/businesses/${id}`);
      toast.success("Business deleted");
      loadBusinesses();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Page>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Businesses</h2>
        <button
          onClick={() => openModal()}
          className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
        >
          Add Business
        </button>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg mb-1">{b.name}</h3>
              <p className="text-gray-600 mb-2">{b.description || "No description"}</p>
            </div>

            {/* Edit/Delete buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openModal(b)}
                className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBusiness(b.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded shadow w-96"
          >
            <h3 className="text-lg font-semibold mb-4">{editBusiness ? "Edit" : "Add"} Business</h3>
            <input
              className="w-full p-2 border mb-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <textarea
              className="w-full p-2 border mb-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={saveBusiness}
                className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
              >
                Save
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Page>
  );
}
