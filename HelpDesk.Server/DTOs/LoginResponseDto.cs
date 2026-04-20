namespace HelpDesk.Server.DTOs
{
    public class LoginResponseDto
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email {  get; set; } = string.Empty;
        public string RoleName {  get; set; } = string.Empty;
        public DateTime ExpiredAt { get; set; }
    }
}
