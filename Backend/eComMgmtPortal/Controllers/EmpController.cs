using eComMgmtPortal.Models;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/emp")]
    public class EmpController : ControllerBase
    {
        private readonly IEmpService _service;
        public EmpController(IEmpService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _service.GetByIdAsync(id);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] EmpModel model)
        {
            if (model.UpdFile != null && model.UpdFile.Length > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "emp");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                string fileName = model.UpdFile.FileName;
                string fullPath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await model.UpdFile.CopyToAsync(stream);
                }

                model.PhotoPath = "/emp/"+ fileName;
            }

            var result = await _service.SaveAsync(0, model);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id,[FromForm] EmpModel model)
        {
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

            var result = await _service.SaveAsync(id, model);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}
