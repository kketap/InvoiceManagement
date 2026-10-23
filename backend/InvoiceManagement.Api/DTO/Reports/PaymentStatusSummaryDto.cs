namespace InvoiceManagement.Api.DTOs.Reports;

public class PaymentStatusSummaryDto
{
    public int TotalInvoices { get; set; }

    public List<PaymentStatusItemDto> Statuses { get; set; }
        = new();
}