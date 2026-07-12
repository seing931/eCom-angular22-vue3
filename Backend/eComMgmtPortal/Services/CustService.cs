using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Services
{
    public interface ICustService
    {
        Task<List<CustModel>> GetAllAsync();
        Task<CustModel> GetByIdAsync(int id);
        Task<int> SaveAsync(int id, CustModel model);
        Task DeleteAsync(int id);
    }
    public class CustService : ICustService
    {
        private readonly AppDbContext _dbContext;

        public CustService(AppDbContext context)
        {
            _dbContext = context;
        }

        public async Task<List<CustModel>> GetAllAsync()
        {
            var data = await _dbContext.Customers.ToListAsync();

            return data.Select(x => new CustModel
            {
                CustId = x.CustomerID,
                FirstName = x.FirstName,
                LastName = x.LastName,
                UserName = x.UserName,
                Password = "********",
                Age = x.Age,
                Gender = x.Gender,
                DateofBirth = x.DateofBirth,
                Organization = x.Organization,
                Country = x.Country,
                State = x.State,
                City = x.City,
                PostalCode = x.PostalCode,
                Email = x.Email,
                AltEmail = x.AltEmail,
                Phone1 = x.Phone1,
                Phone2 = x.Phone2,
                Mobile1 = x.Mobile1,
                Mobile2 = x.Mobile2,
                Address1 = x.Address1,
                Address2 = x.Address2,
                Picture = x.Picture,
                Status = x.Status,
                LastLogin = x.LastLogin,
                Created = x.Created,
                Notes = x.Notes
            }).ToList();
        }

        public async Task<CustModel> GetByIdAsync(int id)
        {
            var x = await _dbContext.Customers.FindAsync(id);
            if (x == null) return null;
            return new CustModel
            {
                CustId = x.CustomerID,
                FirstName = x.FirstName,
                LastName = x.LastName,
                UserName = x.UserName,
                Password = "********",
                Age = x.Age,
                Gender = x.Gender,
                DateofBirth = x.DateofBirth,
                Organization = x.Organization,
                Country = x.Country,
                State = x.State,
                City = x.City,
                PostalCode = x.PostalCode,
                Email = x.Email,
                AltEmail = x.AltEmail,
                Phone1 = x.Phone1,
                Phone2 = x.Phone2,
                Mobile1 = x.Mobile1,
                Mobile2 = x.Mobile2,
                Address1 = x.Address1,
                Address2 = x.Address2,
                Picture = x.Picture,
                Status = x.Status,
                LastLogin = x.LastLogin,
                Created = x.Created,
                Notes = x.Notes
            };
        }

        public async Task<int> SaveAsync(int id, CustModel model)
        {
            if (id > 0)
            {
                var existEntity = _dbContext.Customers.Find(model.CustId);
                existEntity.FirstName = model.FirstName;
                existEntity.LastName = model.LastName;
                existEntity.Age = model.Age;
                existEntity.Gender = model.Gender;
                existEntity.DateofBirth = model.DateofBirth;
                existEntity.Organization = model.Organization;
                existEntity.Country = model.Country;
                existEntity.State = model.State;
                existEntity.City = model.City;
                existEntity.PostalCode = model.PostalCode;
                existEntity.Email = model.Email;
                existEntity.AltEmail = model.AltEmail;
                existEntity.Phone1 = model.Phone1;
                existEntity.Phone2 = model.Phone2;
                existEntity.Mobile1 = model.Mobile1;
                existEntity.Mobile2 = model.Mobile2;
                existEntity.Address1 = model.Address1;
                existEntity.Address2 = model.Address2;
                existEntity.Picture = model.Picture;
                existEntity.Status = model.Status;
                existEntity.Notes = model.Notes;
                await _dbContext.SaveChangesAsync();
                return (int)existEntity.CustomerID;

            }
            else
            {
                Customers newEntity = new Customers();
                newEntity.FirstName= model.FirstName;
                newEntity.LastName = model.LastName;
                newEntity.UserName = model.UserName;
                newEntity.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
                newEntity.Age = model.Age;
                newEntity.Gender = model.Gender;
                newEntity.DateofBirth = model.DateofBirth;
                newEntity.Organization = model.Organization;
                newEntity.Country = model.Country;
                newEntity.State = model.State;
                newEntity.City = model.City;
                newEntity.PostalCode = model.PostalCode;
                newEntity.Email = model.Email;
                newEntity.AltEmail = model.AltEmail;
                newEntity.Phone1 = model.Phone1;
                newEntity.Phone2 = model.Phone2;
                newEntity.Mobile1 = model.Mobile1;
                newEntity.Mobile2 = model.Mobile2;
                newEntity.Address1 = model.Address1;
                newEntity.Address2 = model.Address2;
                newEntity.Picture = model.Picture;
                newEntity.Status = model.Status;
                newEntity.Created = DateTime.Now;
                newEntity.Notes = model.Notes;
                _dbContext.Customers.Add(newEntity);
                await _dbContext.SaveChangesAsync();
                return (int)newEntity.CustomerID;
            }
        }
        public async Task DeleteAsync(int id)
        {
            var entity = await _dbContext.Customers.FindAsync(id);

            if (entity == null)
                throw new Exception("Customer not found.");

            try
            {
                _dbContext.Customers.Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw new Exception("Cannot delete this customer because it is linked to existing orders.");
            }
        }
    }
}
