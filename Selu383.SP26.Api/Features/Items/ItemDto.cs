namespace Selu383.SP26.Api.Features.Items
{
    public class ItemDto
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Nutrition { get; set; } = string.Empty;
        public List<ExtraOptionDto> Extras { get; set; } = new();
    }
}
