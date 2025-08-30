import React, { useState } from "react";
import { Tab, Tabs, Container } from "react-bootstrap";
import AdminForm from "./AdminForm";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";

const AdminPanel = () => {
  const [key, setKey] = useState("add-admin");

  return (
    <Container fluid className="p-4">
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="add-admin" title="Add Admin">
          <AdminForm />
        </Tab>
        <Tab eventKey="categories" title="Categories">
          <CategoryForm />
        </Tab>
        <Tab eventKey="products" title="Products">
          <ProductForm />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPanel;
