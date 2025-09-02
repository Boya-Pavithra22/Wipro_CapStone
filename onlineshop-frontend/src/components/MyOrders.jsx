import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/${user.userId}?page=${page}&size=4`);
        setOrders(res.data.content || res.data); 
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [user, page]);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages - 1));

  if (!orders.length) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <p style={{ fontSize: 24 }}>😔 You have no orders yet!</p>
        <p>Start shopping and place your first order!</p>
        <a
          href="/"
          style={{
            marginTop: 20,
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#ff3e6c",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Shop Now
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: 30, textAlign: "center", color: "#ff3e6c" }}>
        My Orders ({orders.length})
      </h2>

      
      <div
        style={{
          maxHeight: "600px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 30,
          paddingRight: 10,
        }}
      >
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              background: "#fff",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <h4 style={{ margin: 0 }}>Order #{order.id}</h4>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  backgroundColor: order.status === "PENDING" ? "#facc15" : "#10b981",
                  color: "#fff",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {order.status}
              </span>
            </div>
            <p style={{ margin: "5px 0 15px", color: "#555" }}>
              Order Date: {new Date(order.orderDate).toLocaleString()}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    padding: 15,
                    minWidth: 180,
                    textAlign: "center",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  />
                  <p style={{ fontWeight: "bold", margin: "5px 0" }}>{item.productName}</p>
                  <p style={{ color: "#555", margin: "5px 0" }}>Qty: {item.quantity}</p>
                  <p style={{ fontWeight: "bold", margin: "5px 0" }}>₹{item.price}</p>
                </div>
              ))}
            </div>

            <p
              style={{
                marginTop: 15,
                fontWeight: "bold",
                textAlign: "right",
                fontSize: 16,
              }}
            >
              Total: ₹{order.totalAmount}
            </p>
          </div>
        ))}
      </div>

      
      {totalPages > 1 && (
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 15,
          }}
        >
          <button
            onClick={handlePrev}
            disabled={page === 0}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              cursor: page === 0 ? "not-allowed" : "pointer",
            }}
          >
            {"<<"} Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages - 1}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
            }}
          >
            Next {">>"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
