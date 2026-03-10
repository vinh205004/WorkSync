using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkSync.Api.Models
{
    public class ExplanationRequest
    {
        [Key]
        public int Id { get; set; }

        // Liên kết với người gửi đơn
        [ForeignKey("Employee")]
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        [Required]
        public DateTime TargetDate { get; set; } // Ngày xảy ra sự việc cần giải trình

        [Required]
        public string Reason { get; set; } = string.Empty; // Lý do giải trình

        public string? AttachmentUrl { get; set; } // File đính kèm (nếu có)

        // Trạng thái: Chờ duyệt, Chấp thuận, Từ chối
        public string Status { get; set; } = "Chờ duyệt";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7); // Thời gian nộp đơn
    }
}