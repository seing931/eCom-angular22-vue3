using eComMgmtPortal.Dtos;
using eComMgmtPortal.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace eComMgmtPortal.Models
{
    public class OrderModel
    {
        public int OrdId { get; set; }
        public int CustID { get; set; }
        public int? PayID { get; set; }
        public string? PayDesc { get; set; }
        public int? ShipID { get; set; }
        public string? Name { get; set; }
        public string? CustAdd { get; set; }
        public string? ContactNo { get; set; }
        public string? ShipAdd { get; set; }
        public string? PmtType { get; set; }
        public int? Disc { get; set; }
        public int? Taxes { get; set; }
        public int? TotalAmt { get; set; }
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
        public decimal? SumAmt { get; set; }
        public int? SumQty { get; set; }
        public decimal? SumAmtAftDisc { get; set; }
        public List<OrderItemsModel>? Items { get; set; }
        public ShipDetModel? ShipDetModel { get; set; }
    }

    public class OrderItemsModel
    {
        public int? OrdDetid { get; set; }
        public int? Ordid { get; set; }
        public int ProdId { get; set; }
        public string? ProdName { get; set; }
        public int? Qty { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? Disc { get; set; }
        public decimal? TotalAmt { get; set; }
        public DateTime? OrderDate { get; set; }
        public ProdModel? ProdModel { get; set; }
    }

    public class ShipDetModel
    {
        public int? ShipID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public string? Address { get; set; }
        public string? Province { get; set; }
        public string? City { get; set; }
        public string? PostCode { get; set; }
    }
}
