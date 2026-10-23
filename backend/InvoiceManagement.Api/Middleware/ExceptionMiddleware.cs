using System.Net;
using System.Text.Json;

using InvoiceManagement.Api.DTOs.Common;
using InvoiceManagement.Api.Exceptions;

namespace InvoiceManagement.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(
        HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.NotFound,
                ex.Message
            );
        }
        catch (RequestValidationException ex)
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.BadRequest,
                ex.Message
            );
        }
        catch (BusinessRuleException ex)
        {
            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.Conflict,
                ex.Message
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Ocurrió un error no controlado."
            );

            await WriteErrorResponseAsync(
                context,
                HttpStatusCode.InternalServerError,
                "Ocurrió un error interno en el servidor."
            );
        }
    }

    private static async Task WriteErrorResponseAsync(
        HttpContext context,
        HttpStatusCode statusCode,
        string message)
    {
        context.Response.StatusCode =
            (int)statusCode;

        context.Response.ContentType =
            "application/json";

        var response =
            new ApiErrorDto
            {
                Status =
                    (int)statusCode,

                Message =
                    message
            };

        var json =
            JsonSerializer.Serialize(
                response,
                new JsonSerializerOptions
                {
                    PropertyNamingPolicy =
                        JsonNamingPolicy.CamelCase
                }
            );

        await context.Response
            .WriteAsync(json);
    }
}