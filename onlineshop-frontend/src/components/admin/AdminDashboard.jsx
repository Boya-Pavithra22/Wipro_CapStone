import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom"; 


const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState([]);
  const navigate = useNavigate(); 


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        console.log("Fetching dashboard summary...");
        const response = await api.get("/admin/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const data = response.data;
        setStats([
          {
            title: "Total Users",
            value: data.totalUsers,
            icon: <PeopleIcon fontSize="large" color="primary" />,
          },
          {
            title: "Total Orders",
            value: data.totalOrders,
            icon: <ShoppingCartIcon fontSize="large" color="warning" />,
          },
          {
            title: "Products",
            value: data.totalProducts,
            icon: <InventoryIcon fontSize="large" color="secondary" />,
          },
          {
            title: "Revenue",
            value: `₹${data.totalRevenue}`,
            icon: <CategoryIcon fontSize="large" color="success" />,
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchSummary();
  }, [user]);

  return (
    <Box sx={{ padding: "40px" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#2c3e50" }}
      >
        Welcome {user?.name} 👋
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ marginBottom: "30px" }}>
        Your growth in numbers 🚀
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                sx={{
                  borderRadius: "16px",
                  textAlign: "center",
                  boxShadow: 3,
                  padding: "20px",
                  background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
                  "&:hover": { boxShadow: 6, transform: "scale(1.05)" },
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent>
                  <Box sx={{ marginBottom: "15px" }}>{stat.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Manage Products Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Box
          sx={{
            marginTop: "60px",
            borderRadius: "20px",
            padding: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            color: "white",
            boxShadow: 4,
          }}
        >
          {/* Left side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <StoreIcon sx={{ fontSize: 60 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Manage Products
              </Typography>
              <Typography variant="body1">
                Add, edit, or update your product catalog.
              </Typography>
            </Box>
          </Box>

          {/* Right side button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "#764ba2",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#f1f1f1" },
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "16px",
            }}
            onClick={() => navigate("/ProductList")}
          >
            Go →
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default AdminDashboard;
