import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [pincode, setPincode] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [popupMessage, setPopupMessage] = useState(""); 
  const [popupType, setPopupType] = useState("success"); 
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [editData, setEditData] = useState({}); 

  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const navigate = useNavigate();


  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setSelectedImage(res.data.imageUrl);
        setEditData(res.data);
      })
      .catch(console.error);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const triggerPopup = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleAddToCart = async () => {
    if (!user) {
      triggerPopup("Please login first", "error");
      return;
    }
    try {
      await addItem(product.id, 1);
      triggerPopup(`🛒 Added ${product.name} to cart!`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      triggerPopup("Failed to add to cart", "error");
    }
  };

  const handleCheckDelivery = () => {
    if (!pincode) {
      triggerPopup("Please enter a pincode", "error");
      return;
    }
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 3000);
  };

  const handleEdit = () => setIsEditing(true);

  const handleRemove = async () => {
  if (!user || user.role?.toLowerCase() !== "admin") {
    triggerPopup("You are not authorized to perform this action", "error");
    return;
  }

  if (window.confirm("Are you sure you want to remove this product?")) {
    try {
      const token = user.token;
      await api.delete(`/admin/products/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      triggerPopup("Product removed successfully");
      setTimeout(() => {
        navigate("/ProductList"); 
      }, 1000);
    } catch (err) {
      console.error("Failed to remove product:", err);
      triggerPopup("Failed to remove product", "error");
    }
  }
};



  

  const handleSave = async () => {
  if (!user || user.role?.toLowerCase() !== "admin") {
    triggerPopup("You are not authorized to perform this action", "error");
    return;
  }

  try {
    const token = user.token;
    const res = await api.put(
      `/admin/products/${product.id}`,
      editData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setProduct(res.data);
    setIsEditing(false);
    triggerPopup("Product updated successfully");
  } catch (err) {
    console.error("Failed to update product:", err);
    triggerPopup("Failed to update product", "error");
  }
};


  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <div style={{ display: "flex", gap: "40px", padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* LEFT: Image gallery */}
      <div style={{ flex: 1 }}>
        <img 
          src={selectedImage} 
          alt={product.name} 
          style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 8, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} 
        />
        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          {[product.imageUrl, ...(product.images || [])].map((img, idx) => (
            <motion.img 
              key={idx}
              src={img}
              alt="thumb"
              style={{ 
                width: 80, 
                height: 80, 
                objectFit: "cover", 
                border: selectedImage === img ? "2px solid #FF3E6C" : "1px solid #ddd", 
                borderRadius: 6, 
                cursor: "pointer" 
              }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      
      <div style={{ flex: 1 }}>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: 20, borderRadius: 10, boxShadow: "0 5px 20px rgba(0,0,0,0.1)", background: "#fff" }}
          >
            <h2 style={{ marginBottom: 20, color: "#FF3E6C" }}>Edit Product</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Product Name", field: "name", type: "text" },
                { label: "Description", field: "description", type: "text" },
                { label: "Image URL", field: "imageUrl", type: "text" },
                { label: "Price", field: "price", type: "number" },
                { label: "Stock", field: "stock", type: "number" },
              ].map(({ label, field, type }) => (
                <div key={field} style={{ position: "relative" }}>
                  <input
                    type={type}
                    value={editData[field]}
                    onChange={e => handleEditChange(field, e.target.value)}
                    placeholder=" "
                    style={{
                      width: "100%",
                      padding: "14px 12px 14px 12px",
                      border: "2px solid #ddd",
                      borderRadius: 8,
                      outline: "none",
                      fontSize: 16,
                      transition: "all 0.3s",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                    }}
                  />
                  <label
                    style={{
                      position: "absolute",
                      left: 12,
                      top: editData[field] ? -8 : 14,
                      background: "#fff",
                      padding: "0 4px",
                      fontSize: editData[field] ? 12 : 16,
                      color: editData[field] ? "#FF3E6C" : "#999",
                      pointerEvents: "none",
                      transition: "all 0.2s"
                    }}
                  >
                    {label}
                  </label>
                </div>
              ))}

              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <motion.button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    background: "#FF6F00",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  Save
                </motion.button>
                <motion.button
                  onClick={() => { setIsEditing(false); setEditData(product); }}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    background: "#9E9E9E",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <h2 style={{ fontSize: 24, fontWeight: "bold" }}>{product.description || "Brand Name"}</h2>
            <p style={{ fontSize: 18, color: "#444", marginBottom: 5 }}>{product.name}</p>
            <p style={{ margin: "8px 0", color: "#555" }}>
              ⭐ {product.rating || "4.0"} | {product.reviewsCount || "100+ Ratings"}
            </p>

            <div style={{ margin: "15px 0" }}>
              <span style={{ fontSize: 22, fontWeight: "bold" }}>₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span style={{ textDecoration: "line-through", marginLeft: 10, color: "#888" }}>
                    ₹{product.originalPrice}
                  </span>
                  <span style={{ marginLeft: 10, color: "green", fontWeight: "bold" }}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
              <p style={{ fontWeight: "bold", color: product.stock <= 5 ? "red" : "green", marginTop: 5 }}>
                {product.stock <= 5 ? "Few Left!" : "In Stock"}
              </p>
            </div>

            {product.sizes && (
              <div>
                <h4>Select Size:</h4>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 4,
                        border: selectedSize === size ? "2px solid #FF3E6C" : "1px solid #ccc",
                        background: "white",
                        cursor: "pointer"
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ marginTop: 20, display: "flex", gap: 15 }}>
              {user && user.role?.toLowerCase() === "admin" ? (
                <>
                  <button
                    onClick={handleEdit}
                    style={{
                      flex: 1,
                      padding: "14px 20px",
                      backgroundColor: "#FF6F00",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={handleRemove}
                    style={{
                      flex: 1,
                      padding: "14px 20px",
                      backgroundColor: "#D32F2F",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    🗑 Remove
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      padding: "14px 20px",
                      backgroundColor: "#FF3E6C",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ADD TO BAG 🛒
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "14px 20px",
                      backgroundColor: "#FF4081",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 16,
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ❤️ WISHLIST
                  </button>
                </>
              )}
            </div>

            <p style={{ marginTop: 20, fontSize: 14, color: "#555" }}>
              Sold by: <strong>{product.seller || "Default Seller"}</strong>
            </p>

            {/* Delivery */}
            <div style={{ marginTop: 20 }}>
              <h4>Delivery Options</h4>
              <input 
                type="text" 
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: 4, marginRight: 10 }} 
              />
              <button 
                onClick={handleCheckDelivery}
                style={{ padding: "10px 20px", border: "none", background: "#2874f0", color: "#fff", borderRadius: 4, cursor: "pointer" }}
              >
                Check
              </button>

              {showAnimation && (
                <div style={{ marginTop: 10, padding: 10, backgroundColor: "#d4edda", color: "#155724", borderRadius: 4, fontWeight: "bold" }}>
                  🚚 Delivery Available!
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            background: popupType === "success" ? "#28a745" : "#dc3545",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 6,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            zIndex: 1000
          }}
        >
          {popupMessage}
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetails;
