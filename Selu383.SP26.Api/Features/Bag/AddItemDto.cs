using System.ComponentModel.DataAnnotations;

namespace Selu383.SP26.Api.Features.Bag
{
    public class AddItemDto
    {
        [Required]
        public int ItemId { get; set; }

        [Range(1, 100)]
        public int Quantity { get; set; } = 1;
    }
}
