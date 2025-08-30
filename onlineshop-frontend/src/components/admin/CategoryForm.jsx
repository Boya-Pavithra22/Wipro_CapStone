import React, { useState, useEffect } from "react";
import { Form, Button, Table, Alert } from "react-bootstrap";
import api from "../../services/api";

const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name });
      setMessage("Category added!");
      setName("");
      loadCategories();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data || "Error adding category");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group>
          <Form.Label>Category Name</Form.Label>
          <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Button type="submit" variant="success" className="mt-2">Add Category</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr><th>ID</th><th>Name</th></tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoryForm;
