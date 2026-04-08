namespace HelpDesk.Server.DTOs
{
    public class CreateTicketCommentDto
    {
        public int UserId { get; set; }
        public int TicketId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
