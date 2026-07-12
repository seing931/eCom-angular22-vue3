using eComMgmtPortal.Models;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Data;

namespace eComMgmtPortal.Services
{
    public interface IOrderService
    {
        List<OrderModel> OrderLists();
        List<OrderModel> GetById(int id);
        Task<(bool IsSuccess, int OrderId, string Message)> PlaceOrderAsync(OrderModel model);
    }
    public class OrderService: IOrderService
    {
        private readonly AppDbContext _dbContext;
        public OrderService(AppDbContext context)
        {
            _dbContext = context;
        }
        public List<OrderModel> OrderLists()
        {
            var model = _dbContext.vw_Order.Select(o => new OrderModel
            {
                OrdId = o.OrderID,
                Name = o.Name,
                PmtType=o.PaymentType,
                Disc = o.Discount,
                Taxes = o.Taxes,
                TotalAmt = o.TotalAmount,
                OrderDate = o.OrderDate
            }).ToList();
            return model;
        }
        public List<OrderModel> GetById(int id)
        {
            var model = (from o in _dbContext.Order
                         join c in _dbContext.Customers on o.CustomerID equals c.CustomerID
                         join p in _dbContext.Payment on o.PaymentID equals p.PaymentID
                         join pt in _dbContext.PaymentType on p.Type equals pt.PayTypeID
                         join s in _dbContext.ShippingDetails on o.ShippingID equals s.ShippingID
                         where o.OrderID == id
                         select new OrderModel
                         {
                             OrdId = o.OrderID,
                             PayID = o.PaymentID,
                             PayDesc = pt.TypeName,
                             ShipID = o.ShippingID,
                             Name = c.FirstName +" "+ c.LastName,
                             CustAdd = c.Address1+","+c.Address2,
                             ContactNo = s.Mobile,
                             ShipAdd= s.Address,
                             Disc = o.Discount,
                             Taxes = o.Taxes,
                             TotalAmt = o.TotalAmount,
                             isCompleted = o.isCompleted,
                             OrderDate = o.OrderDate,
                             DIspatched = o.DIspatched,
                             DispatchedDate = o.DispatchedDate,
                             Shipped = o.Shipped,
                             ShippingDate = o.ShippingDate,
                             Deliver = o.Deliver,
                             DeliveryDate = o.DeliveryDate,
                             Notes = o.Notes,
                             CancelOrder = o.CancelOrder,

                             SumAmt = _dbContext.OrderDetails
                                 .Where(x => x.OrderID == o.OrderID)
                                 .Sum(x => (decimal?)x.TotalAmount) ?? 0,

                             SumQty = _dbContext.OrderDetails
                                 .Where(x => x.OrderID == o.OrderID)
                                 .Sum(x => (int?)x.Quantity) ?? 0,

                             SumAmtAftDisc =
                                 (_dbContext.OrderDetails
                                     .Where(x => x.OrderID == o.OrderID)
                                     .Sum(x => (decimal?)x.TotalAmount) ?? 0)
                                 - o.Discount,

                             Items = _dbContext.OrderDetails
                                 .Where(x => x.OrderID == o.OrderID)
                                 .Select(x => new OrderItemsModel
                                 {
                                     OrdDetid = x.OrderDetailsID,
                                     Ordid = x.OrderID,
                                     ProdId = x.ProductID,
                                     ProdName = _dbContext.Products
                                         .Where(p => p.ProductID == x.ProductID)
                                         .Select(p => p.Name)
                                         .FirstOrDefault(),
                                     Qty = x.Quantity,
                                     UnitPrice = x.UnitPrice,
                                     Disc = x.Discount,
                                     TotalAmt = x.TotalAmount,
                                     OrderDate = x.OrderDate
                                 }).ToList()
                         }).ToList();

            return model;
        }
        public async Task<(bool IsSuccess, int OrderId, string Message)> PlaceOrderAsync(OrderModel model)
        {
            if (model == null || model.ShipDetModel == null || model.Items == null || !model.Items.Any())
            {
                return (false, 0, "Invalid order data submission payload context.");
            }

            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var shipping = new ShippingDetails
                    {
                        FirstName = model.ShipDetModel.FirstName,
                        LastName = model.ShipDetModel.LastName,
                        Email = model.ShipDetModel.Email,
                        Mobile = model.ShipDetModel.Mobile,
                        Address = model.ShipDetModel.Address,
                        Province = model.ShipDetModel.Province,
                        City = model.ShipDetModel.City,
                        PostCode = model.ShipDetModel.PostCode
                    };

                    _dbContext.ShippingDetails.Add(shipping);
                    await _dbContext.SaveChangesAsync();

                    var order = new Order
                    {
                        CustomerID = model.CustID,
                        PaymentID = model.PayID,
                        ShippingID = shipping.ShippingID,
                        Discount = model.Disc,
                        Taxes = model.Taxes ?? 0,
                        TotalAmount = model.TotalAmt,
                        isCompleted = false,
                        OrderDate = DateTime.Now,
                        CancelOrder = false,
                        DIspatched = false,
                        Shipped = false,
                        Deliver = false
                    };

                    _dbContext.Order.Add(order);
                    await _dbContext.SaveChangesAsync();

                    foreach (var item in model.Items)
                    {
                        var orderDetail = new OrderDetails
                        {
                            OrderID = order.OrderID,
                            ProductID = item.ProdId,
                            UnitPrice = item.UnitPrice,
                            Quantity = item.Qty,
                            Discount = item.Disc,
                            TotalAmount = item.TotalAmt,
                            OrderDate = DateTime.Now
                        };

                        _dbContext.OrderDetails.Add(orderDetail);
                    }

                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return (true, order.OrderID, "Transaction complete.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return (false, 0, ex.Message);
                }
            }
        }
    }
}
