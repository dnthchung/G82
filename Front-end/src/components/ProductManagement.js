import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductManagement = () => {
  // Mock data cho sản phẩm
  const [products] = useState([
    {
      id: "SP001",
      name: "Trứng gà (10 quả)",
      category: "Thực phẩm tươi sống",
      costPrice: 35000,
      sellingPrice: 28000,
      stock: 100,
      unit: "hộp",
    },
    {
      id: "SP002",
      name: "Sữa tươi không đường (1L)",
      category: "Đồ uống",
      costPrice: 32000,
      sellingPrice: 25000,
      stock: 120,
      unit: "hộp",
    },
    {
      id: "SP003",
      name: "Gạo ST25 (5kg)",
      category: "Gia vị & Nấu ăn",
      costPrice: 120000,
      sellingPrice: 95000,
      stock: 70,
      unit: "bao",
    },
    {
      id: "SP004",
      name: "Mì tôm Hảo Hảo (thùng)",
      category: "Gia vị & Nấu ăn",
      costPrice: 90000,
      sellingPrice: 70000,
      stock: 50,
      unit: "thùng",
    },
    {
      id: "SP005",
      name: "Bánh quy bơ Danisa (hộp)",
      category: "Bánh kẹo & Đồ ăn vặt",
      costPrice: 85000,
      sellingPrice: 65000,
      stock: 90,
      unit: "hộp",
    },
    {
      id: "SP006",
      name: "Nước ngọt Coca-Cola (lon)",
      category: "Đồ uống",
      costPrice: 12000,
      sellingPrice: 8000,
      stock: 300,
      unit: "lon",
    },
    {
      id: "SP007",
      name: "Dầu ăn Tường An (2L)",
      category: "Gia vị & Nấu ăn",
      costPrice: 80000,
      sellingPrice: 60000,
      stock: 60,
      unit: "chai",
    },
    {
      id: "SP008",
      name: "Kem đánh răng P/S (tuýp lớn)",
      category: "Chăm sóc cá nhân",
      costPrice: 45000,
      sellingPrice: 30000,
      stock: 150,
      unit: "tuýp",
    },
    {
      id: "SP009",
      name: "Nước rửa chén Sunlight (chai 800g)",
      category: "Vệ sinh nhà cửa",
      costPrice: 30000,
      sellingPrice: 20000,
      stock: 110,
      unit: "chai",
    },
    {
      id: "SP010",
      name: "Bánh gạo One One",
      category: "Bánh kẹo & Đồ ăn vặt",
      costPrice: 25000,
      sellingPrice: 18000,
      stock: 180,
      unit: "gói",
    },
  ]);

  // State cho filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Lấy danh sách categories duy nhất
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((product) => product.category))];
    return uniqueCategories.sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === "" || product.category === selectedCategory;

      const matchesPriceRange = (priceRange.min === "" || product.sellingPrice >= parseInt(priceRange.min)) && (priceRange.max === "" || product.sellingPrice <= parseInt(priceRange.max));

      return matchesSearch && matchesCategory && matchesPriceRange;
    });
  }, [products, searchTerm, selectedCategory, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}>
          Trước
        </button>
      </li>,
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>,
      );
    }

    // Next button
    pages.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}>
          Tiếp
        </button>
      </li>,
    );

    return pages;
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Quản lý sản phẩm</h2>
        <div className="d-flex align-items-center">
          <span className="badge bg-success me-3">Ca làm việc: 08:00 - 20:00</span>
          <div className="position-relative">
            <i className="fas fa-bell text-muted" style={{ fontSize: "1.2rem" }}></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.7rem" }}>
              3
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Nhóm sản phẩm</h5>
              <div className="d-grid gap-2">
                <button className={`btn ${selectedCategory === "" ? "btn-primary" : "btn-outline-secondary"} text-start`} onClick={() => setSelectedCategory("")}>
                  Tất cả sản phẩm
                </button>
                {categories.map((category) => (
                  <button key={category} className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"} text-start`} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </button>
                ))}
              </div>

              {/* Price Range Filter */}
              <div className="mt-4">
                <h6>Khoảng giá</h6>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Từ"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>
                <button className="btn btn-outline-danger btn-sm mt-2 w-100" onClick={resetFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="mb-0">Sản phẩm</h5>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-success btn-sm">
                    <i className="fas fa-plus me-1"></i>
                    Thêm sản phẩm
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Search Bar */}
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Nhập tên sản phẩm hoặc mã sản phẩm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              {/* Results Info */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">
                  Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
                </span>
              </div>

              {/* Products Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>MÃ SP</th>
                      <th>TÊN SẢN PHẨM</th>
                      <th>NHÓM HÀNG</th>
                      <th>GIÁ BÁN</th>
                      <th>GIÁ VỐN TB</th>
                      <th>TỒN KHO</th>
                      <th>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{formatCurrency(product.sellingPrice)}</td>
                        <td>{formatCurrency(product.costPrice)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button className="btn btn-outline-primary btn-sm me-2">Sửa</button>
                          <button className="btn btn-outline-danger btn-sm">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-4">
                  <ul className="pagination justify-content-center">{renderPagination()}</ul>
                </nav>
              )}

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-5">
                  <div className="text-muted">
                    <i className="fas fa-search fa-3x mb-3"></i>
                    <p className="h5">Không tìm thấy sản phẩm nào</p>
                    <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
