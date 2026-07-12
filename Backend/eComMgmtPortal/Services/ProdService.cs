using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Services
{
    public interface IProdService
    {
        Task<List<ProdModel>> GetAllAsync();
        Task<ProdModel> GetByIdAsync(int id);
        Task<int> SaveAsync(int id, ProdModel model);
        Task<string?> SaveImageAsync(IFormFile? file, string targetFolder, string folderName);
        Task<string?> EditImageAsync(IFormFile? newFile, string targetFolder, string folderName, string? existingPath);
        Task DeleteAsync(int id);
        Task<List<TopSoldProdModel>> GetTopSoldProductsAsync();
        Task<IEnumerable<Products>> GetRecentViewProductsAsync(int usrid);
        Task<int> AddReviewAsync(ReviewModel model);
    }
    public class ProdService : IProdService
    {
        private readonly AppDbContext _dbContext;

        public ProdService(AppDbContext context)
        {
            _dbContext = context;
        }

        public async Task<List<ProdModel>> GetAllAsync()
        {
            var data = await _dbContext.Products.ToListAsync();

            return data.Select(x => new ProdModel
            {
                ProdID = x.ProductID,
                Name = x.Name,
                SuppID = x.SupplierID,
                CatID = x.CategoryID,
                SubCatID = x.SubCategoryID,
                QtyPerUnit = x.QuantityPerUnit,
                UnitPrice = x.UnitPrice,
                OldPrice = x.OldPrice,
                UnitWeight = x.UnitWeight,
                Size = x.Size,
                Disc = x.Discount,
                UnitInStock = x.UnitInStock,
                UnitOnOrder = x.UnitOnOrder,
                ProductAvailable = x.ProductAvailable,
                ImageURL = x.ImageURL,
                AltText = x.AltText,
                AddBadge = x.AddBadge,
                OfferTitle = x.OfferTitle,
                OfferBadgeClass = x.OfferBadgeClass,
                ShortDesc = x.ShortDescription,
                LongDesc = x.LongDescription,
                Picture1 = x.Picture1,
                Picture2 = x.Picture2,
                Picture3 = x.Picture3,
                Picture4 = x.Picture4,
                Note = x.Note,
            }).ToList();
        }

        public async Task<ProdModel> GetByIdAsync(int id)
        {
            var x = await (
                from p in _dbContext.Products
                join s in _dbContext.Suppliers
                    on p.SupplierID equals s.SupplierID
                join c in _dbContext.Categories
                    on p.CategoryID equals c.CategoryID
                join sc in _dbContext.SubCategory
                    on p.SubCategoryID equals sc.SubCategoryID
                where p.ProductID == id
                select new ProdModel
                {
                    ProdID = p.ProductID,
                    Name = p.Name,
                    SuppID = p.SupplierID,
                    CatID = p.CategoryID,
                    SubCatID = p.SubCategoryID,
                    SuppDesc = s.CompanyName,      
                    CatDesc = c.Name,      
                    SubcatDesc = sc.Name,    
                    QtyPerUnit = p.QuantityPerUnit,
                    UnitPrice = p.UnitPrice,
                    OldPrice = p.OldPrice,
                    UnitWeight = p.UnitWeight,
                    Size = p.Size,
                    Disc = p.Discount,
                    UnitInStock = p.UnitInStock,
                    UnitOnOrder = p.UnitOnOrder,
                    ProductAvailable = p.ProductAvailable,
                    ImageURL = p.ImageURL,
                    AltText = p.AltText,
                    AddBadge = p.AddBadge,
                    OfferTitle = p.OfferTitle,
                    OfferBadgeClass = p.OfferBadgeClass,
                    ShortDesc = p.ShortDescription,
                    LongDesc = p.LongDescription,
                    Picture1 = p.Picture1,
                    Picture2 = p.Picture2,
                    Picture3 = p.Picture3,
                    Picture4 = p.Picture4,
                    Note = p.Note
                }
            ).FirstOrDefaultAsync();
            return x;
        }

        public async Task<int> SaveAsync(int id, ProdModel model)
        {
            if (id > 0)
            {
                var existEntity = _dbContext.Products.Find(model.ProdID);
                existEntity.ProductID = model.ProdID;
                existEntity.Name = model.Name;
                existEntity.SupplierID = model.SuppID;
                existEntity.CategoryID = model.CatID;
                existEntity.SubCategoryID = model.SubCatID;
                existEntity.QuantityPerUnit = model.QtyPerUnit;
                existEntity.UnitPrice = model.UnitPrice;
                existEntity.OldPrice = model.OldPrice;
                existEntity.UnitWeight = model.UnitWeight;
                existEntity.Size = model.Size;
                existEntity.Discount = model.Disc;
                existEntity.UnitInStock = model.UnitInStock;
                existEntity.UnitOnOrder = model.UnitOnOrder;
                existEntity.ProductAvailable = model.ProductAvailable;
                existEntity.ImageURL = model.ImageURL;
                existEntity.AltText = model.AltText;
                existEntity.AddBadge = model.AddBadge;
                existEntity.OfferTitle = model.OfferTitle;
                existEntity.OfferBadgeClass = model.OfferBadgeClass;
                existEntity.ShortDescription = model.ShortDesc;
                existEntity.LongDescription = model.LongDesc;
                existEntity.Picture1 = model.Picture1;
                existEntity.Picture2 = model.Picture2;
                existEntity.Picture3 = model.Picture3;
                existEntity.Picture4 = model.Picture4;
                existEntity.Note = model.Note;
                await _dbContext.SaveChangesAsync();
                return (int)existEntity.SupplierID;
            }
            else
            {
                Products newEntity = new Products();
                newEntity.ProductID = model.ProdID;
                newEntity.Name = model.Name;
                newEntity.SupplierID = model.SuppID;
                newEntity.CategoryID = model.CatID;
                newEntity.SubCategoryID = model.SubCatID;
                newEntity.QuantityPerUnit = model.QtyPerUnit;
                newEntity.UnitPrice = model.UnitPrice;
                newEntity.OldPrice = model.OldPrice;
                newEntity.UnitWeight = model.UnitWeight;
                newEntity.Size = model.Size;
                newEntity.Discount = model.Disc;
                newEntity.UnitInStock = model.UnitInStock;
                newEntity.UnitOnOrder = model.UnitOnOrder;
                newEntity.ProductAvailable = model.ProductAvailable;
                newEntity.ImageURL = model.ImageURL;
                newEntity.AltText = model.AltText;
                newEntity.AddBadge = model.AddBadge;
                newEntity.OfferTitle = model.OfferTitle;
                newEntity.OfferBadgeClass = model.OfferBadgeClass;
                newEntity.ShortDescription = model.ShortDesc;
                newEntity.LongDescription = model.LongDesc;
                newEntity.Picture1 = model.Picture1;
                newEntity.Picture2 = model.Picture2;
                newEntity.Picture3 = model.Picture3;
                newEntity.Picture4 = model.Picture4;
                newEntity.Note = model.Note;
                _dbContext.Products.Add(newEntity);
                await _dbContext.SaveChangesAsync();
                return (int)newEntity.SupplierID;
            }
        }

        public async Task<string?> SaveImageAsync(IFormFile? file, string targetFolder, string folderName)
        {
            if (file == null || file.Length == 0)
            {
                return null; 
            }

            var filename = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(targetFolder, filename);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return string.IsNullOrEmpty(folderName)
                ? $"/prod/{filename}"
                : $"/prod/{folderName}/{filename}";
        }

        public async Task<string?> EditImageAsync(IFormFile? newFile, string targetFolder, string folderName, string? existingPath)
        {
            if (newFile == null || newFile.Length == 0)
            {
                return existingPath;
            }

            var filename = Guid.NewGuid().ToString() + Path.GetExtension(newFile.FileName);
            var filePath = Path.Combine(targetFolder, filename);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await newFile.CopyToAsync(stream);
            }

            return string.IsNullOrEmpty(folderName)
                ? $"/prod/{filename}"
                : $"/prod/{folderName}/{filename}";
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _dbContext.Products.FindAsync(id);
            if (entity != null)
            {
                _dbContext.Products.Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<List<TopSoldProdModel>> GetTopSoldProductsAsync()
        {
            var prodList = await _dbContext.OrderDetails
                .GroupBy(p => p.ProductID)
                .Select(g => new { pID = g.Key, sold = g.Sum(x => x.Quantity) })
                .OrderByDescending(y => y.sold)
                .Take(3)
                .ToListAsync();

            List<TopSoldProdModel> topSoldProds = new List<TopSoldProdModel>();
            foreach (var item in prodList)
            {
                var product = await _dbContext.Products.FindAsync(item.pID);
                topSoldProds.Add(new TopSoldProdModel
                {
                    product = product,
                    CountSold = Convert.ToInt32(item.sold)
                });
            }
            return topSoldProds;
        }

        public async Task<IEnumerable<Products>> GetRecentViewProductsAsync(int usrid)
        {
            if (usrid > 0)
            {
                var top3ProductIds = await _dbContext.RecentlyViews
                    .Where(r => r.CustomerID == usrid)
                    .OrderByDescending(r => r.ViewDate)
                    .Select(r => r.ProductID)
                    .Take(3)
                    .ToListAsync();

                return await _dbContext.Products
                    .Where(x => top3ProductIds.Contains(x.ProductID))
                    .ToListAsync();
            }

            return await _dbContext.Products
                .OrderByDescending(x => x.UnitPrice)
                .Take(3)
                .ToListAsync();
        }

        public async Task<int> AddReviewAsync(ReviewModel model)
        {
            Review newEntity = new Review();
            _dbContext.Review.Add(newEntity);
            newEntity.CustomerID = model.CustID;
            newEntity.ProductID = model.ProdID;
            newEntity.Name = model.Name;
            newEntity.Email = model.Email;
            newEntity.ReviewText = model.ReviewText;
            newEntity.Rate = model.Rate;
            newEntity.DateTime = DateTime.Now;
            await _dbContext.SaveChangesAsync();
            return (int)newEntity.ReviewID;
        }
    }
}
