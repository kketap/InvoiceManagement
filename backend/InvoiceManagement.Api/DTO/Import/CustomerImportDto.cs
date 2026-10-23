using System.Text.Json.Serialization;

namespace InvoiceManagement.Api.DTOs.Import;

public class CustomerImportDto
{
    [JsonPropertyName("customer_run")]
    public string Run { get; set; }
        = string.Empty;

    [JsonPropertyName("customer_name")]
    public string Name { get; set; }
        = string.Empty;

    [JsonPropertyName("customer_email")]
    public string Email { get; set; }
        = string.Empty;
}