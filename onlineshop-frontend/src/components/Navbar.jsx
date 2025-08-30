import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "./CartContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "10px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Logo */}
        <h2 
          style={{ fontWeight: "bold", color: "#ff3e6c", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          ShopEase
        </h2>

        {/* Right menu */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "30px", fontSize: "14px", fontWeight: "bold" }}>
            
            {/* Profile */}
            <div 
              style={{ position: "relative", cursor: "pointer" }}
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              👤 Profile
              {showMenu && (
                <div style={{
                  position: "absolute", top: "120%", right: 0,
                  background: "#fff", border: "1px solid #ddd", borderRadius: 6,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)", minWidth: 150, zIndex: 1000
                }}>
                  <p style={{ padding: "8px 12px", margin: 0, borderBottom: "1px solid #eee" }}>
                    Hello {user?.name || "User"}
                  </p>
                  <p style={{ padding: "8px 12px", margin: 0, borderBottom: "1px solid #eee" }}>
                    {user?.email}
                  </p>
                  <Link to="/orders" style={{ display: "block", padding: "8px 12px", textDecoration: "none", color: "#333" }}>
                    My Orders
                  </Link>
                  <button 
                    onClick={handleLogout}
                    style={{ width: "100%", padding: "8px 12px", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" style={{ textDecoration: "none", color: "#333" }}>
              ❤️ Wishlist
            </Link>

            {/* Bag */}
            <Link to="/cart" style={{ textDecoration: "none", color: "#333", position: "relative" }}>
              🛍️ Bag
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -8, right: -12,
                  background: "red", color: "#fff", fontSize: "12px",
                  borderRadius: "50%", padding: "2px 6px", fontWeight: "bold"
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>Login</Link>
            <Link to="/register" style={{ textDecoration: "none", color: "#333" }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
