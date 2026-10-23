using InvoiceManagement.Api.Services.Interfaces;

using Microsoft.AspNetCore.Mvc;

namespace InvoiceManagement.Api.Controllers;

[ApiController]
[Route("api/import")]
public class ImportController : ControllerBase
{
    private readonly IInvoiceImportService _importService;

    public ImportController(
        IInvoiceImportService importService)
    {
        _importService = importService;
    }

    [HttpPost("invoices")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ImportInvoices()
    {
        var result =
            await _importService.ImportAsync();

        return Ok(result);
    }
}