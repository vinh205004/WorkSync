using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WorkSync.Api.Data;
using WorkSync.Api.Middleware;
using WorkSync.Api.Repositories;
using WorkSync.Api.Services;

namespace WorkSync.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Database Configuration
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // 2. Add Controllers
            builder.Services.AddControllers();

            // 3. Register 3-layer Dependency Injection
            builder.Services.AddScoped<ITimeLogRepository, TimeLogRepository>();
            builder.Services.AddScoped<ITimeLogService, TimeLogService>();
            builder.Services.AddScoped<IExplanationRepository, ExplanationRepository>();
            builder.Services.AddScoped<IExplanationService, ExplanationService>();
            builder.Services.AddScoped<ILeaveRequestRepository, LeaveRequestRepository>();
            builder.Services.AddScoped<ILeaveRequestService, LeaveRequestService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IReportService, ReportService>();

            // 4. Add Logging
            builder.Services.AddLogging();

            builder.Services.AddEndpointsApiExplorer();

            // 5. Configure JWT Authentication
            var jwtKey = builder.Configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey) || jwtKey.Length < 32)
            {
                throw new InvalidOperationException("JWT Key must be at least 32 characters long. Set it in User Secrets or Environment Variables.");
            }

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                        ClockSkew = TimeSpan.Zero // Ngăn chặn clock skew
                    };
                });

            // 6. Configure CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactNative", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // 7. Configure Swagger with Security
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "WorkSync API",
                    Version = "v1",
                    Description = "API quản lý chấm công nhân viên"
                });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Nhập 'Bearer [khoảng trắng] [Token của bạn]' vào ô bên dưới.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            var app = builder.Build();

            // 8. Configure HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // 9. Global Exception Handler Middleware
            app.UseMiddleware<ExceptionHandlingMiddleware>();

            // 10. Security Headers
            app.UseHsts();
            app.UseHttpsRedirection();

            // 11. CORS
            app.UseCors("AllowReactNative");

            // 12. Authentication & Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // 13. Map Controllers
            app.MapControllers();

            // 14. Run Application
            app.Run();
        }
    }
}
