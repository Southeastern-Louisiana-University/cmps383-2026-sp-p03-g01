using Selu383.SP26.Api.Features.Items;
using System.ComponentModel.DataAnnotations.Schema;

namespace Selu383.SP26.Api.Features.Bag
{
    public class BagItem
    {
        public int BagId { get; set; }
        public Bag Bag { get; set; } = null!;

        public int ItemId { get; set; }
        public Item Item { get; set; } = null!;

        public int Quantity { get; set; } = 1;

        public decimal UnitPriceSnapshot { get; set; }

        [NotMapped]
        public decimal LineTotal => Quantity * UnitPriceSnapshot;

    }
}
