namespace InvoiceManagement.Api.Data.Views;

public class InvoiceSearchView
{
    public int Id { get; set; }

    public int InvoiceNumber { get; set; }

    public DateTime InvoiceDate { get; set; }

    public decimal TotalAmount { get; set; }

    public DateTime PaymentDueDate { get; set; }

    public string InvoiceStatus { get; set; }
        = string.Empty;

    public bool IsConsistent { get; set; }

    public int CustomerId { get; set; }

    public string CustomerName { get; set; }
        = string.Empty;

    public string CustomerRun { get; set; }
        = string.Empty;
}