using System.ComponentModel.DataAnnotations;

namespace WorkSync.Api.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string EmployeeCode { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Role { get; set; } = "User"; // Quyền: Admin, Manager, Staff, User

        public string Status { get; set; } = "Đang làm việc";

        public string PasswordHash { get; set; } = string.Empty;
        public double RemainingLeaveHours { get; set; } = 96;
    }
}