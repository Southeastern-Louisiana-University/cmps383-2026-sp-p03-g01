namespace Selu383.SP26.Api.Features.Rewards
{
    public class RewardService
    {
        private const int PointsPerDollar = 100;
        private const decimal DollarsPerPoint = 0.01m;
        public int CalculatePointsEarned(decimal total)
        {
            return (int)Math.Floor(total * 100);
        }

        public decimal CalculateDiscount(int pointsToUse, decimal subtotal)
        {
            var maxDiscount = subtotal * 0.10m;

            var requestedDiscount = pointsToUse * DollarsPerPoint;

            return Math.Min(requestedDiscount, maxDiscount);
        }

        public int CalculatePointsFromDiscount(decimal discount)
        {
            return (int)Math.Floor(discount / DollarsPerPoint);
        }
    }
}
