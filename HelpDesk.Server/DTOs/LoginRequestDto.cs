namespace HelpDesk.Server.DTOs
{
    public class LoginRequestDto
    {
        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
    }
}
