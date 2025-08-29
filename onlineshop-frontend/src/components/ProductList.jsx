import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  const addToCart = async (productId) => {
    if (!user) {
      alert("Login first");
      navigate("/login");
      return;
    }
    await API.post("/cart", { userId: user.userId, productId, quantity: 1 });
    alert("Added to cart");
  };

  return (
    <div className="container mt-4">
      <h3>Products</h3>
      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5>{p.name}</h5>
                <p>{p.description}</p>
                <p>₹ {p.price}</p>
                <button className="btn btn-primary" onClick={() => addToCart(p.id)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
