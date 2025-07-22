import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:9999/api";

const dashboardAPI = axios.create({
  baseURL: `${API_BASE_URL}/dashboard`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token if available
dashboardAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Dashboard service methods
export const dashboardService = {
  // Get overview statistics
  getOverviewStats: async () => {
    try {
      const response = await dashboardAPI.get("/overview");
      return response.data;
    } catch (error) {
      console.error("Error fetching overview stats:", error);
      throw error;
    }
  },

  // Get top selling products
  getTopSellingProducts: async () => {
    try {
      const response = await dashboardAPI.get("/top-products");
      return response.data;
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      throw error;
    }
  },

  // Get staff performance
  getStaffPerformance: async () => {
    try {
      const response = await dashboardAPI.get("/staff-performance");
      return response.data;
    } catch (error) {
      console.error("Error fetching staff performance:", error);
      throw error;
    }
  },

  // Get low stock products
  getLowStockProducts: async () => {
    try {
      const response = await dashboardAPI.get("/low-stock");
      return response.data;
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      throw error;
    }
  },

  // Get monthly revenue
  getMonthlyRevenue: async () => {
    try {
      const response = await dashboardAPI.get("/monthly-revenue");
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      throw error;
    }
  },

  // Get monthly profit
  getMonthlyProfit: async () => {
    try {
      const response = await dashboardAPI.get("/monthly-profit");
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly profit:", error);
      throw error;
    }
  },
};

export default dashboardService;
