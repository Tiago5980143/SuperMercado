using System.ComponentModel.DataAnnotations;

namespace Supermercado.Models
{
    public class Produto
    {
        [Display(Name = "Id do Produto")]
        public string Id { get; set; }

        [Display(Name = "Nome do Produto")]
        public string Nome { get; set; }

        [Display(Name = "Preço")]
        public string? Preco { get; set; }

        [Display(Name = "Categoria")]
        public string? Categoria { get; set; }
    }
}