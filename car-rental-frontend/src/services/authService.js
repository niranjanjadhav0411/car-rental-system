import api from "./api";

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);

  const token = res.data?.token;

  if (!token) {
    throw new Error("Token not received from server");
  }

  localStorage.setItem("token", token);

  return token;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};
