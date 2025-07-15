# Return Goods API Integration Documentation

## Tổng quan
Đã tích hợp thành công API vào component `ReturnGoods.jsx` để thay thế mock data bằng API thực tế.

## Files đã tạo/cập nhật

### 1. Service Layer
- **File**: `src/services/returnOrderService.js`
- **Mô tả**: Service class chứa các method để gọi API
- **Chức năng**:
  - `getBillsForReturn()`: Lấy danh sách hóa đơn có thể trả hàng
  - `getBillDetailsForReturn()`: Lấy chi tiết hóa đơn để trả hàng
  - `createReturnOrder()`: Tạo yêu cầu trả hàng
  - `getReturnOrders()`: Lấy danh sách return orders
  - `getReturnOrderDetails()`: Lấy chi tiết return order

### 2. Component Update
- **File**: `src/components/ReturnGoods.jsx`
- **Thay đổi chính**:
  - Thay thế mock data bằng API calls
  - Thêm loading states cho UX tốt hơn
  - Thêm error handling
  - Tích hợp real-time data loading

## API Endpoints được sử dụng

### 1. Lấy danh sách hóa đơn có thể trả hàng
```
GET /api/return/bills
Query Parameters:
- shift_id: ID ca làm việc
- date_filter: "24h" cho 24 giờ gần đây
- time_slot: "8-9", "9-10", etc.
```

### 2. Lấy chi tiết hóa đơn
```
GET /api/return/bills/:bill_id
```

### 3. Tạo yêu cầu trả hàng
```
POST /api/return/
Body: {
  bill_id: string,
  return_reason: string,
  items: [{ goods_id, goods_name, quantity, unit_price }],
  created_by: string
}
```

### 4. Lấy danh sách return orders
```
GET /api/return/
Query Parameters:
- page: số trang
- limit: số lượng per page
- date_filter: "today", "week"
```

### 5. Lấy chi tiết return order
```
GET /api/return/:return_order_id
```

## Tính năng đã tích hợp

### 1. Loading States
- ✅ Loading spinner khi tải danh sách hóa đơn
- ✅ Loading indicator khi tải chi tiết hóa đơn
- ✅ Loading state khi submit return order
- ✅ Disable buttons trong khi loading

### 2. Error Handling
- ✅ Hiển thị lỗi khi API call thất bại
- ✅ Alert thông báo lỗi chi tiết
- ✅ Graceful fallback khi không có data
- ✅ Try-catch cho tất cả API calls

### 3. Real-time Data
- ✅ Auto-reload danh sách hóa đơn sau khi tạo return order
- ✅ Filter theo ca làm việc và khung giờ
- ✅ Search functionality với API
- ✅ Pagination với API data

### 4. User Experience
- ✅ Responsive design giữ nguyên
- ✅ Smooth transitions
- ✅ Clear feedback messages
- ✅ Confirmation dialog before submit

## Cấu trúc Data Flow

```
ReturnGoods Component
    ↓
ReturnOrderService
    ↓
API Endpoints (/api/return/*)
    ↓
Backend Controllers
    ↓
Database Models
```

## Validation & Security

### Frontend Validation
- ✅ Kiểm tra required fields
- ✅ Validate số lượng trả hàng
- ✅ Validate lý do trả hàng

### Backend Validation
- ✅ Validate request body
- ✅ Check bill existence
- ✅ Validate item quantities
- ✅ Update stock quantities

## Testing

### Manual Testing Steps
1. **Kiểm tra load danh sách hóa đơn**
   - Mở component
   - Verify loading spinner hiển thị
   - Verify danh sách hóa đơn được load

2. **Kiểm tra filter**
   - Thay đổi ca làm việc
   - Thay đổi khung giờ
   - Verify results được filter đúng

3. **Kiểm tra chi tiết hóa đơn**
   - Click "Chọn" trên một hóa đơn
   - Verify loading indicator
   - Verify chi tiết sản phẩm hiển thị

4. **Kiểm tra tạo return order**
   - Chọn sản phẩm để trả
   - Nhập lý do trả hàng
   - Click "Xác nhận trả hàng"
   - Verify confirmation dialog
   - Verify success message

## Troubleshooting

### Common Issues
1. **API không response**
   - Kiểm tra backend server đang chạy
   - Kiểm tra URL trong service file

2. **CORS Error**
   - Đảm bảo backend đã config CORS cho frontend URL

3. **Data format mismatch**
   - Kiểm tra response format từ API
   - Verify field names match

## Next Steps
- [ ] Thêm unit tests
- [ ] Implement caching cho better performance
- [ ] Add offline support
- [ ] Implement push notifications cho return status updates

## Dependencies
- React (hooks: useState, useEffect)
- Fetch API cho HTTP requests
- Bootstrap cho styling
- Lucide React cho icons

---

**Tác giả**: AI Assistant
**Ngày tạo**: 2024-01-20
**Version**: 1.0.0
