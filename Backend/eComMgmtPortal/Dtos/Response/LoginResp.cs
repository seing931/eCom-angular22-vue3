using eComMgmtPortal.Models;

namespace eComMgmtPortal.Dtos.Response
{
    public class LoginResp
    {
        public string Token { get; set; }
        public string Username { get; set; }
        public int Role { get; set; }
        public int Id { get; set; }
        public bool? RememberMe { get; set; }
    }
}
