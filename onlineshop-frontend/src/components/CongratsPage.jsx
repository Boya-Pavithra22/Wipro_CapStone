import React from "react";
import { useNavigate } from "react-router-dom";

const CongratsPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
        color: "#333",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: "3rem" }}>🎉 Wohoo! 🎊</h1>
      <h2 style={{ marginTop: 10 }}>Your order has been placed successfully ✅</h2>
      <p style={{ fontSize: "18px", marginTop: 10 }}>
        Thank you for shopping with us. Your order is on the way 🚚✨
      </p>

      <button
        onClick={() => navigate("/products")}
        style={{
          marginTop: 30,
          padding: "15px 25px",
          backgroundColor: "#ff3e6c",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: 16,
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          transition: "transform 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        🛍️ Continue Shopping
      </button>
    </div>
  );
};

export default CongratsPage;
