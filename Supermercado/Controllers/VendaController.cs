using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Supermercado.Models;
using System;

namespace Supermercado.Controllers
{
    public class VendaController : Controller
    {
        private readonly IConfiguration _configuration;
        public VendaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public IActionResult Cadastrar()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Cadastrar(Venda venda)
        {
            string? connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var connection = new MySqlConnection(connectionString);
            connection.Open();

            string sql = "INSERT INTO tbVenda (id_venda,data_venda,valor_total)  VALUES(@Venid, @Vendata, @Venvalor)";
            MySqlCommand command = new MySqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Venid", venda.Id);
            command.Parameters.AddWithValue("@Vendata", venda.Data);
            command.Parameters.AddWithValue("@Venvalor", venda.Valor);
            command.ExecuteNonQuery();

            return RedirectToAction("Index", "Home");


        }
    }
}