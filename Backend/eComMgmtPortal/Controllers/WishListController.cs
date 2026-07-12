using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/wishlist")]
    public class WishListController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IWishListService _service;
        public WishListController(AppDbContext context,IWishListService service)
        {
            _dbContext = context;
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetWishlist([FromQuery]int userId)
        {
            var wishlistProducts = await _dbContext.Wishlist
                    .Include(x => x.Products)
                    .Where(x => x.CustomerID == userId)
                    .ToListAsync();

            return Ok(wishlistProducts);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddWishlist([FromQuery] int userId, [FromQuery] int productId)
        {
            int newCount = await _service.AddWishlistAsync(userId, productId);
            return Ok(new
            {
                wlcount = newCount,
                Message = "Added to Wishlist Successfully"
            });
        }

        [HttpDelete("del")]
        public async Task<IActionResult>Delete([FromQuery] int id, [FromQuery] int userId)
        {
            int newCount = await _service.DeleteAsync(id, userId);

            return Ok(new
            {
                wlcount = newCount,
                Message = "Item Removed Successfully"
            });
        }

        [HttpDelete("remove")]
        public async Task<IActionResult>Remove([FromQuery] int userId, [FromQuery] int productId)
        {
            var newCount = await _service.RemoveAsync(userId, productId);

            return Ok(new
            {
                wlcount = newCount,
                Message = "Item Removed Successfully"
            });
        }
    }
}
