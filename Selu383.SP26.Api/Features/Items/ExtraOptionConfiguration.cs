using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Selu383.SP26.Api.Features.Items;

public class ExtraOptionConfiguration : IEntityTypeConfiguration<ExtraOption>
{
    public void Configure(EntityTypeBuilder<ExtraOption> builder)
    {
        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(e => e.Description)
            .HasMaxLength(500);

        builder.Property(e => e.Price).HasPrecision(18, 2);

        builder.HasOne(e => e.Item)
            .WithMany(i => i.Extras)
            .HasForeignKey(e => e.ItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
