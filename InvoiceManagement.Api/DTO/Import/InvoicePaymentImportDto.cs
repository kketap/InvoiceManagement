using System.Text.Json.Serialization;

namespace InvoiceManagement.Api.DTOs.Import;

public class InvoicePaymentImportDto
{
    [JsonPropertyName("payment_method")]
    public string? PaymentMethod { get; set; }

    [JsonPropertyName("payment_date")]
    public DateTime? PaymentDate { get; set; }
}