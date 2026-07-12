using eComMgmtPortal.Data;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/home")]
    public class HomeController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly ICartService _service;
        public HomeController(AppDbContext context, ICartService service)
        {
            _dbContext = context;
            _service = service;
        }

        [HttpGet("index")]
        public async Task<IActionResult> Index()
        {
            var men = _dbContext.Products.Include(p => p.Categories).Where(p => p.Categories.Name == "Men").ToList();
            var women = _dbContext.Products.Include(p => p.Categories).Where(p => p.Categories.Name == "Women").ToList();
            var sports = _dbContext.Products.Include(p => p.Categories).Where(p => p.Categories.Name == "Sports").ToList();
            var electronics = _dbContext.Products.Include(p => p.Categories).Where(p => p.Categories.Name == "Phones").ToList();
            var slider = _dbContext.genMainSlider.ToList();
            var promo = await _dbContext.genPromoRight.Include(p => p.Categories) 
                    .Select(p => new
                    {
                        p.PromoRightID,
                        p.ImageURL,
                        p.AltText,
                        p.OfferTag,
                        p.Title,
                        Name = p.Categories != null ? p.Categories.Name : "No Category"
                    }).ToListAsync();
            return Ok(new
            {
                MenProduct = men,
                WomenProduct = women,
                SportsProduct = sports,
                ElectronicsProduct = electronics,
                Slider = slider,
                PromoRight = promo
            });
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> Count([FromQuery] int usrid)
        {
            var count = await _dbContext.Wishlist
                .Where(x => x.CustomerID == usrid)
                .CountAsync();

            return Ok(count);
        }
    }
}
