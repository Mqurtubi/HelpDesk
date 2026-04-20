using HelpDesk.Server.Data;
using HelpDesk.Server.Models;
using HelpDesk.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace HelpDesk.Server.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            var users = await _context.AppUsers
                .Include(x => x.Departement)
                .Include(x => x.Role)
                .Select(x => new UserResponseDto
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    Email = x.Email,
                    DepartmentId = x.DepartementId,
                    DepartmentName = x.Departement != null ? x.Departement.Name : string.Empty,
                    RoleId = x.RoleId,
                    RoleName = x.Role != null ? x.Role.Name : string.Empty,
                })
                .ToListAsync();
            return Ok(users);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
        {
            var user = await _context.AppUsers
                .Include(x => x.Departement)
                .Include(x => x.Role)
                .Where(x => x.Id == id)
                .Select(x => new UserResponseDto
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    Email = x.Email,
                    DepartmentId = x.DepartementId,
                    DepartmentName = x.Departement != null ? x.Departement.Name : string.Empty,
                    RoleId = x.RoleId,
                    RoleName = x.Role != null ? x.Role.Name : string.Empty,
                })
                .FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = $"user dengan id {id} tidak ditemukan" });
            }
            return Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<AppUser>> CreateUser(CreateUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName)) {
                return BadRequest(new { message = "fullname wajib diisi" });
            }
            if (string.IsNullOrWhiteSpace(dto.Email)) {
                return BadRequest(new { message = "email wajib diisi" });
            }
            if (string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "password wajib diisi" });
            }
            var emailExist = await _context.AppUsers.AnyAsync(x => x.Email == dto.Email);
            if (emailExist)
            {
                return BadRequest(new { message = "email sudah digunakan" });
            }
            var departemensExist = await _context.Departements.AnyAsync(x => x.Id == dto.DepartementId);
            if (!departemensExist)
            {
                return BadRequest(new { message = $"DepartementId {dto.DepartementId} tidak ada" });
            }
            var roleExist = await _context.Roles.AnyAsync(x => x.Id == dto.RoleId);
            if (!roleExist)
            {
                return BadRequest(new { message = $"RoleId {dto.RoleId} tidak ada" });
            }
            var user = new AppUser
            {
                FullName = dto.FullName,
                Email = dto.Email,
                DepartementId = dto.DepartementId,
                Password = dto.Password,
                RoleId = dto.RoleId,
            };

            _context.AppUsers.Add(user);
            await _context.SaveChangesAsync();

            var createdUser = await _context.AppUsers
                .Include(x => x.Departement)
                .Include(x => x.Role)
                .Where(x => x.Id == user.Id)
                .Select(x => new UserResponseDto
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    Email = x.Email,
                    DepartmentId = x.DepartementId,
                    DepartmentName = x.Departement != null ? x.Departement.Name : string.Empty,
                    RoleId = x.RoleId,
                    RoleName = x.Role != null ? x.Role.Name : string.Empty,
                })
                .FirstAsync();
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
            {
                return BadRequest(new { message = "fullname wajib diisi" });
            }
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "email wajib diisi" });
            }
            var user = await _context.AppUsers.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "user tidak ditemukan" });
            }
            var emailExist = await _context.AppUsers.AnyAsync(x => x.Email == dto.Email && x.Id != id);
            if (emailExist)
            {
                return BadRequest(new { message = "email sudah terpakai" });
            }
            var departementExist = await _context.Departements.AnyAsync(x => x.Id == dto.DepartementId);
            if (!departementExist)
            {
                return BadRequest(new { message = "departement tidak ada" });
            }
            var roleExist = await _context.Roles.AnyAsync(x => x.Id == dto.RoleId);
            if (!roleExist)
            {
                return BadRequest(new { message = "role tidak ada" });
            }

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.DepartementId = dto.DepartementId;
            user.RoleId = dto.RoleId;

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.Password = dto.Password;
            }
            await _context.SaveChangesAsync();

            var updateUser = await _context.AppUsers
                .Include(x => x.Departement)
                .Include(x => x.Role)
                .Where(x => x.Id == user.Id)
                .Select(x => new UserResponseDto
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    Email = x.Email,
                    DepartmentId = x.DepartementId,
                    DepartmentName = x.Departement != null ? x.Departement.Name : string.Empty,
                    RoleId = x.RoleId,
                    RoleName = x.Role != null ? x.Role.Name : string.Empty,
                })
                .FirstAsync();

            return Ok(updateUser);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.AppUsers.FirstOrDefaultAsync(x => x.Id == id);
            if(user == null)
            {
                return NotFound(new { message = "user tidak ditemukan" });
            }
            _context.AppUsers.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "user berhasil dihapus" });
        }
    }
}
