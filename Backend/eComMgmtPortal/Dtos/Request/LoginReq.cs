namespace eComMgmtPortal.Dtos.Request
{
    public class LoginReq
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool? RememberMe { get; set; }
    }
}
