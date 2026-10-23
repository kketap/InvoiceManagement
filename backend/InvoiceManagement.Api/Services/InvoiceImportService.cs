using System.Text.Json;

using InvoiceManagement.Api.Data;
using InvoiceManagement.Api.Domain.Entities;
using InvoiceManagement.Api.Domain.Rules;
using InvoiceManagement.Api.DTOs.Import;
using InvoiceManagement.Api.Services.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace InvoiceManagement.Api.Services;

public class InvoiceImportService
    : IInvoiceImportService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public InvoiceImportService(
        AppDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    public async Task<ImportResultDto> ImportAsync()
    {
        var filePath = Path.Combine(
            _environment.ContentRootPath,
            "DataFiles",
            "bd_exam_invoices.json"
        );

        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException(
                "No se encontró el archivo de facturas.",
                filePath
            );
        }

        var json =
            await File.ReadAllTextAsync(filePath);

        var data =
            JsonSerializer.Deserialize<InvoiceImportRootDto>(
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            );

        if (data is null)
        {
            throw new InvalidOperationException(
                "No fue posible deserializar el archivo JSON."
            );
        }

        var result = new ImportResultDto
        {
            Processed = data.Invoices.Count
        };

        await using var transaction =
            await _context.Database
                .BeginTransactionAsync();

        foreach (var source in data.Invoices)
        {
            var alreadyExists =
                await _context.Invoices
                    .AnyAsync(
                        x =>
                            x.InvoiceNumber ==
                            source.InvoiceNumber
                    );

            if (alreadyExists)
            {
                result.Skipped++;

                continue;
            }

            var customer =
                await _context.Customers
                    .FirstOrDefaultAsync(
                        x =>
                            x.Run ==
                            source.Customer.Run
                    );

            if (customer is null)
            {
                customer = new Customer
                {
                    Run = source.Customer.Run,
                    Name = source.Customer.Name,
                    Email = source.Customer.Email
                };

                _context.Customers.Add(customer);
            }

            var invoice = new Invoice
            {
                InvoiceNumber =
                    source.InvoiceNumber,

                InvoiceDate =
                    source.InvoiceDate,

                TotalAmount =
                    source.TotalAmount,

                DaysToDue =
                    source.DaysToDue,

                PaymentDueDate =
                    source.PaymentDueDate,

                Customer =
                    customer
            };

            invoice.Details =
                source.Details
                    .Select(detail =>
                        new InvoiceDetail
                        {
                            ProductName =
                                detail.ProductName,

                            UnitPrice =
                                detail.UnitPrice,

                            Quantity =
                                detail.Quantity,

                            Subtotal =
                                detail.Subtotal
                        })
                    .ToList();

            invoice.CreditNotes =
                source.CreditNotes
                    .Select(note =>
                        new CreditNote
                        {
                            CreditNoteNumber =
                                note.CreditNoteNumber,

                            CreditNoteDate =
                                note.CreditNoteDate,

                            Amount =
                                note.Amount
                        })
                    .ToList();

            if (source.Payment is not null)
            {
                invoice.Payment =
                    new InvoicePayment
                    {
                        PaymentMethod =
                            source.Payment.PaymentMethod,

                        PaymentDate =
                            source.Payment.PaymentDate
                    };
            }

            invoice.IsConsistent =
                InvoiceRules.IsConsistent(
                    invoice.TotalAmount,
                    invoice.Details
                );

            invoice.ConsistencyDifference =
                InvoiceRules
                    .CalculateConsistencyDifference(
                        invoice.TotalAmount,
                        invoice.Details
                    );

            invoice.InvoiceStatus =
                InvoiceRules.CalculateInvoiceStatus(
                    invoice.TotalAmount,
                    invoice.CreditNotes
                );

            if (!invoice.IsConsistent)
            {
                result.Inconsistent++;
            }

            _context.Invoices.Add(invoice);

            result.Created++;
        }

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return result;
    }
}