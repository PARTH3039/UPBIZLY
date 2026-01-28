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
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [stockStatus, setStockStatus] = useState("In-stock");

  const loadData = async () => {
    try {
      const resProducts = await API.get("/products");
      const resBusinesses = await API.get("/businesses");

      setBusinesses(resBusinesses.data);
      setProducts(user.role === "Owner" ? resProducts.data.filter(p => p.ownerId === user.id) : resProducts.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadData();
}, [loadData]); // add loadData to dependency array


  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openModal = (p = null) => {
    setEditProduct(p);
    setName(p?.name || "");
    setPrice(p?.price || "");
    setBusinessId(p?.businessId || "");
    setStockStatus(p?.stockStatus || "In-stock");
    setModalOpen(true);
  };

  const saveProduct = async () => {
    if (!name || !price || !businessId) return toast.error("All fields required");

    try {
      const payload = {
        name,
        price: parseFloat(price),
        businessId: parseInt(businessId), // ✅ convert to int
        stockStatus,
        ownerId: user.id
      };

      if (editProduct) {
        await API.put(`/products/${editProduct.id}`, payload);
        toast.success("Product updated");
      } else {
        await API.post("/products", payload);
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
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Page>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded px-2 py-1" />
          <button onClick={() => openModal()} className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">Add Product</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
            <p className="text-gray-600 mb-1">Price: ${p.price}</p>
            <p className="text-gray-600 mb-1">Business: {businesses.find(b => b.id === p.businessId)?.name}</p>
            <p className="text-gray-600 mb-2">Stock: {p.stockStatus}</p>
            {(user.role === "Admin" || p.ownerId === user.id) && (
              <div className="flex gap-2">
                <button onClick={() => openModal(p)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
              </div>
              
            )}
          </div>
        ))}
      </div>

      {modalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-semibold mb-4">{editProduct ? "Edit" : "Add"} Product</h3>
            <input placeholder="Name" className="w-full p-2 border mb-2 rounded" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Price" className="w-full p-2 border mb-2 rounded" value={price} onChange={e => setPrice(e.target.value)} />
            <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="w-full p-2 border mb-2 rounded">
              <option value="">Select Business</option>
              {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className="w-full p-2 border mb-2 rounded">
              <option>In-stock</option>
              <option>Out-of-stock</option>
            </select>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={saveProduct} className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">Save</button>
              <button onClick={() => setModalOpen(false)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Page>
  );
}
