using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkSync.Api.Models
{
    public class LeaveRequest
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Employee")]
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        [Required]
        public DateTime FromDate { get; set; } // Từ ngày

        [Required]
        public DateTime ToDate { get; set; } // Đến ngày

        [Required]
        public double LeaveHours { get; set; } // Số giờ nghỉ (Ví dụ: 8h, 4h)

        public string? ProjectName { get; set; } // Dự án đang tham gia (có thể null)

        [Required]
        public string LeaveType { get; set; } = string.Empty; // Loại nghỉ (Nghỉ phép năm, thai sản, ốm...)

        [Required]
        public string Reason { get; set; } = string.Empty; // Lý do nghỉ

        public string Status { get; set; } = "Chờ duyệt"; // Trạng thái đơn

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7); // Thời gian tạo đơn
    }
}