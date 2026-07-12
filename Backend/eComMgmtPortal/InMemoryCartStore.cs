using eComMgmtPortal.Models;
using System.Collections.Concurrent;

namespace eComMgmtPortal
{
    public class InMemoryCartStore
    {
        private readonly ConcurrentDictionary<int, List<OrderItemsModel>> _carts = new();
        public List<OrderItemsModel> GetItems(int userId)
        {
            return _carts.GetOrAdd(userId, new List<OrderItemsModel>());
        }
        public void AddItem(int userId, OrderItemsModel newItem)
        {
            var items = GetItems(userId);

            var existingItem = items.FirstOrDefault(i => i.ProdId == newItem.ProdId);

            if (existingItem != null)
            {
                existingItem.Qty += 1;
            }
            else
            {
                items.Add(newItem);
            }
        }
        public void RemoveItem(int userId, int productId)
        {
            if (_carts.TryGetValue(userId, out var items))
            {
                items.RemoveAll(x => x.ProdId == productId);
            }
        }
    }
}
