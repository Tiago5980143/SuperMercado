using Microsoft.EntityFrameworkCore;
using Supermercado.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuração do AppDbContext com MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySqlConn"),
        new MySqlServerVersion(new Version(8, 0, 33)) // Substitua pela versão do seu MySQL
    )
);

var app = builder.Build();

// Resto da configuração do app
app.Run();