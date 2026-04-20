using HelpDesk.Server.Data;
using HelpDesk.Server.DTOs;
using HelpDesk.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelpDesk.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController:ControllerBase
    {
        private readonly AppDbContext _context;
        public TicketsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketResponseDto>>> GetTickets()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            var query = _context.Tickets
                .Include(x => x.CreatedByUser)
                    .ThenInclude(x => x.Departement)
                .Include(x => x.CreatedByUser)
                    .ThenInclude(x => x.Role)
                .AsQueryable();

            if (roleClaim == "Employee" && int.TryParse(userIdClaim, out var userId)){
                query = query.Where(x=>x.CreatedByUserId == userId);
            }

            var tickets = await query
                .OrderByDescending(x=>x.CreatedAt)
                .Select(x=> new TicketResponseDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description= x.Description,
                    Status = x.Status,
                    Priority = x.Priority,
                    CreatedAt = x.CreatedAt,
                    CreatedByUserId = x.CreatedByUserId,
                    CreatedByUserName = x.CreatedByUser != null ? x.CreatedByUser.FullName : string.Empty,
                    DepartmentName = x.CreatedByUser != null && x.CreatedByUser.Departement != null? x.CreatedByUser.Departement.Name : string.Empty,
                    RoleName = x.CreatedByUser != null && x.CreatedByUser.Role != null ? x.CreatedByUser.Role.Name : string.Empty,
                })
                .ToListAsync();
            return Ok(tickets);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketResponseDto>> GetTicketById(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            var ticket = await _context.Tickets
                .Include(x => x.CreatedByUser)
                    .ThenInclude(x => x.Departement)
                .Include(x => x.CreatedByUser)
                    .ThenInclude(x => x.Role)
                .Where(x => x.Id == id)
                .Select(x => new TicketResponseDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    Status = x.Status,
                    Priority = x.Priority,
                    CreatedAt = x.CreatedAt,
                    CreatedByUserId = x.CreatedByUserId,
                    CreatedByUserName = x.CreatedByUser != null ? x.CreatedByUser.FullName : string.Empty,
                    DepartmentName = x.CreatedByUser != null && x.CreatedByUser.Departement != null ? x.CreatedByUser.Departement.Name : string.Empty,
                    RoleName = x.CreatedByUser != null && x.CreatedByUser.Role != null ? x.CreatedByUser.Role.Name : string.Empty,
                })
                .FirstOrDefaultAsync();
            if(ticket == null)
            {
                return NotFound(new { message = $"ticket dengan id {id} tidak ada" });
            }
            if(roleClaim == "Employee" && int.TryParse(userIdClaim, out var userId) && ticket.CreatedByUserId != userId){
                return Forbid();
            }
            return Ok(ticket);
        }
        [HttpPost]
        public async Task<ActionResult<Ticket>> CreateTicket(CreateTicketDto dto)
        {
            var userClaimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return BadRequest(new { message = "title wajib diisi" });
            }
            if (string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest(new { message = "deskripsi wajib diisi" });
            }
            if (!int.TryParse(userClaimId, out var userId))
            {
                return Unauthorized();
            }

            var userExist = await _context.AppUsers.AnyAsync(x => x.Id == userId);
            if (!userExist)
            {
                return BadRequest(new { message = $"user dengan id {dto.CreatedByUserId} tidak ada" });
            }

            var ticket = new Ticket
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                Status = "Open",
                CreatedByUserId = dto.CreatedByUserId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            var createdTicket = await _context.Tickets
                .Include(x => x.CreatedByUser)
                    .ThenInclude(x => x.Departement)
                .Include(x => x.CreatedByUser)
                    .ThenInclude(x => x.Role)
                .Where(x => x.Id == ticket.Id)
                .Select(x => new TicketResponseDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    Status = x.Status,
                    Priority = x.Priority,
                    CreatedAt = x.CreatedAt,
                    CreatedByUserId = x.CreatedByUserId,
                    CreatedByUserName = x.CreatedByUser != null ? x.CreatedByUser.FullName : string.Empty,
                    DepartmentName = x.CreatedByUser != null && x.CreatedByUser.Departement != null ? x.CreatedByUser.Departement.Name : string.Empty,
                    RoleName = x.CreatedByUser != null && x.CreatedByUser.Role != null ? x.CreatedByUser.Role.Name : string.Empty,
                })
                .FirstAsync();
            return CreatedAtAction(nameof(GetTicketById), new {id = createdTicket.Id}, createdTicket);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, UpdateTicketDto dto)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.Id == id);
            if(ticket == null)
            {
                NotFound(new { message = $"ticke dengan id {id} tidak ada" });
            }
            ticket.Title = dto.Title;
            ticket.Description = dto.Description;
            ticket.Priority = dto.Priority;
            await _context.SaveChangesAsync();
            return Ok(new { message = "ticket berhasil diupdate" });
        }
        [Authorize(Roles = "Admin,Agent")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTicketStatus(int id, UpdateTicketStatusDto dto)
        {
            var allowedStatus = new[] { "Open", "In Progress", "Resolved", "Closed" };
            if (string.IsNullOrWhiteSpace(dto.Status))
            {
                BadRequest(new { message = "Status wajib diisi" });
            }
            if (!allowedStatus.Contains(dto.Status))
            {
                return BadRequest(new { message = "Status tidak valid" });
            }
            var ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.Id == id);
            if (ticket == null)
            {
                return BadRequest(new { message= $"ticket dengan id {id} tidak ditemukan" });
            }
            ticket.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "status ticket berhasil diubah",
                TicketId = ticket.Id,
                newStatus = ticket.Status
            });
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleCLaim = User.FindFirst(ClaimTypes.Role)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }
            var ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.Id == id);
            if(ticket == null)
            {
                return BadRequest(new { message = "ticket tidak ditemukan" });
            }
            var isAdmin = roleCLaim == "Admin";
            var isOwnerOpenTicket = roleCLaim == "Employee"
                && ticket.CreatedByUserId == userId
                && ticket.Status == "Open";

            if(!isAdmin && !isOwnerOpenTicket)
            {
                return Forbid();
            }
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return Ok(new { message = "tiket berhasil dihapus" });
        }
    }
}
