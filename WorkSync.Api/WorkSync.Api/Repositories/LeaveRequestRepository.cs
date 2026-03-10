using Microsoft.EntityFrameworkCore;
using WorkSync.Api.Data;
using WorkSync.Api.Models;

namespace WorkSync.Api.Repositories
{
    public class LeaveRequestRepository : ILeaveRequestRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<LeaveRequestRepository> _logger;

        public LeaveRequestRepository(AppDbContext context, ILogger<LeaveRequestRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task AddLeaveRequestAsync(LeaveRequest request)
        {
            try
            {
                await _context.LeaveRequests.AddAsync(request);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Leave request added successfully. ID: {request.Id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding leave request");
                throw;
            }
        }

        public async Task<IEnumerable<LeaveRequest>> GetPendingLeaveRequestsAsync()
        {
            try
            {
                return await _context.LeaveRequests
                    .Include(lr => lr.Employee)
                    .Where(lr => lr.Status == "Chờ duyệt")
                    .OrderByDescending(lr => lr.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching pending leave requests");
                throw;
            }
        }

        public async Task<IEnumerable<LeaveRequest>> GetLeaveRequestsByEmployeeAsync(int employeeId)
        {
            try
            {
                return await _context.LeaveRequests
                    .Where(lr => lr.EmployeeId == employeeId)
                    .OrderByDescending(lr => lr.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching leave requests for employee {employeeId}");
                throw;
            }
        }

        public async Task<LeaveRequest?> GetLeaveRequestByIdAsync(int id)
        {
            try
            {
                return await _context.LeaveRequests
                    .Include(lr => lr.Employee)
                    .FirstOrDefaultAsync(lr => lr.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching leave request {id}");
                throw;
            }
        }

        public async Task UpdateLeaveRequestAsync(LeaveRequest request)
        {
            try
            {
                // Đánh dấu LeaveRequest cần cập nhật
                _context.LeaveRequests.Update(request);

                // Nếu Employee bị thay đổi (RemainingLeaveHours), đánh dấu để cập nhật
                if (request.Employee != null)
                {
                    _context.Employees.Update(request.Employee);
                }

                await _context.SaveChangesAsync();
                _logger.LogInformation($"Leave request {request.Id} updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating leave request {request.Id}");
                throw;
            }
        }
    }
}