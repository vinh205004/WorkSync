using System;
using System.ComponentModel.DataAnnotations;

namespace WorkSync.Api.DTOs
{
    public class LeaveRequestDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        [Required]
        [Range(0.5, 80, ErrorMessage = "Số giờ nghỉ không hợp lệ")]
        public double LeaveHours { get; set; }

        public string? ProjectName { get; set; }

        [Required]
        public string LeaveType { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập lý do nghỉ")]
        public string Reason { get; set; } = string.Empty;
    }
}