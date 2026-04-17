using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Identity.Client;

namespace Selu383.SP26.Api.Features.Bag
{
    public class BagConfiguration : IEntityTypeConfiguration<Bag>
    {
        public void Configure(EntityTypeBuilder<Bag> builder)
        {
           builder.HasOne(b => b.Location)
                .WithMany()
                .HasForeignKey(b => b.LocationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(b => b.LocationId);

            builder.Property(b => b.Subtotal)
                .HasComputedColumnSql("SELECT SUM(Price * Quantity) FROM BagItems WHERE BagId = Id", stored: true);
        }
    }
}
