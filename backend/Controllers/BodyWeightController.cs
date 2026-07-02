using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class BodyWeightController(AppDbContext context) : ControllerBase
{
    // GET: /BodyWeight
    [HttpGet(Name = "GetBodyWeight")]
    public async Task<ActionResult<IEnumerable<BodyWeight>>> Get()
    {
        var records = await context.BodyWeights
            .OrderByDescending(b => b.Date)
            .ToListAsync();

        return Ok(records);
    }

    // GET: /BodyWeight/5
    [HttpGet("{id}", Name = "GetBodyWeightById")]
    public async Task<ActionResult<BodyWeight>> GetById(int id)
    {
        var record = await context.BodyWeights.FindAsync(id);

        if (record is null)
        {
            return NotFound();
        }

        return Ok(record);
    }

    // POST: /BodyWeight
    [HttpPost(Name = "CreateBodyWeight")]
    public async Task<ActionResult<BodyWeight>> CreateBodyWeight(BodyWeight bodyWeight)
    {
        context.BodyWeights.Add(bodyWeight);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = bodyWeight.Id }, bodyWeight);
    }

    // DELETE: /BodyWeight/5
    [HttpDelete("{id:int}", Name = "DeleteBodyWeight")]
    public async Task<IActionResult> Delete(int id)
    {
        var record = await context.BodyWeights.FindAsync(id);

        if (record is null)
        {
            return NotFound();
        }

        context.BodyWeights.Remove(record);
        await context.SaveChangesAsync();

        return NoContent();
    }
}