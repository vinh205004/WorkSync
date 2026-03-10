using WorkSync.Api.Models;

namespace WorkSync.Api.Repositories
{
    public interface ITimeLogRepository
    {
        Task<TimeLog?> GetLogByDateAsync(int employeeId, DateTime date);
        Task AddLogAsync(TimeLog timeLog);
        Task UpdateLogAsync(TimeLog timeLog);
        Task<IEnumerable<TimeLog>> GetMonthlyLogsAsync(int month, int year);
        Task<IEnumerable<TimeLog>> GetEmployeeMonthlyLogsAsync(int employeeId, int month, int year);
    }
}