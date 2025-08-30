import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../components/CartContext";
import "../components/css/ProductList.css"

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res;
        if (categoryName) {
          res = await api.get(`/products/category/${categoryName}`);
          setProducts(res.data);
        } else {
          res = await api.get(`/products?page=0&size=12`);
          setProducts(res.data.content);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [categoryName]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Please login first");
      return;
    }
    try {
      await addItem(productId); // updates cart and count automatically
      alert("Added to cart");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            onClick={() => navigate(`/products/${product.id}`)}
          />
          <div className="product-info">
            <h5 className="product-name">{product.name}</h5>
            <p className="product-price">₹{product.price}</p>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="add-btn"
            >
              🛒 Add to Bag
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
