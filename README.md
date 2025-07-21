Dưới đây là **danh sách các tài khoản** đã được seed sẵn trong đoạn mã của bạn, dùng để **đăng nhập (login)**:

| STT | Username   | Password | Full Name    | Role           | Email                                           | Phone      |
| --- | ---------- | -------- | ------------ | -------------- | ----------------------------------------------- | ---------- |
| 1   | `admin1`   | `123456` | Nguyễn Văn A | Admin          | [admin1@example.com](mailto:admin1@example.com) | 0901234567 |
| 2   | `admin2`   | `123456` | Trần Thị B   | Staff          | [admin2@example.com](mailto:admin2@example.com) | 0912345678 |
| 3   | `manager1` | `123456` | Lê Văn C     | Manager        | [a@gmail.com](mailto:a@gmail.com)               | 0987654321 |
| 4   | `staff1`   | `123456` | Phạm Thị D   | WarehouseStaff | [b@gmail.com](mailto:b@gmail.com)               | 0976543210 |

### Ghi chú:

* Tất cả các tài khoản đều có **mật khẩu ban đầu là `123456`**, đã được mã hóa với `bcrypt`.
* Mỗi tài khoản liên kết với một `role` tương ứng: `Admin`, `Staff`, `Manager`, hoặc `WarehouseStaff`.

Bạn có thể sử dụng các thông tin này để **đăng nhập vào hệ thống** (giả sử hệ thống có chức năng xác thực sử dụng username và password từ collection `Account`).
