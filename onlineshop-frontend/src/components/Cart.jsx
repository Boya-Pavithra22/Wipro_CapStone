import React, { useContext } from "react";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Cart = () => {
  const { cart, removeItem, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calculate total price dynamically
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleRemove = async (cartId) => {
    await removeItem(cartId);
  };

  const handleQuantityChange = async (cartId, newQty) => {
    try {
      // Send PUT request to update quantity
      await api.put(`/cart/${cartId}?quantity=${newQty}`);
      
      // Refresh cart and re-render
      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const placeOrder = () => {
    if (!user) {
      alert("Please login first");
      return;
    }
    navigate(`/orders`);
  };

  if (!cart.length) return <p style={{ margin: 20 }}>Your cart is empty</p>;

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: 20 }}>My Bag ({cart.length} items)</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            borderBottom: "1px solid #eee",
            padding: "15px 0",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* Product Image */}
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
          />

          {/* Product Info */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: "#888" }}>{item.product.brand || "Brand"}</p>
            <p style={{ fontSize: 16, fontWeight: "bold", margin: "5px 0" }}>
              {item.product.name}
            </p>

            {/* Size */}
            {item.size && (
              <p style={{ fontSize: 14, color: "#555" }}>Size: {item.size}</p>
            )}

            {/* Price */}
            <p style={{ marginTop: 8, fontSize: 16, fontWeight: "bold" }}>
              ₹{item.product.price * item.quantity}{" "}
              <span style={{ fontSize: 14, color: "#888", marginLeft: 5 }}>
                (₹{item.product.price} × {item.quantity})
              </span>
            </p>

            {/* Quantity Selector */}
            <div style={{ marginTop: 5 }}>
              <label htmlFor={`qty-${item.id}`} style={{ marginRight: 5 }}>Qty:</label>
              <select
                id={`qty-${item.id}`}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }}
              >
                {[...Array(10).keys()].map((n) => (
                  <option key={n + 1} value={n + 1}>
                    {n + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => handleRemove(item.id)}
              style={{
                marginTop: 10,
                padding: "6px 12px",
                border: "1px solid #ccc",
                borderRadius: 4,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Total & Place Order */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          paddingTop: 20,
          borderTop: "2px solid #eee",
        }}
      >
        <h3>Total: ₹{totalPrice}</h3>
        <button
          onClick={placeOrder}
          style={{
            padding: "12px 24px",
            background: "#ff3e6c",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
