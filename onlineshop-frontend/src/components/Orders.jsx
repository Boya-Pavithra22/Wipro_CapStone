import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      API.get(`/orders/${user.userId}`).then((res) => setOrders(res.data));
    }
  }, [user]);

  return (
    <div className="container mt-4">
      <h3>Your Orders</h3>
      {orders.map((o) => (
        <div key={o.id} className="border p-2 mb-2">
          <p>Order #{o.id} - Status: {o.status}</p>
          <ul>
            {o.orderItems.map((it) => (
              <li key={it.id}>{it.product.name} (x{it.quantity})</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
