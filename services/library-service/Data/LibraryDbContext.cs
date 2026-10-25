using Microsoft.EntityFrameworkCore;

namespace LibraryService.Data;

// Entry point to the library database. Entities (favorites, wishlist)
// will be added here as DbSet<T> properties.
public class LibraryDbContext(DbContextOptions<LibraryDbContext> options) : DbContext(options)
{
}
