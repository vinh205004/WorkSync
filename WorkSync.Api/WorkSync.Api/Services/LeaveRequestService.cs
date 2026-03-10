using WorkSync.Api.Models;
using WorkSync.Api.Repositories;
using Microsoft.Extensions.Logging;

namespace WorkSync.Api.Services
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly ILeaveRequestRepository _leaveRepo;
        private readonly ILogger<LeaveRequestService> _logger;

        public LeaveRequestService(ILeaveRequestRepository leaveRepo, ILogger<LeaveRequestService> logger)
        {
            _leaveRepo = leaveRepo;
            _logger = logger;
        }

        public async Task<string> SubmitLeaveRequestAsync(int employeeId, DateTime fromDate, DateTime toDate, double leaveHours, string? projectName, string leaveType, string reason)
        {
            try
            {
                // 1. Validate dữ liệu ngày tháng
                if (toDate.Date < fromDate.Date)
                {
                    _logger.LogWarning($"Invalid date range for employee {employeeId}: from {fromDate:yyyy-MM-dd} to {toDate:yyyy-MM-dd}");
                    return "Lỗi: Ngày kết thúc không được nhỏ hơn ngày bắt đầu!";
                }

                // 2. Validate số giờ nghỉ
                if (leaveHours <= 0)
                {
                    _logger.LogWarning($"Invalid leave hours for employee {employeeId}: {leaveHours}");
                    return "Lỗi: Số giờ nghỉ phải lớn hơn 0!";
                }

                // 3. Validate leaveType không được trống
                if (string.IsNullOrWhiteSpace(leaveType))
                {
                    _logger.LogWarning($"Leave type is empty for employee {employeeId}");
                    return "Lỗi: Loại nghỉ không được bỏ trống!";
                }

                // 4. Validate reason không được trống
                if (string.IsNullOrWhiteSpace(reason))
                {
                    _logger.LogWarning($"Leave reason is empty for employee {employeeId}");
                    return "Lỗi: Lý do nghỉ không được bỏ trống!";
                }

                // 5. Tạo đơn mới
                var request = new LeaveRequest
                {
                    EmployeeId = employeeId,
                    FromDate = fromDate.Date,
                    ToDate = toDate.Date,
                    LeaveHours = leaveHours,
                    ProjectName = projectName,
                    LeaveType = leaveType,
                    Reason = reason,
                    Status = "Chờ duyệt",
                    CreatedAt = DateTime.UtcNow.AddHours(7)
                };

                await _leaveRepo.AddLeaveRequestAsync(request);

                _logger.LogInformation($"Leave request submitted successfully for employee {employeeId}. ID: {request.Id}");
                return "Gửi đơn nghỉ phép thành công! Trạng thái: Chờ duyệt";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error submitting leave request for employee {employeeId}");
                throw;
            }
        }

        public async Task<IEnumerable<LeaveRequest>> GetPendingLeaveRequestsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching pending leave requests.");
                var requests = await _leaveRepo.GetPendingLeaveRequestsAsync();
                _logger.LogInformation($"Retrieved {requests.Count()} pending leave requests.");
                return requests;
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
                _logger.LogInformation($"Fetching leave requests for employee {employeeId}.");
                var requests = await _leaveRepo.GetLeaveRequestsByEmployeeAsync(employeeId);
                _logger.LogInformation($"Retrieved {requests.Count()} leave requests for employee {employeeId}.");
                return requests;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching leave requests for employee {employeeId}");
                throw;
            }
        }

        public async Task<string> ReviewLeaveRequestAsync(int requestId, bool isApproved)
        {
            try
            {
                _logger.LogInformation($"Reviewing leave request {requestId}. Approved: {isApproved}");

                // 1. Tìm đơn nghỉ phép
                var request = await _leaveRepo.GetLeaveRequestByIdAsync(requestId);
                if (request == null)
                {
                    _logger.LogWarning($"Leave request not found: {requestId}");
                    return "Lỗi: Không tìm thấy đơn nghỉ phép này!";
                }

                // 2. Kiểm tra trạng thái
                if (request.Status != "Chờ duyệt")
                {
                    _logger.LogWarning($"Leave request {requestId} already processed. Current status: {request.Status}");
                    return $"Lỗi: Đơn này đã được xử lý (Trạng thái hiện tại: {request.Status})!";
                }

                // 3. Kiểm tra Employee được load từ DB
                if (request.Employee == null)
                {
                    _logger.LogError($"Employee data is null for leave request {requestId}");
                    return "Lỗi: Không tìm thấy thông tin nhân viên!";
                }

                // 4. Xử lý nếu duyệt
                if (isApproved)
                {
                    request.Status = "Chấp thuận";

                    // Kiểm tra quỹ phép
                    if (request.Employee.RemainingLeaveHours >= request.LeaveHours)
                    {
                        // Đủ quỹ phép: Trừ trực tiếp
                        request.Employee.RemainingLeaveHours -= request.LeaveHours;
                        _logger.LogInformation($"Leave approved for employee {request.EmployeeId}. Deducted {request.LeaveHours} hours. Remaining: {request.Employee.RemainingLeaveHours} hours");
                    }
                    else
                    {
                        // Không đủ quỹ phép: Chuyển thành không lương
                        request.LeaveType = "Nghỉ phép không hưởng lương";
                        _logger.LogWarning($"Insufficient leave hours for employee {request.EmployeeId}. Leave converted to unpaid. Requested: {request.LeaveHours}, Available: {request.Employee.RemainingLeaveHours}");
                    }
                }
                else
                {
                    // Từ chối đơn
                    request.Status = "Từ chối";
                    _logger.LogInformation($"Leave request {requestId} has been rejected");
                }

                // 5. Lưu thay đổi (Employee + LeaveRequest)
                await _leaveRepo.UpdateLeaveRequestAsync(request);

                _logger.LogInformation($"Leave request {requestId} processed successfully. New status: {request.Status}");
                return $"Xử lý đơn thành công. Trạng thái mới: {request.Status}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error reviewing leave request {requestId}");
                throw;
            }
        }
    }
}