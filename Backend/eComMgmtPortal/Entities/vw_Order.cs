using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class vw_Order
    {
        [Key]
        public int OrderID { get; set; }
        public string? Name { get; set; }
        public string? PaymentType { get; set; }
        public int? Discount { get; set; }
        public int? Taxes { get; set; }
        public int? TotalAmount { get; set; }
        public DateTime? OrderDate { get; set; }
    }
}
