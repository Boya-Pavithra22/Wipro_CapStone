import React from "react";
import { Nav } from "react-bootstrap";
import { motion } from "framer-motion";

const AdminSidebar = () => {
  return (
    <motion.div 
      className="bg-dark text-white p-3 sidebar"
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h4>Admin Panel</h4>
      <Nav className="flex-column mt-4">
        <Nav.Link className="text-white" href="#add-admin">Add Admin</Nav.Link>
        <Nav.Link className="text-white" href="#categories">Categories</Nav.Link>
        <Nav.Link className="text-white" href="#products">Products</Nav.Link>
      </Nav>
    </motion.div>
  );
};

export default AdminSidebar;
