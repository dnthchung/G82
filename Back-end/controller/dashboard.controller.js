const { Bill, BillDetail, Goods, Account, Shift, ImportDetail, ImportBatch } = require("../models");
const mongoose = require("mongoose");

// Get overview statistics for dashboard
exports.getOverviewStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Tính tổng doanh thu tháng hiện tại
    const monthlyRevenue = await Bill.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: [{ $month: "$createdAt" }, currentMonth] }, { $eq: [{ $year: "$createdAt" }, currentYear] }],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalAmount" },
        },
      },
    ]);

    // Tính lợi nhuận tháng (giả sử lợi nhuận = 30% doanh thu)
    const revenue = monthlyRevenue[0]?.totalRevenue || 0;
    const profit = revenue * 0.3;

    // Đếm số đơn hàng tháng hiện tại
    const monthlyOrders = await Bill.countDocuments({
      $expr: {
        $and: [{ $eq: [{ $month: "$createdAt" }, currentMonth] }, { $eq: [{ $year: "$createdAt" }, currentYear] }],
      },
    });

    // Tính giá trị tồn kho
    const inventoryValue = await Goods.aggregate([
      {
        $match: { is_active: true },
      },
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: {
              $multiply: ["$stock_quantity", "$average_import_price"],
            },
          },
        },
      },
    ]);

    const stockValue = inventoryValue[0]?.totalValue || 0;

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue: revenue,
        monthlyProfit: profit,
        monthlyOrders: monthlyOrders,
        inventoryValue: stockValue,
      },
    });
  } catch (error) {
    console.error("Error getting overview stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get top selling products
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await BillDetail.aggregate([
      {
        $group: {
          _id: "$goods_id",
          totalQuantity: { $sum: "$quantity" },
          productName: { $first: "$goods_name" },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          productName: 1,
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error("Error getting top selling products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get staff performance
exports.getStaffPerformance = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const staffPerformance = await Bill.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: [{ $month: "$createdAt" }, currentMonth] }, { $eq: [{ $year: "$createdAt" }, currentYear] }],
          },
        },
      },
      {
        $group: {
          _id: "$seller",
          totalRevenue: { $sum: "$finalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 5,
      },
      {
        $addFields: {
          rating: {
            $switch: {
              branches: [
                { case: { $gte: ["$totalRevenue", 25000000] }, then: "Giỏi" },
                { case: { $gte: ["$totalRevenue", 20000000] }, then: "Tốt" },
                { case: { $gte: ["$totalRevenue", 15000000] }, then: "Khá" },
              ],
              default: "Trung bình",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalRevenue: 1,
          orderCount: 1,
          rating: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: staffPerformance,
    });
  } catch (error) {
    console.error("Error getting staff performance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get low stock products
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Goods.aggregate([
      {
        $match: {
          is_active: true,
          stock_quantity: { $lte: 50 }, // Sản phẩm có tồn kho <= 50
        },
      },
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                { case: { $eq: ["$stock_quantity", 0] }, then: "Hết hàng" },
                { case: { $lte: ["$stock_quantity", 10] }, then: "Bán chạy" },
                { case: { $lte: ["$stock_quantity", 30] }, then: "Bán ít" },
              ],
              default: "Bình thường",
            },
          },
        },
      },
      {
        $sort: { stock_quantity: 1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          name: "$goods_name",
          quantity: "$stock_quantity",
          status: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: lowStockProducts,
    });
  } catch (error) {
    console.error("Error getting low stock products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get monthly revenue for the last 6 months
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const monthlyRevenue = await Bill.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: "$createdAt" }, currentYear] },
              { $gte: [{ $month: "$createdAt" }, currentDate.getMonth() - 4] }, // Last 6 months
            ],
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$finalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          revenue: "$totalRevenue",
        },
      },
    ]);

    // Map month numbers to month names
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    const formattedData = monthlyRevenue.map((item) => ({
      month: monthNames[item.month - 1],
      revenue: item.revenue,
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error getting monthly revenue:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get monthly profit for the last 6 months
exports.getMonthlyProfit = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const monthlyRevenue = await Bill.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $eq: [{ $year: "$createdAt" }, currentYear] }, { $gte: [{ $month: "$createdAt" }, currentDate.getMonth() - 4] }],
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$finalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $addFields: {
          profit: { $multiply: ["$totalRevenue", 0.3] }, // Giả sử lợi nhuận = 30% doanh thu
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          profit: 1,
        },
      },
    ]);

    // Map month numbers to month names
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    const formattedData = monthlyRevenue.map((item) => ({
      month: monthNames[item.month - 1],
      profit: item.profit,
    }));

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error getting monthly profit:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
