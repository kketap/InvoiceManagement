namespace InvoiceManagement.Api.DTOs.Reports;

public class InconsistentInvoiceReportDto
{
    public int Id { get; set; }

    public int InvoiceNumber { get; set; }

    public string CustomerName { get; set; }
        = string.Empty;

    public decimal DeclaredTotal { get; set; }

    public decimal DetailsTotal { get; set; }

    public decimal Difference { get; set; }
}