using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eComMgmtPortal.Entities
{
    public class genPromoRight
    {
        [Key]
        public int PromoRightID { get; set; }
        public int CategoryID { get; set; }

        [ForeignKey("CategoryID")]
        public virtual Categories? Categories { get; set; }
        public string? ImageURL { get; set; }
        public string? AltText { get; set; }
        public string? OfferTag { get; set; }
        public string? Title { get; set; }
        public bool? isDeleted { get; set; }
    }
}