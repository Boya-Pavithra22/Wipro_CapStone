import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9080/api", // Spring Boot runs on port 9080
});

// attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
