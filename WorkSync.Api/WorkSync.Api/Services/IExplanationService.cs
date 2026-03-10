using WorkSync.Api.Models;

namespace WorkSync.Api.Services
{
    public interface IExplanationService
    {
        Task<string> SubmitExplanationAsync(int employeeId, DateTime targetDate, string reason);
        Task<IEnumerable<ExplanationRequest>> GetPendingExplanationsAsync();
        Task<string> ReviewExplanationAsync(int requestId, bool isApproved);
        Task<IEnumerable<ExplanationRequest>> GetExplanationsByEmployeeAsync(int employeeId);
    }
}