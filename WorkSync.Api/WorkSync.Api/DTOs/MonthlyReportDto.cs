namespace WorkSync.Api.DTOs
{
    public class MonthlyReportDto
    {
        public string EmployeeCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public int TotalWorkingDays { get; set; } // Tổng số ngày đi làm
        public double TotalWorkingHours { get; set; } // Tổng số giờ làm việc
        public int LateCount { get; set; } // Số lần đi muộn
        public double TotalLateMinutes { get; set; } // Số phút đi muộn
        public int EarlyLeaveCount { get; set; } // Số lần về sớm
        public double TotalEarlyLeaveMinutes { get; set; } // Số phút về sớm
    }
}