namespace InvoiceManagement.Api.DTOs.Reports;

public class OverdueInvoiceReportDto
{
    public int Id { get; set; }

    public int InvoiceNumber { get; set; }

    public string CustomerName { get; set; }
        = string.Empty;

    public string CustomerRun { get; set; }
        = string.Empty;

    public decimal TotalAmount { get; set; }

    public DateTime PaymentDueDate { get; set; }

    public int DaysOverdue { get; set; }
}