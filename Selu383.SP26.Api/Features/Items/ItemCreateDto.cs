namespace Selu383.SP26.Api.Features.Items
{
    public class ItemCreateDto
    {
        public decimal Price { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Nutrition { get; set; } = string.Empty;

        public IFormFile? Image { get; set; }

        public List<ExtraOptionDto> Extras { get; set; } = new();
    }
}
