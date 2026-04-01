using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Selu383.SP26.Api.Features.Items;

public class ExtraOptionConfiguration : IEntityTypeConfiguration<ExtraOption>
{
    public void Configure(EntityTypeBuilder<ExtraOption> builder)
    {
        builder.Property(x => x.Name).IsRequired().HasMaxLength(120);
        builder.Property(x => x.Description).HasMaxLength(500);
        builder.Property(x => x.Price).HasPrecision(18, 2);
    }
}
