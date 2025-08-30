import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user from localStorage for persistent login
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = ({ token, role, name, email, userId }) => {
  const userData = { token, role, name, email, userId };
  
  // Save user to localStorage
  localStorage.setItem("user", JSON.stringify(userData));
  
  // Set user state
  setUser(userData);

  // Show alerts
  alert(`User ID: ${userData.userId}`);
  alert(`Email: ${userData.email}`);
  alert(`Token: ${userData.token}`);
};

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
