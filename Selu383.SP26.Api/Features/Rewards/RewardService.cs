namespace Selu383.SP26.Api.Features.Rewards
{
    public class RewardService
    {
        private const int PointsPerDollar = 100;
        private const decimal DollarsPerPoint = 0.01m;
        public int CalculatePointsEarned(decimal subtotal)
        {
            return (int)(subtotal * PointsPerDollar);
        }

        public decimal CalculateDiscount(int pointsToUse, decimal subtotal)
        {
            var value = pointsToUse * DollarsPerPoint;
            return value;
        }

        public int CalculatePointsFromDiscount(decimal discount)
        {
            return (int)(discount / DollarsPerPoint);
        }
    }
}
