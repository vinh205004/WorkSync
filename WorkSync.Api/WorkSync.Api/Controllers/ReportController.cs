using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkSync.Api.Services;

namespace WorkSync.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly ILogger<ReportController> _logger;

        public ReportController(IReportService reportService, ILogger<ReportController> logger)
        {
            _reportService = reportService;
            _logger = logger;
        }

        [HttpGet("monthly")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetMonthlyReport([FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                // Validate month/year
                if (month < 1 || month > 12 || year < 2000 || year > DateTime.Now.Year)
                {
                    _logger.LogWarning($"Invalid month/year parameters: month={month}, year={year}");
                    return BadRequest(new { Success = false, Message = "Tháng hoặc năm không hợp lệ!" });
                }

                _logger.LogInformation($"Generating monthly report for {month}/{year}.");

                var result = await _reportService.GetMonthlyReportAsync(month, year);

                _logger.LogInformation($"Monthly report generated successfully. Records: {result.Count()}");
                return Ok(new { Success = true, Data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while generating report for {month}/{year}.");
                return StatusCode(500, new { Success = false, Message = "An error occurred while generating the report." });
            }
        }

        [HttpGet("employee/{employeeId}")]
        [Authorize]
        public async Task<IActionResult> GetEmployeeMonthlyReport(int employeeId, [FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (!int.TryParse(userIdClaim?.Value, out int userId))
                {
                    return Unauthorized(new { Success = false, Message = "Invalid token." });
                }

                // Employee chỉ xem được báo cáo của chính họ, Manager/Admin xem được tất cả
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";
                if (userRole == "User" && userId != employeeId)
                {
                    _logger.LogWarning($"Unauthorized report access attempt: User {userId} trying to access employee {employeeId}");
                    return Forbid();
                }

                if (month < 1 || month > 12 || year < 2000 || year > DateTime.Now.Year)
                {
                    _logger.LogWarning($"Invalid month/year parameters: month={month}, year={year}");
                    return BadRequest(new { Success = false, Message = "Tháng hoặc năm không hợp lệ!" });
                }

                _logger.LogInformation($"Generating employee {employeeId} report for {month}/{year}.");

                var result = await _reportService.GetEmployeeMonthlyReportAsync(employeeId, month, year);

                _logger.LogInformation($"Employee report generated successfully for employee {employeeId}.");
                return Ok(new { Success = true, Data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while generating employee {employeeId} report.");
                return StatusCode(500, new { Success = false, Message = "An error occurred while generating the report." });
            }
        }
    }
}