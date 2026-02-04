import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("user");

    if (userStr && userStr !== "undefined") {
      try {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        localStorage.removeItem("user");
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
