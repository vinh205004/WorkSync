using WorkSync.Api.Models;

namespace WorkSync.Api.Repositories
{
    public interface IExplanationRepository
    {
        Task AddExplanationAsync(ExplanationRequest request);
        Task<bool> HasExplanationAsync(int employeeId, DateTime targetDate);
        Task<IEnumerable<ExplanationRequest>> GetPendingExplanationsAsync();
        Task<IEnumerable<ExplanationRequest>> GetExplanationsByEmployeeAsync(int employeeId);
        Task<ExplanationRequest?> GetExplanationByIdAsync(int id);
        Task UpdateExplanationAsync(ExplanationRequest request);
    }
}