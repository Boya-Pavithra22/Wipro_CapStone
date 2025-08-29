import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      API.get(`/cart/${user.userId}`).then((res) => setCart(res.data));
    }
  }, [user]);

  const removeItem = async (id) => {
    await API.delete(`/cart/${id}`);
    setCart(cart.filter((c) => c.id !== id));
  };

  const placeOrder = async () => {
    const res = await API.post(`/orders?userId=${user.userId}`);
    navigate(`/payment/${res.data.id}`);
  };

  return (
    <div className="container mt-4">
      <h3>Your Cart</h3>
      {cart.map((c) => (
        <div key={c.id} className="d-flex justify-content-between border p-2 mb-2">
          <span>{c.product.name} (x{c.quantity})</span>
          <button className="btn btn-sm btn-danger" onClick={() => removeItem(c.id)}>
            Remove
          </button>
        </div>
      ))}
      {cart.length > 0 && <button className="btn btn-success" onClick={placeOrder}>Place Order</button>}
    </div>
  );
}
