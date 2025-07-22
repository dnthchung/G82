import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, Plus, Edit2, Trash2, RotateCcw } from "lucide-react";
import CashierLayout from "./cashier/CashierLayout";

// Helper function định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};

const ProductManagement = () => {
  // Mock data cho sản phẩm
  const [products] = useState([
    { id: "SP001", name: "Trứng gà (10 quả)", category: "Thực phẩm tươi sống", costPrice: 28000, sellingPrice: 35000, stock: 100, unit: "hộp" },
    { id: "SP002", name: "Sữa tươi không đường (1L)", category: "Đồ uống", costPrice: 25000, sellingPrice: 32000, stock: 120, unit: "hộp" },
    { id: "SP003", name: "Gạo ST25 (5kg)", category: "Gia vị & Nấu ăn", costPrice: 95000, sellingPrice: 120000, stock: 70, unit: "bao" },
    { id: "SP004", name: "Mì tôm Hảo Hảo (thùng)", category: "Gia vị & Nấu ăn", costPrice: 70000, sellingPrice: 90000, stock: 50, unit: "thùng" },
    { id: "SP005", name: "Bánh quy bơ Danisa (hộp)", category: "Bánh kẹo & Đồ ăn vặt", costPrice: 65000, sellingPrice: 85000, stock: 90, unit: "hộp" },
    { id: "SP006", name: "Nước ngọt Coca-Cola (lon)", category: "Đồ uống", costPrice: 8000, sellingPrice: 12000, stock: 300, unit: "lon" },
    { id: "SP007", name: "Dầu ăn Tường An (2L)", category: "Gia vị & Nấu ăn", costPrice: 60000, sellingPrice: 80000, stock: 60, unit: "chai" },
    { id: "SP008", name: "Kem đánh răng P/S (tuýp lớn)", category: "Chăm sóc cá nhân", costPrice: 30000, sellingPrice: 45000, stock: 150, unit: "tuýp" },
    { id: "SP009", name: "Nước rửa chén Sunlight (chai 800g)", category: "Vệ sinh nhà cửa", costPrice: 20000, sellingPrice: 30000, stock: 110, unit: "chai" },
    { id: "SP010", name: "Bánh gạo One One", category: "Bánh kẹo & Đồ ăn vặt", costPrice: 18000, sellingPrice: 25000, stock: 180, unit: "gói" },
    { id: "SP011", name: "Nước mắm Nam Ngư (chai 500ml)", category: "Gia vị & Nấu ăn", costPrice: 22000, sellingPrice: 28000, stock: 80, unit: "chai" },
    { id: "SP012", name: "Bánh mì sandwich", category: "Thực phẩm tươi sống", costPrice: 8000, sellingPrice: 12000, stock: 45, unit: "ổ" },
    { id: "SP013", name: "Kẹo Alpenliebe", category: "Bánh kẹo & Đồ ăn vặt", costPrice: 15000, sellingPrice: 20000, stock: 200, unit: "gói" },
    { id: "SP014", name: "Dầu gội Head & Shoulders", category: "Chăm sóc cá nhân", costPrice: 85000, sellingPrice: 110000, stock: 75, unit: "chai" },
    { id: "SP015", name: "Nước giặt Omo", category: "Vệ sinh nhà cửa", costPrice: 95000, sellingPrice: 125000, stock: 60, unit: "túi" },
  ]);

  // State cho filters và pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Lấy danh sách categories duy nhất
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    return ["Tất cả", ...uniqueCategories.sort()];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (priceRange.min !== "") {
      filtered = filtered.filter((p) => p.sellingPrice >= Number(priceRange.min));
    }

    if (priceRange.max !== "") {
      filtered = filtered.filter((p) => p.sellingPrice <= Number(priceRange.max));
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange]);

  // Xử lý bộ lọc
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tất cả");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 3;

    // Previous button
    pages.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} title="Trang trước">
          ‹
        </button>
      </li>,
    );

    // First page
    if (currentPage > 2) {
      pages.push(
        <li key={1} className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>,
      );

      if (currentPage > 3) {
        pages.push(
          <li key="dots1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>,
        );
      }
    }

    // Current page and neighbors
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>,
      );
    }

    // Last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(
          <li key="dots2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>,
        );
      }

      pages.push(
        <li key={totalPages} className="page-item">
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        </li>,
      );
    }

    // Next button
    pages.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} title="Trang sau">
          ›
        </button>
      </li>,
    );

    return pages;
  };

  return (
    <CashierLayout pageTitle="Quản lý sản phẩm" breadcrumb="Quản lý sản phẩm">
      <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div className="row g-4">
          {/* Left Panel - Categories */}
          <div className="col-md-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-title mb-0">Nhóm sản phẩm</h6>
                  <button className="btn btn-sm btn-success">
                    <Plus size={16} className="me-1" />
                    Thêm
                  </button>
                </div>

                {/* Categories List */}
                <div className="list-group list-group-flush">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedCategory === category ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                    >
                      <span className="small">{category}</span>
                      <span className="badge bg-secondary">{category === "Tất cả" ? products.length : products.filter((p) => p.category === category).length}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Products List */}
          <div className="col-md-9">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-title mb-0">
                    Danh sách sản phẩm
                    <span className="badge bg-primary ms-2">{filteredProducts.length}</span>
                  </h6>
                  <button className="btn btn-sm btn-primary">
                    <Plus size={16} className="me-1" />
                    Thêm sản phẩm
                  </button>
                </div>

                {/* Filters */}
                <div className="mb-3">
                  {/* Search */}
                  <div className="mb-3">
                    <div
                      className="d-grid"
                      style={{
                        gridTemplateColumns: "1fr auto",
                        gap: 0,
                        maxWidth: "100%",
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên sản phẩm hoặc mã sản phẩm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          margin: 0,
                          height: "32px",
                          fontSize: "0.9rem",
                          padding: "0.375rem 0.75rem",
                        }}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleSearch}
                        type="button"
                        style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          margin: 0,
                          height: "32px",
                          fontSize: "0.9rem",
                          padding: "0.375rem 0.75rem",
                        }}
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label text-muted small">Khoảng giá:</label>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Từ"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                          min="0"
                        />
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Đến"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <button className="btn btn-sm btn-outline-danger" onClick={resetFilters}>
                        <RotateCcw size={16} className="me-1" />
                        Xóa bộ lọc
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead className="table-light">
                      <tr className="align-middle text-center">
                        <th className="text-start text-muted small text-uppercase">Sản phẩm</th>
                        <th className="text-muted small text-uppercase">Giá bán</th>
                        <th className="text-muted small text-uppercase">Giá vốn</th>
                        <th className="text-muted small text-uppercase">Tồn kho</th>
                        <th className="text-muted small text-uppercase">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                          <tr key={product.id} className="align-middle">
                            <td>
                              <div className="fw-bold small">{product.name}</div>
                              <div className="text-muted small">{product.id}</div>
                            </td>
                            <td className="text-center text-danger fw-bold small">{formatCurrency(product.sellingPrice)}</td>
                            <td className="text-center small">{formatCurrency(product.costPrice)}</td>
                            <td className="text-center fw-bold small">
                              {product.stock} <span className="text-muted">{product.unit}</span>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-1">
                                <button className="btn btn-sm btn-outline-primary" title="Sửa">
                                  <Edit2 size={14} />
                                </button>
                                <button className="btn btn-sm btn-outline-danger" title="Xóa">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-4">
                            <Search size={48} className="mb-3 opacity-50" />
                            <p className="mb-0">Không tìm thấy sản phẩm nào</p>
                            <p className="small">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredProducts.length > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    {/* Items per page selector */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small">Hiển thị:</span>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: "auto", minWidth: "70px" }}
                          value={itemsPerPage}
                          onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                          <option value={20}>20</option>
                        </select>
                        <span className="text-muted small">sản phẩm/trang</span>
                      </div>
                      <div className="text-muted small">Tổng: {filteredProducts.length} sản phẩm</div>
                    </div>

                    {totalPages > 1 ? (
                      <>
                        <nav aria-label="Phân trang sản phẩm">
                          <ul className="pagination pagination-sm justify-content-center mb-2">{renderPagination()}</ul>
                        </nav>
                        <div className="text-center text-muted small">
                          Trang {currentPage} / {totalPages} - Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)}
                          trong tổng {filteredProducts.length} sản phẩm
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-muted small">Hiển thị tất cả {filteredProducts.length} sản phẩm</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CashierLayout>
  );
};

export default ProductManagement;
