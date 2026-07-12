using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class RecentlyViews
    {
        [Key]
        public int RViewID { get; set; }
        public int CustomerID { get; set; }
        public int ProductID { get; set; }
        public DateTime ViewDate { get; set; }
        public string Note { get; set; }
    }
}
