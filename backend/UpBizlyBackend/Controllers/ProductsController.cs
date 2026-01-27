using Microsoft.AspNetCore.Mvc;
using UpBizlyBackend.Models; // or wherever your Business, Product, User classes are
using UpBizlyBackend.Data;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    public ProductsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _context.Products.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Post(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Name))
            return BadRequest("Name required");

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return Ok(product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Product updated)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = updated.Name;
        product.Price = updated.Price;
        product.BusinessId = updated.BusinessId;
        product.StockStatus = updated.StockStatus;

        await _context.SaveChangesAsync();
        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
