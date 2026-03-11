# 🔌 API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Login
```
POST /auth/login
Headers: Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "data": {
    "token": "eyJhbGc...",
    "employee": {
      "id": "uuid",
      "code": "NV001",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "User",
      "remainingLeaveHours": 96,
      "createdAt": "2026-03-10T00:00:00Z"
    }
  }
}
```

### Register
```
POST /auth/register
Headers: Content-Type: application/json

Body:
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123"
}

Response: Same as login
```

## Time Keeping

### Check In
```
POST /timekeeping/checkin
Headers: Authorization: Bearer {token}

Body: {} (optional location: { latitude, longitude })

Response:
{
  "data": {
    "id": "uuid",
    "employeeId": "uuid",
    "checkInTime": "2026-03-11T08:15:00Z",
    "checkOutTime": null,
    "isLateDeparture": true,
    "isEarlyLeave": false,
    "status": "Ongoing",
    "date": "2026-03-11",
    "lateMinutes": 15
  }
}
```

### Check Out
```
POST /timekeeping/checkout
Headers: Authorization: Bearer {token}

Body: {} (optional location: { latitude, longitude })

Response: Same as check in
```

### Get Today's Status
```
GET /timekeeping/today
Headers: Authorization: Bearer {token}

Response: TimeLog object
```

## Leave Management

### Submit Leave Request
```
POST /leave/submit
Headers: Authorization: Bearer {token}

Body:
{
  "startDate": "2026-03-15T00:00:00Z",
  "endDate": "2026-03-20T00:00:00Z",
  "reason": "Annual vacation"
}

Response: {} (success if 200)
```

### Get My Leave Requests
```
GET /leave/my-requests
Headers: Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": "uuid",
      "employeeId": "uuid",
      "employeeName": "John Doe",
      "startDate": "2026-03-15",
      "endDate": "2026-03-20",
      "reason": "Vacation",
      "status": "Pending",
      "leaveHours": 40,
      "createdAt": "2026-03-10T09:30:00Z"
    }
  ]
}
```

### Get Pending Leave Requests (Manager/Admin)
```
GET /leave/pending
Headers: Authorization: Bearer {token}

Response: Array of LeaveRequest objects with status "Pending"
```

### Review Leave Request (Manager/Admin)
```
PUT /leave/{id}/review
Headers: Authorization: Bearer {token}

Body:
{
  "approved": true,
  "rejectionReason": null
}

OR (for rejection)

{
  "approved": false,
  "rejectionReason": "Scheduling conflict"
}

Response: {} (success if 200)
```

## Explanations

### Submit Explanation
```
POST /explanation/submit
Headers: Authorization: Bearer {token}

Body:
{
  "date": "2026-03-10T00:00:00Z",
  "type": "Late",
  "explanation": "Traffic jam on the way"
}

Response: {} (success if 200)
```

### Get My Explanations
```
GET /explanation/my-requests
Headers: Authorization: Bearer {token}

Response: Array of ExplanationRequest objects
```

### Get Pending Explanations (Manager/Admin)
```
GET /explanation/pending
Headers: Authorization: Bearer {token}

Response: Array of pending ExplanationRequest objects
```

### Review Explanation (Manager/Admin)
```
PUT /explanation/{id}/review
Headers: Authorization: Bearer {token}

Body:
{
  "approved": true,
  "rejectionReason": null
}

Response: {} (success if 200)
```

## Reports

### Get Monthly Report (Current User)
```
GET /report/monthly?month=3&year=2026
Headers: Authorization: Bearer {token}

Response:
{
  "data": {
    "employeeId": "uuid",
    "employeeName": "John Doe",
    "month": 3,
    "year": 2026,
    "workDays": 20,
    "workHours": 160,
    "lateCount": 2,
    "lateMinutes": 45,
    "earlyCount": 1,
    "earlyMinutes": 30,
    "leaveHours": 8,
    "totalHours": 168
  }
}
```

### Get Employee's Report (Manager/Admin)
```
GET /report/employee/{employeeId}?month=3&year=2026
Headers: Authorization: Bearer {token}

Response: Monthly report for specified employee
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error details"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials or token expired"
}
```

### 403 Forbidden
```json
{
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

Token obtained from login endpoint and stored in AsyncStorage.

## Rate Limiting

No rate limiting implemented (development mode).

## Data Types

### Employee
```typescript
{
  id: string;
  code: string;           // e.g., "NV001"
  fullName: string;
  email: string;
  role: "Admin" | "Manager" | "User";
  remainingLeaveHours: number;
  createdAt: string;      // ISO 8601
}
```

### TimeLog
```typescript
{
  id: string;
  employeeId: string;
  checkInTime: string | null;     // ISO 8601
  checkOutTime: string | null;    // ISO 8601
  isLateDeparture: boolean;
  isEarlyLeave: boolean;
  status: "Ongoing" | "Completed";
  date: string;                   // YYYY-MM-DD
  lateMinutes?: number;
  earlyMinutes?: number;
}
```

### LeaveRequest
```typescript
{
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;              // YYYY-MM-DD
  endDate: string;                // YYYY-MM-DD
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  leaveHours: number;
  createdAt: string;              // ISO 8601
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
```

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Check In
```bash
curl -X POST http://localhost:5000/api/timekeeping/checkin \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Get Monthly Report
```bash
curl -X GET "http://localhost:5000/api/report/monthly?month=3&year=2026" \
  -H "Authorization: Bearer <TOKEN>"
```

## Notes

- All dates are in ISO 8601 format unless specified
- Times are in UTC
- Leave is calculated in hours (1 day = 8 hours)
- Late cutoff: 08:00 AM
- Early departure: Before 17:30 (5:30 PM)
- Default leave per year: 96 hours (12 days)
