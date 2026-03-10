using System;
using System.ComponentModel.DataAnnotations;

namespace WorkSync.Api.DTOs
{
    public class ExplanationDto
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime TargetDate { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập lý do giải trình")]
        public string Reason { get; set; } = string.Empty;
    }
}