namespace InvoiceManagement.Api.DTOs.Invoices;

public class CreditNoteDto
{
    public int Id { get; set; }

    public int CreditNoteNumber { get; set; }

    public DateTime CreditNoteDate { get; set; }

    public decimal Amount { get; set; }
}