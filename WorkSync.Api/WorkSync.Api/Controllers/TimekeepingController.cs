using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkSync.Api.Services;

namespace WorkSync.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TimekeepingController : ControllerBase
    {
        private readonly ITimeLogService _timeLogService;
        private readonly ILogger<TimekeepingController> _logger;

        public TimekeepingController(ITimeLogService timeLogService, ILogger<TimekeepingController> logger)
        {
            _timeLogService = timeLogService;
            _logger = logger;
        }

        private int GetEmployeeIdFromToken()
        {
            var employeeIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (employeeIdClaim == null || !int.TryParse(employeeIdClaim.Value, out int employeeId))
            {
                throw new UnauthorizedAccessException("Invalid token: Employee ID not found.");
            }
            return employeeId;
        }

        [HttpPost("checkin")]
        public async Task<IActionResult> CheckIn()
        {
            try
            {
                var employeeId = GetEmployeeIdFromToken();
                _logger.LogInformation($"Employee {employeeId} attempting check-in.");

                var result = await _timeLogService.ProcessCheckInAsync(employeeId);
                return Ok(new { Success = true, Message = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning($"Unauthorized check-in attempt: {ex.Message}");
                return Unauthorized(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Check-in error occurred.");
                return StatusCode(500, new { Success = false, Message = "An error occurred during check-in." });
            }
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> CheckOut()
        {
            try
            {
                var employeeId = GetEmployeeIdFromToken();
                _logger.LogInformation($"Employee {employeeId} attempting check-out.");

                var result = await _timeLogService.ProcessCheckOutAsync(employeeId);
                return Ok(new { Success = true, Message = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning($"Unauthorized check-out attempt: {ex.Message}");
                return Unauthorized(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Check-out error occurred.");
                return StatusCode(500, new { Success = false, Message = "An error occurred during check-out." });
            }
        }
    }
}