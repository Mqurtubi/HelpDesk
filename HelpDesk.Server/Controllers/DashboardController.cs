using HelpDesk.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Server.Controllers
{
    [Authorize(Roles = "Admin, Agent")]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController:ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalTickets = await _context.Tickets.CountAsync();
            var openTickets = await _context.Tickets.CountAsync(x => x.Status == "Open");
            var inProgressTickets = await _context.Tickets.CountAsync(x => x.Status == "In Progress");
            var resolvedTickets = await _context.Tickets.CountAsync(x => x.Status == "Resolved");
            var closedTickets = await _context.Tickets.CountAsync(x => x.Status == "Closed");

            return Ok(new
            {
                totalTickets,
                openTickets,
                inProgressTickets,
                resolvedTickets,
                closedTickets
            });
        }
    }
}
