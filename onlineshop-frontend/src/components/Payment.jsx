import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Payment() {
  const { orderId } = useParams();
  const [method, setMethod] = useState("CARD");
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      await API.post("/payments", { orderId, paymentMethod: method, amount: 0 });
      alert("Payment Successful");
      navigate("/orders");
    } catch (err) {
      alert("Payment Failed");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Payment for Order #{orderId}</h3>
      <select className="form-control my-2" value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="CARD">Card</option>
        <option value="UPI">UPI</option>
        <option value="COD">Cash on Delivery</option>
      </select>
      <button className="btn btn-primary" onClick={handlePayment}>Pay Now</button>
    </div>
  );
}
