using InvoiceManagement.Api.DTOs.Invoices;
using InvoiceManagement.Api.Services.Interfaces;
using InvoiceManagement.Api.DTOs.CreditNotes;

using Microsoft.AspNetCore.Mvc;

namespace InvoiceManagement.Api.Controllers;

[ApiController]
[Route("api/invoices")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;

    private readonly ICreditNoteService
    _creditNoteService;

    public InvoicesController(
        IInvoiceService invoiceService,
        ICreditNoteService creditNoteService)
    {
        _invoiceService = invoiceService;

        _creditNoteService = creditNoteService;
    }

    [HttpGet]
    [ProducesResponseType(
        StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] InvoiceFilterDto filters)
    {
        var invoices =
            await _invoiceService
                .GetAllAsync(filters);

        return Ok(invoices);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(
    StatusCodes.Status200OK)]
    [ProducesResponseType(
    StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(
    int id)
    {
        var invoice =
            await _invoiceService
                .GetByIdAsync(id);

        return Ok(invoice);
    }

    [HttpPost("{id:int}/credit-notes")]
    [ProducesResponseType(
    StatusCodes.Status201Created)]
    [ProducesResponseType(
    StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
    StatusCodes.Status404NotFound)]
    [ProducesResponseType(
    StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateCreditNote(
    int id,
    [FromBody] CreateCreditNoteDto dto)
    {
        var result =
            await _creditNoteService
                .CreateAsync(
                    id,
                    dto
                );

        return Created(
            $"/api/invoices/{id}",
            result
        );
    }
}