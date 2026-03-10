using WorkSync.Api.DTOs;
using WorkSync.Api.Models;
using WorkSync.Api.Repositories;

namespace WorkSync.Api.Services
{
    public class ReportService : IReportService
    {
        private readonly ITimeLogRepository _timeLogRepo;
        private readonly ILogger<ReportService> _logger;

        public ReportService(ITimeLogRepository timeLogRepo, ILogger<ReportService> logger)
        {
            _timeLogRepo = timeLogRepo;
            _logger = logger;
        }

        public async Task<IEnumerable<MonthlyReportDto>> GetMonthlyReportAsync(int month, int year)
        {
            try
            {
                _logger.LogInformation($"Generating monthly report for {month}/{year}.");

                // 1. Lấy toàn bộ dữ liệu thô của tháng đó
                var logs = await _timeLogRepo.GetMonthlyLogsAsync(month, year);

                if (!logs.Any())
                {
                    _logger.LogWarning($"No time logs found for {month}/{year}.");
                    return new List<MonthlyReportDto>();
                }

                // 2. Tính toán báo cáo
                var report = CalculateMonthlyReport(logs);

                _logger.LogInformation($"Monthly report generated with {report.Count} employee records.");
                return report;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error generating monthly report for {month}/{year}");
                throw;
            }
        }

        public async Task<MonthlyReportDto?> GetEmployeeMonthlyReportAsync(int employeeId, int month, int year)
        {
            try
            {
                _logger.LogInformation($"Generating monthly report for employee {employeeId} for {month}/{year}.");

                // 1. Lấy dữ liệu chấm công của employee trong tháng đó
                var logs = await _timeLogRepo.GetEmployeeMonthlyLogsAsync(employeeId, month, year);

                if (!logs.Any())
                {
                    _logger.LogWarning($"No time logs found for employee {employeeId} in {month}/{year}.");
                    return null;
                }

                // 2. Lấy employee info từ logs
                var employee = logs.First().Employee;
                if (employee == null)
                {
                    _logger.LogError($"Employee data is null for employee {employeeId}");
                    return null;
                }

                // 3. Tính toán báo cáo
                var report = CalculateEmployeeMonthlyReport(employee, logs);

                _logger.LogInformation($"Employee report generated for employee {employeeId}.");
                return report;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error generating report for employee {employeeId} for {month}/{year}");
                throw;
            }
        }

        private List<MonthlyReportDto> CalculateMonthlyReport(IEnumerable<TimeLog> logs)
        {
            var standardCheckIn = new TimeSpan(8, 0, 0);
            var standardCheckOut = new TimeSpan(17, 30, 0);

            var report = logs
                .GroupBy(l => l.EmployeeId)
                .Select(g =>
                {
                    var employee = g.First().Employee;
                    return new MonthlyReportDto
                    {
                        EmployeeCode = employee.EmployeeCode,
                        FullName = employee.FullName,
                        TotalWorkingDays = g.Count(x => x.CheckInTime.HasValue),
                        TotalWorkingHours = Math.Round(
                            g.Where(x => x.CheckInTime.HasValue && x.CheckOutTime.HasValue)
                                .Sum(x => (x.CheckOutTime.Value - x.CheckInTime.Value).TotalHours), 2),
                        LateCount = g.Count(x => x.CheckInStatus == "Muộn"),
                        EarlyLeaveCount = g.Count(x => x.CheckOutStatus == "Sớm"),
                        TotalLateMinutes = Math.Round(
                            g.Where(x => x.CheckInTime.HasValue && x.CheckInTime.Value > standardCheckIn)
                                .Sum(x => (x.CheckInTime.Value - standardCheckIn).TotalMinutes), 2),
                        TotalEarlyLeaveMinutes = Math.Round(
                            g.Where(x => x.CheckOutTime.HasValue && x.CheckOutTime.Value < standardCheckOut)
                                .Sum(x => (standardCheckOut - x.CheckOutTime.Value).TotalMinutes), 2)
                    };
                })
                .ToList();

            return report;
        }

        private MonthlyReportDto CalculateEmployeeMonthlyReport(Employee employee, IEnumerable<TimeLog> logs)
        {
            var standardCheckIn = new TimeSpan(8, 0, 0);
            var standardCheckOut = new TimeSpan(17, 30, 0);

            var logsList = logs.ToList();

            return new MonthlyReportDto
            {
                EmployeeCode = employee.EmployeeCode,
                FullName = employee.FullName,
                TotalWorkingDays = logsList.Count(x => x.CheckInTime.HasValue),
                TotalWorkingHours = Math.Round(
                    logsList.Where(x => x.CheckInTime.HasValue && x.CheckOutTime.HasValue)
                        .Sum(x => (x.CheckOutTime.Value - x.CheckInTime.Value).TotalHours), 2),
                LateCount = logsList.Count(x => x.CheckInStatus == "Muộn"),
                EarlyLeaveCount = logsList.Count(x => x.CheckOutStatus == "Sớm"),
                TotalLateMinutes = Math.Round(
                    logsList.Where(x => x.CheckInTime.HasValue && x.CheckInTime.Value > standardCheckIn)
                        .Sum(x => (x.CheckInTime.Value - standardCheckIn).TotalMinutes), 2),
                TotalEarlyLeaveMinutes = Math.Round(
                    logsList.Where(x => x.CheckOutTime.HasValue && x.CheckOutTime.Value < standardCheckOut)
                        .Sum(x => (standardCheckOut - x.CheckOutTime.Value).TotalMinutes), 2)
            };
        }
    }
}