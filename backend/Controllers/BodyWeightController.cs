using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/bodyweights")]
public class BodyWeightController(AppDbContext context) : ControllerBase
{
    // GET: /api/bodyweights
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BodyWeight>>> Get()
    {
        var records = await context.BodyWeights
            .OrderByDescending(b => b.Date)
            .ToListAsync();

        return Ok(records);
    }

    // GET: /api/bodyweights/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<BodyWeight>> GetById(int id)
    {
        var record = await context.BodyWeights.FindAsync(id);

        if (record is null) return NotFound();

        return Ok(record);
    }

    // POST: /api/bodyweights
    [HttpPost]
    public async Task<ActionResult<BodyWeight>> CreateBodyWeight(BodyWeight bodyWeight)
    {
        context.BodyWeights.Add(bodyWeight);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = bodyWeight.Id }, bodyWeight);
    }

    // DELETE: /api/bodyweights/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var record = await context.BodyWeights.FindAsync(id);

        if (record is null) return NotFound();
        
        context.BodyWeights.Remove(record);
        await context.SaveChangesAsync();

        return NoContent();
    }
}