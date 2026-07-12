using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class Suppliers
    {
        [Key]
        public int SupplierID { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactName { get; set; }
        public string? ContactTitle { get; set; }
        public string? Address { get; set; }
        public string? Mobile { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string? Fax { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? Country { get; set; }
    }
}