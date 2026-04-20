using HelpDesk.Server.Data;
using HelpDesk.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
namespace HelpDesk.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController :ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginRequestDto>> Login(LoginRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.email))
            {
                return BadRequest(new { message = "Email wajib diisi" });
            }
            if (string.IsNullOrWhiteSpace(dto.password))
            {
                return BadRequest(new { message = "Password wajib diisi" });
            }
            var user = await _context.AppUsers
                .Include(x=>x.Role)
                .FirstOrDefaultAsync(x=>x.Email == dto.email);

            if (user == null)
            {
                return Unauthorized(new { message = "Email atau password salah" });
            }
            if (user.Password != dto.password)
            {
                return Unauthorized(new { message = "Email atau password salah" });
            }
            var jwtSection = _config.GetSection("jwt");
            var key = jwtSection["Key"];
            var issuer = jwtSection["Issuer"];
            var audience = jwtSection["Audience"];
            var expireMinutes = int.Parse(jwtSection["ExpireMinutes"]!);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role?.Name?? string.Empty)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!));
            var credentials = new SigningCredentials(securityKey,SecurityAlgorithms.HmacSha256);
            var expiredAt = DateTime.UtcNow.AddMinutes(expireMinutes);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiredAt,
                signingCredentials: credentials
                );
            var token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            var response = new LoginResponseDto
            {
                Id=user.Id,
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                RoleName = user.Role?.Name ?? string.Empty,
                ExpiredAt = expiredAt
            };
            return Ok(response);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<CurrentUserResponseDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(!int.TryParse(userIdClaim,out var userId))
            {
                return Unauthorized();
            }
            var user = await _context.AppUsers
                .Include(x => x.Departement)
                .Include(x => x.Role)
                .Where(x => x.Id == userId)
                .Select(x => new CurrentUserResponseDto
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
            if(user == null)
            {
                return NotFound(new { message = "user tidak ditemukan" });
            }
            return Ok(user);
        } 
    }
}
