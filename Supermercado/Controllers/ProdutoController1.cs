using Microsoft.AspNetCore.Mvc;
using Supermercado.Models;
using MySql.Data.MySqlClient;


namespace Supermercado.Controllers
{
    public class ProdutoController : Controller
    {
        private readonly IConfiguration _configuration;
        public ProdutoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public IActionResult Cadastrar()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Cadastrar(Produto produto)
        {
            string? connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var connection = new MySqlConnection(connectionString);
            connection.Open();

            string sql = "INSERT INTO tbProduto (id_produto,nome,categoria,preco,estoque) VALUES (@Prodid,@Prodnome, @ProdCategoria,@ProdPreco)";
            MySqlCommand command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Prodid", produto.Id);
            command.Parameters.AddWithValue("@Prodnome", produto.Nome);
            command.Parameters.AddWithValue("@ProdCategoria", produto.Categoria);
            command.Parameters.AddWithValue("@ProdPreco", produto.Preco);
            command.ExecuteNonQuery();

            return RedirectToAction("Index", "Home");
        }
    }
}
