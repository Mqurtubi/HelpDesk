namespace HelpDesk.Server.Models
{
    public class Ticket
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Empty { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "Open";
        public string Priority { get; set; } = "Medium";

        public int CreatedByUserId { get; set; }
        public AppUser? CreatedByUser { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();
    }
}
