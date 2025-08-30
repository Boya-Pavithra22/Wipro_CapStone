import React, { useState } from "react";
import "../css/Register.css"
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

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setToastMessage("Passwords do not match!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Prepare payload (exclude confirmPassword)
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      phone: formData.phone
    };

    try {
      const response = await api.post("/auth/register-customer", payload);
      console.log(response.data);

      setToastMessage("Registration Successful!");
      setShowToast(true);

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: ""
      });

      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setToastMessage(error.response?.data || "Registration failed");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="register-container" style={{ backgroundImage: `url(${reg1})` }}>
      <div className="overlay"></div>
      <div className="register-box">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>

      {/* Toast Notification */}
      {showToast && <div className="toast">{toastMessage}</div>}
    </div>
  );
};

export default Register;
