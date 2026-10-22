namespace InvoiceManagement.Api.DTOs.Invoices;

public class InvoiceListDto
{
    public int Id { get; set; }

    public int InvoiceNumber { get; set; }

    public DateTime InvoiceDate { get; set; }

    public string CustomerName { get; set; }
        = string.Empty;

    public string CustomerRun { get; set; }
        = string.Empty;

    public decimal TotalAmount { get; set; }

    public decimal PendingAmount { get; set; }

    public string InvoiceStatus { get; set; }
        = string.Empty;

    public string PaymentStatus { get; set; }
        = string.Empty;

    public DateTime PaymentDueDate { get; set; }
}