import React from "react";
import { FaHeart, FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="icons">
        <FaHeart title="Wishlist" />
        <FaShoppingCart title="Cart" /> 
        <FaUserCircle title="Profile" />
      </div>
    </div>
  );
};

export default Topbar;
