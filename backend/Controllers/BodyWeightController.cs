using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class BodyWeightController : ControllerBase
{
    private readonly AppDbContext _context;

    public BodyWeightController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /BodyWeight
    [HttpGet(Name = "GetBodyWeight")]
    public async Task<ActionResult<IEnumerable<BodyWeight>>> Get()
    {
        var records = await _context.BodyWeights
            .OrderByDescending(x => x.Date)
            .ToListAsync();

        return Ok(records);
    }

    // GET: /BodyWeight/5
    [HttpGet("{id}", Name = "GetBodyWeightById")]
    public async Task<ActionResult<BodyWeight>> GetById(int id)
    {
        var record = await _context.BodyWeights.FindAsync(id);

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
        _context.BodyWeights.Add(bodyWeight);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = bodyWeight.Id }, bodyWeight);
    }

    // DELETE: /BodyWeight/5
    [HttpDelete("{id:int}", Name = "DeleteBodyWeight")]
    public async Task<IActionResult> Delete(int id)
    {
        var record = await _context.BodyWeights.FindAsync(id);

        if (record is null)
        {
            return NotFound();
        }

        _context.BodyWeights.Remove(record);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}