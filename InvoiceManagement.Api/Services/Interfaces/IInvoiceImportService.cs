using InvoiceManagement.Api.DTOs.Import;

namespace InvoiceManagement.Api.Services.Interfaces;

public interface IInvoiceImportService
{
    Task<ImportResultDto> ImportAsync();
}