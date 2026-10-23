using System.Text.Json.Serialization;

namespace InvoiceManagement.Api.DTOs.Import;

public class InvoiceImportDto
{
    [JsonPropertyName("invoice_number")]
    public int InvoiceNumber { get; set; }

    [JsonPropertyName("invoice_date")]
    public DateTime InvoiceDate { get; set; }

    [JsonPropertyName("invoice_status")]
    public string InvoiceStatus { get; set; }
        = string.Empty;

    [JsonPropertyName("total_amount")]
    public decimal TotalAmount { get; set; }

    [JsonPropertyName("days_to_due")]
    public int DaysToDue { get; set; }

    [JsonPropertyName("payment_due_date")]
    public DateTime PaymentDueDate { get; set; }

    [JsonPropertyName("payment_status")]
    public string PaymentStatus { get; set; }
        = string.Empty;

    [JsonPropertyName("invoice_detail")]
    public List<InvoiceDetailImportDto> Details { get; set; }
        = new();

    [JsonPropertyName("invoice_payment")]
    public InvoicePaymentImportDto? Payment { get; set; }

    [JsonPropertyName("invoice_credit_note")]
    public List<CreditNoteImportDto> CreditNotes { get; set; }
        = new();

    [JsonPropertyName("customer")]
    public CustomerImportDto Customer { get; set; }
        = new();
}