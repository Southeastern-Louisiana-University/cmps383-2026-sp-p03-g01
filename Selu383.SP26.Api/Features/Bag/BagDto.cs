using Selu383.SP26.Api.Features.Bag;

public record BagDto
{
    public int Id { get; set; }
    public IEnumerable<BagItemDto> Items { get; set; }
    public decimal Subtotal { get; set; }

    public decimal Discount { get; set; }
    public decimal Total { get; set; }
}
