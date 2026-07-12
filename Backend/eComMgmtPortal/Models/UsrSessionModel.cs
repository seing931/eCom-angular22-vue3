namespace eComMgmtPortal.Models
{
    public class UsrSessionModel
    {
        public int UserID { get; set; }
        public List<OrderItemsModel> Items { get; set; } = new List<OrderItemsModel>();
        public int SubTotal { get; set; }
        public int Discount { get; set; }
        public int TtlAmt { get; set; }
        public int MyCartCount { get; set; }
        public int WishlistCount { get; set; }
    }
}
