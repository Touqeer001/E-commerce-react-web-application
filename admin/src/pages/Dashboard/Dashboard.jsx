import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboardService";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import RecentOrders from "../../components/Dashboard/RecentOrders";
import LowStockProducts from "../../components/Dashboard/LowStockProducts";
import Loader from "../../components/Common/Loader";
import "./Dashboard.css";

export default function Dashboard() {
  const [d, setD] = useState();
  useEffect(() => {
    getDashboard()
      .then((r) => setD(r.data))
      .catch(() => {});
  }, []);
  if (!d) return <Loader message="Loading dashboard…" />;
  return (
    <>
      <h1>Dashboard</h1>
      <DashboardStats stats={d.stats} />
      <div className="grid dashboardGrid">
        <RecentOrders orders={d.recentOrders} />
        <LowStockProducts products={d.lowStock} />
      </div>
    </>
  );
}
