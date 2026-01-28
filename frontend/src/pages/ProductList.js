import React, { useState, useEffect } from "react";
import API from "../api/axios";
import Page from "../components/Page";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [stockStatus, setStockStatus] = useState("In-stock");

  const loadData = async () => {
    try {
      const resProducts = await API.get("/products");
      const resBusinesses = await API.get("/businesses");

      setBusinesses(resBusinesses.data);

      if (user.role === "Owner") {
        setProducts(resProducts.data.filter(p => p.ownerId === user.id));
      } else {
        setProducts(resProducts.data);
      }
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (p = null) => {
    setEditProduct(p);
    setName(p?.name || "");
    setPrice(p?.price || "");
    setBusinessId(p?.businessId || "");
    setStockStatus(p?.stockStatus || "In-stock");
    setModalOpen(true);
  };

  const saveProduct = async () => {
    if (!name || !price || !businessId) {
      return toast.error("All fields required");
    }

    try {
      if (editProduct) {
        await API.put(`/products/${editProduct.id}`, {
          name,
          price: parseFloat(price),
          businessId,
          stockStatus
        });
        toast.success("Product updated");
      } else {
        await API.post("/products", {
          name,
          price: parseFloat(price),
          businessId,
          stockStatus,
          ownerId: user.id
        });
        toast.success("Product added");
      }
      setModalOpen(false);
      loadData();
    } catch {
      toast.error("Save failed");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await API.delete(`/products/${id}`);
    toast.success("Product deleted");
    loadData();
  };

  return (
    <Page>
      <h2>Products</h2>
      <button onClick={() => openModal()}>Add Product</button>

      {/* CARD GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem"
        }}
      >
        {products.map(p => (
          <div key={p.id} className="card">
            <h3>{p.name}</h3>
            <p><strong>${p.price}</strong></p>
            <p>{businesses.find(b => b.id === p.businessId)?.name}</p>

            <span
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                background:
                  p.stockStatus === "In-stock" ? "#dcfce7" : "#fee2e2",
                color:
                  p.stockStatus === "In-stock" ? "#166534" : "#991b1b"
              }}
            >
              {p.stockStatus}
            </span>

            {(user.role === "Admin" || p.ownerId === user.id) && (
              <div style={{ marginTop: "1rem" }}>
                <button onClick={() => openModal(p)}>Edit</button>{" "}
                <button
                  onClick={() => deleteProduct(p.id)}
                  style={{ background: "#ef4444" }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL (UNCHANGED) */}
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{ background: "#fff", padding: "2rem", width: "400px" }}
          >
            <h3>{editProduct ? "Edit" : "Add"} Product</h3>
            <input value={name} onChange={e => setName(e.target.value)} />
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
            <select value={businessId} onChange={e => setBusinessId(e.target.value)}>
              <option value="">Select Business</option>
              {businesses.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <select value={stockStatus} onChange={e => setStockStatus(e.target.value)}>
              <option>In-stock</option>
              <option>Out-of-stock</option>
            </select>
            <br />
            <button onClick={saveProduct}>Save</button>{" "}
            <button onClick={() => setModalOpen(false)}>Cancel</button>
          </motion.div>
        </motion.div>
      )}
    </Page>
  );
}
