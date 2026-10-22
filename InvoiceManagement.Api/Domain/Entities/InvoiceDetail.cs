namespace InvoiceManagement.Api.Domain.Entities;

public class InvoiceDetail
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public Invoice Invoice { get; set; } = null!;

    public string ProductName { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public decimal Subtotal { get; set; }
}