import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminPanel from "./AdminPanel";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="d-flex admin-dashboard">
      <AdminSidebar />
      <AdminPanel />
    </div>
  );
};

export default AdminDashboard;
