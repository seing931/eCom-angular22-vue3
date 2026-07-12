using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class PaymentType
    {
        [Key]
        public int PayTypeID { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}