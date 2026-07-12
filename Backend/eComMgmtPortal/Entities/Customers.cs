using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class Customers
    {
        [Key]
        public int CustomerID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateofBirth { get; set; }
        public string? Organization { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Email { get; set; }
        public string? AltEmail { get; set; }
        public string? Phone1 { get; set; }
        public string? Phone2 { get; set; }
        public string? Mobile1 { get; set; }
        public string? Mobile2 { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Picture { get; set; }
        public string? Status { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime? Created { get; set; }
        public string? Notes { get; set; }
    }
}