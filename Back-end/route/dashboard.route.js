const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboard.controller");

// Dashboard overview statistics
router.get("/overview", dashboardController.getOverviewStats);

// Top selling products
router.get("/top-products", dashboardController.getTopSellingProducts);

// Staff performance
router.get("/staff-performance", dashboardController.getStaffPerformance);

// Low stock products
router.get("/low-stock", dashboardController.getLowStockProducts);

// Monthly revenue
router.get("/monthly-revenue", dashboardController.getMonthlyRevenue);

// Monthly profit
router.get("/monthly-profit", dashboardController.getMonthlyProfit);

module.exports = router;
