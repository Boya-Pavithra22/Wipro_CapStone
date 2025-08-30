import React, { useState, useEffect } from "react";
import { Form, Button, Table, Alert } from "react-bootstrap";
import api from "../../services/api";

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", imageUrl: "", categoryId: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", { ...formData, category: { id: formData.categoryId } });
      setMessage("Product added!");
      setFormData({ name: "", price: "", imageUrl: "", categoryId: "" });
      loadProducts();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data || "Error adding product");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group>
          <Form.Label>Product Name</Form.Label>
          <Form.Control value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Image URL</Form.Label>
          <Form.Control value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} required>
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="success" className="mt-2">Add Product</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th></tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.name}</td>
              <td>{prod.price}</td>
              <td>{prod.category?.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductForm;
