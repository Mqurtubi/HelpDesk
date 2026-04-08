using HelpDesk.Server.Data;
using HelpDesk.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Server.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("[controller]")]
    public class DepartementsController:ControllerBase
    {
        private readonly AppDbContext _context;
        public DepartementsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Departement>>> GetDepartement()
        {
            return await _context.Departements.ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult<Departement>> CreateDepartement (Departement departement)
        {
            _context.Departements.Add(departement);
            await _context.SaveChangesAsync();
            return Ok(departement);
        }

        
    }
}
