import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";   
import { AuthContext } from "../context/AuthContext";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ attach token like AdminDashboard
      await api.post(
        "/admin/categories",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      showToast("Category added successfully!", "success");
      setTimeout(() => navigate("/categories"), 1500); // redirect to category list
    } catch (err) {
      console.error("Error adding category:", err.response || err);
      showToast("Failed to add category", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: 500,
        margin: "50px auto",
        padding: 30,
        borderRadius: 16,
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: 20, textAlign: "center" }}>➕ Add Category</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Name</label>
          <input
            type="text"
            value={name}
            required
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "none",
              outline: "none",
              fontSize: "15px",
              color: "#333",
            }}
            placeholder="Enter category name"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "none",
              outline: "none",
              fontSize: "15px",
              color: "#333",
            }}
            placeholder="Enter category description"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "100%",
            padding: 14,
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            background: "#fff",
            color: "#764ba2",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          Add Category
        </motion.button>
      </form>

      {/* Toast */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 20,
            padding: "12px",
            borderRadius: 8,
            textAlign: "center",
            backgroundColor:
              toast.type === "success" ? "#4caf50" : "#f44336",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {toast.message}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddCategory;
