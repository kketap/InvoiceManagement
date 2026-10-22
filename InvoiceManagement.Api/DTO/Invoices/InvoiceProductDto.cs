namespace InvoiceManagement.Api.DTOs.Invoices;

public class InvoiceProductDto
{
    public int Id { get; set; }

    public string ProductName { get; set; }
        = string.Empty;

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public decimal Subtotal { get; set; }
}