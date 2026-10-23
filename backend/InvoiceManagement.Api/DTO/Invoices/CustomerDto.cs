namespace InvoiceManagement.Api.DTOs.Invoices;

public class CustomerDto
{
    public int Id { get; set; }

    public string Run { get; set; }
        = string.Empty;

    public string Name { get; set; }
        = string.Empty;

    public string Email { get; set; }
        = string.Empty;
}