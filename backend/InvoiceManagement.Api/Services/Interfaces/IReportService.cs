using InvoiceManagement.Api.DTOs.Reports;

namespace InvoiceManagement.Api.Services.Interfaces;

public interface IReportService
{
    Task<List<OverdueInvoiceReportDto>>
        GetOverdueInvoicesAsync();

    Task<PaymentStatusSummaryDto>
        GetPaymentStatusSummaryAsync();

    Task<List<InconsistentInvoiceReportDto>>
        GetInconsistentInvoicesAsync();
}