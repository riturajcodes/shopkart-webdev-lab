import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  const response = await api.post("/customers/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/customers/login", credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/customers/me");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/customers/logout");
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.patch("/customers/change-password", data);
  return response.data;
};

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};
export const addToWishlist = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

export default api;
