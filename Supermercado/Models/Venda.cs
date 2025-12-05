using System.ComponentModel.DataAnnotations;

namespace Supermercado.Models
{
    public class Venda
    {
        [Display(Name = "Id da Venda")]
        public string Id { get; set; }

        [Display(Name = "Data da Venda")]
        public string Data { get; set; }

        [Display(Name = "Valor total")]
        public string? Valor { get; set; }
    }
}
