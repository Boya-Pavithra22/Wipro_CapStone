import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../components/CartContext";

const PaymentPage = () => {
  const { id } = useParams();
  const orderId = id;
  const navigate = useNavigate();

  const { cart, setCart, setCartCount, removeItem } = useContext(CartContext);

  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/order/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        showNotification("Failed to fetch order details!", "error");
      }
    };
    fetchOrder();
  }, [orderId]);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); 
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!order) return;

    if (paymentMethod === "UPI" && !upiId) {
      showNotification("UPI ID is required", "error");
      return;
    }

    if (paymentMethod === "Card") {
      const { cardNumber, expiry, cvv, cardName } = cardDetails;
      if (!cardNumber || !expiry || !cvv || !cardName) {
        showNotification("All card details are required", "error");
        return;
      }
    }

    try {
      
      await api.put(`/orders/${orderId}/status?status=CONFIRMED`);

      
      const paymentRequest = {
        orderId: order.id,
        paymentMethod: paymentMethod,
        amount: order.totalAmount,
      };
      await api.post("/payments", paymentRequest);

      
      for (let item of cart) await removeItem(item.id);
      setCart([]);
      setCartCount(0);

      showNotification(`Payment successful! Order #${order.id} is confirmed 🎉`, "success");

      setTimeout(() => {
        navigate("/congrats");
      }, 2000); 
    } catch (err) {
      console.error("Payment error:", err);
      showNotification("Payment failed!", "error");
    }
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", display: "flex", gap: 20, position: "relative" }}>
      
      
      {notification && (
        <div
          style={{
            position: "absolute",
            top: -60,
            left: 0,
            right: 0,
            padding: 15,
            backgroundColor: notification.type === "success" ? "#4BB543" : "#FF4C4C",
            color: "#fff",
            borderRadius: 6,
            textAlign: "center",
            fontWeight: "bold",
            zIndex: 1000,
          }}
        >
          {notification.message}
        </div>
      )}

      
      <div
        style={{
          flex: 1,
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          maxHeight: "600px",
        }}
      >
        <h3>Order Summary</h3>

        <div style={{ flex: 1, overflowY: "auto", paddingRight: 5, marginBottom: 15 }}>
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 15,
                border: "1px solid #eee",
                padding: 10,
                borderRadius: 6,
              }}
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 6,
                  marginRight: 15,
                  objectFit: "cover",
                }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.product.name}</p>
                <p style={{ margin: 0 }}>Qty: {item.quantity}</p>
                <p style={{ margin: 0 }}>₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 10 }}>
          <p style={{ fontWeight: "bold", textAlign: "right", marginTop: 10 }}>
            Total: ₹{order.totalAmount}
          </p>
        </div>
      </div>

      
      <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: 20 }}>
        <h3>Choose Payment Method</h3>
        <div style={{ marginTop: 20 }}>
          {["UPI", "Card", "COD"].map((method) => (
            <label key={method} style={{ display: "block", marginBottom: 10 }}>
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{" "}
              {method}
            </label>
          ))}
        </div>

        {paymentMethod === "UPI" && (
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            style={{ marginTop: 10, padding: 12, width: "100%", borderRadius: 6, border: "1px solid #ccc" }}
          />
        )}

        {paymentMethod === "Card" && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {["cardNumber", "expiry", "cvv", "cardName"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field}
                value={cardDetails[field]}
                onChange={handleCardChange}
                style={{ padding: 12, borderRadius: 6, border: "1px solid #ccc" }}
              />
            ))}
          </div>
        )}

        <button
          onClick={handlePayment}
          style={{
            marginTop: 20,
            padding: 15,
            width: "100%",
            backgroundColor: "#ff3e6c",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Pay ₹{order.totalAmount}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
