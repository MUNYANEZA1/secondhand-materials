import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import authService from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("auth-token") || localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token exists and is valid on initial load
  useEffect(() => {
    const verifyToken = async () => {
      console.log("Verifying token:", token ? "exists" : "missing");
      try {
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        // Check token expiration
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        console.log("Token expiration:", new Date(decodedToken.exp * 1000));

        if (decodedToken.exp < currentTime) {
          console.log("Token expired, logging out");
          logout();
          return;
        }

        // Token valid, fetch user data
        console.log("Token valid, fetching user data");
        const userData = await authService.getCurrentUser();

        if (!userData?.data) {
          console.error("Invalid user data received:", userData);
          throw new Error("Invalid user data received");
        }

        // Extract just the user data, not the response wrapper
        const user = userData.data.data || userData.data;
        console.log("User data received:", user);
        setCurrentUser(user);
      } catch (error) {
        console.error("Token verification failed:", error);
        // Clear invalid state
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login user
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token } = response.data;

      // Save token to localStorage
      localStorage.setItem("auth-token", token);
      setToken(token);

      // Get user data
      const userData = await authService.getCurrentUser();
      const user = userData.data.data || userData.data;
      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.error ||
          "Login failed. Please check your credentials.",
      };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token } = response.data;

      // Save token to localStorage
      localStorage.setItem("auth-token", token);
      setToken(token);

      // Get user data
      const userResponse = await authService.getCurrentUser();
      const user = userResponse.data.data || userResponse.data;
      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.error ||
          "Registration failed. Please try again.",
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("token"); // Remove old token if exists
    setToken(null);
    setCurrentUser(null);
    navigate("/login");
  };

  // Update user profile
  const updateProfile = async (userId, userData) => {
    if (!token || !userId) {
      console.error("Update failed - no token or userId:", { token, userId });
      return {
        success: false,
        message: "Authentication required. Please log in again.",
      };
    }

    try {
      const response = await authService.updateUser(userId, userData);

      if (!response?.data) {
        throw new Error("Invalid response from server");
      }

      // Update current user data
      const updatedUser = response.data.data || response.data;
      setCurrentUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error("Profile update failed:", error);
      return {
        success: false,
        message:
          error.response?.data?.error ||
          "Failed to update profile. Please try again.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!token,
        isAdmin: currentUser?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
