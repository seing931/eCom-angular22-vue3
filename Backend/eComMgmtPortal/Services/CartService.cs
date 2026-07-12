using eComMgmtPortal.Data;
using eComMgmtPortal.Dtos.Request;
using eComMgmtPortal.Dtos.Response;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Services
{
    public interface ICartService
    {
        Task<UsrSessionModel> SelectCartAsync(int userId);
        Task<UsrSessionModel> RemoveItemAsync(int userId, int productId);
        Task AddRecentViewAsync(int userId, int productId);
        Task<UsrSessionModel> AddItemAsync(int userId, int productId);
    }
    public class CartService : ICartService
    {
        private readonly AppDbContext _dbContext;
        private readonly InMemoryCartStore _cartStore;
        public CartService(AppDbContext dbContext, InMemoryCartStore cartStore)
        {
            _dbContext = dbContext;
            _cartStore = cartStore;
        }
        public async Task<UsrSessionModel> SelectCartAsync(int userId)
        {
            var items = _cartStore.GetItems(userId);
            int subTotal = (int)items.Sum(x => x.TotalAmt ?? 0);
            int discount = (int)items.Sum(x => x.Disc ?? 0);

            return new UsrSessionModel
            {
                UserID = userId,
                Items = items,
                SubTotal = subTotal,
                Discount = discount,
                TtlAmt = subTotal - discount,
                MyCartCount = items.Count,
                WishlistCount = await _dbContext.Wishlist.CountAsync(x => x.CustomerID == userId)
            };
        }
        public async Task<UsrSessionModel> RemoveItemAsync(int userId, int productId)
        {
            _cartStore.RemoveItem(userId, productId);
            return await SelectCartAsync(userId);
        }
        public async Task AddRecentViewAsync(int userId, int productId)
        {
            if (userId > 0)
            {
                var recentlyViewed = new RecentlyViews
                {
                    CustomerID = userId,
                    ProductID = productId,
                    ViewDate = DateTime.Now
                };

                _dbContext.RecentlyViews.Add(recentlyViewed);
                await _dbContext.SaveChangesAsync();
            }
        }
        public async Task<UsrSessionModel> AddItemAsync(int userId, int productId)
        {
            var product = await _dbContext.Products.FindAsync(productId);
            if (product == null) return null;

            var orderItem = new OrderItemsModel
            {
                ProdId = product.ProductID,
                ProdName = product.Name,
                Qty = 1,
                UnitPrice = product.UnitPrice,
                ProdModel = new ProdModel
                {
                    ImageURL = product.ImageURL,
                    AltText = product.AltText
                }
            };

            _cartStore.AddItem(userId, orderItem);

            await AddRecentViewAsync(userId, productId);

            return await SelectCartAsync(userId);
        }
    }
}
