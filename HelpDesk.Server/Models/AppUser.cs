namespace HelpDesk.Server.Models
{
    public class AppUser
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public int DepartementId { get; set; }
        public Departement? Departement { get; set; }

        public int RoleId { get; set; }
        public Role? Role { get; set; }
    }
}
