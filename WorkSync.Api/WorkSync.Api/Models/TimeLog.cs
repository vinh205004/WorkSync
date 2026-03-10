using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorkSync.Api.Models
{
    public class TimeLog
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Employee")]
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        public DateTime Date { get; set; }

        public TimeSpan? CheckInTime { get; set; }
        public string CheckInStatus { get; set; } = string.Empty; // Đúng giờ/Muộn/Không check in 

        public TimeSpan? CheckOutTime { get; set; }
        public string CheckOutStatus { get; set; } = string.Empty; // Đúng giờ/Sớm/Không check out 
    }
}