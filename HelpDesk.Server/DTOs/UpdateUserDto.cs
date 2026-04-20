namespace HelpDesk.Server.DTOs
{
    public class UpdateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int DepartementId { get; set; }
        public int RoleId { get; set; }
    }
}
