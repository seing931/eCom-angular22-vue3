using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Services
{
    public interface ISupplierService
    {
        Task<List<SupplierModel>> GetAllAsync();
        Task<SupplierModel> GetByIdAsync(int id);
        Task<int> SaveAsync(int id, SupplierModel model);
        Task DeleteAsync(int id);
    }
    public class SupplierService: ISupplierService
    {
        private readonly AppDbContext _dbContext;

        public SupplierService(AppDbContext context)
        {
            _dbContext = context;
        }

        public async Task<List<SupplierModel>> GetAllAsync()
        {
            var data = await _dbContext.Suppliers.ToListAsync();

            return data.Select(x => new SupplierModel
            {
                SuppId = x.SupplierID,
                CompName = x.CompanyName,
                ContactName = x.ContactName,
                ContactTitle = x.ContactTitle,
                Address = x.Address,
                Mobile = x.Mobile,
                Phone = x.Phone,
                Fax = x.Fax,
                Email = x.Email,
                City = x.City,
                Country = x.Country
            }).ToList();
        }

        public async Task<SupplierModel> GetByIdAsync(int id)
        {
            var x = await _dbContext.Suppliers.FindAsync(id);
            if (x == null) return null;
            return new SupplierModel
            {
                SuppId = x.SupplierID,
                CompName = x.CompanyName,
                ContactName = x.ContactName,
                ContactTitle = x.ContactTitle,
                Address = x.Address,
                Mobile = x.Mobile,
                Phone = x.Phone,
                Fax = x.Fax,
                Email = x.Email,
                City = x.City,
                Country = x.Country
            };
        }

        public async Task<int> SaveAsync(int id, SupplierModel model)
        {
            if (id > 0)
            {
                var existEntity = _dbContext.Suppliers.Find(model.SuppId);
                existEntity.CompanyName = model.CompName;
                existEntity.ContactName = model.ContactName;
                existEntity.ContactTitle = model.ContactTitle;
                existEntity.Address = model.Address;
                existEntity.Mobile = model.Mobile;
                existEntity.Phone = model.Phone;
                existEntity.Fax = model.Fax;
                existEntity.Email = model.Email;
                existEntity.City = model.City;
                existEntity.Country = model.Country;
                await _dbContext.SaveChangesAsync();
                return (int)existEntity.SupplierID;

            }
            else
            {
                Suppliers newEntity = new Suppliers();
                newEntity.CompanyName = model.CompName;
                newEntity.ContactName = model.ContactName;
                newEntity.ContactTitle = model.ContactTitle;
                newEntity.Address = model.Address;
                newEntity.Mobile = model.Mobile;
                newEntity.Phone = model.Phone;
                newEntity.Fax = model.Fax;
                newEntity.Email = model.Email;
                newEntity.City = model.City;
                newEntity.Country = model.Country;
                _dbContext.Suppliers.Add(newEntity);
                await _dbContext.SaveChangesAsync();
                return (int)newEntity.SupplierID;
            }
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _dbContext.Suppliers.FindAsync(id);
            if (entity != null)
            {
                _dbContext.Suppliers.Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
