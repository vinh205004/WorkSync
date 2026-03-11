// Auth Models
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  employee: Employee;
}

// Employee Model
export interface Employee {
  id: string;
  code: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User';
  remainingLeaveHours: number;
  createdAt: string;
}

// TimeLog Model
export interface TimeLog {
  id: string;
  employeeId: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  isLateDeparture: boolean;
  isEarlyLeave: boolean;
  status: 'Ongoing' | 'Completed';
  date: string;
  lateMinutes?: number;
  earlyMinutes?: number;
}

// Leave Request Model
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  leaveHours: number;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// Explanation Request Model
export interface ExplanationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  type: 'Late' | 'Early';
  explanation: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

// Monthly Report Model
export interface MonthlyReportDto {
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  workDays: number;
  workHours: number;
  lateCount: number;
  lateMinutes: number;
  earlyCount: number;
  earlyMinutes: number;
  leaveHours: number;
  totalHours: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// Review Request DTO
export interface ReviewLeaveRequestDto {
  approved: boolean;
  rejectionReason?: string;
}

export interface ReviewExplanationDto {
  approved: boolean;
  rejectionReason?: string;
}

// Checkin/Checkout Request
export interface CheckinCheckoutRequest {
  latitude?: number;
  longitude?: number;
}

// Leave Submission
export interface SubmitLeaveRequestDto {
  startDate: string;
  endDate: string;
  reason: string;
}

// Explanation Submission
export interface SubmitExplanationDto {
  date: string;
  type: 'Late' | 'Early';
  explanation: string;
}
