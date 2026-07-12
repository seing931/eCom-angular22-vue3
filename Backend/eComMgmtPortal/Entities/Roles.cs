using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class Roles
    {
        [Key]
        public int RoleID { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}