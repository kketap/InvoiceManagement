namespace InvoiceManagement.Api.DTOs.Common;

public class ApiErrorDto
{
    public int Status { get; set; }

    public string Message { get; set; }
        = string.Empty;
}