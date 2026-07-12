using eComMgmtPortal.Entities;

namespace eComMgmtPortal.Models
{
    public class ProdModel
    {
        public int ProdID { get; set; }
        public string Name { get; set; }
        public int SuppID { get; set; }
        public int CatID { get; set; }
        public int? SubCatID { get; set; }
        public string? SuppDesc { get; set; }
        public string? CatDesc { get; set; }
        public string? SubcatDesc { get; set; }
        public string? QtyPerUnit { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal? OldPrice { get; set; }
        public string? UnitWeight { get; set; }
        public string? Size { get; set; }
        public decimal? Disc { get; set; }
        public int? UnitInStock { get; set; }
        public int? UnitOnOrder { get; set; }
        public bool? ProductAvailable { get; set; }
        public string? ImageURL { get; set; }
        public string? AltText { get; set; }
        public bool? AddBadge { get; set; }
        public string? OfferTitle { get; set; }
        public string? OfferBadgeClass { get; set; }
        public string? ShortDesc { get; set; }
        public string? LongDesc { get; set; }
        public string? Picture1 { get; set; }
        public string? Picture2 { get; set; }
        public string? Picture3 { get; set; }
        public string? Picture4 { get; set; }
        public string? Note { get; set; }
        public IFormFile? ImageFileDef { get; set; }
        public IFormFile? ImageFile1 { get; set; }
        public IFormFile? ImageFile2 { get; set; }
        public IFormFile? ImageFile3 { get; set; }
        public IFormFile? ImageFile4 { get; set; }
    }
}
