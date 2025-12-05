using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Supermercado.Models;
using System.Diagnostics;

namespace ProjetoGigiDede.Controllers
{
    public class UsuarioController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public UsuarioController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("MySqlConn");
        }

        public IActionResult Cadastro()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Cadastro([FromBody] Usuario newUsuario)
        {
            if (!ModelState.IsValid)
                return BadRequest("Dados inválidos.");

            try
            {
                using (var conn = new MySqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    string sql = "INSERT INTO usuarios (nome, telefone, email) VALUES (@nome, @telefone, @email)";
                    using (var cmd = new MySqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@nome", newUsuario.Nome ?? string.Empty);
                        cmd.Parameters.AddWithValue("@telefone", newUsuario.Telefone ?? string.Empty);
                        cmd.Parameters.AddWithValue("@email", newUsuario.Email ?? string.Empty);
                        await cmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok("Cadastro realizado com sucesso!");
            }
            catch (Exception ex)
            {
                return BadRequest("Erro ao inserir: " + ex.Message);
            }
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
