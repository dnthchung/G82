const express = require("express");
const router = express.Router();
const controller = require("../controller/index");

// Main goods management routes
router.get("/", controller.goodsController.getAllGoods); // Get all goods with pagination and filters
router.get("/categories", controller.goodsController.getCategories); // Get all categories
router.post("/", controller.goodsController.createGoods); // Create new goods
router.get("/:id", controller.goodsController.getGoodsById); // Get goods by ID
router.put("/:id", controller.goodsController.updateGoods); // Update goods
router.delete("/:id", controller.goodsController.deleteGoods); // Delete goods (soft delete)

// Legacy search and filter routes (keeping for backward compatibility)
router.post("/search", controller.goodsController.searchGoods); // Search goods
router.post("/filter/category", controller.goodsController.filterByCategory); // Filter by category
router.post("/filter/status", controller.goodsController.filterByStatus); // Filter by status
router.post("/filter/price-range", controller.goodsController.filterGoodsByPriceRange); // Filter by price range

module.exports = router;
