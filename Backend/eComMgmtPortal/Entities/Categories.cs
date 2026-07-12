using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class Categories
    {
        [Key]
        public int CategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Picture1 { get; set; }
        public string? Picture2 { get; set; }
        public bool? isActive { get; set; }
        public ICollection<Products> Products { get; set; }
        public ICollection<SubCategory> SubCategory { get; set; }
    }
}
