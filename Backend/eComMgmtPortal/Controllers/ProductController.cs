using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/prod")]
    public class ProductController : ControllerBase
    {
        private readonly IProdService _service;
        private readonly AppDbContext _dbContext;
        public ProductController(IProdService service, AppDbContext context)
        {
            _service = service;
            _dbContext = context;
        }

        #region eCom Management Portal

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] ProdModel model)
        {
            var categoryName = await _dbContext.Categories
                              .Where(c => c.CategoryID == model.CatID)
                              .Select(c => c.Name)
                              .FirstOrDefaultAsync();

            string folderName = !string.IsNullOrEmpty(categoryName) ? categoryName : "";
            var targetFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "prod", folderName);

            if (!Directory.Exists(targetFolder))
            {
                Directory.CreateDirectory(targetFolder);
            }

            model.ImageURL = await _service.SaveImageAsync(model.ImageFileDef, targetFolder, folderName);
            model.Picture1 = await _service.SaveImageAsync(model.ImageFile1, targetFolder, folderName);
            model.Picture2 = await _service.SaveImageAsync(model.ImageFile2, targetFolder, folderName);
            model.Picture3 = await _service.SaveImageAsync(model.ImageFile3, targetFolder, folderName);
            model.Picture4 = await _service.SaveImageAsync(model.ImageFile4, targetFolder, folderName);

            var result = await _service.SaveAsync(0, model);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] ProdModel model)
        {
            var existingProduct = await _dbContext.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound("Product not found");
            }

            var categoryName = await _dbContext.Categories
                            .Where(c => c.CategoryID == model.CatID)
                            .Select(c => c.Name)
                            .FirstOrDefaultAsync();

            string folderName = !string.IsNullOrEmpty(categoryName) ? categoryName : "";

            var targetFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "prod", folderName);

            if (!Directory.Exists(targetFolder))
            {
                Directory.CreateDirectory(targetFolder);
            }

            model.ImageURL = await _service.EditImageAsync(model.ImageFileDef, targetFolder, folderName, existingProduct.ImageURL);
            model.Picture1 = await _service.EditImageAsync(model.ImageFile1, targetFolder, folderName, existingProduct.Picture1);
            model.Picture2 = await _service.EditImageAsync(model.ImageFile2, targetFolder, folderName, existingProduct.Picture2);
            model.Picture3 = await _service.EditImageAsync(model.ImageFile3, targetFolder, folderName, existingProduct.Picture3);
            model.Picture4 = await _service.EditImageAsync(model.ImageFile4, targetFolder, folderName, existingProduct.Picture4);

            var result = await _service.SaveAsync(id, model);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }

        #endregion


        [HttpGet("menu")]
        public async Task<IActionResult> GetMenu()
        {
            var result = await _dbContext.Categories
                .Select(c => new
                {
                    c.CategoryID,
                    c.Name,
                    SubCategories = c.SubCategory.Select(s => new
                    {
                        s.SubCategoryID,
                        s.Name
                    })
                }).Take(8).ToListAsync();

            return Ok(result);
        }

        [HttpGet("sidebar")]
        public async Task<IActionResult> GetSidebar([FromQuery] int usrid)
        {
            var categories = await _dbContext.Categories.Select(c => c.Name).ToListAsync();
            var topProducts = await _service.GetTopSoldProductsAsync();
            var recentProducts = await _service.GetRecentViewProductsAsync(usrid);

            return Ok(new
            {
                Categories = categories,
                TopProducts = topProducts,
                RecentProducts = recentProducts
            });
        }

        [HttpGet("filter")]
        public async Task<ActionResult<Products>> GetProducts([FromQuery] string cat,[FromQuery] string subCat, [FromQuery] int page, [FromQuery] int pageSize)
        {
            var products = await _dbContext.Products
                            .Include(p => p.Categories)
                            .Include(p => p.SubCategory)
                            .Where(p => p.Categories.Name == cat && p.SubCategory.Name == subCat)
                            .Skip((page - 1) * pageSize)
                            .Take(pageSize)
                            .Select(p => new
                            {
                                p.ProductID,
                                p.ImageURL,
                                p.Name,
                                p.UnitInStock,
                                p.UnitPrice,
                                p.OldPrice,
                                p.OfferTitle
                            })
                            .ToListAsync();

            return Ok(new { items = products, meta = new { page, pageSize } });
        }

        [HttpGet("filter-cat")]
        public async Task<IActionResult> GetProdsByCategory([FromQuery]string cat, [FromQuery] int page, [FromQuery] int pageSize)
        {
            var products = await _dbContext.Products.Include(p => p.Categories).
                Where(p => p.Categories.Name == cat)
               .Skip((page - 1) * pageSize)
               .Take(pageSize).ToListAsync();

            return Ok(new { items = products, meta = new { page, pageSize } });
        }

        [HttpGet("filter-by-price")]
        public async Task<IActionResult> FilterByPrice([FromQuery] string cat,[FromQuery] string subCat,[FromQuery] int minPrice, [FromQuery] int maxPrice, [FromQuery] int page, [FromQuery] int pageSize)
        {
            List<Products> products;

            if (subCat == "0")
            {
                products = await _dbContext.Products
                    .Include(p => p.Categories)
                    .Where(p =>
                        p.Categories.Name == cat &&
                        p.UnitPrice >= minPrice &&
                        p.UnitPrice <= maxPrice)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }
            else
            {
                products = await _dbContext.Products
                    .Include(p => p.Categories)
                    .Include(p => p.SubCategory)
                    .Where(p =>
                        p.Categories.Name == cat &&
                        p.SubCategory.Name == subCat &&
                        p.UnitPrice >= minPrice &&
                        p.UnitPrice <= maxPrice)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }

            return Ok(new { items = products, meta = new { page, pageSize } });
        }

        [HttpGet("filter-by-prod")]
        public async Task<IActionResult> FilterByProdsName([FromQuery] string term, [FromQuery] int page, [FromQuery] int pageSize)
        {
            var query = _dbContext.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(term))
            {
                query = query.Where(x => x.Name.ToLower().Contains(term.ToLower()));
            }

            var totalItems = await query.CountAsync();

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.ProductID,
                    p.ImageURL,
                    p.Name,
                    p.UnitInStock,
                    p.UnitPrice,
                    p.OldPrice,
                    p.OfferTitle
                })
                .ToListAsync();

            return Ok(new { items = products, meta = new { page, pageSize } });
            //totalItems, // Helpful for pagination UI later!
            //totalPages = (int)Math.Ceiling((double)totalItems / pageSize)
        }

        [HttpGet("view")]
        public async Task<ActionResult> ViewDet([FromQuery] int id)
        {
            var product = await _dbContext.Products
                                .Where(p => p.ProductID == id)
                                .Select(p => new
                                {
                                    p.ProductID,
                                    p.ImageURL,
                                    p.AltText,
                                    p.Name,
                                    p.UnitInStock,
                                    p.UnitPrice,
                                    p.ShortDescription,
                                    p.LongDescription
                                })
                                .FirstOrDefaultAsync();


            var reviews = await _dbContext.Review
                .Where(x => x.ProductID == id)
                .Select(x => new
                {
                    x.Name,
                    x.DateTime,
                    x.Rate,
                    x.ReviewText,
                    Picture = x.Customers != null ? x.Customers.Picture : null,
                    LastName= x.Customers != null ? x.Customers.LastName : null
                })
                .ToListAsync();

            int totalReviews = reviews.Count;
            int totalRate = reviews.Sum(x => x.Rate ?? 0);
            double avgRate = totalReviews > 0 ? (double)totalRate / totalReviews : 0;
            var relatedprd = await _dbContext.Products
                        .Where(p => p.CategoryID == _dbContext.Products
                                                    .Where(x => x.ProductID == id)
                                                    .Select(x => x.CategoryID)
                                                    .FirstOrDefault())
                        .Take(20)
                        .Select(p => new
                        {
                            p.ProductID,
                            p.ImageURL,
                            p.AltText,
                            p.Name,
                            p.UnitPrice
                        }).ToListAsync();

            return Ok(new
            {
                product,reviews,relatedprd,totalReviews,avgRate = Math.Round(avgRate, 1) // Rounds to 1 decimal place (e.g., 4.3)
            });
        }

        [HttpPost("review")]
        public async Task<IActionResult> AddReview([FromForm] ReviewModel model)
        {
            var valid = await _service.AddReviewAsync(model);

            if (valid == 0 || valid == null) return NotFound();
            return Ok(new
            {
                Message = "Add review successfully"
            });
        }
    }
}
