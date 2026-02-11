import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = () => {
      try {
        const userStr = localStorage.getItem("user");

        if (!userStr || userStr === "undefined") {
          setUser(null);
          return;
        }

        const parsedUser = JSON.parse(userStr);

        if (parsedUser?.token) {
          setUser(parsedUser);
          api.defaults.headers.common["Authorization"] =
            `Bearer ${parsedUser.token}`;
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (err) {
        console.error("Auth restore failed:", err);
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = (userData, token) => {
    const authUser = {
      ...userData,
      token,
    };

    localStorage.setItem("user", JSON.stringify(authUser));
    setUser(authUser);

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
