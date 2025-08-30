import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { CartProvider } from "./components/CartContext";   // ✅ import CartProvider

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Payment from "./components/Payment";
import Navbar from "./components/Navbar";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminForm from "./components/admin/AdminForm";
import CategoryForm from "./components/admin/CategoryForm";
import ProductForm from "./components/admin/ProductForm";

import 'bootstrap/dist/css/bootstrap.min.css';

// Private Route for authenticated users
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

// Admin Route for users with role ADMIN
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user && user.role === "ADMIN" ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>   {/* ✅ wrap everything with CartProvider */}
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route path="/" element={<PrivateRoute><ProductList /></PrivateRoute>} />
            <Route path="/products/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} /> 
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/payment/:id" element={<PrivateRoute><Payment /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/add-admin" element={<AdminRoute><AdminForm /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><CategoryForm /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductForm /></AdminRoute>} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
