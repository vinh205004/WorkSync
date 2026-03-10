using WorkSync.Api.Models;

namespace WorkSync.Api.Repositories
{
    public interface ILeaveRequestRepository
    {
        Task AddLeaveRequestAsync(LeaveRequest request);
        Task<IEnumerable<LeaveRequest>> GetPendingLeaveRequestsAsync();
        Task<IEnumerable<LeaveRequest>> GetLeaveRequestsByEmployeeAsync(int employeeId);
        Task<LeaveRequest?> GetLeaveRequestByIdAsync(int id);
        Task UpdateLeaveRequestAsync(LeaveRequest request);
    }
}
