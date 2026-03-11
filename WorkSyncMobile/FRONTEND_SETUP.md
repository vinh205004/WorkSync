

# WorkSync Mobile - Hướng dẫn thiết lập Frontend

## 📱 Cấu trúc dự án

```
WorkSyncMobile/
├── app/                          # Thư mục app của Expo Router
│   └── _layout.tsx              # Layout gốc với AuthProvider
├── src/
│   ├── components/              # Các UI component tái sử dụng
│   │   ├── buttons/             # CustomButton
│   │   ├── cards/               # Card component
│   │   ├── inputs/              # CustomInput
│   │   ├── loaders/             # Loading component
│   │   └── modals/              # AlertModal
│   ├── config/                  # Các file cấu hình
│   │   └── config.ts            # Cấu hình API và ứng dụng
│   ├── context/                 # React Context (Auth)
│   │   └── AuthContext.tsx      # Quản lý trạng thái xác thực
│   ├── hooks/                   # Custom React hooks
│   │   └── useAsync.ts          # Hook cho các thao tác bất đồng bộ
│   ├── navigation/              # Cấu hình điều hướng
│   │   ├── RootNavigator.tsx    # Điều hướng gốc
│   │   ├── AuthStack.tsx        # Stack điều hướng cho xác thực
│   │   └── AppStack.tsx         # Điều hướng chính của app (tabs)
│   ├── screens/                 # Các màn hình
│   │   ├── Auth/                # Đăng nhập & đăng ký
│   │   ├── Employee/            # Tính năng nhân viên
│   │   ├── Manager/             # Phê duyệt của quản lý
│   │   └── Common/              # Hồ sơ, báo cáo, cài đặt
│   ├── services/                # Các service gọi API
│   │   └── api/                 # API được tổ chức theo từng tính năng
│   │       ├── client.ts        # Axios instance với interceptors
│   │       ├── authService.ts
│   │       ├── timeLogService.ts
│   │       ├── leaveService.ts
│   │       ├── explanationService.ts
│   │       └── reportService.ts
│   ├── types/                   # Interface TypeScript
│   │   └── index.ts             # Tất cả định nghĩa kiểu dữ liệu
│   └── utils/                   # Các hàm tiện ích
├── assets/                      # Ảnh, font, icon
├── package.json
├── app.json
└── tsconfig.json
```

---

# 🚀 Bắt đầu

## 1. Yêu cầu trước khi cài đặt

* Node.js (v18 trở lên)
* npm hoặc yarn
* Expo CLI (`npm install -g expo-cli`)
* Backend API chạy tại `http://localhost:5000`

---

## 2. Cài đặt

```bash
cd WorkSyncMobile
npm install
# hoặc
yarn install
```

---

## 3. Cấu hình

**Cập nhật URL API trong `src/config/config.ts`:**

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://YOUR_BACKEND_URL/api',  // Thay đổi địa chỉ này
  TIMEOUT: 10000,
};
```

---

## 4. Chạy ứng dụng

```bash
# Khởi động server phát triển Expo
npm start
# hoặc
yarn start
```

Chọn nền tảng chạy:

* Nhấn **i** → iOS Simulator
* Nhấn **a** → Android Emulator
* Nhấn **w** → Web
* Hoặc **quét QR code bằng app Expo Go trên điện thoại**

---

# 📋 Các tính năng đã triển khai

## ✅ Xác thực (Authentication)

* [x] Màn hình đăng nhập
* [x] Màn hình đăng ký
* [x] Quản lý token JWT
* [x] Tự động đăng nhập khi mở lại app
* [x] Chức năng đăng xuất

---

## ✅ Tính năng cho nhân viên

* [x] Dashboard với thống kê nhanh
* [x] Check-in / Check-out (phát hiện đi trễ / về sớm)
* [x] Gửi yêu cầu nghỉ phép
* [x] Lịch sử yêu cầu nghỉ phép
* [x] Gửi giải trình khi đi trễ / về sớm

---

## ✅ Tính năng cho quản lý

* [x] Dashboard quản lý với số lượng yêu cầu đang chờ
* [x] Xem yêu cầu nghỉ phép đang chờ
* [x] Xem giải trình đang chờ
* [x] Phê duyệt / từ chối nghỉ phép
* [x] Phê duyệt / từ chối giải trình
* [x] Thêm lý do từ chối

---

## ✅ Tính năng chung

* [x] Báo cáo theo tháng (ngày làm việc, giờ làm, số lần trễ/sớm)
* [x] Xem hồ sơ người dùng
* [x] Trang cài đặt (thông báo & sinh trắc học)
* [x] Đăng xuất

---

# 🔒 Quy trình xác thực

1. **Đăng nhập / Đăng ký** → Người dùng nhập thông tin
2. **Lưu token** → JWT token lưu trong AsyncStorage
3. **Tự động đăng nhập** → Khi mở app sẽ kiểm tra token
4. **Route bảo vệ** → AuthProvider tự động chuyển giữa Auth Stack và App Stack
5. **Refresh token** → Nếu API trả lỗi 401 sẽ tự động logout

---

# 🎨 UI Components

### Các component chính

* **CustomButton**

  * Variants: primary, secondary, danger
  * Có trạng thái loading

* **CustomInput**

  * Có label
  * Hiển thị lỗi

* **Card**

  * Card tái sử dụng
  * Có badge

* **Loading**

  * Spinner loading dạng modal

* **AlertModal**

  * Hộp thoại xác nhận

---

# 🔌 API Services

Tất cả service nằm trong:

```
src/services/api/
```

---

## AuthService

```typescript
authService.login(credentials)
authService.register(userData)
authService.logout()
```

---

## TimeLogService

```typescript
timeLogService.checkin()
timeLogService.checkout()
timeLogService.getTodayStatus()
```

---

## LeaveService

```typescript
leaveService.submitLeaveRequest(data)
leaveService.getMyLeaveRequests()
leaveService.getPendingLeaveRequests()  // Chỉ manager
leaveService.reviewLeaveRequest(id, decision)
```

---

## ExplanationService

```typescript
explanationService.submitExplanation(data)
explanationService.getMyExplanationRequests()
explanationService.getPendingExplanationRequests()  // Chỉ manager
explanationService.reviewExplanationRequest(id, decision)
```

---

## ReportService

```typescript
reportService.getMonthlyReport(month, year)
reportService.getEmployeeMonthlyReport(employeeId, month, year)
```

---

# 🧪 Kiểm thử ứng dụng

## Tài khoản test (gợi ý trong backend)

```
Employee:
Email: employee@example.com
Password: password123

Manager:
Email: manager@example.com
Password: password123

Admin:
Email: admin@example.com
Password: password123
```

---

## Các luồng kiểm thử

### 1. Check-in / Check-out

* Đăng nhập bằng tài khoản employee
* Dashboard → Check In
* Nếu đã check-in rồi sẽ báo lỗi

---

### 2. Yêu cầu nghỉ phép

* Dashboard → Request Leave
* Chọn ngày nghỉ
* Nhập lý do
* Hệ thống sẽ trừ số giờ nghỉ còn lại

---

### 3. Phê duyệt của quản lý

* Đăng nhập bằng manager
* Tab **Team**
* Xem yêu cầu nghỉ phép / giải trình
* Nhấn để xem chi tiết
* Phê duyệt hoặc từ chối (kèm lý do)

---

### 4. Báo cáo

* Tab **Common → Reports**
* Chọn tháng / năm
* Xem thống kê làm việc

---

# 📦 Dependencies

Các package chính:

* `@react-navigation/*` → framework điều hướng
* `axios` → HTTP client
* `@react-native-async-storage/async-storage` → lưu trữ local
* `expo-router` → routing theo file
* `@expo/vector-icons` → thư viện icon

---

# 🔧 Các file cấu hình

### tsconfig.json

* Bật **Strict mode**
* Alias đường dẫn `@/*`

---

### app.json

* Metadata của app
* Cấu hình splash screen
* Permissions

---

### package.json

* Tất cả dependencies
* Scripts phục vụ development

---

# 🐛 Lỗi thường gặp & cách khắc phục

### Lỗi: "Cannot find module"

**Cách xử lý:**

* Kiểm tra import đúng đường dẫn
* Kiểm tra cấu trúc thư mục `src/`

---

### Lỗi: Không kết nối được API

**Cách xử lý:**

* Kiểm tra backend có đang chạy (`http://localhost:5000`)
* Kiểm tra `API_CONFIG` trong `src/config/config.ts`
* Với Android emulator cần dùng **IP máy thật thay vì localhost**

---

### Lỗi: Token không lưu

**Cách xử lý:**

* Kiểm tra AsyncStorage
* Kiểm tra dữ liệu user có được lưu sau khi login

---

### Lỗi: Navigation không hoạt động

**Cách xử lý:**

* Đảm bảo `AuthContext` bọc toàn bộ app trong `app/_layout.tsx`
* Kiểm tra params navigation đúng với screen

---

# 📚 Tính năng có thể bổ sung (tuỳ chọn)

1. **Xác thực sinh trắc học** → `react-native-biometrics`
2. **Thông báo** → `expo-notifications`
3. **Định vị GPS** → lưu vị trí khi check-in/out
4. **Upload ảnh** → ảnh đại diện nhân viên
5. **Offline Mode** → Redux / Zustand
6. **Đa ngôn ngữ** → Localization
7. **Phân tích nâng cao** → biểu đồ báo cáo
8. **Push Notifications** → thông báo phê duyệt

---

# 🚀 Triển khai (Deployment)

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

Xem chi tiết tại:
[https://docs.expo.dev/build/setup/](https://docs.expo.dev/build/setup/)

---

# 📞 Hỗ trợ

Nếu gặp vấn đề:

1. Kiểm tra API endpoints trong backend
2. Kiểm tra network request trong Expo Dev Tools
3. Kiểm tra lỗi trong console
4. Kiểm tra file cấu hình `src/config/config.ts`

---

# 📝 Ghi chú

* Tất cả API request đều gửi **JWT token trong Authorization header**
* Nếu request trả về **401** → hệ thống tự động logout
* Định dạng ngày: **ISO 8601 (YYYY-MM-DD)**
* Thời gian lưu theo **UTC**
* Nghỉ phép tính **8 giờ / ngày**

---

**Version:** 1.0.0
**Cập nhật lần cuối:** Tháng 3/2026

---
