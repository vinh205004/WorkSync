using Microsoft.EntityFrameworkCore;
using WorkSync.Api.Data;
using WorkSync.Api.Models;

namespace WorkSync.Api.Repositories
{
    public class TimeLogRepository : ITimeLogRepository
    {
        private readonly AppDbContext _context;

        public TimeLogRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TimeLog?> GetLogByDateAsync(int employeeId, DateTime date)
        {
            return await _context.TimeLogs
                .FirstOrDefaultAsync(tl => tl.EmployeeId == employeeId && tl.Date.Date == date.Date);
        }

        public async Task AddLogAsync(TimeLog timeLog)
        {
            await _context.TimeLogs.AddAsync(timeLog);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateLogAsync(TimeLog timeLog)
        {
            _context.TimeLogs.Update(timeLog);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<TimeLog>> GetMonthlyLogsAsync(int month, int year)
        {
            return await _context.TimeLogs
                .Include(tl => tl.Employee)
                .Where(tl => tl.Date.Month == month && tl.Date.Year == year)
                .OrderBy(tl => tl.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<TimeLog>> GetEmployeeMonthlyLogsAsync(int employeeId, int month, int year)
        {
            return await _context.TimeLogs
                .Include(tl => tl.Employee)
                .Where(tl => tl.EmployeeId == employeeId && tl.Date.Month == month && tl.Date.Year == year)
                .OrderBy(tl => tl.Date)
                .ToListAsync();
        }
    }
}