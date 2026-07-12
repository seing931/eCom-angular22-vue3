using eComMgmtPortal.Data;
using eComMgmtPortal.Entities;
using eComMgmtPortal.Models;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Services
{
    public interface IProfileService
    {
        Task<int> SaveAsync(EmpModel model);
    }
    public class ProfileService: IProfileService
    {
        private readonly AppDbContext _dbContext;
        public ProfileService(AppDbContext context)
        {
            _dbContext = context;
        }
        public async Task<int> SaveAsync(EmpModel model)
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
    }
}
