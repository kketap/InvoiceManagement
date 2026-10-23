using InvoiceManagement.Api.Domain.Enums;

namespace InvoiceManagement.Api.Domain.Entities;

public class Invoice
{
    public int Id { get; set; }

    public int InvoiceNumber { get; set; }

    public DateTime InvoiceDate { get; set; }

    public decimal TotalAmount { get; set; }

    public int DaysToDue { get; set; }

    public DateTime PaymentDueDate { get; set; }

    public InvoiceStatus InvoiceStatus { get; set; }

    public bool IsConsistent { get; set; }

    public decimal ConsistencyDifference { get; set; }

    public int CustomerId { get; set; }

    public Customer Customer { get; set; } = null!;

    public ICollection<InvoiceDetail> Details { get; set; }
        = new List<InvoiceDetail>();

    public ICollection<CreditNote> CreditNotes { get; set; }
        = new List<CreditNote>();

    public InvoicePayment? Payment { get; set; }
}