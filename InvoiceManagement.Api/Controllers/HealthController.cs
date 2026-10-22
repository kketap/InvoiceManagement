using Microsoft.AspNetCore.Mvc;

namespace InvoiceManagement.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult GetHealth()
    {
        return Ok(new
        {
            status = "ok",
            application = "InvoiceManagement.Api"
        });
    }
}