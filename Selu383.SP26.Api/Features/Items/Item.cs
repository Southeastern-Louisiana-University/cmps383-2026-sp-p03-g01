using Selu383.SP26.Api.Features.Auth;

namespace Selu383.SP26.Api.Features.Items;

public class Item
{
    public int Id { get; set; }
    public decimal Price { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Nutrition { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;

    public List<ExtraOption> Extras { get; set; } = new();
}
