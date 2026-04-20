using HelpDesk.Server.Data;
using HelpDesk.Server.DTOs;
using HelpDesk.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace HelpDesk.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketCommentController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TicketCommentController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("ticket/{ticketId}")]
        public async Task<ActionResult<IEnumerable<TicketCommentResponseDto>>> GetCommentsByTicketId(int ticketId)
        {
            var ticketExist = await _context.Tickets.AnyAsync(x=>x.Id == ticketId);
            if (!ticketExist)
            {
                return NotFound(new { message = $"Tickket dengan id {ticketId} tidak ditemukan" });
            }
            var comments = await _context.TicketComments
                .Include(x => x.User)
                .Where(x => x.TicketId == ticketId)
                .OrderBy(x => x.CreatedAt)
                .Select(x => new TicketCommentResponseDto
                {
                    Id = x.Id,
                    TicketId = x.TicketId,
                    UserId = x.UserId,
                    UserName = x.User != null ? x.User.FullName : string.Empty,
                    Message = x.Message,
                    CreatedAt = x.CreatedAt,
                })
                .ToListAsync();
            return Ok(comments);
        }
        [HttpPost]
        public async Task<ActionResult<TicketCommentResponseDto>> CreateComment(CreateTicketCommentDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { message = "pesan wajib diisi" });
            }

            var ticketExist = await _context.Tickets.FirstOrDefaultAsync(x=>x.Id==dto.TicketId);

            if (ticketExist == null)
            {
                return NotFound(new { message = $"ticket dengan id {dto.TicketId} tidak ada" });
            }

            if (roleClaim == "Employee" && ticketExist.CreatedByUserId != userId)
            {
                return Forbid();
            }

            var userExist = await _context.AppUsers.AnyAsync(x=>x.Id == userId);
            if (!userExist)
            {
                return BadRequest(new { message = $"user dengan id tidak valid" });
            }
            
            var comment = new TicketComment
            {
                TicketId = dto.TicketId,
                UserId = dto.UserId,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow
            };
            _context.TicketComments.Add(comment);
            await _context.SaveChangesAsync();

            var createdComment = await _context.TicketComments
                .Include(x => x.User)
                .Where(x => x.Id == comment.Id)
                .Select(x => new TicketCommentResponseDto
                {
                    Id = x.Id,
                    TicketId = x.TicketId,
                    UserId = x.UserId,
                    UserName = x.User != null ? x.User.FullName : string.Empty,
                    Message = x.Message,
                    CreatedAt = x.CreatedAt,
                })
                .FirstAsync();
            return Ok(createdComment);
        }
    }
}
