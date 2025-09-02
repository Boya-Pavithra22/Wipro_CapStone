import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [showPopup, setShowPopup] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        triggerPopup("Failed to load categories", "error");
      }
    };
    fetchCategories();
  }, [user]);

  const triggerPopup = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (!user || user.role?.toLowerCase() !== "admin") {
      return triggerPopup("You are not authorized to add products", "error");
    }

    if (!formData.categoryId) {
      return triggerPopup("Please select a category", "error");
    }

    try {
      await api.post(
        "/admin/products",
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          categoryName: formData.categoryId,
          imageUrl: formData.imageUrl,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      triggerPopup("Product added successfully!");
      setTimeout(() => navigate("/ProductList"), 1000);
    } catch (err) {
      console.error("Failed to add product:", err);
      triggerPopup("Failed to add product", "error");
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#007bff", marginBottom: 20 }}>Add New Product</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 15 }}
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          style={{
            padding: "12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          style={{
            padding: "12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          style={{
            padding: "12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          style={{
            padding: "12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          style={{
            padding: "12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
            backgroundColor: "#fff",
          }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id || cat} value={cat.id || cat}>
              {cat.name || cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          style={{
            padding: "12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            fontSize: 16,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ➕ Add Product
        </button>
      </form>

      {/* Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 20px",
            backgroundColor: popupType === "success" ? "#28a745" : "#dc3545",
            color: "#fff",
            borderRadius: 6,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default AddProduct;
