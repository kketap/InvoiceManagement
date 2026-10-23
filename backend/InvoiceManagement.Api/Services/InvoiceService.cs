using InvoiceManagement.Api.Data;
using InvoiceManagement.Api.Domain.Enums;
using InvoiceManagement.Api.Domain.Rules;
using InvoiceManagement.Api.DTOs.Invoices;
using InvoiceManagement.Api.Exceptions;
using InvoiceManagement.Api.Services.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace InvoiceManagement.Api.Services;

public class InvoiceService : IInvoiceService
{
    private readonly AppDbContext _context;

    public InvoiceService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<InvoiceListDto>> GetAllAsync(
    InvoiceFilterDto filters)
    {
        var searchQuery =
            _context.InvoiceSearch
                .AsNoTracking()
                .Where(x => x.IsConsistent)
                .AsQueryable();

        if (filters.InvoiceNumber.HasValue)
        {
            searchQuery =
                searchQuery.Where(
                    x =>
                        x.InvoiceNumber ==
                        filters.InvoiceNumber.Value
                );
        }

        if (!string.IsNullOrWhiteSpace(
         filters.InvoiceStatus))
        {
            if (!TryParseEnumName<InvoiceStatus>(
                    filters.InvoiceStatus,
                    out var invoiceStatus))
            {
                var allowedValues =
                    string.Join(
                        ", ",
                        Enum.GetNames<InvoiceStatus>()
                    );

                throw new RequestValidationException(
                    $"InvoiceStatus inválido. " +
                    $"Valores permitidos: {allowedValues}."
                );
            }

            searchQuery =
                searchQuery.Where(
                    x =>
                        x.InvoiceStatus ==
                        invoiceStatus.ToString()
                );
        }

        var matchingIds =
            await searchQuery
                .Select(x => x.Id)
                .ToListAsync();

        var invoices =
            await _context.Invoices
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.CreditNotes)
                .Include(x => x.Payment)
                .Where(x =>
                    matchingIds.Contains(x.Id))
                .OrderBy(x => x.InvoiceNumber)
                .ToListAsync();

        var result =
            invoices.Select(invoice =>
            {
                var paymentStatus =
                    InvoiceRules.CalculatePaymentStatus(
                        invoice.PaymentDueDate,
                        invoice.Payment?.PaymentDate,
                        DateTime.UtcNow
                    );

                var pendingAmount =
                    InvoiceRules.CalculatePendingAmount(
                        invoice.TotalAmount,
                        invoice.CreditNotes
                    );

                return new InvoiceListDto
                {
                    Id =
                        invoice.Id,

                    InvoiceNumber =
                        invoice.InvoiceNumber,

                    InvoiceDate =
                        invoice.InvoiceDate,

                    CustomerName =
                        invoice.Customer.Name,

                    CustomerRun =
                        invoice.Customer.Run,

                    TotalAmount =
                        invoice.TotalAmount,

                    PendingAmount =
                        pendingAmount,

                    InvoiceStatus =
                        invoice.InvoiceStatus.ToString(),

                    PaymentStatus =
                        paymentStatus.ToString(),

                    PaymentDueDate =
                        invoice.PaymentDueDate
                };
            })
            .ToList();

        if (!string.IsNullOrWhiteSpace(
         filters.PaymentStatus))
        {
            if (!TryParseEnumName<PaymentStatus>(
                    filters.PaymentStatus,
                    out var paymentStatusFilter))
            {
                var allowedValues =
                    string.Join(
                        ", ",
                        Enum.GetNames<PaymentStatus>()
                    );

                throw new RequestValidationException(
                    $"PaymentStatus inválido. " +
                    $"Valores permitidos: {allowedValues}."
                );
            }

            result =
                result
                    .Where(x =>
                        x.PaymentStatus.Equals(
                            paymentStatusFilter.ToString(),
                            StringComparison.OrdinalIgnoreCase
                        )
                    )
                    .ToList();
        }

        return result;
    }

    public async Task<InvoiceDetailResponseDto> GetByIdAsync(
    int id)
    {
        var invoice =
            await _context.Invoices
                .AsNoTracking()
                .Include(x => x.Customer)
                .Include(x => x.Details)
                .Include(x => x.CreditNotes)
                .Include(x => x.Payment)
                .FirstOrDefaultAsync(
                    x =>
                        x.Id == id &&
                        x.IsConsistent
                );

        if (invoice is null)
        {
            throw new NotFoundException(
                "Factura no encontrada."
            );
        }

        var creditNotesTotal =
            invoice.CreditNotes
                .Sum(x => x.Amount);

        var pendingAmount =
            InvoiceRules.CalculatePendingAmount(
                invoice.TotalAmount,
                invoice.CreditNotes
            );

        var paymentStatus =
            InvoiceRules.CalculatePaymentStatus(
                invoice.PaymentDueDate,
                invoice.Payment?.PaymentDate,
                DateTime.UtcNow
            );

        return new InvoiceDetailResponseDto
        {
            Id =
                invoice.Id,

            InvoiceNumber =
                invoice.InvoiceNumber,

            InvoiceDate =
                invoice.InvoiceDate,

            TotalAmount =
                invoice.TotalAmount,

            CreditNotesTotal =
                creditNotesTotal,

            PendingAmount =
                pendingAmount,

            DaysToDue =
                invoice.DaysToDue,

            PaymentDueDate =
                invoice.PaymentDueDate,

            InvoiceStatus =
                invoice.InvoiceStatus.ToString(),

            PaymentStatus =
                paymentStatus.ToString(),

            IsConsistent =
                invoice.IsConsistent,

            Customer = new CustomerDto
            {
                Id =
                    invoice.Customer.Id,

                Run =
                    invoice.Customer.Run,

                Name =
                    invoice.Customer.Name,

                Email =
                    invoice.Customer.Email
            },

            Details =
                invoice.Details
                    .Select(detail =>
                        new InvoiceProductDto
                        {
                            Id =
                                detail.Id,

                            ProductName =
                                detail.ProductName,

                            UnitPrice =
                                detail.UnitPrice,

                            Quantity =
                                detail.Quantity,

                            Subtotal =
                                detail.Subtotal
                        })
                    .ToList(),

            Payment =
                invoice.Payment is null
                    ? null
                    : new InvoicePaymentDto
                    {
                        PaymentMethod =
                            invoice.Payment.PaymentMethod,

                        PaymentDate =
                            invoice.Payment.PaymentDate
                    },

            CreditNotes =
                invoice.CreditNotes
                    .OrderBy(
                        x => x.CreditNoteDate)
                    .Select(note =>
                        new CreditNoteDto
                        {
                            Id =
                                note.Id,

                            CreditNoteNumber =
                                note.CreditNoteNumber,

                            CreditNoteDate =
                                note.CreditNoteDate,

                            Amount =
                                note.Amount
                        })
                    .ToList()
        };
    }

    private static bool TryParseEnumName<TEnum>(
    string value,
    out TEnum result)
    where TEnum : struct, Enum
    {
        result = default;

        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        if (int.TryParse(value, out _))
        {
            return false;
        }

        return Enum.TryParse<TEnum>(
            value,
            true,
            out result
        )
        &&
        Enum.IsDefined(result);
    }
}