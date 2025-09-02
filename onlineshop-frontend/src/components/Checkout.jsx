import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TopPopup from "../components/TopPopup"; 

const Checkout = () => {
  const { user, setUser } = useContext(AuthContext);
  const { cart: cartItems, removeItem, cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userId: "",
    address: "",
    phone: "",
  });
  const [initialData, setInitialData] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [removingItems, setRemovingItems] = useState([]);

  // ✅ Popup state
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  // ✅ Helper to show popup
  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type }), 2000);
  };

  // Populate form with user data
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        userId: user.userId || "",
        address: user.address || "Not Available",
        phone: user.phone || "Not Available",
      };
      setFormData(userData);
      setInitialData(userData);
      setIsModified(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: value };
      const modified = ["name", "email", "address", "phone"].some(
        (key) => updatedForm[key] !== initialData[key]
      );
      setIsModified(modified);
      return updatedForm;
    });
  };

  const handleUpdateUser = async () => {
    if (!isModified) return;

    try {
      const updatedUser = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
      };

      const response = await api.put(`/users/${formData.userId}`, updatedUser);
      setUser((prev) => ({ ...prev, ...response.data }));
      setInitialData(response.data);
      setIsModified(false);

      showPopup("✅ User details updated successfully!", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      showPopup("❌ Failed to update user details!", "error");
    }
  };

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      showPopup("❌ Your cart is empty!", "error");
      return;
    }

    try {
      showPopup("⏳ Placing your order...", "success");

      const orderRequest = {
        userId: user.userId,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const response = await api.post("/orders", orderRequest);

      for (let item of cartItems) {
        await removeItem(item.id);
      }

      showPopup("✅ Order placed successfully!", "success");
      navigate(`/payment/${response.data.id}`);
    } catch (error) {
      console.error(error);
      showPopup("❌ Failed to place order.", "error");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: 20, display: "flex", gap: 30, flexWrap: "wrap" }}>
      {/* ✅ Popup component */}
      <TopPopup show={popup.show} message={popup.message} type={popup.type} />

      {/* Left Column: User Details */}
      <div style={{ flex: 1, minWidth: 350, padding: 25, border: "1px solid #ddd", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h3 style={{ marginBottom: 20 }}>Your Details</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" style={inputStyle} />
          <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={inputStyle} />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" style={inputStyle} />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" style={inputStyle} />
        </div>
        <button
          onClick={handleUpdateUser}
          disabled={!isModified}
          style={{
            marginTop: 25,
            width: "100%",
            padding: 12,
            background: isModified ? "#ff3e6c" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: isModified ? "pointer" : "not-allowed",
          }}
        >
          Update Details
        </button>
      </div>

      {/* Right Column: Cart */}
      <div style={{ flex: 1, minWidth: 350, padding: 25, border: "1px solid #ddd", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", maxHeight: "600px" }}>
        <h3 style={{ marginBottom: 20 }}>Products in Cart</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", paddingRight: 5, marginBottom: 15 }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, border: "1px solid #eee", borderRadius: 6, gap: 15, marginBottom: 10 }}>
                  <div style={{ width: 80, height: 80, flexShrink: 0 }}>
                    <img src={item.product.imageUrl} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: "bold" }}>{item.product.name}</p>
                    <p style={{ margin: 0 }}>Qty: {item.quantity}</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <p style={{ margin: 0 }}>₹{item.product.price * item.quantity}</p>
                    <button
                      onClick={async () => {
                        setRemovingItems((prev) => [...prev, item.id]);
                        await removeItem(item.id);
                        setRemovingItems((prev) => prev.filter((id) => id !== item.id));
                        showPopup("🗑️ Item removed!", "success");
                      }}
                      disabled={removingItems.includes(item.id)}
                      style={{ background: "transparent", border: "none", cursor: removingItems.includes(item.id) ? "not-allowed" : "pointer", color: "red", fontSize: 18 }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #eee", paddingTop: 10 }}>
              <p style={{ fontWeight: "bold", textAlign: "right", marginTop: 10 }}>Total: ₹{total}</p>
              <p style={{ marginTop: 5 }}>Cart Count: {cartCount}</p>
              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                style={{
                  marginTop: 15,
                  width: "100%",
                  padding: 12,
                  background: cartItems.length > 0 ? "#ff3e6c" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontWeight: "bold",
                  cursor: cartItems.length > 0 ? "pointer" : "not-allowed",
                }}
              >
                Confirm & Pay
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  width: "100%",
  fontSize: 14,
};

export default Checkout;
