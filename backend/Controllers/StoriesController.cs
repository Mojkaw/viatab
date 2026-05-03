using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ViaTab.API.Data;
using ViaTab.API.Models;

namespace ViaTab.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public StoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.Stories.OrderByDescending(s => s.CreatedAt).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var story = await _db.Stories.FindAsync(id);
        return story is null ? NotFound() : Ok(story);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Story story)
    {
        story.CreatedAt = DateTime.UtcNow;
        _db.Stories.Add(story);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = story.Id }, story);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Story updated)
    {
        var story = await _db.Stories.FindAsync(id);
        if (story is null) return NotFound();

        story.Title = updated.Title;
        story.Content = updated.Content;
        story.Department = updated.Department;
        await _db.SaveChangesAsync();
        return Ok(story);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var story = await _db.Stories.FindAsync(id);
        if (story is null) return NotFound();

        _db.Stories.Remove(story);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
