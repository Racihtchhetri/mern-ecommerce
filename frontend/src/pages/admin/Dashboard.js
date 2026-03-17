import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {

  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const res = await axios.get("http://localhost:5000/api/admin/dashboard");

      setStats(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row g-3">

        <div className="col-md-6">
          <div className="card text-center shadow bg-primary text-white">
            <div className="card-body">
              <h5>Total Orders</h5>
              <h3>{stats.orders}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-center shadow bg-success text-white">
            <div className="card-body">
              <h5>Total Products</h5>
              <h3>{stats.products}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-center shadow bg-warning">
            <div className="card-body">
              <h5>Total Users</h5>
              <h3>{stats.users}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-center shadow bg-info text-white">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <h3>₹{stats.revenue}</h3>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}