using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class admin_Employee
    {
        [Key]
        public int EmpID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public int? Age { get; set; }
        public DateTime? DateofBirth { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string Mobile { get; set; } = string.Empty;
        public string? PhotoPath { get; set; }
    }
}