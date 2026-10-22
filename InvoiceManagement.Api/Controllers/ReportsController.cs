using InvoiceManagement.Api.Services.Interfaces;

using Microsoft.AspNetCore.Mvc;

namespace InvoiceManagement.Api.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(
        IReportService reportService)
    {
        _reportService =
            reportService;
    }

    [HttpGet("overdue")]
    [ProducesResponseType(
        StatusCodes.Status200OK)]
    public async Task<IActionResult>
        GetOverdue()
    {
        var result =
            await _reportService
                .GetOverdueInvoicesAsync();

        return Ok(result);
    }

    [HttpGet("payment-summary")]
    [ProducesResponseType(
        StatusCodes.Status200OK)]
    public async Task<IActionResult>
        GetPaymentSummary()
    {
        var result =
            await _reportService
                .GetPaymentStatusSummaryAsync();

        return Ok(result);
    }

    [HttpGet("inconsistent")]
    [ProducesResponseType(
        StatusCodes.Status200OK)]
    public async Task<IActionResult>
        GetInconsistent()
    {
        var result =
            await _reportService
                .GetInconsistentInvoicesAsync();

        return Ok(result);
    }
}