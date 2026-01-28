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

  const loadData = async () => {
    const b = await API.get("/businesses");
    const p = await API.get("/products");
    setBusinesses(b.data);
    setProducts(p.data);
  };

  useEffect(() => {
    loadData();
}, [loadData]); 

  const barData = {
    labels: businesses.map(b => b.name),
    datasets: [
      {
        label: "Products per Business",
        data: businesses.map(b => products.filter(p => p.businessId === b.id).length),
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

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="mb-6">Logged in as <strong>{user.username}</strong> ({user.role})</p>

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
