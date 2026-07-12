using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class Order
    {
        [Key]
        public int OrderID { get; set; }
        public int CustomerID { get; set; }
        public int? PaymentID { get; set; }
        public int? ShippingID { get; set; }
        public int? Discount { get; set; }
        public int? Taxes { get; set; }
        public int? TotalAmount { get; set; }
        public bool? isCompleted { get; set; }
        public DateTime? OrderDate { get; set; }
        public bool? DIspatched { get; set; }
        public DateTime? DispatchedDate { get; set; }
        public bool? Shipped { get; set; }
        public DateTime? ShippingDate { get; set; }
        public bool? Deliver { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? Notes { get; set; }
        public bool? CancelOrder { get; set; }
    }
}