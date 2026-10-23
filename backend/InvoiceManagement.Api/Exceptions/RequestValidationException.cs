namespace InvoiceManagement.Api.Exceptions;

public class RequestValidationException
    : Exception
{
    public RequestValidationException(
        string message)
        : base(message)
    {
    }
}