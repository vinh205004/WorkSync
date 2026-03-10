using Microsoft.EntityFrameworkCore;
using WorkSync.Api.Models;

namespace WorkSync.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<TimeLog> TimeLogs { get; set; }
        public DbSet<ExplanationRequest> ExplanationRequests { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }
    }
}