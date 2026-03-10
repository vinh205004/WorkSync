using WorkSync.Api.Models;

namespace WorkSync.Api.Services
{
    public interface ILeaveRequestService
    {
        Task<string> SubmitLeaveRequestAsync(int employeeId, DateTime fromDate, DateTime toDate, double leaveHours, string? projectName, string leaveType, string reason);
        Task<IEnumerable<LeaveRequest>> GetPendingLeaveRequestsAsync();
        Task<string> ReviewLeaveRequestAsync(int requestId, bool isApproved);
        Task<IEnumerable<LeaveRequest>> GetLeaveRequestsByEmployeeAsync(int employeeId);
    }
}