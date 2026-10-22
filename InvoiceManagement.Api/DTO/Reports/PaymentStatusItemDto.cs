namespace InvoiceManagement.Api.DTOs.Reports;

public class PaymentStatusItemDto
{
    public string Status { get; set; }
        = string.Empty;

    public int Total { get; set; }

    public decimal Percentage { get; set; }
}