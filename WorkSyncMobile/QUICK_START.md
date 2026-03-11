Dưới đây là **bản dịch tiếng Việt** của tài liệu bạn gửi:

---

# 🚀 Hướng dẫn bắt đầu nhanh - WorkSync Mobile

## Cài đặt & Thiết lập (5 phút)

### 1. Cài đặt thư viện

```bash
cd WorkSyncMobile
npm install
```

---

### 2. Cấu hình địa chỉ Backend

Chỉnh sửa file:

```
src/config/config.ts
```

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_BACKEND_IP:5000/api',  // ← Cập nhật địa chỉ này
  TIMEOUT: 10000,
};
```

### Lưu ý cho Android Emulator

Bạn phải dùng **IP của máy tính** thay vì `localhost`.

Tìm IP bằng lệnh:

```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I

# Windows
netstat -an | findstr 5000
```

---

### 3. Chạy ứng dụng

```bash
npm start
```

Sau đó nhấn:

* `i` → iOS Simulator
* `a` → Android Emulator
* `w` → Web
* Hoặc **quét QR code** bằng **Expo Go**

---

# ✅ Các tính năng có sẵn

## 👤 Nhân viên

* ✓ Đăng nhập / Đăng ký / Đăng xuất
* ✓ Check-in / Check-out
* ✓ Gửi yêu cầu nghỉ phép
* ✓ Gửi giải trình
* ✓ Xem lịch sử nghỉ phép

---

## 👨‍💼 Quản lý

* ✓ Xem yêu cầu của nhân viên
* ✓ Phê duyệt / Từ chối nghỉ phép
* ✓ Phê duyệt / Từ chối giải trình
* ✓ Dashboard quản lý đội nhóm

---

## 📊 Tính năng chung

* ✓ Báo cáo theo tháng
* ✓ Xem hồ sơ cá nhân
* ✓ Cài đặt & thông báo

---

# 🧪 Thử nghiệm ứng dụng

### 1. Đăng nhập

Sử dụng tài khoản từ backend.

---

### 2. Check-in

Dashboard → **Check In**

---

### 3. Yêu cầu nghỉ phép

Dashboard → **Request Leave** → Chọn ngày nghỉ

---

### 4. Chế độ Manager

Đăng nhập bằng tài khoản **manager** → Tab **Team**

---

# 📂 Cấu trúc dự án

```
src/
├── screens/         ← Tất cả màn hình UI
├── services/api/    ← Gọi API
├── context/         ← Quản lý trạng thái xác thực
├── components/      ← UI component tái sử dụng
├── navigation/      ← Routing
├── types/           ← Interfaces TypeScript
└── config/          ← Cấu hình
```

---

# 🔗 Các file quan trọng

| File                          | Chức năng                    |
| ----------------------------- | ---------------------------- |
| `src/config/config.ts`        | Cấu hình API                 |
| `src/context/AuthContext.tsx` | Quản lý trạng thái đăng nhập |
| `src/services/api/client.ts`  | Cấu hình Axios + JWT         |
| `app/_layout.tsx`             | Điểm khởi chạy ứng dụng      |

---

# ⚠️ Lỗi thường gặp

### Không kết nối được localhost

* Android: cập nhật `API_CONFIG.BASE_URL` thành **IP máy tính**
* iOS Simulator: `localhost` vẫn hoạt động

---

### Lỗi import

* Kiểm tra đường dẫn import đúng
* Kiểm tra alias trong `tsconfig.json`

---

### Token không được lưu

* Kiểm tra **AsyncStorage** (`react-native-async-storage`)
* Kiểm tra backend có trả **JWT token hợp lệ**

---

# 📚 Tài liệu đầy đủ

Xem file:

```
FRONTEND_SETUP.md
```

để biết chi tiết về:

* Danh sách tính năng đầy đủ
* Tài liệu API
* Quy trình test
* Các tính năng có thể bổ sung
* Hướng dẫn deploy

---

# 🎯 Các bước tiếp theo

1. ✅ Chạy ứng dụng
2. ✅ Test đăng nhập bằng tài khoản backend
3. ✅ Test check-in / check-out
4. ✅ Test gửi yêu cầu nghỉ phép
5. ✅ Test phê duyệt của manager

---

# 💡 Mẹo hữu ích

* Dùng **React DevTools Extension** để debug
* Kiểm tra **network request trong Expo Dev Tools**
* Log sẽ hiển thị trong terminal khi chạy `npm start`
* Test cả **Employee** và **Manager**

---

**Cần hỗ trợ?**
Hãy xem file **`FRONTEND_SETUP.md`** để có hướng dẫn chi tiết.

---


