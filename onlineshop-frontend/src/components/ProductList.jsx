import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../components/CartContext";
import "../components/css/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (selectedCategory) {
          const res = await api.get(`/products/category/${selectedCategory}?page=${page}&size=8`);
          setProducts(res.data.content || res.data || []);
          setTotalPages(res.data.totalPages || 1);
        } else {
          const res = await api.get(`/products?page=${page}&size=8`);
          setProducts(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setTotalPages(1);
      }
    };
    fetchProducts();
  }, [selectedCategory, page]);

  // Show toast helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const handleAddToCart = async (productId) => {
    if (!user) return showToast("Please login first!", "error");
    try {
      await addItem(productId);
      showToast("Added to cart!", "success");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      showToast("Failed to add to cart", "error");
    }
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <div style={{ display: "flex" }}>
      {/* Left Sidebar: Categories */}
      <div
        style={{
          width: 220,
          minHeight: "100vh",
          borderRight: "1px solid #ddd",
          padding: 20,
          position: "sticky",
          top: 0,
          background: "#fff",
        }}
      >
        <h4>Categories</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label>
            <input
              type="radio"
              value=""
              checked={selectedCategory === ""}
              onChange={() => { setSelectedCategory(""); setPage(0); }}
            />
            All
          </label>
          {categories.map((cat) => (
            <label key={cat}>
              <input
                type="radio"
                value={cat}
                checked={selectedCategory === cat}
                onChange={() => { setSelectedCategory(cat); setPage(0); }}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ flex: 1, padding: 20 }}>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
                onClick={() => navigate(`/products/${product.id}`)}
              />
              <div className="product-info">
                <h5 className="product-name">{product.name}</h5>
                <p className="product-price">₹{product.price}</p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: product.stock <= 5 ? "red" : "green",
                  }}
                >
                  {product.stock <= 5 ? "Few Left!" : "In Stock"}
                </p>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="add-btn"
                >
                  🛒 Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button onClick={handlePrev} disabled={page === 0} className="page-btn">
              {"<<"}
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {page + 1} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={page === totalPages - 1} className="page-btn">
              {">>"}
            </button>
          </div>
        )}
      </div>

      {/* Slide-down Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 20px",
            backgroundColor: toast.type === "success" ? "#4caf50" : "#f44336",
            color: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 1000,
            transition: "all 0.3s ease",
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ProductList;
