using System.Text.Json.Serialization;

namespace InvoiceManagement.Api.DTOs.Import;

public class InvoiceImportRootDto
{
    [JsonPropertyName("invoices")]
    public List<InvoiceImportDto> Invoices { get; set; }
        = new();
}