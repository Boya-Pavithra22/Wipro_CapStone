import React, { useState } from "react";
import "../css/Register.css";
import reg1 from "../images/reg1.jpg";
import api from "../../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: ""
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset field error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      phone: formData.phone
    };

    try {
      await api.post("/auth/register-customer", payload);
      showNotification("✅ Registration Successful!", "success");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: ""
      });
      setErrors({});
    } catch (error) {
      console.error(error.response?.data || error.message);

      // If backend says email already exists, show below email field
      if (error.response?.status === 409 || (error.response?.data?.includes && error.response.data.includes("Email"))) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      } else {
        showNotification(error.response?.data || "❌ Registration failed", "error");
      }
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type }), 3000);
  };

  return (
    <div className="register-container" style={{ backgroundImage: `url(${reg1})` }}>
      <div className="overlay"></div>

      {/* Slide-down Notification */}
      <div
        style={{
          position: "fixed",
          top: notification.show ? "20px" : "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 20px",
          backgroundColor: notification.type === "success" ? "#4caf50" : "#f44336",
          color: "#fff",
          borderRadius: 6,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 1000,
          transition: "top 0.5s ease",
        }}
      >
        {notification.message}
      </div>

      <div className="register-box">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error animate-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error animate-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error animate-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="error animate-error">{errors.confirmPassword}</p>}
          </div>

          <div className="form-group">
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          </div>

          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>

      <style>
        {`
          .error {
            color: #f44336;
            font-size: 13px;
            margin-top: 4px;
            opacity: 0;
          }
          .animate-error {
            animation: fadeIn 0.5s forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Register;
