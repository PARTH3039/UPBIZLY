using Microsoft.AspNetCore.Mvc;
using UpBizlyBackend.Models; // or wherever your Business, Product, User classes are
using UpBizlyBackend.Data;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/businesses")]
public class BusinessesController : ControllerBase
{
    private readonly AppDbContext _context;
    public BusinessesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _context.Businesses.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Post(Business business)
    {
        if (string.IsNullOrWhiteSpace(business.Name))
            return BadRequest("Name required");

        _context.Businesses.Add(business);
        await _context.SaveChangesAsync();
        return Ok(business);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Business updated)
    {
        var business = await _context.Businesses.FindAsync(id);
        if (business == null) return NotFound();

        business.Name = updated.Name;
        business.Description = updated.Description;

        await _context.SaveChangesAsync();
        return Ok(business);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var business = await _context.Businesses.FindAsync(id);
        if (business == null) return NotFound();

        _context.Businesses.Remove(business);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
