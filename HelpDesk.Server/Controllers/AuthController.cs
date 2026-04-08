using HelpDesk.Server.Data;
using HelpDesk.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace HelpDesk.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                RoleName = user.Role?.Name ?? string.Empty,
                ExpiredAt = expiredAt
            };
            return Ok(response);
        }
    }
}
