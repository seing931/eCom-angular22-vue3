using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Services
{
    public interface IEmpService
    {
        Task<List<EmpModel>> GetAllAsync();
        Task<EmpModel> GetByIdAsync(int id);
        Task<int> SaveAsync(int id, EmpModel model);
        Task DeleteAsync(int id);
    }
    public class EmpService: IEmpService
    {
        private readonly AppDbContext _dbContext;
        public EmpService(AppDbContext context)
        {
            _dbContext = context;
        }

        public async Task<List<EmpModel>> GetAllAsync()
        {
            var data = await _dbContext.admin_Employee.ToListAsync();

            return data.Select(x => new EmpModel
            {
                EmpID = x.EmpID,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Age = x.Age,
                DateofBirth = x.DateofBirth,
                Gender = x.Gender,
                Email = x.Email,
                Address = x.Address,
                Phone = x.Phone,
                Mobile = x.Mobile,
                PhotoPath = x.PhotoPath
            }).ToList();
        }

        public async Task<EmpModel> GetByIdAsync(int id)
        {
            var x = await _dbContext.admin_Employee.FindAsync(id);
            if (x == null) return null;
            return new EmpModel
            {
                EmpID = x.EmpID,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Age = x.Age,
                DateofBirth = x.DateofBirth,
                Gender = x.Gender,
                Email = x.Email,
                Address = x.Address,
                Phone = x.Phone,
                Mobile = x.Mobile,
                PhotoPath = x.PhotoPath
            };
        }
        public async Task<int> SaveAsync(int id, EmpModel model)
        {
            if (id > 0)
            {
                var existEntity = _dbContext.admin_Employee.Find(model.EmpID);
                existEntity.EmpID = model.EmpID;
                existEntity.FirstName = model.FirstName;
                existEntity.LastName = model.LastName;
                existEntity.Age = model.Age;
                existEntity.DateofBirth = model.DateofBirth;
                existEntity.Gender = model.Gender;
                existEntity.Email = model.Email;
                existEntity.Address = model.Address;
                existEntity.Phone = model.Phone;
                existEntity.Mobile = model.Mobile;
                existEntity.PhotoPath = model.PhotoPath;
                await _dbContext.SaveChangesAsync();
                return (int)existEntity.EmpID;

            }
            else
            {
                admin_Employee newEntity = new admin_Employee();
                newEntity.EmpID = model.EmpID;
                newEntity.FirstName = model.FirstName;
                newEntity.LastName = model.LastName;
                newEntity.Age = model.Age;
                newEntity.DateofBirth = model.DateofBirth;
                newEntity.Gender = model.Gender;
                newEntity.Email = model.Email;
                newEntity.Address = model.Address;
                newEntity.Phone = model.Phone;
                newEntity.Mobile = model.Mobile;
                newEntity.PhotoPath = model.PhotoPath;
                _dbContext.admin_Employee.Add(newEntity);
                await _dbContext.SaveChangesAsync();
                return (int)newEntity.EmpID;
            }
        }
        public async Task DeleteAsync(int id)
        {
            var entity = await _dbContext.admin_Employee.FindAsync(id);
            if (entity != null)
            {
                _dbContext.admin_Employee.Remove(entity);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
