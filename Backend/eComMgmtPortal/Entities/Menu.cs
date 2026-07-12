using System.ComponentModel.DataAnnotations;

namespace eComMgmtPortal.Entities
{
    public class Menu
    {
        [Key]
        public int MenuID { get; set; }
        public string? Category { get; set; }
        public string? Name { get; set; }
        public string? Icon { get; set; }
        public string? Url { get; set; }
        public int? OrderNo { get; set; }
    }
}
