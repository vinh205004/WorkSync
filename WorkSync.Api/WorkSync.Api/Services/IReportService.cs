using WorkSync.Api.DTOs;

namespace WorkSync.Api.Services
{
    public interface IReportService
    {
        Task<IEnumerable<MonthlyReportDto>> GetMonthlyReportAsync(int month, int year);
        Task<MonthlyReportDto?> GetEmployeeMonthlyReportAsync(int employeeId, int month, int year);
    }
}