namespace eComMgmtPortal.Models
{
    public class ReviewModel
    {
        public int? CustID { get; set; }
        public int? ProdID { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? ReviewText { get; set; }
        public int? Rate { get; set; }
        public DateTime? DateTime { get; set; }
    }
}
