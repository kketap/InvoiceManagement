using InvoiceManagement.Api.Data;
using InvoiceManagement.Api.Domain.Entities;
using InvoiceManagement.Api.Domain.Rules;
using InvoiceManagement.Api.DTOs.CreditNotes;
using InvoiceManagement.Api.DTOs.Invoices;
using InvoiceManagement.Api.Exceptions;
using InvoiceManagement.Api.Services.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace InvoiceManagement.Api.Services;

public class CreditNoteService
    : ICreditNoteService
{
    private readonly AppDbContext _context;

    public CreditNoteService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<CreditNoteDto> CreateAsync(
        int invoiceId,
        CreateCreditNoteDto dto)
    {
        var invoice =
            await _context.Invoices
                .Include(x => x.CreditNotes)
                .FirstOrDefaultAsync(
                    x => x.Id == invoiceId
                );

        if (invoice is null)
        {
            throw new NotFoundException(
                "Factura no encontrada."
            );
        }

        if (!invoice.IsConsistent)
        {
            throw new BusinessRuleException(
                "No se pueden agregar notas de crédito " +
                "a una factura inconsistente."
            );
        }

        if (dto.Amount <= 0)
        {
            throw new RequestValidationException(
                "El monto de la nota de crédito debe ser mayor que cero."
            );
        }

        var pendingAmount =
            InvoiceRules.CalculatePendingAmount(
                invoice.TotalAmount,
                invoice.CreditNotes
            );

        if (pendingAmount <= 0)
        {
            throw new BusinessRuleException(
                "La factura no tiene saldo pendiente."
            );
        }

        if (dto.Amount > pendingAmount)
        {
            throw new BusinessRuleException(
                $"El monto de la nota de crédito " +
                $"no puede superar el saldo pendiente " +
                $"de {pendingAmount}."
            );
        }

        var duplicateNumber =
            await _context.CreditNotes
                .AnyAsync(
                    x =>
                        x.CreditNoteNumber ==
                        dto.CreditNoteNumber
                );

        if (duplicateNumber)
        {
            throw new BusinessRuleException(
                "Ya existe una nota de crédito " +
                "con ese número."
            );
        }

        var creditNote =
            new CreditNote
            {
                InvoiceId = invoice.Id,

                CreditNoteNumber =
                    dto.CreditNoteNumber,

                CreditNoteDate =
                    DateTime.UtcNow,

                Amount =
                    dto.Amount
            };

        invoice.CreditNotes.Add(
            creditNote
        );

        invoice.InvoiceStatus =
            InvoiceRules.CalculateInvoiceStatus(
                invoice.TotalAmount,
                invoice.CreditNotes
            );

        await _context.SaveChangesAsync();

        return new CreditNoteDto
        {
            Id =
                creditNote.Id,

            CreditNoteNumber =
                creditNote.CreditNoteNumber,

            CreditNoteDate =
                creditNote.CreditNoteDate,

            Amount =
                creditNote.Amount
        };
    }
}