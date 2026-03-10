using WorkSync.Api.Models;
using WorkSync.Api.Repositories;

namespace WorkSync.Api.Services
{
    public class ExplanationService : IExplanationService
    {
        private readonly IExplanationRepository _explanationRepo;
        private readonly ITimeLogRepository _timeLogRepo;
        private readonly ILogger<ExplanationService> _logger;

        public ExplanationService(IExplanationRepository explanationRepo, ITimeLogRepository timeLogRepo, ILogger<ExplanationService> logger)
        {
            _explanationRepo = explanationRepo;
            _timeLogRepo = timeLogRepo;
            _logger = logger;
        }

        public async Task<string> SubmitExplanationAsync(int employeeId, DateTime targetDate, string reason)
        {
            try
            {
                // 1. Kiểm tra xem ngày đó có đi làm không
                var timeLog = await _timeLogRepo.GetLogByDateAsync(employeeId, targetDate);
                if (timeLog == null)
                {
                    _logger.LogWarning($"No time log found for employee {employeeId} on {targetDate.Date}");
                    return "Không tìm thấy dữ liệu chấm công cho ngày này!";
                }

                // 2. Kiểm tra xem có đi muộn / về sớm thật không
                if (timeLog.CheckInStatus != "Muộn" && timeLog.CheckOutStatus != "Sớm")
                {
                    _logger.LogInformation($"Employee {employeeId} was on time on {targetDate.Date}, no explanation needed");
                    return "Ngày này bạn đi làm đúng giờ, không cần giải trình!";
                }

                // 3. Kiểm tra xem đã gửi đơn cho ngày này chưa
                bool hasSubmitted = await _explanationRepo.HasExplanationAsync(employeeId, targetDate);
                if (hasSubmitted)
                {
                    _logger.LogWarning($"Employee {employeeId} already submitted explanation for {targetDate.Date}");
                    return "Bạn đã gửi đơn giải trình cho ngày này rồi, vui lòng chờ duyệt!";
                }

                // 4. Lưu đơn vào DB
                var request = new ExplanationRequest
                {
                    EmployeeId = employeeId,
                    TargetDate = targetDate.Date,
                    Reason = reason,
                    Status = "Chờ duyệt",
                    CreatedAt = DateTime.UtcNow.AddHours(7)
                };

                await _explanationRepo.AddExplanationAsync(request);

                _logger.LogInformation($"Explanation submitted successfully by employee {employeeId}.");
                return "Gửi đơn giải trình thành công! Trạng thái: Chờ duyệt";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error submitting explanation for employee {employeeId}");
                throw;
            }
        }

        public async Task<IEnumerable<ExplanationRequest>> GetPendingExplanationsAsync()
        {
            try
            {
                _logger.LogInformation("Fetching pending explanations.");
                return await _explanationRepo.GetPendingExplanationsAsync();
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
                _logger.LogInformation($"Fetching explanations for employee {employeeId}.");
                return await _explanationRepo.GetExplanationsByEmployeeAsync(employeeId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error fetching explanations for employee {employeeId}");
                throw;
            }
        }

        public async Task<string> ReviewExplanationAsync(int requestId, bool isApproved)
        {
            try
            {
                // 1. Tìm cái đơn đó trong DB
                var request = await _explanationRepo.GetExplanationByIdAsync(requestId);
                if (request == null)
                {
                    _logger.LogWarning($"Explanation request not found: {requestId}");
                    return "Không tìm thấy đơn giải trình này!";
                }

                // 2. Phải là đơn "Chờ duyệt" thì mới được phép thao tác
                if (request.Status != "Chờ duyệt")
                {
                    _logger.LogWarning($"Explanation request {requestId} already processed with status: {request.Status}");
                    return $"Đơn này đã được xử lý (Trạng thái hiện tại: {request.Status})!";
                }

                // 3. Cập nhật trạng thái
                request.Status = isApproved ? "Chấp thuận" : "Từ chối";

                await _explanationRepo.UpdateExplanationAsync(request);

                _logger.LogInformation($"Explanation request {requestId} reviewed. New status: {request.Status}");
                return $"Xử lý đơn thành công. Trạng thái mới: {request.Status}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error reviewing explanation {requestId}");
                throw;
            }
        }
    }
}