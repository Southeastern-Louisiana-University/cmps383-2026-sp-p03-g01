namespace Selu383.SP26.Api.Features.Bag
{
    public record BagItemDto
    {
        public int ItemId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal LineTotal => Quantity * Price;
    }
}
