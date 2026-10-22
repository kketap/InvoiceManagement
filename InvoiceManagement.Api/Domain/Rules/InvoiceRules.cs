using InvoiceManagement.Api.Domain.Entities;
using InvoiceManagement.Api.Domain.Enums;

namespace InvoiceManagement.Api.Domain.Rules;

public static class InvoiceRules
{
    public static bool IsConsistent(
        decimal totalAmount,
        IEnumerable<InvoiceDetail> details)
    {
        var detailsTotal =
            details.Sum(x => x.Subtotal);

        return detailsTotal == totalAmount;
    }

    public static decimal CalculateConsistencyDifference(
        decimal totalAmount,
        IEnumerable<InvoiceDetail> details)
    {
        var detailsTotal =
            details.Sum(x => x.Subtotal);

        return totalAmount - detailsTotal;
    }

    public static InvoiceStatus CalculateInvoiceStatus(
        decimal totalAmount,
        IEnumerable<CreditNote> creditNotes)
    {
        var creditNotesTotal =
            creditNotes.Sum(x => x.Amount);

        if (creditNotesTotal <= 0)
        {
            return InvoiceStatus.Issued;
        }

        if (creditNotesTotal >= totalAmount)
        {
            return InvoiceStatus.Cancelled;
        }

        return InvoiceStatus.Partial;
    }

    public static PaymentStatus CalculatePaymentStatus(
        DateTime paymentDueDate,
        DateTime? paymentDate,
        DateTime currentDate)
    {
        if (paymentDate.HasValue)
        {
            return PaymentStatus.Paid;
        }

        if (currentDate.Date > paymentDueDate.Date)
        {
            return PaymentStatus.Overdue;
        }

        return PaymentStatus.Pending;
    }

    public static decimal CalculatePendingAmount(
        decimal totalAmount,
        IEnumerable<CreditNote> creditNotes)
    {
        var creditNotesTotal =
            creditNotes.Sum(x => x.Amount);

        return totalAmount - creditNotesTotal;
    }
}