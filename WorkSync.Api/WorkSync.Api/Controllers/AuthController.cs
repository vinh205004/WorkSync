using Microsoft.AspNetCore.Mvc;
using WorkSync.Api.Services;
using WorkSync.Api.DTOs;
using Microsoft.Extensions.Logging;

namespace WorkSync.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Register attempt with invalid model state.");
                    return BadRequest(new { Success = false, Message = "Invalid registration data." });
                }

                _logger.LogInformation($"Registration attempt for email: {dto.Email}");

                var result = await _authService.RegisterAsync(dto.FullName, dto.Email, dto.Password);

                if (result.StartsWith("Lỗi"))
                {
                    _logger.LogWarning($"Registration failed for email {dto.Email}: {result}");
                    return BadRequest(new { Success = false, Message = result });
                }

                _logger.LogInformation($"User registered successfully: {dto.Email}");
                return Ok(new { Success = true, Message = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during registration.");
                return StatusCode(500, new { Success = false, Message = "An error occurred during registration." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Login attempt with invalid model state.");
                    return BadRequest(new { Success = false, Message = "Invalid login credentials." });
                }

                _logger.LogInformation($"Login attempt for email: {dto.Email}");

                var token = await _authService.LoginAsync(dto.Email, dto.Password);

                if (token.StartsWith("Lỗi"))
                {
                    _logger.LogWarning($"Login failed for email {dto.Email}");
                    return BadRequest(new { Success = false, Message = token });
                }

                _logger.LogInformation($"Login successful for email: {dto.Email}");
                return Ok(new { Success = true, Token = token, Message = "Đăng nhập thành công!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred during login.");
                return StatusCode(500, new { Success = false, Message = "An error occurred during login." });
            }
        }
    }
}