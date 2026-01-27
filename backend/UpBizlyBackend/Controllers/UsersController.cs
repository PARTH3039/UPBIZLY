using Microsoft.AspNetCore.Mvc;
using UpBizlyBackend.Models; // or wherever your Business, Product, User classes are
using UpBizlyBackend.Data;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    public UsersController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _context.Users.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Post(User user)
    {
        if (string.IsNullOrWhiteSpace(user.Username) ||
            string.IsNullOrWhiteSpace(user.Password))
            return BadRequest("Missing fields");

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, User updated)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.Username = updated.Username;
        user.Role = updated.Role;
        if (!string.IsNullOrWhiteSpace(updated.Password))
            user.Password = updated.Password;

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
