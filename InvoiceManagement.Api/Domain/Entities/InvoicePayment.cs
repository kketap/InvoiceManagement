namespace InvoiceManagement.Api.Domain.Entities;

public class InvoicePayment
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public Invoice Invoice { get; set; } = null!;

    public string? PaymentMethod { get; set; }

    public DateTime? PaymentDate { get; set; }
}