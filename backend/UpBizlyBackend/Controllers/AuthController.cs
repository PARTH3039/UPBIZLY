using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UpBizlyBackend.Data;
using UpBizlyBackend.Models;
using UpBizlyBackend.DTOs;

namespace UpBizlyBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // POST: api/auth/login
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
{
    if (string.IsNullOrWhiteSpace(request.Username) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return BadRequest("Username and password are required.");
    }

    var user = await _context.Users
        .AsNoTracking()
        .FirstOrDefaultAsync(u => u.Username == request.Username);

    if (user == null)
        return Unauthorized("Invalid credentials.");

    bool passwordValid;

    if (user.PasswordHash.StartsWith("$2a$") ||
        user.PasswordHash.StartsWith("$2b$") ||
        user.PasswordHash.StartsWith("$2y$"))
    {
        passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
    }
    else
    {
        passwordValid = request.Password == user.PasswordHash;
    }

    if (!passwordValid)
        return Unauthorized("Invalid credentials.");

    var token = GenerateJwtToken(user);

    // ✅ Return user info along with JWT
    return Ok(new
    {
        token,
        user = new
        {
            id = user.Id,
            username = user.Username,
            role = user.Role
        }
    });

        
    }

    private string GenerateJwtToken(User user)
    {
        var secret = _config["JwtSettings:SecretKey"];
        if (string.IsNullOrEmpty(secret) || secret.Length < 32)
            throw new Exception("JWT SecretKey is missing or too short.");

        var key = Encoding.UTF8.GetBytes(secret);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(4),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
        
    }
}
