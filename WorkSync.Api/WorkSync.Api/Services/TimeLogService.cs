using WorkSync.Api.Models;
using WorkSync.Api.Repositories;

namespace WorkSync.Api.Services
{
    public class TimeLogService : ITimeLogService
    {
        private readonly ITimeLogRepository _repository;

        public TimeLogService(ITimeLogRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> ProcessCheckInAsync(int employeeId)
        {
            var now = DateTime.UtcNow.AddHours(7); // Lấy giờ VN hiện tại

            // Quy tắc 1: Kiểm tra xem hôm nay đã check-in chưa
            var existingLog = await _repository.GetLogByDateAsync(employeeId, now);
            if (existingLog != null)
            {
                return "Hôm nay bạn đã check-in rồi!";
            }

            // Quy tắc 2: So sánh với giờ hành chính (8:00 AM)
            var standardTime = new TimeSpan(8, 0, 0);
            string status = now.TimeOfDay > standardTime ? "Muộn" : "Đúng giờ";

            // Tạo bản ghi mới đẩy xuống DB
            var newLog = new TimeLog
            {
                EmployeeId = employeeId,
                Date = now.Date,
                CheckInTime = now.TimeOfDay,
                CheckInStatus = status
            };

            await _repository.AddLogAsync(newLog);

            return $"Check-in thành công lúc {now:HH:mm:ss}. Trạng thái: {status}";
        }
        public async Task<string> ProcessCheckOutAsync(int employeeId)
        {
            var now = DateTime.UtcNow.AddHours(7); // Lấy giờ VN

            // 1. Phải check-in rồi thì mới có cái để check-out
            var existingLog = await _repository.GetLogByDateAsync(employeeId, now);
            if (existingLog == null)
            {
                return "Bạn chưa check-in ngày hôm nay! Không thể check-out.";
            }

            // 2. Logic tính toán về sớm (Giờ hành chính kết thúc lúc 17:30)
            var standardCheckOutTime = new TimeSpan(17, 30, 0);
            string status = now.TimeOfDay < standardCheckOutTime ? "Sớm" : "Đúng giờ";

            // 3. Cập nhật thời gian và trạng thái (cho phép ghi đè nhiều lần)
            existingLog.CheckOutTime = now.TimeOfDay;
            existingLog.CheckOutStatus = status;

            await _repository.UpdateLogAsync(existingLog);

            return $"Check-out thành công lúc {now:HH:mm:ss}. Trạng thái: {status}";
        }
    }
}