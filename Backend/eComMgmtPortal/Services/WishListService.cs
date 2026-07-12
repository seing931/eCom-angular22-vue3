using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Services
{
    public interface IWishListService
    {
        Task<int> AddWishlistAsync(int userId, int productId);
        Task<int> DeleteAsync(int id, int userId);
        Task<int> RemoveAsync(int userId, int productId);
    }
    public class WishListService : IWishListService
    {
        private readonly AppDbContext _dbContext;
        private readonly ICartService _service;
        private readonly InMemoryCartStore _cartStore;
        public WishListService(AppDbContext dbContext, ICartService service, InMemoryCartStore cartStore)
        {
            _dbContext = dbContext;
            _service = service;
            _cartStore = cartStore;
        }
        public async Task<int> AddWishlistAsync(int userId, int productId)
        {
            bool exists = await _dbContext.Wishlist
                .AnyAsync(w => w.ProductID == productId && w.CustomerID == userId);

            if (!exists)
            {
                var wl = new Wishlist
                {
                    ProductID = productId,
                    CustomerID = userId
                };

                _dbContext.Wishlist.Add(wl);
                await _dbContext.SaveChangesAsync();
                await _service.AddRecentViewAsync(userId, productId);
            }
            return await _dbContext.Wishlist.CountAsync(w => w.CustomerID == userId);
        }
        public async Task<int> DeleteAsync(int id, int userId)
        {
            var item = await _dbContext.Wishlist.FindAsync(id);
            if (item != null)
            {
                _dbContext.Wishlist.Remove(item);
                await _dbContext.SaveChangesAsync();
            }

            return await _dbContext.Wishlist.CountAsync(w => w.CustomerID == userId);
        }
        public async Task<int> RemoveAsync(int userId, int productId)
        {
            var item = await _dbContext.Wishlist.FirstOrDefaultAsync(w => w.CustomerID == userId && w.ProductID == productId);
            if (item != null)
            {
                _dbContext.Wishlist.Remove(item);
                await _dbContext.SaveChangesAsync();
            }
            return await _dbContext.Wishlist.CountAsync(w => w.CustomerID == userId);
        }
    }
}
