using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class Payment
    {
        [Key]
        public int PaymentID { get; set; }
        public int Type { get; set; }
        public decimal? CreditAmount { get; set; }
        public decimal? DebitAmount { get; set; }
        public decimal? Balance { get; set; }
        public DateTime? PaymentDateTime { get; set; }
    }
}