using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eComMgmtPortal.Entities
{
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }
        public int? CustomerID { get; set; }
        public int? ProductID { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? ReviewText { get; set; }
        public int? Rate { get; set; }
        public DateTime? DateTime { get; set; }
        public bool? isDelete { get; set; }

        [ForeignKey("CustomerID")]
        public Customers? Customers { get; set; }
    }
}