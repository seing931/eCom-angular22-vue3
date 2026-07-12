using eComMgmtPortal.Data;
using eComMgmtPortal.Models;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/profile")]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IProfileService _service;
        private readonly IConfiguration _config;
        public ProfileController(AppDbContext context, IProfileService service, IConfiguration config)
        {
            _dbContext = context;
            _service = service;
            _config = config;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int Id)
        {
            var emp = await _dbContext.admin_Employee.FirstOrDefaultAsync(x => x.EmpID == Id);
            return Ok(emp);
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Edit(int id, [FromForm] EmpModel model)
        {
            model.EmpID = id;

            if (model.UpdFile != null && model.UpdFile.Length > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "emp");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var uniqueFileName = $"{id}_{Guid.NewGuid()}{Path.GetExtension(model.UpdFile.FileName)}";
                var fullFilePath = Path.Combine(folderPath, uniqueFileName);

                using (var stream = new FileStream(fullFilePath, FileMode.Create))
                {
                    await model.UpdFile.CopyToAsync(stream);
                }
                model.PhotoPath = "/emp/" + uniqueFileName;
            }
            var result = await _service.SaveAsync(model);
            return Ok(result);
        }
    }
}
