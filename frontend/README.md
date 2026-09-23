# NITRO GRAND HOTEL - HOTEL MANAGEMENT & BOOKING SYSTEM

Hệ thống đặt phòng trực tuyến và quản trị vận hành khách sạn tiêu chuẩn 4 sao quốc tế **Nitro Grand Hotel** (24 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh).

---

## 🌟 1. Tổng quan Kiến trúc Dự án

Dự án được xây dựng theo chuẩn kiến trúc hiện đại, sẵn sàng bàn giao cho đội ngũ Backend:
- **Frontend Stack**: React 19, TypeScript, Tailwind CSS v4, React Router v7, Lucide Icons, i18next (Đa ngôn ngữ VI/EN).
- **Kiến trúc Dữ liệu Dual-Mode**:
  - **Khi chưa có Backend**: Tự động sử dụng In-Memory Mock Database tại `src/mocks/data.ts` và `src/services/api.ts` để kiểm thử và chạy độc lập.
  - **Khi kết nối Backend**: Chỉ cần cấu hình `VITE_API_URL` trong `.env`, toàn bộ hệ thống tự động chuyển sang gọi REST API thực tế.
- **Bảo mật & Phân quyền (RBAC)**:
  - Sử dụng chuẩn JWT Bearer Token: `Authorization: Bearer <token>`.
  - Phân quyền theo 4 vai trò: `CUSTOMER`, `FRONT_DESK` (Lễ tân), `MANAGER` (Quản lý), `ADMIN` (Quản trị viên hệ thống).

---

## 🚀 2. Hướng dẫn Cài đặt & Khởi chạy

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Khởi chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: **http://localhost:3000**

---

## 🔌 3. Hướng dẫn Dành riêng cho Đội ngũ Backend

### Bước 1: Đọc tài liệu đặc tả API
Mọi đặc tả về REST API, Request/Response mẫu, JWT Payload, và code mẫu Middleware đã được chuẩn bị sẵn tại:
👉 **[`About System/BACKEND_API_SPEC.md`](./About%20System/BACKEND_API_SPEC.md)**

### Bước 2: Tham khảo kiểu dữ liệu TypeScript để thiết kế Database
Toàn bộ Model dữ liệu của hệ thống nằm tại:
👉 **[`src/types.ts`](./src/types.ts)** (Bao gồm: `User`, `Room`, `RoomType`, `Booking`, `Guest`, `HotelService`, `DashboardMetrics`)

### Bước 3: Kết nối Backend với Frontend
Khi máy chủ Backend đã sẵn sàng (ví dụ tại `http://localhost:5000`):
1. Tạo file `.env` tại thư mục gốc của Frontend:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
2. Khởi động lại Frontend (`npm run dev`).
3. Frontend sẽ tự động chuyển từ Mock Data sang gọi REST API của Backend mà không cần sửa code giao diện.

---

## 🔑 4. Tài khoản Đăng nhập Kiểm thử (Test Credentials)

Hệ thống cung cấp sẵn các tài khoản kiểm thử cho từng vai trò (Mật khẩu mặc định: bất kỳ hoặc `password123`):

| Vai trò (Role) | Email đăng nhập | Số điện thoại | Quyền hạn chính |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin@nitrohotel.com` | `0901234567` | Toàn quyền hệ thống, phân quyền, cấu hình phòng, xem nhật ký kiểm toán |
| **Quản lý (MANAGER)** | `manager@nitrohotel.com` | `0908765432` | Báo cáo doanh thu KPI, quản lý phòng, bảng điều khiển ca trực |
| **Lễ tân (FRONT_DESK)** | `reception@nitrohotel.com` | `0912345678` | Sơ đồ buồng phòng, Check-in/Check-out, tạo đơn Walk-in, quản lý khách |
| **Khách hàng (CUSTOMER)** | `customer@example.com` | `0987654321` | Đặt phòng trực tuyến, xem lịch sử đặt phòng, quản lý tài khoản |

> 🔗 **Trang đăng nhập**: [http://localhost:3000/login](http://localhost:3000/login)  
> 🔗 **Trang đăng ký**: [http://localhost:3000/register](http://localhost:3000/register)

---

## 📂 5. Thư mục Tài liệu Hệ thống (`About System/`)

| File tài liệu | Nội dung chi tiết |
| :--- | :--- |
| **[`BACKEND_API_SPEC.md`](./About%20System/BACKEND_API_SPEC.md)** | Đặc tả chi tiết 100% RESTful API, Schema Request/Response, JWT & RBAC Middleware |
| **[`SYSTEM_URLS.md`](./About%20System/SYSTEM_URLS.md)** | Danh bạ toàn bộ URL của hệ thống (Khách hàng, Lễ tân, Quản lý, Admin) |
| **[`MOBILE_DEPLOYMENT_GUIDE.md`](./About%20System/MOBILE_DEPLOYMENT_GUIDE.md)** | Hướng dẫn demo và đóng gói ứng dụng di động (Capacitor / PWA / Responsive) |
| **[`FRONTEND_OVERVIEW.md`](./About%20System/FRONTEND_OVERVIEW.md)** | Kiến trúc phân tầng Frontend, cấu trúc thư mục và quy chuẩn phát triển |

---

## 🛠️ 6. Cấu trúc Thư mục Mã nguồn (`src/`)

```
src/
├── components/         # Các UI component tái sử dụng (Button, Modal, DatePicker,...)
├── context/            # Quản lý State toàn cục (AppContext: Auth, Token, Role, Cart)
├── i18n/               # Cấu hình đa ngôn ngữ Tiếng Việt & Tiếng Anh
├── layouts/            # Layout Khách hàng (CustomerLayout) và Nhân viên (StaffLayout)
├── mocks/              # Dữ liệu mẫu ban đầu (Mock Data)
├── pages/
│   ├── auth/           # Đăng nhập, Đăng ký, Quên mật khẩu
│   ├── customer/       # Trang chủ, Tìm kiếm phòng, Đặt phòng 3 bước, Lịch sử đặt
│   └── staff/          # 15 trang nghiệp vụ chuyên sâu cho Lễ tân, Quản lý, Admin
├── services/           # Tầng kết nối REST API tập trung (api.ts)
├── types/              # Định nghĩa kiểu dữ liệu TypeScript (types.ts)
└── utils/              # Các hàm tiện ích (Format tiền tệ VND, định dạng ngày tháng)
```
