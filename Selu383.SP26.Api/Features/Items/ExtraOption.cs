namespace Selu383.SP26.Api.Features.Items
{
    public class ExtraOption
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int Price { get; set; }

        public string Description { get; set; } = string.Empty;

        public int ItemId { get; set; }
        public Item Item { get; set; } = null!;

    }
}
