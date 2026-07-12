using eComMgmtPortal.Data;
using eComMgmtPortal.Dtos.Request;
using eComMgmtPortal.Dtos.Response;
using eComMgmtPortal.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace eComMgmtPortal.Services
{
    public interface IAuthService
    {
        Task<LoginResp?> LoginAsync(LoginReq request);
        Task<LoginResp?> ClientLoginAsync(LoginReq request);
        Task<bool> UsernameExistsAsync(string username);
        Task<bool> RegClientAsync(RegReq request);
    }
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _config;
        public AuthService(AppDbContext context,IConfiguration configuration)
        {
            _dbContext = context;
            _config = configuration;
        }
        public async Task<LoginResp?> LoginAsync(LoginReq request)
        {
            var user = await _dbContext.admin_Login.FirstOrDefaultAsync(x => x.UserName == request.Username);
            if (user == null) return null;
            var valid = BCrypt.Net.BCrypt.Verify(request.Password,user.PasswordHash);

            if (!valid) return null;

            var claims = new[]
            {
                new Claim("userid", user.LoginID.ToString()),
                new Claim("username", user.UserName),
                new Claim("empid", user.EmpID.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds =new SigningCredentials(key,SecurityAlgorithms.HmacSha256);
            var token =new JwtSecurityToken(claims: claims,expires: DateTime.Now.AddHours(8),signingCredentials: creds);

            return new LoginResp
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Username = user.UserName,
                Role = (int)user.RoleType,
                Id = user.EmpID,
                RememberMe = request.RememberMe ?? false
            };
        }
        public async Task<LoginResp?> ClientLoginAsync(LoginReq request)
        {
            var user = await _dbContext.Customers.FirstOrDefaultAsync(x => x.UserName == request.Username);
            if (user == null) return null;
            var valid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!valid) return null;

            var claims = new[]
            {
                new Claim("userid", user.CustomerID.ToString()),
                new Claim("username", user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddHours(8), signingCredentials: creds);

            return new LoginResp
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Username = user.UserName,
                Id = user.CustomerID,
                RememberMe = request.RememberMe ?? false
            };
        }
        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _dbContext.Customers.AnyAsync(u => u.UserName == username);
        }
        public async Task<bool> RegClientAsync(RegReq request)
        {
            if (await _dbContext.Customers.AnyAsync(u => u.UserName == request.UserName))
                return false;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new Customers 
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.UserName,
                PasswordHash = passwordHash, 
                Email = request.Email,
                Mobile1 = request.Mobile1,
                Address1 = request.Address1
            };

            _dbContext.Customers.Add(newUser);
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
