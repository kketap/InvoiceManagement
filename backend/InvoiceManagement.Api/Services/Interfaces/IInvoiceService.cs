using InvoiceManagement.Api.DTOs.Invoices;

namespace InvoiceManagement.Api.Services.Interfaces;

public interface IInvoiceService
{
    Task<List<InvoiceListDto>> GetAllAsync(
        InvoiceFilterDto filters);

    Task<InvoiceDetailResponseDto> GetByIdAsync(
    int id);
}