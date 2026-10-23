namespace InvoiceManagement.Api.Domain.Entities;

public class Customer
{
    public int Id { get; set; }

    public string Run { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public ICollection<Invoice> Invoices { get; set; }
        = new List<Invoice>();
}