using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Selu383.SP26.Api.Features.Bag;

namespace Selu383.SP26.Api.Features.Items;

public class ItemConfiguration : IEntityTypeConfiguration<Item>
{
    public void Configure(EntityTypeBuilder<Item> builder)
    {
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.Nutrition)
            .HasMaxLength(300);

        builder.HasMany(x => x.Extras)
           .WithOne(x => x.Item)
           .HasForeignKey(x => x.ItemId)
           .OnDelete(DeleteBehavior.Cascade);

        builder.Property(i => i.Price).HasPrecision(18, 2);

        builder.Property(i => i.ImageUrl)
       .HasMaxLength(500);
    }
}
