using InvoiceManagement.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using InvoiceManagement.Api.Data.Views;

namespace InvoiceManagement.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Customer> Customers =>
        Set<Customer>();

    public DbSet<Invoice> Invoices =>
        Set<Invoice>();

    public DbSet<InvoiceDetail> InvoiceDetails =>
        Set<InvoiceDetail>();

    public DbSet<CreditNote> CreditNotes =>
        Set<CreditNote>();

    public DbSet<InvoicePayment> InvoicePayments =>
        Set<InvoicePayment>();

    public DbSet<InvoiceSearchView> InvoiceSearch =>
        Set<InvoiceSearchView>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureCustomer(modelBuilder);

        ConfigureInvoice(modelBuilder);

        ConfigureInvoiceDetail(modelBuilder);

        ConfigureCreditNote(modelBuilder);

        ConfigureInvoicePayment(modelBuilder);

        ConfigureInvoiceSearchView(modelBuilder);
    }

    private static void ConfigureCustomer(
        ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Run)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(200);

            entity.HasIndex(x => x.Run);
        });
    }

    private static void ConfigureInvoice(
        ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.InvoiceNumber)
                .IsUnique();

            entity.Property(x => x.TotalAmount)
                .HasPrecision(18, 2);

            entity.Property(
                    x => x.ConsistencyDifference)
                .HasPrecision(18, 2);

            entity.Property(x => x.InvoiceStatus)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.HasOne(x => x.Customer)
                .WithMany(x => x.Invoices)
                .HasForeignKey(x => x.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureInvoiceDetail(
        ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InvoiceDetail>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.ProductName)
                .IsRequired()
                .HasMaxLength(300);

            entity.Property(x => x.UnitPrice)
                .HasPrecision(18, 2);

            entity.Property(x => x.Subtotal)
                .HasPrecision(18, 2);

            entity.HasOne(x => x.Invoice)
                .WithMany(x => x.Details)
                .HasForeignKey(x => x.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureCreditNote(
        ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CreditNote>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Amount)
                .HasPrecision(18, 2);

            entity.HasOne(x => x.Invoice)
                .WithMany(x => x.CreditNotes)
                .HasForeignKey(x => x.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureInvoicePayment(
        ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InvoicePayment>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.PaymentMethod)
                .HasMaxLength(100);

            entity.HasIndex(x => x.InvoiceId)
                .IsUnique();

            entity.HasOne(x => x.Invoice)
                .WithOne(x => x.Payment)
                .HasForeignKey<InvoicePayment>(
                    x => x.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureInvoiceSearchView(
    ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InvoiceSearchView>(entity =>
        {
            entity.HasNoKey();

            entity.ToView("vw_invoice_search");

            entity.Property(x => x.Id)
                .HasColumnName("Id");

            entity.Property(x => x.InvoiceNumber)
                .HasColumnName("InvoiceNumber");

            entity.Property(x => x.InvoiceDate)
                .HasColumnName("InvoiceDate");

            entity.Property(x => x.TotalAmount)
                .HasColumnName("TotalAmount");

            entity.Property(x => x.PaymentDueDate)
                .HasColumnName("PaymentDueDate");

            entity.Property(x => x.InvoiceStatus)
                .HasColumnName("InvoiceStatus");

            entity.Property(x => x.IsConsistent)
                .HasColumnName("IsConsistent");

            entity.Property(x => x.CustomerId)
                .HasColumnName("CustomerId");

            entity.Property(x => x.CustomerName)
                .HasColumnName("CustomerName");

            entity.Property(x => x.CustomerRun)
                .HasColumnName("CustomerRun");
        });
    }
}