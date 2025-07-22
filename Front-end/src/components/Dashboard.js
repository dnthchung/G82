import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import CashierLayout from "./cashier/CashierLayout";
import { dashboardService } from "../services/dashboardService";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // State for dashboard data
  const [overviewStats, setOverviewStats] = useState({
    monthlyRevenue: 0,
    monthlyProfit: 0,
    monthlyOrders: 0,
    inventoryValue: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyProfit, setMonthlyProfit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all dashboard data in parallel
        const [overviewResponse, topProductsResponse, staffResponse, lowStockResponse, revenueResponse, profitResponse] = await Promise.all([
          dashboardService.getOverviewStats(),
          dashboardService.getTopSellingProducts(),
          dashboardService.getStaffPerformance(),
          dashboardService.getLowStockProducts(),
          dashboardService.getMonthlyRevenue(),
          dashboardService.getMonthlyProfit(),
        ]);

        // Update state with fetched data
        if (overviewResponse.success) {
          setOverviewStats(overviewResponse.data);
        }
        if (topProductsResponse.success) {
          setTopProducts(topProductsResponse.data);
        }
        if (staffResponse.success) {
          setStaffPerformance(staffResponse.data);
        }
        if (lowStockResponse.success) {
          setLowStockProducts(lowStockResponse.data);
        }
        if (revenueResponse.success) {
          setMonthlyRevenue(revenueResponse.data);
        }
        if (profitResponse.success) {
          setMonthlyProfit(profitResponse.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Refresh dashboard data function
  const refreshDashboard = async () => {
    setLoading(true);
    try {
      const [overviewResponse, topProductsResponse, staffResponse, lowStockResponse, revenueResponse, profitResponse] = await Promise.all([
        dashboardService.getOverviewStats(),
        dashboardService.getTopSellingProducts(),
        dashboardService.getStaffPerformance(),
        dashboardService.getLowStockProducts(),
        dashboardService.getMonthlyRevenue(),
        dashboardService.getMonthlyProfit(),
      ]);

      if (overviewResponse.success) setOverviewStats(overviewResponse.data);
      if (topProductsResponse.success) setTopProducts(topProductsResponse.data);
      if (staffResponse.success) setStaffPerformance(staffResponse.data);
      if (lowStockResponse.success) setLowStockProducts(lowStockResponse.data);
      if (revenueResponse.success) setMonthlyRevenue(revenueResponse.data);
      if (profitResponse.success) setMonthlyProfit(profitResponse.data);

      setError(null);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setError("Không thể làm mới dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data based on API responses
  const topProductsData = {
    labels: topProducts.length > 0 ? topProducts.map((item) => item.productName || "N/A") : ["Chưa có dữ liệu"],
    datasets: [
      {
        label: "Số lượng bán",
        data: topProducts.length > 0 ? topProducts.map((item) => item.totalQuantity || 0) : [0],
        backgroundColor: ["#FF6B9D", "#4ECDC4", "#FFD93D", "#6BCF7F", "#A8E6CF", "#FFB347", "#87CEEB", "#DDA0DD", "#F0E68C", "#98FB98"],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  // Data for monthly revenue chart
  const monthlyRevenueData = {
    labels: monthlyRevenue.length > 0 ? monthlyRevenue.map((item) => item.month || "") : ["Chưa có dữ liệu"],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: monthlyRevenue.length > 0 ? monthlyRevenue.map((item) => item.revenue || 0) : [0],
        borderColor: "#4A90E2",
        backgroundColor: "rgba(74, 144, 226, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#4A90E2",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  // Data for monthly profit chart
  const monthlyProfitData = {
    labels: monthlyProfit.length > 0 ? monthlyProfit.map((item) => item.month || "") : ["Chưa có dữ liệu"],
    datasets: [
      {
        label: "Lợi nhuận gộp (VNĐ)",
        data: monthlyProfit.length > 0 ? monthlyProfit.map((item) => item.profit || 0) : [0],
        borderColor: "#9B59B6",
        backgroundColor: "rgba(155, 89, 182, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#9B59B6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.1)" },
        ticks: { color: "#666" },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#666",
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.1)" },
        ticks: {
          color: "#666",
          callback: function (value) {
            return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
          },
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#666" },
      },
    },
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColorName = (status) => {
    switch (status) {
      case "Bán chạy":
        return "success";
      case "Hết hàng":
        return "danger";
      case "Bán ít":
        return "warning";
      default:
        return "primary";
    }
  };

  const getRatingColorName = (rating) => {
    switch (rating) {
      case "Giỏi":
        return "success";
      case "Tốt":
        return "info";
      case "Khá":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Show loading spinner if data is loading
  if (loading) {
    return (
      <CashierLayout pageTitle="Dashboard Quản Lý" breadcrumb="Dashboard Quản Lý">
        <div className="container-fluid bg-light min-vh-100 py-4 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Đang tải dữ liệu dashboard...</p>
          </div>
        </div>
      </CashierLayout>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <CashierLayout pageTitle="Dashboard Quản Lý" breadcrumb="Dashboard Quản Lý">
        <div className="container-fluid bg-light min-vh-100 py-4">
          <div className="alert alert-danger text-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      </CashierLayout>
    );
  }

  return (
    <CashierLayout pageTitle="Dashboard Quản Lý" breadcrumb="Dashboard Quản Lý">
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="row">
          {/* Header */}
          {/* <div className="col-12 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="fw-bold text-dark mb-0">Dashboard Quản Lý</h2>
              <div className="text-muted">
                <i className="fas fa-user-circle me-2"></i>
                Quản lý
              </div>
            </div>
          </div> */}

          {/* Quick Actions - Moved to top */}
          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="card-title fw-bold text-dark mb-0">Tác vụ nhanh</h5>
                <button className="btn btn-outline-primary btn-sm d-flex align-items-center" onClick={refreshDashboard} disabled={loading}>
                  <i className={`fas fa-sync-alt me-2 ${loading ? "fa-spin" : ""}`}></i>
                  Làm mới dữ liệu
                </button>
              </div>
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-lg-3 col-md-6">
                    <button className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center">
                      <i className="fas fa-tasks me-2"></i>
                      Phân ca làm việc
                    </button>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <button className="btn btn-success btn-sm w-100 d-flex align-items-center justify-content-center">
                      <i className="fas fa-plus me-2"></i>
                      Nhập hàng
                    </button>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <button className="btn btn-info btn-sm w-100 d-flex align-items-center justify-content-center">
                      <i className="fas fa-chart-bar me-2"></i>
                      Quản lý kiểm kho
                    </button>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <button className="btn btn-warning btn-sm w-100 d-flex align-items-center justify-content-center text-white">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Báo cáo xuất nhập tồn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">Tổng doanh thu tháng</h6>
                    <h3 className="card-title fw-bold mb-0">{formatCurrency(overviewStats.monthlyRevenue)}</h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                    <i className="fas fa-chart-line fa-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">Lợi nhuận tháng</h6>
                    <h3 className="card-title fw-bold mb-0">{formatCurrency(overviewStats.monthlyProfit)}</h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                    <i className="fas fa-coins fa-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">Số đơn đã bán</h6>
                    <h3 className="card-title fw-bold mb-0">{overviewStats.monthlyOrders}</h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                    <i className="fas fa-shopping-cart fa-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100" style={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
              <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">Giá trị tồn kho</h6>
                    <h3 className="card-title fw-bold mb-0">{formatCurrency(overviewStats.inventoryValue)}</h3>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                    <i className="fas fa-wallet fa-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Top Selling Products Chart */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pb-0">
                <h5 className="card-title fw-bold text-dark">Top 10 Sản phẩm bán chạy nhất</h5>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <Bar data={topProductsData} options={barChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Staff Performance Table */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pb-0">
                <h5 className="card-title fw-bold text-dark">Hiệu suất nhân viên hàng đầu</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th className="border-0 text-muted fw-normal">Tên nhân viên</th>
                        <th className="border-0 text-muted fw-normal">Doanh thu cá nhân</th>
                        <th className="border-0 text-muted fw-normal">Số đơn hàng</th>
                        <th className="border-0 text-muted fw-normal">Đánh giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffPerformance.length > 0 ? (
                        staffPerformance.map((staff, index) => (
                          <tr key={index}>
                            <td className="fw-medium">{staff.name}</td>
                            <td className="text-primary fw-medium">{formatCurrency(staff.totalRevenue)}</td>
                            <td>{staff.orderCount}</td>
                            <td>
                              <span className={`badge rounded-pill bg-${getRatingColorName(staff.rating)}-subtle text-${getRatingColorName(staff.rating)}-emphasis`}>{staff.rating}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            Chưa có dữ liệu hiệu suất nhân viên
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Top Products Table */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pb-0">
                <h5 className="card-title fw-bold text-dark">Top 10 Sản phẩm tồn kho ít</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th className="border-0 text-muted fw-normal">Sản phẩm</th>
                        <th className="border-0 text-muted fw-normal">Số lượng tồn</th>
                        <th className="border-0 text-muted fw-normal">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.length > 0 ? (
                        lowStockProducts.slice(0, 8).map((product, index) => (
                          <tr key={index}>
                            <td className="fw-medium">{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>
                              <span className={`badge rounded-pill bg-${getStatusColorName(product.status)}-subtle text-${getStatusColorName(product.status)}-emphasis`}>{product.status}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center text-muted">
                            Chưa có dữ liệu sản phẩm tồn kho ít
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pb-0">
                <h5 className="card-title fw-bold text-dark">Doanh thu theo tháng</h5>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <Line data={monthlyRevenueData} options={lineChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Profit Chart */}
          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pb-0">
                <h5 className="card-title fw-bold text-dark">Lợi nhuận gộp theo tháng</h5>
              </div>
              <div className="card-body">
                <div style={{ height: "300px" }}>
                  <Line data={monthlyProfitData} options={lineChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CashierLayout>
  );
};

export default Dashboard;
