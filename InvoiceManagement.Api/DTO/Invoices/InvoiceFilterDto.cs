namespace InvoiceManagement.Api.DTOs.Invoices;

public class InvoiceFilterDto
{
    public int? InvoiceNumber { get; set; }

    public string? InvoiceStatus { get; set; }

    public string? PaymentStatus { get; set; }
}