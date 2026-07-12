using eComMgmtPortal.Data;
using eComMgmtPortal.Services;
using Microsoft.AspNetCore.Mvc;

namespace eComMgmtPortal.Controllers
{
    [ApiController]
    [Route("api/dash")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public DashboardController(AppDbContext context)
        {
            _dbContext = context;
        }

        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            return Ok(new
            {
                latestOrders = _dbContext.Order.OrderByDescending(x => x.OrderID).Take(10).ToList(),
                newOrders = _dbContext.Order.Count(a =>a.DIspatched == false && a.Shipped == false && a.Deliver == false),
                dispatchedOrders = _dbContext.Order.Count(a => a.DIspatched == true && a.Shipped == false && a.Deliver == false),
                shippedOrders = _dbContext.Order.Count(a => a.DIspatched == true && a.Shipped == true && a.Deliver == false),
                deliveredOrders = _dbContext.Order.Count(a => a.DIspatched == true && a.Shipped == true && a.Deliver == true)
            });
        }

        [HttpGet("sales-per-day")]
        public IActionResult GetSalesPerDay()
        {
            var data = _dbContext.Order
                .GroupBy(o => o.OrderDate.Value.Date)
                .Select(g => new
                {
                    date = g.Key,
                    sales = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.date).ToList();

            return Ok(data);
        }

        [HttpGet("top-products")]
        public IActionResult GetTopProducts()
        {
            var data = _dbContext.OrderDetails
                .Join(_dbContext.Products,
                    od => od.ProductID,
                    p => p.ProductID,
                    (od, p) => new { od, p })
                .GroupBy(x => x.p.Name)
                .Select(g => new
                {
                    label = g.Key,
                    value = g.Sum(x => x.od.Quantity)
                })
                .OrderByDescending(x => x.value)
                .Take(3)
                .ToList();

            return Ok(data);
        }

        [HttpGet("orders-per-day")]
        public IActionResult GetOrderPerDay()
        {
            var data = _dbContext.Order
                .GroupBy(o => o.OrderDate.Value.Date)
                .Select(g => new
                {
                    date = g.Key,
                    orders = g.Count()
                })
                .OrderBy(x => x.date).ToList();

            return Ok(data);
        }

        [HttpGet("sales-by-country")]
        public IActionResult GetSalesByCountry()
        {
            var data = (from o in _dbContext.Order
                        join c in _dbContext.Customers
                        on o.CustomerID equals c.CustomerID
                        group o by c.Country into g
                        select new
                        {
                            country = g.Key,
                            sales = g.Sum(x => x.TotalAmount)
                        })
                        .OrderByDescending(x => x.sales).Take(6).ToList();

            return Ok(data);
        }
    }
}
