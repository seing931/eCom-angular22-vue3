using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class Products
    {
        [Key]
        public int ProductID { get; set; }
        public string Name { get; set; } = string.Empty;
        public int SupplierID { get; set; }
        public int CategoryID { get; set; }
        public int? SubCategoryID { get; set; }
        public string? QuantityPerUnit { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? OldPrice { get; set; }
        public string? UnitWeight { get; set; }
        public string? Size { get; set; }
        public decimal? Discount { get; set; }
        public int? UnitInStock { get; set; }
        public int? UnitOnOrder { get; set; }
        public bool? ProductAvailable { get; set; }
        public string? ImageURL { get; set; }
        public string? AltText { get; set; }
        public bool? AddBadge { get; set; }
        public string? OfferTitle { get; set; }
        public string? OfferBadgeClass { get; set; }
        public string? ShortDescription { get; set; }
        public string? LongDescription { get; set; }
        public string? Picture1 { get; set; }
        public string? Picture2 { get; set; }
        public string? Picture3 { get; set; }
        public string? Picture4 { get; set; }
        public string? Note { get; set; } 
        public Categories Categories { get; set; }
        public SubCategory SubCategory { get; set; }
    }
}