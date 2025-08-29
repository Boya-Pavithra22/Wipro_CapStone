import React, { useState, useContext } from "react";
import { TextField, Button, Card, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../components/css/Login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      alert("came in try ???")
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
    alert(res.data.token)
      navigate("/");
    } catch (err) {
      alert("Invalid credentials Anil");
    }
  };

  return (
    <div className="login-bg">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Card className="login-card">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {/* 🔹 Custom Store Name */}
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold", color: "#2c3e50" }}
            >
              🛍️ ShopEase
            </Typography>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{
                  marginTop: "20px",
                  padding: "12px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Login
              </Button>
            </motion.div>
          </form>

          <Typography align="center" sx={{ marginTop: "15px" }}>
            New here? <a href="/register">Create an account</a>
          </Typography>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
