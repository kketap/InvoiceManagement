using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InvoiceManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInvoiceSearchView : Migration
    {
        /// <inheritdoc />
        protected override void Up(
         MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
            CREATE VIEW vw_invoice_search AS
            SELECT
                i.Id AS Id,
                i.InvoiceNumber AS InvoiceNumber,
                i.InvoiceDate AS InvoiceDate,
                i.TotalAmount AS TotalAmount,
                i.PaymentDueDate AS PaymentDueDate,
                i.InvoiceStatus AS InvoiceStatus,
                i.IsConsistent AS IsConsistent,
                i.CustomerId AS CustomerId,
                c.Name AS CustomerName,
                c.Run AS CustomerRun
            FROM Invoices i
            INNER JOIN Customers c
                ON c.Id = i.CustomerId;
            """
            );
        }

        /// <inheritdoc />
        protected override void Down(
       MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
            DROP VIEW IF EXISTS vw_invoice_search;
            """
            );
        }
    }
}
