using InvoiceManagement.Api.DTOs.CreditNotes;
using InvoiceManagement.Api.DTOs.Invoices;

namespace InvoiceManagement.Api.Services.Interfaces;

public interface ICreditNoteService
{
    Task<CreditNoteDto> CreateAsync(
        int invoiceId,
        CreateCreditNoteDto dto);
}