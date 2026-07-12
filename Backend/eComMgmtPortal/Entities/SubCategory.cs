using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eComMgmtPortal.Entities
{
    public class SubCategory
    {
        [Key]
        public int SubCategoryID { get; set; }
        public int CategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Picture1 { get; set; }
        public string? Picture2 { get; set; }
        public bool? isActive { get; set; }

        [ForeignKey("CategoryID")]
        public Categories Categories { get; set; }
        public ICollection<Products> Products { get; set; }
    }
}