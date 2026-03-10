using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WorkSync.Api.Data;
using WorkSync.Api.Models;

namespace WorkSync.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // --- HÀM 1: ĐĂNG KÝ (Băm mật khẩu) ---
        public async Task<string> RegisterAsync(string fullName, string email, string password)
        {
            // 1. Kiểm tra email trùng
            var isExist = await _context.Employees.AnyAsync(e => e.Email == email);
            if (isExist) return "Lỗi: Email này đã được sử dụng!";

            // 2. LOGIC TỰ ĐỘNG SINH MÃ NHÂN VIÊN (NV001, NV002...)
            string newEmployeeCode = "NV001"; // Mặc định nếu công ty chưa có ai

            // Tìm nhân viên có Id lớn nhất (người vào công ty gần nhất)
            var lastEmployee = await _context.Employees
                .OrderByDescending(e => e.Id)
                .FirstOrDefaultAsync();

            if (lastEmployee != null && !string.IsNullOrEmpty(lastEmployee.EmployeeCode))
            {
                // Cắt bỏ chữ "NV" (2 ký tự đầu), lấy phần số đằng sau
                string lastNumberStr = lastEmployee.EmployeeCode.Substring(2);

                // Ép sang số nguyên và cộng thêm 1
                if (int.TryParse(lastNumberStr, out int lastNumber))
                {
                    // Ký hiệu :D3 giúp format số luôn có 3 chữ số (ví dụ: 1 -> 001, 15 -> 015)
                    newEmployeeCode = $"NV{(lastNumber + 1):D3}";
                }
            }

            // 3. Băm mật khẩu
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            // 4. Tạo nhân viên mới
            var newEmployee = new Employee
            {
                EmployeeCode = newEmployeeCode, // Dùng mã tự sinh
                FullName = fullName,
                Email = email,
                PasswordHash = passwordHash,
                Role = "User",
                Status = "Đang làm việc"
            };

            await _context.Employees.AddAsync(newEmployee);
            await _context.SaveChangesAsync();

            return $"Tạo tài khoản thành công! Mã nhân viên của bạn là: {newEmployeeCode}";
        }

        // --- HÀM 2: ĐĂNG NHẬP (Giải mã và đối chiếu) ---
        public async Task<string> LoginAsync(string email, string password)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == email);
            if (employee == null) return "Lỗi: Email không tồn tại!";

            // KIỂM TRA MẬT KHẨU BẰNG BCRYPT
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, employee.PasswordHash);
            if (!isPasswordValid) return "Lỗi: Sai mật khẩu!";

            // Pass đúng -> Sinh Token (Đoạn này giữ nguyên như cũ)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
                new Claim(ClaimTypes.Email, employee.Email),
                new Claim(ClaimTypes.Role, employee.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}