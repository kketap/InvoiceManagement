using System.ComponentModel.DataAnnotations;

namespace InvoiceManagement.Api.DTOs.CreditNotes;

public class CreateCreditNoteDto
{
    [Range(1, int.MaxValue)]
    public int CreditNoteNumber { get; set; }

    public decimal Amount { get; set; }
}