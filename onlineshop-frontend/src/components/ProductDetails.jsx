import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../components/CartContext";
import { AuthContext } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext); // get addItem function

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setSelectedImage(res.data.imageUrl); // default main image
      })
      .catch(console.error);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  // Handler for Add to Bag
  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await addItem(product.id, 1); // add 1 quantity by default
      alert(`Added to cart!\nUser ID: ${user.userId}\nProduct ID: ${product.id}\nQuantity: 1`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div style={{ display: "flex", gap: "40px", padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* LEFT: Image gallery */}
      <div style={{ flex: 1 }}>
        <img 
          src={selectedImage} 
          alt={product.name} 
          style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 8 }} 
        />
        
        {/* Thumbnails */}
        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          {[product.imageUrl, ...(product.images || [])].map((img, idx) => (
            <img 
              key={idx}
              src={img}
              alt="thumb"
              style={{ 
                width: 80, 
                height: 80, 
                objectFit: "cover", 
                border: selectedImage === img ? "2px solid #2874f0" : "1px solid #ddd", 
                borderRadius: 6, 
                cursor: "pointer" 
              }}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Product details */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 24, fontWeight: "bold" }}>{product.brand || "Brand Name"}</h2>
        <p style={{ fontSize: 18, color: "#444", marginBottom: 5 }}>{product.name}</p>
        <p style={{ margin: "8px 0", color: "#555" }}>
          ⭐ {product.rating || "4.0"} | {product.reviewsCount || "100+ Ratings"}
        </p>

        <div style={{ margin: "15px 0" }}>
          <span style={{ fontSize: 22, fontWeight: "bold" }}>₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span style={{ textDecoration: "line-through", marginLeft: 10, color: "#888" }}>
                ₹{product.originalPrice}
              </span>
              <span style={{ marginLeft: 10, color: "green", fontWeight: "bold" }}>
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {product.sizes && (
          <div>
            <h4>Select Size:</h4>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 4,
                    border: selectedSize === size ? "2px solid #2874f0" : "1px solid #ccc",
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: 20, display: "flex", gap: 15 }}>
          <button 
            onClick={handleAddToCart} // <-- Add to cart
            style={{ 
              flex: 1, 
              padding: "14px 20px", 
              backgroundColor: "#ff3e6c", 
              color: "#fff", 
              border: "none", 
              borderRadius: 6, 
              fontSize: 16, 
              fontWeight: "bold", 
              cursor: "pointer" 
            }}
          >
            ADD TO BAG 🛒
          </button>

          <button 
            style={{ 
              flex: 1, 
              padding: "14px 20px", 
              backgroundColor: "#fff", 
              color: "#555", 
              border: "1px solid #ccc", 
              borderRadius: 6, 
              fontSize: 16, 
              fontWeight: "bold", 
              cursor: "pointer" 
            }}
          >
            ❤️ WISHLIST
          </button>
        </div>

        <p style={{ marginTop: 20, fontSize: 14, color: "#555" }}>
          Sold by: <strong>{product.seller || "Default Seller"}</strong>
        </p>

        <div style={{ marginTop: 20 }}>
          <h4>Delivery Options</h4>
          <input 
            type="text" 
            placeholder="Enter Pincode" 
            style={{ padding: "10px", border: "1px solid #ccc", borderRadius: 4, marginRight: 10 }} 
          />
          <button style={{ padding: "10px 20px", border: "none", background: "#2874f0", color: "#fff", borderRadius: 4, cursor: "pointer" }}>
            Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
