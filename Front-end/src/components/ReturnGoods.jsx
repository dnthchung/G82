import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/returnGoods.css";

export default function ReturnGoods() {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data cho lịch sử đơn hàng
  const [orderHistory] = useState([
    {
      id: "ORD001",
      date: "2024-06-15 09:30:00",
      total: 500000,
      customer: "Nguyễn Văn A",
      status: "completed"
    },
    {
      id: "ORD002",
      date: "2024-06-14 14:20:00",
      total: 750000,
      customer: "Trần Thị B",
      status: "completed"
    },
    {
      id: "ORD003",
      date: "2024-06-13 16:45:00",
      total: 320000,
      customer: "Lê Văn C",
      status: "completed"
    }
  ]);

  // Mock data cho sản phẩm trong đơn hàng
  const [orderProducts] = useState({
    "ORD001": [
      { name: "Áo phông nam", quantity: 2, price: 250000, returned: 0 },
      { name: "Quần jean", quantity: 1, price: 450000, returned: 0 },
      { name: "Mũ lưỡi trai", quantity: 1, price: 100000, returned: 0 }
    ],
    "ORD002": [
      { name: "Váy midi", quantity: 1, price: 350000, returned: 0 },
      { name: "Giày cao gót", quantity: 1, price: 400000, returned: 0 }
    ],
    "ORD003": [
      { name: "Áo sơ mi", quantity: 2, price: 160000, returned: 0 }
    ]
  });

  // State cho form
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [timeRange, setTimeRange] = useState("9h-10h");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnOrderId, setReturnOrderId] = useState("ORD001");
  const [returnDate, setReturnDate] = useState("12/07/2025");
  const [returnProducts, setReturnProducts] = useState([
    { name: "Áo phông nam", buyQty: 2, returnQty: 0, price: 250000, totalReturn: 0 },
    { name: "Mũ lưỡi trai", buyQty: 1, returnQty: 1, price: 100000, totalReturn: 100000 }
  ]);
  const [returnReason, setReturnReason] = useState("");

  // Lọc đơn hàng
  const filteredOrders = orderHistory.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" ||
                         (filterType === "morning" && order.date.includes("09:")) ||
                         (filterType === "evening" && order.date.includes("14:"));
    return matchesSearch && matchesFilter;
  });

  // Tính tổng tiền hoàn lại
  const calculateTotalRefund = () => {
    return returnProducts.reduce((sum, product) => sum + product.totalReturn, 0);
  };

  // Xử lý thay đổi số lượng trả
  const handleQuantityChange = (index, newQty) => {
    const updatedProducts = [...returnProducts];
    const qty = Math.max(0, Math.min(newQty, updatedProducts[index].buyQty));
    updatedProducts[index].returnQty = qty;
    updatedProducts[index].totalReturn = qty * updatedProducts[index].price;
    setReturnProducts(updatedProducts);
  };

  // Xử lý xác nhận trả hàng
  const handleConfirmReturn = () => {
    // Logic xử lý trả hàng
    console.log("Xác nhận trả hàng:", {
      orderId: returnOrderId,
      date: returnDate,
      products: returnProducts.filter(p => p.returnQty > 0),
      reason: returnReason,
      totalRefund: calculateTotalRefund()
    });

    // Reset form hoặc chuyển trang
    alert("Trả hàng thành công!");
  };

  // Xử lý hủy
  const handleCancel = () => {
    setReturnProducts(returnProducts.map(p => ({ ...p, returnQty: 0, totalReturn: 0 })));
    setReturnReason("");
  };

  return (
    <div className="return-goods-container">
      <div className="return-goods-header">
        <h2>Trả hàng</h2>
        <div className="working-hours">
          <span className="status-dot"></span>
          <span>Ca làm việc: 08:00 - 20:00</span>
        </div>
      </div>

      <div className="return-content">
        {/* Lịch sử đơn hàng */}
        <div className="order-history-section">
          <h3>Lịch sử đơn hàng</h3>

          <div className="search-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng hoặc tên sản phẩm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-options">
              <span>Chọn ca:</span>
              <label>
                <input
                  type="radio"
                  name="shift"
                  value="all"
                  checked={filterType === "all"}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                Ca sáng
              </label>
              <label>
                <input
                  type="radio"
                  name="shift"
                  value="evening"
                  checked={filterType === "evening"}
                  onChange={(e) => setFilterType(e.target.value)}
                />
                Ca chiều
              </label>
            </div>

            <div className="time-range">
              <span>Khung giờ:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="9h-10h">9h-10h</option>
                <option value="10h-11h">10h-11h</option>
                <option value="14h-15h">14h-15h</option>
                <option value="15h-16h">15h-16h</option>
              </select>
            </div>
          </div>

          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>MÃ ĐƠN HÀNG</th>
                  <th>NGÀY MUA</th>
                  <th>TỔNG TIỀN</th>
                  <th>NGƯỜI BÁN</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={selectedOrder?.id === order.id ? "selected" : ""}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.total.toLocaleString()} đ</td>
                    <td>{order.customer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tạo yêu cầu trả hàng */}
        <div className="return-request-section">
          <h3>Tạo yêu cầu trả hàng</h3>

          <div className="return-form">
            <div className="form-row">
              <div className="form-group">
                <label>Mã đơn hàng trả:</label>
                <input
                  type="text"
                  value={returnOrderId}
                  onChange={(e) => setReturnOrderId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Ngày trả hàng:</label>
                <input
                  type="text"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>

            <div className="products-section">
              <h4>Các sản phẩm trong đơn hàng:</h4>
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>SẢN PHẨM</th>
                      <th>SL ĐÃ MUA</th>
                      <th>SL TRẢ</th>
                      <th>ĐƠN GIÁ</th>
                      <th>THÀNH TIỀN TRẢ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.buyQty}</td>
                        <td>
                          <div className="quantity-controls">
                            <button
                              onClick={() => handleQuantityChange(index, product.returnQty - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={product.returnQty}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                              min="0"
                              max={product.buyQty}
                            />
                            <button
                              onClick={() => handleQuantityChange(index, product.returnQty + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>{product.price.toLocaleString()} đ</td>
                        <td>{product.totalReturn.toLocaleString()} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="total-section">
              <h4>Tổng tiền hoàn lại: <span className="total-amount">{calculateTotalRefund().toLocaleString()} đ</span></h4>
            </div>

            <div className="reason-section">
              <label>Lý do trả hàng:</label>
              <textarea
                placeholder="Mô tả lý do trả hàng"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              />
            </div>

            <div className="action-buttons">
              <button className="btn-cancel" onClick={handleCancel}>
                Hủy
              </button>
              <button className="btn-confirm" onClick={handleConfirmReturn}>
                Xác nhận trả hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
