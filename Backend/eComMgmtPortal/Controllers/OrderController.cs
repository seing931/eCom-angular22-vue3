using eComMgmtPortal.Models;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;
        public OrderController(IOrderService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrdLists()
        {
            var data = _service.OrderLists();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = _service.GetById(id);
            return Ok(data);
        }

        [HttpPost("place-order")]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid order data submission payload context.");
            }

            var result = await _service.PlaceOrderAsync(model);

            if (!result.IsSuccess)
            {
                if (result.OrderId == 0 && result.Message.Contains("payload"))
                {
                    return BadRequest(result.Message);
                }

                return StatusCode(500, $"Internal execution error occurred handling transactions: {result.Message}");
            }

            return Ok(new { success = true, orderId = result.OrderId, message = result.Message });
        }
    }
}
