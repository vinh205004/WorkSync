using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkSync.Api.DTOs;
using WorkSync.Api.Services;

namespace WorkSync.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveController : ControllerBase
    {
        private readonly ILeaveRequestService _leaveService;

        public LeaveController(ILeaveRequestService leaveService)
        {
            _leaveService = leaveService;
        }


        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] LeaveRequestDto dto)
        {
            try
            {
                var result = await _leaveService.SubmitLeaveRequestAsync(
                    dto.EmployeeId, dto.FromDate, dto.ToDate, dto.LeaveHours, dto.ProjectName, dto.LeaveType, dto.Reason);

                if (result.Contains("thành công")) return Ok(new { Message = result });
                return BadRequest(new { Error = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
        // API 1: Quản lý lấy danh sách đơn xin nghỉ chờ duyệt
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingRequests()
        {
            try
            {
                var requests = await _leaveService.GetPendingLeaveRequestsAsync();

                // Format dữ liệu trả về cho App/Web dễ hiển thị
                var result = requests.Select(r => new {
                    r.Id,
                    EmployeeName = r.Employee.FullName,
                    r.FromDate,
                    r.ToDate,
                    r.LeaveHours,
                    r.LeaveType,
                    r.Reason,
                    r.Status,
                    r.CreatedAt
                });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        // API 2: Quản lý bấm Duyệt / Từ chối
        [HttpPut("{id}/review")]
        public async Task<IActionResult> ReviewRequest(int id, [FromQuery] bool isApproved)
        {
            try
            {
                var result = await _leaveService.ReviewLeaveRequestAsync(id, isApproved);
                if (result.Contains("thành công")) return Ok(new { Message = result });
                return BadRequest(new { Error = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}