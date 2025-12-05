using System.ComponentModel.DataAnnotations;

namespace Supermercado.Models
{
    public class Fornecedor
    {
        [Display(Name = "Id do Fornecedor")]
        public string Id { get; set; }

        [Display(Name = "Nome do Fornecedor")]
        public string Nome { get; set; }

        [Display(Name = "Telefone do Fornecedor")]
        public string? Telefone { get; set; }

        [Display(Name = "Endereço do Fornecedor")]
        public string? Endereco { get; set; }
    }
}
