using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Selu383.SP26.Api.Features.Bag
{
    public class BagItemConfiguration : IEntityTypeConfiguration<BagItem>
    {
        public void Configure(EntityTypeBuilder<BagItem> builder)
        {
            builder.HasKey(b => new { b.BagId, b.ItemId });

            builder.HasOne(b => b.Bag)
                .WithMany(bag => bag.Items)
                .HasForeignKey(b => b.BagId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(b => b.Item)
                .WithMany()
                .HasForeignKey(b => b.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(b => b.UnitPriceSnapshot).HasPrecision(18, 2);
        }
    }
}
