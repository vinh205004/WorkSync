Dưới đây là **bản dịch tiếng Việt đầy đủ** của tài liệu **WorkSync Project - Comprehensive Analysis** bạn gửi.

---

# 📊 Phân tích tổng thể dự án WorkSync

**Ngày:** 11/03/2026
**Loại dự án:** Hệ thống quản lý chấm công & nghỉ phép nhân viên
**Kiến trúc:** 3-Layer (Controllers → Services → Repositories) + Frontend React Native

---

# 📊 Tổng quan dự án

**WorkSync** là hệ thống quản lý nhân viên bao gồm:

* Xác thực người dùng (đăng ký / đăng nhập)
* Chấm công (check-in / check-out với phát hiện trễ / về sớm)
* Quản lý yêu cầu nghỉ phép
* Gửi giải trình khi đi trễ hoặc về sớm
* Báo cáo chấm công theo tháng

---

# 🔧 BACKEND API – WorkSync.Api (.NET 8.0)

### Database

**PostgreSQL + Entity Framework Core**

### Các bảng trong database

* Employees
* TimeLogs
* LeaveRequests
* ExplanationRequests

---

# 📡 Tài liệu API Endpoints

---

# 1️⃣ Authentication API (Public)

**Base route**

```
api/auth
```

| Method | Endpoint    | Chức năng     | Trường yêu cầu            | Response                    |
| ------ | ----------- | ------------- | ------------------------- | --------------------------- |
| POST   | `/register` | Tạo tài khoản | FullName, Email, Password | `{Success, Message}`        |
| POST   | `/login`    | Đăng nhập     | Email, Password           | `{Success, Token, Message}` |

### Ghi chú

* EmployeeCode được tạo tự động: `NV001`, `NV002`
* Password được hash bằng **BCrypt**
* JWT token có thời hạn **24 giờ**
* Token chứa:

  * EmployeeId
  * Email
  * Role

---

# 2️⃣ Timekeeping API (Protected)

**Base route**

```
api/timekeeping
```

Yêu cầu:

```
JWT Bearer Token
```

| Method | Endpoint    | Chức năng        |
| ------ | ----------- | ---------------- |
| POST   | `/checkin`  | Ghi nhận giờ đến |
| POST   | `/checkout` | Ghi nhận giờ về  |

### Logic chấm công

Check-in:

* Trước **08:00** → **Đúng giờ**
* Sau **08:00** → **Muộn**

Check-out:

* Trước **17:30** → **Về sớm**
* Sau **17:30** → **Đúng giờ**

Quy tắc:

* Mỗi nhân viên chỉ check-in **1 lần/ngày**
* Phải check-in trước khi check-out

---

# 3️⃣ Leave Request API

**Base route**

```
api/leave
```

| Method | Endpoint       | Chức năng             | Role           |
| ------ | -------------- | --------------------- | -------------- |
| POST   | `/submit`      | Gửi yêu cầu nghỉ      | Tất cả         |
| GET    | `/pending`     | Lấy yêu cầu chờ duyệt | Manager, Admin |
| PUT    | `/{id}/review` | Duyệt hoặc từ chối    | Manager, Admin |

---

### LeaveRequestDto

```
EmployeeId
FromDate
ToDate
LeaveHours
ProjectName
LeaveType
Reason
```

### Logic nghỉ phép

* ToDate ≥ FromDate
* LeaveHours > 0

Khi được duyệt:

* Trừ vào `RemainingLeaveHours`

Nếu không đủ giờ nghỉ:

* Chuyển thành **unpaid leave**

### Status

```
Chờ duyệt
Chấp thuận
Từ chối
```

---

# 4️⃣ Explanation API

**Base route**

```
api/explanation
```

| Method | Endpoint   | Chức năng                |
| ------ | ---------- | ------------------------ |
| POST   | `/submit`  | Gửi giải trình           |
| GET    | `/pending` | Lấy giải trình chờ duyệt |

---

### ExplanationDto

```
EmployeeId
TargetDate
Reason
```

---

### Logic giải trình

Chỉ được gửi khi:

* Check-in **muộn**
* Hoặc check-out **sớm**

Điều kiện:

* Chỉ **1 giải trình / ngày**
* Phải có **TimeLog**
* Validate với dữ liệu chấm công

### Status

```
Chờ duyệt
Chấp thuận
Từ chối
```

---

# 5️⃣ Reporting API

**Base route**

```
api/report
```

| Method | Endpoint                 | Chức năng                  |
| ------ | ------------------------ | -------------------------- |
| GET    | `/monthly`               | Báo cáo tháng toàn công ty |
| GET    | `/employee/{employeeId}` | Báo cáo cá nhân            |

---

### MonthlyReportDto

```
EmployeeCode
FullName
TotalWorkingDays
TotalWorkingHours
LateCount
TotalLateMinutes
EarlyLeaveCount
TotalEarlyLeaveMinutes
```

---

### Authorization

Employee:

* Chỉ xem **report của mình**

Manager/Admin:

* Xem report **mọi nhân viên**

---

# 📦 Data Models

---

## Employee

```
Id
EmployeeCode
FullName
Email
Role (Admin / Manager / User)
Status
PasswordHash
RemainingLeaveHours (default 96h)
```

---

## TimeLog

```
Id
EmployeeId
Date
CheckInTime
CheckInStatus
CheckOutTime
CheckOutStatus
```

---

## LeaveRequest

```
Id
EmployeeId
FromDate
ToDate
LeaveHours
ProjectName
LeaveType
Reason
Status
CreatedAt
```

---

## ExplanationRequest

```
Id
EmployeeId
TargetDate
Reason
AttachmentUrl
Status
CreatedAt
```

---

# 🏗️ Kiến trúc Backend

### Mô hình 3 Layer

```
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Database
```

---

## Repositories

```
ITimeLogRepository
TimeLogRepository

ILeaveRequestRepository
LeaveRequestRepository

IExplanationRepository
ExplanationRepository
```

---

## Services

```
AuthService
TimeLogService
LeaveRequestService
ExplanationService
ReportService
```

---

## Controllers

```
AuthController
TimekeepingController
LeaveController
ExplanationController
ReportController
```

---

# 🔐 Security

* JWT Authentication
* Role-based Authorization
* BCrypt password hashing
* Global Exception Middleware
* CORS cho React Native

---

# 📱 FRONTEND – WorkSyncMobile

### Công nghệ

* React Native 0.81.5
* Expo Router v6
* Axios
* TypeScript
* AsyncStorage
* React Navigation

---

# 📊 Trạng thái Frontend

### Đã cấu hình

* Expo project
* Axios
* Navigation
* Async Storage
* TypeScript
* Folder structure

---

### Chưa triển khai

* Không có màn hình UI
* Không có API services
* Không có authentication flow
* Không có context
* Không có components

---

# 📂 Cấu trúc thư mục hiện tại

```
src/

components/
buttons
cards
inputs
loaders
modals

context/

hooks/

navigation/

screens/
Auth
Common
Employee
Manager

services/
api
notification
storage

types/

utils/
```

---

# 🎯 Những tính năng Frontend còn thiếu

---

# Auth Screens

* Login
* Register
* Forgot password
* Profile settings

---

# Employee Screens

* Dashboard
* Check-in / Check-out
* Leave request form
* Leave history
* Explanation form
* Monthly report
* Profile

---

# Manager Screens

* Manager dashboard
* Pending approvals
* Team reports
* Attendance analytics
* Approve / Reject UI

---

# Common Screens

* Splash screen
* Loading
* Error screen

---

# API Service Layer cần xây dựng

1️⃣ Axios instance

* Base URL
* Token interceptor
* Error handling

2️⃣ Auth Service

* Login
* Register
* Logout

3️⃣ Timekeeping Service

* Check-in
* Check-out

4️⃣ Leave Service

* Submit leave
* Fetch leave
* Review leave

5️⃣ Explanation Service

* Submit explanation
* Fetch explanation
* Review explanation

6️⃣ Report Service

* Fetch monthly report

---

# State Management cần có

* Auth state
* User role
* Employee data
* Leave balance
* Form state

---

# UI Components cần thiết

* Login form
* Leave form
* Explanation form
* Request card
* Report charts
* Approval dialog
* Date picker
* Time picker
* Loading indicator
* Error message

---

# 🔄 Data Flow

---

# Authentication Flow

1. User login
2. API `/auth/login`
3. Nhận JWT
4. Lưu AsyncStorage
5. Axios interceptor
6. Xác định role
7. Navigate dashboard

---

# Check-in Flow

1. Tap check-in
2. (Optional) GPS
3. Call API
4. Show result
5. Update UI

---

# Leave Request Flow

1. Fill form
2. Validate
3. Call `/leave/submit`
4. Show result
5. Go to history

---

# Manager Approval Flow

1. Fetch `/leave/pending`
2. Display list
3. Review request
4. Approve / Reject
5. Call `/leave/{id}/review`
6. Update list

---

# 📈 Development Priority

---

# Phase 1 (MVP)

* API Service Layer
* Login/Register
* Check-in / Check-out
* Employee Dashboard

---

# Phase 2

* Leave request
* Leave approval
* Leave history

---

# Phase 3

* Explanation
* Reports
* Manager dashboard

---

# Phase 4

* Error handling
* Loading states
* Offline support

---

# ⚙️ Configuration Needed

### Backend

* PostgreSQL connection
* JWT Key
* JWT Issuer/Audience
* Database migrations

---

### Frontend

* API base URL
* API timeout

---

# 📋 Tổng kết

| Thành phần     | Backend    | Frontend     |
| -------------- | ---------- | ------------ |
| Status         | ✅ 95%      | ❌ 5%         |
| Endpoints      | 11         | 0            |
| Services       | 5          | 0            |
| Database       | PostgreSQL | AsyncStorage |
| Auth           | JWT        | Chưa làm     |
| Error handling | Có         | Chưa         |
| Validation     | Có         | Chưa         |

---

# 🚀 Bước tiếp theo

Bắt đầu **Phase 1 frontend**

1. API Service Layer
2. Authentication UI
3. Check-in screen
4. Employee Dashboard

---

