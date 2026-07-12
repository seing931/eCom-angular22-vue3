using eComMgmtPortal.Data;
using eComMgmtPortal.Dtos.Request;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IAuthService _authService;
        public AuthController(AppDbContext context, IAuthService authService)
        {
            _dbContext = context;
            _authService = authService;
        }

        #region eCom Management Portal

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginReq request)
        {
            var result = await _authService.LoginAsync(request);
            if (result == null)
                return Unauthorized("Invalid credentials");

            return Ok(result);
        }

        [HttpGet("menu")]
        public async Task<IActionResult> GetMenu(string? cat)
        {
            var result = await _dbContext.Menu.Where(x => x.Category == cat)
                .OrderBy(x => x.OrderNo).ToListAsync();

            return Ok(result);
        }

        [HttpGet("supp")]
        public IActionResult GetSuppliers()
        {
            var data = _dbContext.Suppliers.Select(x => new {
                            suppID = x.SupplierID,
                            suppName = x.CompanyName
                        }).ToList();

            return Ok(data);
        }

        [HttpGet("cat")]
        public IActionResult GetCategories()
        {
            var data = _dbContext.Categories.Select(x => new {
                        catID = x.CategoryID,
                        catName = x.Name
                    }).ToList();

            return Ok(data);
        }

        [HttpGet("subcat")]
        public IActionResult GetSubCategories([FromQuery] int catId)
        {
            var data = _dbContext.SubCategory
                .Where(x => x.CategoryID == catId)
                .Select(x => new {
                    subCatID = x.SubCategoryID,
                    subCatName = x.Name
                }).ToList();

            return Ok(data);
        }
        #endregion

        [HttpPost("clogin")]
        public async Task<IActionResult> ClientLogin(LoginReq request)
        {
            var result = await _authService.ClientLoginAsync(request);
            if (result == null)
                return Unauthorized("Invalid Username or Password");

            return Ok(result);
        }

        [HttpPost("reg")]
        public async Task<IActionResult> Register(RegReq request)
        {
            bool userExists = await _authService.UsernameExistsAsync(request.UserName);

            if (userExists) 
                return BadRequest("This Username is already taken");

            var success = await _authService.RegClientAsync(request);
            if (!success) 
                return BadRequest("Registration failed due to a server error.");

            var user = await _dbContext.Customers.FirstOrDefaultAsync(x => x.UserName == request.UserName);

            return Ok(new
            {
                message = "User registered successfully!",
                id = user.CustomerID,
                username = user.UserName
            });
        }

        [HttpGet("pay")]
        public IActionResult GetPayment()
        {
            var data = _dbContext.PaymentType.Select(x => new {
                typeID = x.PayTypeID,
                typeName = x.TypeName
            }).ToList();

            return Ok(data);
        }
    }
}
