import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import api from "../../services/api";

const AdminForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register-admin", formData);
      setMessage("Admin created successfully!");
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data || "Error creating admin");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {message && <Alert variant="info">{message}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control name="name" value={formData.name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
      </Form.Group>
      <Button type="submit" variant="primary">Create Admin</Button>
    </Form>
  );
};

export default AdminForm;
