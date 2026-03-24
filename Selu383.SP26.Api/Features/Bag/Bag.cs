using System;
using System.Collections.Generic;
using System.Linq;
using Selu383.SP26.Api.Features.Items;
using System.ComponentModel.DataAnnotations.Schema;

namespace Selu383.SP26.Api.Features.Bag
{
    public enum BagStatus
    {
        Open,
        CheckedOut,
        Abandoned
    }

    public class Bag
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? SessionId { get; set; }
        public BagStatus Status { get; set; } = BagStatus.Open;
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdateAt { get; set; }
        public ICollection<BagItem> Items { get; set; } = new List<BagItem>();
        [NotMapped]
        public decimal Subtotal => Items.Sum(i => i.LineTotal);

    }

}