using Microsoft.EntityFrameworkCore;
using ViaTab.API.Models;

namespace ViaTab.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Story> Stories => Set<Story>();
}
