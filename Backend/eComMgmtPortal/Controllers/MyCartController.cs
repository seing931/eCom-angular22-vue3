using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/mycart")]
    public class MyCartController : ControllerBase
    {
        private readonly ICartService _service;
        private readonly AppDbContext _dbContext;
        public MyCartController(ICartService service, AppDbContext context)
        {
            _service = service;
            _dbContext = context;
        }

        [HttpPost("remove")]
        public async Task<IActionResult> Remove([FromQuery] int userId, [FromQuery] int productId)
        {
            var updatedCart = await _service.RemoveItemAsync(userId, productId);
            return Ok(updatedCart);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromQuery] int userId, [FromQuery] int productId)
        {
            var updatedCart = await _service.AddItemAsync(userId, productId);
            return Ok(updatedCart);
        }

        [HttpPost("bal-qty")]
        public async Task<IActionResult> GetStockBalances([FromBody] List<int> productIds)
        {
            if (productIds == null || !productIds.Any())
                return Ok(new Dictionary<int, int>());

            var stocks = await _dbContext.Products.Where(p => productIds.Contains(p.ProductID))
                .ToDictionaryAsync(p => p.ProductID, p => p.UnitInStock);

            return Ok(stocks); 
        }

        [HttpGet("chkout")]
        public async Task<IActionResult> Checkout([FromQuery] int userId)
        {
            var result = await _service.SelectCartAsync(userId);
            return Ok(new{ result });
        }
    }
}
