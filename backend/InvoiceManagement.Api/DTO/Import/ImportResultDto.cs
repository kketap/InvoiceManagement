namespace InvoiceManagement.Api.DTOs.Import;

public class ImportResultDto
{
    public int Processed { get; set; }

    public int Created { get; set; }

    public int Skipped { get; set; }

    public int Inconsistent { get; set; }
}