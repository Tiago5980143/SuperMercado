using Microsoft.EntityFrameworkCore;

namespace Supermercado.Data
{
    public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
            {
            }
            public DbSet<Supermercado.Models.Usuario> Usuarios { get; set; }
        }
    }
