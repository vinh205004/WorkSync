namespace WorkSync.Api.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(string fullName, string email, string password);
        Task<string> LoginAsync(string email, string password);
    }
}