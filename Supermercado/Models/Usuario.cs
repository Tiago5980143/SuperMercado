using System.ComponentModel.DataAnnotations;

namespace Supermercado.Models
{
    public class Usuario
    {
        [Display(Name = "Id do Produto")]
        public string Id { get; set; }

        [Display(Name = "Nome do Produto")]
        public string Nome { get; set; }

        [Display(Name = "Telefone")]
        public string? Telefone { get; set; }

        [Display(Name = "Email")]
        public string? Email { get; set; }
    }
}
