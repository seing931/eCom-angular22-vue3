using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eComMgmtPortal.Entities
{
    public class Wishlist
    {
        [Key]
        public int WishlistID { get; set; }
        public int CustomerID { get; set; }
        public int ProductID { get; set; }
        public bool? isActive { get; set; }

        [ForeignKey("ProductID")]
        public virtual Products Products { get; set; }
    }
}