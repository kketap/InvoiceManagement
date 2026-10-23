namespace InvoiceManagement.Api.DTOs.Invoices;

public class InvoiceDetailResponseDto
{
    public int Id { get; set; }

    public int InvoiceNumber { get; set; }

    public DateTime InvoiceDate { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal CreditNotesTotal { get; set; }

    public decimal PendingAmount { get; set; }

    public int DaysToDue { get; set; }

    public DateTime PaymentDueDate { get; set; }

    public string InvoiceStatus { get; set; }
        = string.Empty;

    public string PaymentStatus { get; set; }
        = string.Empty;

    public bool IsConsistent { get; set; }

    public CustomerDto Customer { get; set; }
        = new();

    public List<InvoiceProductDto> Details { get; set; }
        = new();

    public InvoicePaymentDto? Payment { get; set; }

    public List<CreditNoteDto> CreditNotes { get; set; }
        = new();
}