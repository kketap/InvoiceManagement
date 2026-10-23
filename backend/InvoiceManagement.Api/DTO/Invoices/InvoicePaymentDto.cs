namespace InvoiceManagement.Api.DTOs.Invoices;

public class InvoicePaymentDto
{
    public string? PaymentMethod { get; set; }

    public DateTime? PaymentDate { get; set; }
}