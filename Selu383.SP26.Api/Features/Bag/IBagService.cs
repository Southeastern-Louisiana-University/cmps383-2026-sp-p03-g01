using System.Threading.Tasks;

namespace Selu383.SP26.Api.Features.Bag
{
    public interface IBagService
    {
        Task<Bag> GetOrCreateBagAsync();
        Task AddItemAsync(int itemId, int quantity);
        
        Task RemoveItemAsync(int itemId);
        Task UpdateItemQuantityAsync(int itemId, int quantity);
        Task CheckoutAsync(int pointsToUse);

        Task<List<Bag>> GetCheckedOutBagsAsync();
        Task MarkBagCompletedAsync(int bagId);
    }
}
