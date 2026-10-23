namespace InvoiceManagement.Api.Domain.Entities;

public class CreditNote
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public Invoice Invoice { get; set; } = null!;

    public int CreditNoteNumber { get; set; }

    public DateTime CreditNoteDate { get; set; }

    public decimal Amount { get; set; }
}