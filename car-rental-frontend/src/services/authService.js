import api from "./api";

export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);

    const accessToken = res.data?.accessToken;

    if (!accessToken) {
      throw new Error("Access token not returned from server");
    }

    return accessToken;
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || err.response?.data || "Login failed",
    );
  }
};
