using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class admin_Login
    {
        [Key]
        public int LoginID { get; set; }
        public int EmpID { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int? RoleType { get; set; }
        public string? Notes { get; set; }
    }
}