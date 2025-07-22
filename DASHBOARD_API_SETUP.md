# Dashboard API Setup Guide

## Tổng quan
Tài liệu này hướng dẫn setup và sử dụng các API dashboard mới được tạo cho hệ thống quản lý bán hàng.

## API Endpoints được thêm

### 1. Overview Statistics
- **Endpoint**: `GET /api/dashboard/overview`
- **Mô tả**: Lấy thống kê tổng quan (doanh thu, lợi nhuận, đơn hàng, tồn kho)
- **Response**:
```json
{
  "success": true,
  "data": {
    "monthlyRevenue": 125000000,
    "monthlyProfit": 37500000,
    "monthlyOrders": 150,
    "inventoryValue": 80000000
  }
}
```

### 2. Top Selling Products
- **Endpoint**: `GET /api/dashboard/top-products`
- **Mô tả**: Lấy top 10 sản phẩm bán chạy nhất
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "productName": "Coca Cola",
      "totalQuantity": 150
    }
  ]
}
```

### 3. Staff Performance
- **Endpoint**: `GET /api/dashboard/staff-performance`
- **Mô tả**: Lấy hiệu suất nhân viên hàng đầu
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "name": "Nguyễn Văn A",
      "totalRevenue": 25000000,
      "orderCount": 52,
      "rating": "Giỏi"
    }
  ]
}
```

### 4. Low Stock Products
- **Endpoint**: `GET /api/dashboard/low-stock`
- **Mô tả**: Lấy top 10 sản phẩm tồn kho ít
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "name": "Snack Oishi",
      "quantity": 5,
      "status": "Bán chạy"
    }
  ]
}
```

### 5. Monthly Revenue
- **Endpoint**: `GET /api/dashboard/monthly-revenue`
- **Mô tả**: Lấy doanh thu 6 tháng gần nhất
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "month": "Tháng 1",
      "revenue": 80000000
    }
  ]
}
```

### 6. Monthly Profit
- **Endpoint**: `GET /api/dashboard/monthly-profit`
- **Mô tả**: Lấy lợi nhuận 6 tháng gần nhất
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "month": "Tháng 1",
      "profit": 24000000
    }
  ]
}
```

## Setup Instructions

### Backend Setup

1. **Database**: Đảm bảo MongoDB đã chạy và có dữ liệu sample từ `db.js`

2. **Environment Variables**: Tạo file `.env` trong thư mục `Back-end/`:
```env
MONGODB_URL=mongodb://localhost:27017
DB_NAME=your_database_name
PORT=3001
```

3. **Start Backend Server**:
```bash
cd Back-end
npm install
npm start
```

Server sẽ chạy tại `http://localhost:3001`

### Frontend Setup

1. **Environment Variables**: Tạo file `.env` trong thư mục `Front-end/`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

2. **Install Dependencies**:
```bash
cd Front-end
npm install
```

3. **Start Frontend**:
```bash
npm start
```

Frontend sẽ chạy tại `http://localhost:3000`

## Files đã được tạo/cập nhật

### Backend Files:
- `Back-end/controller/dashboard.controller.js` - Dashboard API controller
- `Back-end/route/dashboard.route.js` - Dashboard routes
- `Back-end/route/index.js` - Updated to include dashboard routes

### Frontend Files:
- `Front-end/src/services/dashboardService.js` - API service for dashboard
- `Front-end/src/components/Dashboard.js` - Updated dashboard component

## Features Mới

### Dashboard Component:
- ✅ Real-time data loading từ API
- ✅ Loading states với spinner
- ✅ Error handling với thông báo lỗi
- ✅ Refresh button để reload dữ liệu
- ✅ Fallback data cho các chart khi không có dữ liệu
- ✅ Currency formatting cho số tiền VNĐ
- ✅ Responsive design

### API Features:
- ✅ MongoDB aggregation cho performance tốt
- ✅ Error handling
- ✅ Consistent response format
- ✅ Real-time calculation dựa trên dữ liệu thực

## Testing

### Test API Endpoints:
```bash
# Test overview stats
curl http://localhost:3001/api/dashboard/overview

# Test top products
curl http://localhost:3001/api/dashboard/top-products

# Test staff performance
curl http://localhost:3001/api/dashboard/staff-performance

# Test low stock products
curl http://localhost:3001/api/dashboard/low-stock

# Test monthly revenue
curl http://localhost:3001/api/dashboard/monthly-revenue

# Test monthly profit
curl http://localhost:3001/api/dashboard/monthly-profit
```

## Notes

- Dashboard tự động refresh data khi component mount
- Dữ liệu được cache trong component state
- User có thể manual refresh bằng nút "Làm mới dữ liệu"
- All API calls sử dụng Promise.all() để optimize performance
- Charts tự động update khi có dữ liệu mới
- Error states được handle gracefully với UI feedback

## Troubleshooting

### Lỗi thường gặp:

1. **CORS Error**: Đảm bảo backend có config CORS cho frontend domain
2. **API Not Found**: Kiểm tra backend server đã start và endpoint URLs đúng
3. **No Data**: Kiểm tra database có dữ liệu sample từ `db.js`
4. **Loading Forever**: Check network tab trong browser developer tools

### Debug API:
- Mở browser Developer Tools > Network tab
- Kiểm tra API requests và responses
- Xem Console tab cho error messages
