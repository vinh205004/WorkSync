using Microsoft.EntityFrameworkCore;
using WorkSync.Api.Data;
using WorkSync.Api.Models;

namespace WorkSync.Api.Repositories
{
    public class ExplanationRepository : IExplanationRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ExplanationRepository> _logger;

        public ExplanationRepository(AppDbContext context, ILogger<ExplanationRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task AddExplanationAsync(ExplanationRequest request)
        {
            try
            {
                await _context.ExplanationRequests.AddAsync(request);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Explanation request added successfully. ID: {request.Id}, Employee: {request.EmployeeId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding explanation request for employee {request.EmployeeId}");
                throw;
            }
        }

        public async Task<bool> HasExplanationAsync(int employeeId, DateTime targetDate)
        {
            try
            {
                return await _context.ExplanationRequests
                    .AnyAsync(x => x.EmployeeId == employeeId && x.TargetDate.Date == targetDate.Date);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error checking explanation for employee {employeeId} on {targetDate.Date}");
                throw;
            }
        }

        public async Task<IEnumerable<ExplanationRequest>> GetPendingExplanationsAsync()
        {
            try
            {
                return await _context.ExplanationRequests
                    .Include(e => e.Employee)
                    .Where(x => x.Status == "Chờ duyệt")
                    .OrderByDescending(x => x.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching pending explanations");
                throw;
            }
        }

        public async Task<IEnumerable<ExplanationRequest>> GetExplanationsByEmployeeAsync(int employeeId)
        {
            try
            {
                return await _context.ExplanationRequests
                    .Where(x => x.EmployeeId == employeeId)
                    .OrderByDescending(x => x.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching explanations for employee {employeeId}");
                throw;
            }
        }

        public async Task<ExplanationRequest?> GetExplanationByIdAsync(int id)
        {
            try
            {
                return await _context.ExplanationRequests
                    .Include(e => e.Employee)
                    .FirstOrDefaultAsync(x => x.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching explanation {id}");
                throw;
            }
        }

        public async Task UpdateExplanationAsync(ExplanationRequest request)
        {
            try
            {
                _context.ExplanationRequests.Update(request);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Explanation request {request.Id} updated successfully. New status: {request.Status}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating explanation {request.Id}");
                throw;
            }
        }
    }
}