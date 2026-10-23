using System.Text.Json.Serialization;

namespace InvoiceManagement.Api.DTOs.Import;

public class CreditNoteImportDto
{
    [JsonPropertyName("credit_note_number")]
    public int CreditNoteNumber { get; set; }

    [JsonPropertyName("credit_note_date")]
    public DateTime CreditNoteDate { get; set; }

    [JsonPropertyName("credit_note_amount")]
    public decimal Amount { get; set; }
}