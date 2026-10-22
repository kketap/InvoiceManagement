using InvoiceManagement.Api.Data;
using InvoiceManagement.Api.Domain.Enums;
using InvoiceManagement.Api.Domain.Rules;
using InvoiceManagement.Api.DTOs.Reports;
using InvoiceManagement.Api.Services.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace InvoiceManagement.Api.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<OverdueInvoiceReportDto>>
        GetOverdueInvoicesAsync()
    {
        var today =
            DateTime.UtcNow.Date;

        var overdueLimit =
            today.AddDays(-30);

        var invoices =
            await _context.Invoices
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.CreditNotes)
                .Include(x => x.Payment)
                .Where(x =>
                    x.IsConsistent &&
                    x.PaymentDueDate < overdueLimit &&
                    !x.CreditNotes.Any() &&
                    (
                        x.Payment == null ||
                        x.Payment.PaymentDate == null
                    )
                )
                .OrderBy(x => x.PaymentDueDate)
                .ToListAsync();

        return invoices
            .Select(invoice =>
                new OverdueInvoiceReportDto
                {
                    Id =
                        invoice.Id,

                    InvoiceNumber =
                        invoice.InvoiceNumber,

                    CustomerName =
                        invoice.Customer.Name,

                    CustomerRun =
                        invoice.Customer.Run,

                    TotalAmount =
                        invoice.TotalAmount,

                    PaymentDueDate =
                        invoice.PaymentDueDate,

                    DaysOverdue =
                        (today -
                         invoice.PaymentDueDate.Date)
                        .Days
                })
            .ToList();
    }

    public async Task<PaymentStatusSummaryDto>
        GetPaymentStatusSummaryAsync()
    {
        var today =
            DateTime.UtcNow;

        var invoices =
            await _context.Invoices
                .AsNoTracking()
                .Include(x => x.Payment)
                .ToListAsync();

        var calculatedStatuses =
            invoices
                .Select(invoice =>
                    InvoiceRules
                        .CalculatePaymentStatus(
                            invoice.PaymentDueDate,
                            invoice.Payment?.PaymentDate,
                            today
                        )
                )
                .ToList();

        var totalInvoices =
            calculatedStatuses.Count;

        var statuses =
            Enum.GetValues<PaymentStatus>()
                .Select(status =>
                {
                    var count =
                        calculatedStatuses.Count(
                            x => x == status
                        );

                    var percentage =
                        totalInvoices == 0
                            ? 0
                            : Math.Round(
                                count * 100m /
                                totalInvoices,
                                2
                            );

                    return new PaymentStatusItemDto
                    {
                        Status =
                            status.ToString(),

                        Total =
                            count,

                        Percentage =
                            percentage
                    };
                })
                .ToList();

        return new PaymentStatusSummaryDto
        {
            TotalInvoices =
                totalInvoices,

            Statuses =
                statuses
        };
    }

    public async Task<List<InconsistentInvoiceReportDto>>
        GetInconsistentInvoicesAsync()
    {
        var invoices =
            await _context.Invoices
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Details)
                .Where(x => !x.IsConsistent)
                .OrderBy(x => x.InvoiceNumber)
                .ToListAsync();

        return invoices
            .Select(invoice =>
            {
                var detailsTotal =
                    invoice.Details
                        .Sum(x => x.Subtotal);

                return new InconsistentInvoiceReportDto
                {
                    Id =
                        invoice.Id,

                    InvoiceNumber =
                        invoice.InvoiceNumber,

                    CustomerName =
                        invoice.Customer.Name,

                    DeclaredTotal =
                        invoice.TotalAmount,

                    DetailsTotal =
                        detailsTotal,

                    Difference =
                        invoice.ConsistencyDifference
                };
            })
            .ToList();
    }
}