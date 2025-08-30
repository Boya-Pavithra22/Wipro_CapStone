import React from "react";

const Sidebar = ({ selectedCategory, setSelectedCategory, categories }) => {
  return (
    <div className="sidebar">
      <h3>Categories</h3>
      <ul>
        {categories.map((cat) => (
          <li
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
