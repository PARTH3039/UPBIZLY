import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard({ user }) {
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");  // NEW: error state
  const [loading, setLoading] = useState(true);

  // NEW: safe loadData function
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const b = await API.get("/businesses");
      const p = await API.get("/products");

      if (!b.data || !p.data) {
        throw new Error("Invalid data from server");
      }

      if (user.role === "Owner") {
        setBusinesses(b.data.filter(x => x.ownerId === user.id));
        setProducts(p.data.filter(x => x.ownerId === user.id));
      } else {
        setBusinesses(b.data);
        setProducts(p.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Server error: Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const barData = {
    labels: businesses.map(b => b.name),
    datasets: [
      {
        label: "Products per Business",
        data: businesses.map(
          b => products.filter(p => p.businessId === b.id).length
        ),
        backgroundColor: "#0f766e"
      }
    ]
  };

  const doughnutData = {
    labels: ["Businesses", "Products"],
    datasets: [
      {
        data: [businesses.length, products.length],
        backgroundColor: ["#0f766e", "#f97316"]
      }
    ]
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red", marginTop: "2rem" }}>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="mb-6">
        Logged in as <strong>{user.username}</strong> ({user.role})
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Products per Business</h3>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Overview</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}
