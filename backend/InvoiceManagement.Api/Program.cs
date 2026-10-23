using Microsoft.OpenApi.Models;

using InvoiceManagement.Api.Data;
using Microsoft.EntityFrameworkCore;

using InvoiceManagement.Api.Services;
using InvoiceManagement.Api.Services.Interfaces;

using InvoiceManagement.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"));
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "InvoiceManagement.Api",
        Version = "v1",
        Description = "API REST para la gestión de facturas."
    });
});

builder.Services.AddScoped<
    IInvoiceImportService,
    InvoiceImportService>();

builder.Services.AddScoped<
    IInvoiceService,
    InvoiceService>();

builder.Services.AddScoped<
    ICreditNoteService,
    CreditNoteService>();

builder.Services.AddScoped<
    IReportService,
    ReportService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Frontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options =>
    {
        options.SerializeAsV2 = false;
    });

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "InvoiceManagement.Api v1"
        );
    });
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.MapControllers();

app.Run();