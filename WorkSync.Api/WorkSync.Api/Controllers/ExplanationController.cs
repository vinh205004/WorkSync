using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkSync.Api.DTOs;
using WorkSync.Api.Services;

namespace WorkSync.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExplanationController : ControllerBase
    {
        private readonly IExplanationService _explanationService;
        private readonly ILogger<ExplanationController> _logger;

        public ExplanationController(IExplanationService explanationService, ILogger<ExplanationController> logger)
        {
            _explanationService = explanationService;
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

        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] ExplanationDto dto)
        {
            try
            {
                var employeeId = GetEmployeeIdFromToken();

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Explanation submission with invalid model state.");
                    return BadRequest(new { Success = false, Message = "Invalid explanation data." });
                }

                _logger.LogInformation($"Employee {employeeId} submitting explanation for date {dto.TargetDate}.");

                var result = await _explanationService.SubmitExplanationAsync(employeeId, dto.TargetDate, dto.Reason);

                if (result.Contains("thành công"))
                {
                    _logger.LogInformation($"Explanation submitted successfully by employee {employeeId}.");
                    return Ok(new { Success = true, Message = result });
                }

                _logger.LogWarning($"Explanation submission failed for employee {employeeId}: {result}");
                return BadRequest(new { Success = false, Message = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning($"Unauthorized explanation submission attempt: {ex.Message}");
                return Unauthorized(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during explanation submission.");
                return StatusCode(500, new { Success = false, Message = "An error occurred during explanation submission." });
            }
        }

        // API 1: Dành cho quản lý lấy danh sách các đơn đang chờ duyệt
        [HttpGet("pending")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> GetPendingRequests()
        {
            try
            {
                _logger.LogInformation("Fetching pending explanation requests.");

                var requests = await _explanationService.GetPendingExplanationsAsync();

                var result = requests.Select(r => new
                {
                    r.Id,
                    r.EmployeeId,
                    EmployeeName = r.Employee.FullName,
                    r.TargetDate,
                    r.Reason,
                    r.Status,
                    r.CreatedAt
                }).ToList();

                _logger.LogInformation($"Retrieved {result.Count} pending explanation requests.");
                return Ok(new { Success = true, Data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching pending explanations.");
                return StatusCode(500, new { Success = false, Message = "An error occurred while fetching pending explanations." });
            }
        }

        // API 2: Dành cho quản lý bấm nút Duyệt (hoặc Từ chối)
        [HttpPut("{id}/review")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> ReviewRequest(int id, [FromQuery] bool isApproved)
        {
            try
            {
                _logger.LogInformation($"Reviewing explanation request {id}. Approved: {isApproved}");

                var result = await _explanationService.ReviewExplanationAsync(id, isApproved);

                if (result.Contains("thành công"))
                {
                    _logger.LogInformation($"Explanation request {id} reviewed successfully.");
                    return Ok(new { Success = true, Message = result });
                }

                _logger.LogWarning($"Explanation review failed for ID {id}: {result}");
                return BadRequest(new { Success = false, Message = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while reviewing explanation {id}.");
                return StatusCode(500, new { Success = false, Message = "An error occurred while reviewing the explanation." });
            }
        }

        [HttpGet("my-requests")]
        public async Task<IActionResult> GetMyExplanations()
        {
            try
            {
                var employeeId = GetEmployeeIdFromToken();
                _logger.LogInformation($"Employee {employeeId} retrieving their explanations.");

                var requests = await _explanationService.GetExplanationsByEmployeeAsync(employeeId);

                var result = requests.Select(r => new
                {
                    r.Id,
                    r.TargetDate,
                    r.Reason,
                    r.Status,
                    r.CreatedAt
                }).ToList();

                return Ok(new { Success = true, Data = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning($"Unauthorized explanation retrieval: {ex.Message}");
                return Unauthorized(new { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving explanations.");
                return StatusCode(500, new { Success = false, Message = "An error occurred while retrieving explanations." });
            }
        }
    }
}