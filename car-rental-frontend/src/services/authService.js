import api from "./api";

export const loginUser = (credentials) => api.post("/auth/login", credentials);

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
