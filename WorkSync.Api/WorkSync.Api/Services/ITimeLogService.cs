namespace WorkSync.Api.Services
{
    public interface ITimeLogService
    {
        Task<string> ProcessCheckInAsync(int employeeId);
        Task<string> ProcessCheckOutAsync(int employeeId);
    }
}