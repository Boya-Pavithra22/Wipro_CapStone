import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ProductCard from "./ProductCard";
import "./Dashboard.css";
import data from "../assets/data/products.json";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("Men");
  const [products, setProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setProducts(data.products);
  }, []);

  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory
  );

  const addToCart = (product) => {
    setToastMessage(`${product.name} added to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="dashboard">
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={data.categories}
      />
      <div className="main-content">
        <Topbar />
        <div className="products-grid">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} addToCart={addToCart} />
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && <div className="toast">{toastMessage}</div>}
    </div>
  );
};

export default Dashboard;
