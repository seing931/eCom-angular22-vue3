using eComMgmtPortal.Entities;
using Microsoft.EntityFrameworkCore;

namespace eComMgmtPortal.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
       : base(options)
        {
        }

        public DbSet<Categories> Categories { get; set; }
        public DbSet<Customers> Customers { get; set; }
        public DbSet<genMainSlider> genMainSlider { get; set; }
        public DbSet<genPromoRight> genPromoRight { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<vw_Order> vw_Order { get; set; }
        public DbSet<OrderDetails> OrderDetails { get; set; }
        public DbSet<Payment> Payment { get; set; }
        public DbSet<PaymentType> PaymentType { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<ShippingDetails> ShippingDetails { get; set; }
        public DbSet<SubCategory> SubCategory { get; set; }
        public DbSet<Suppliers> Suppliers { get; set; }
        public DbSet<Wishlist> Wishlist { get; set; }
        public DbSet<Review> Review { get; set; }
        public DbSet<admin_Employee> admin_Employee { get; set; }
        public DbSet<admin_Login> admin_Login { get; set; }
        public DbSet<Menu> Menu { get; set; }
        public DbSet<RecentlyViews> RecentlyViews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Products>()
                .HasOne(p => p.Categories)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryID);

            modelBuilder.Entity<Products>()
                .HasOne(p => p.SubCategory) 
                .WithMany(s => s.Products)    
                .HasForeignKey(p => p.SubCategoryID);

            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.Products)
                .WithMany() 
                .HasForeignKey(w => w.ProductID);
        }
    }
}
