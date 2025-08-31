import React, { useContext } from "react";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Cart = () => {
  const { cart, removeItem, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleRemove = async (cartId) => await removeItem(cartId);

  const handleQuantityChange = async (cartId, newQty) => {
    try {
      await api.put(`/cart/${cartId}?quantity=${newQty}`);
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
    navigate("/checkout");
  };

  if (!cart.length)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 50,
          padding: 20,
        }}
      >
        <p style={{ fontSize: 48, margin: "20px 0" }}>😢</p>
        <h2>Your cart is empty!</h2>
        <p>Looks like you haven't added any products yet.</p>
        <button
          onClick={() => navigate("/products")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            backgroundColor: "#ff3e6c",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Shop Products
        </button>
      </div>
    );

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: 20 }}>My Bag ({cart.length} items)</h2>

      {/* Horizontal scroll container */}
      <div
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          paddingBottom: 10,
        }}
      >
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              minWidth: 300,
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 15,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "#fff",
            }}
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 8 }}
            />
            <p style={{ fontSize: 16, fontWeight: "bold", margin: "10px 0 5px" }}>
              {item.product.name}
            </p>
            <p style={{ fontSize: 14, color: "#888" }}>{item.product.brand || "Brand"}</p>
            {item.size && <p style={{ fontSize: 14 }}>Size: {item.size}</p>}
            <p style={{ fontWeight: "bold", marginTop: 5 }}>
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
        ))}
      </div>

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
