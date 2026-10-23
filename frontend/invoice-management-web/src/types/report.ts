export type PaymentStatusReportItem = {
    status:
    | "Paid"
    | "Pending"
    | "Overdue";

    total: number;

    percentage: number;
};

export type PaymentSummaryReport = {
    totalInvoices: number;

    statuses:
    PaymentStatusReportItem[];
};

export type OverdueInvoiceReportItem = {
    id: number;

    invoiceNumber: number;

    customerName: string;

    customerRun: string;

    totalAmount: number;

    paymentDueDate: string;

    daysOverdue: number;
};

export type InconsistentInvoiceReportItem = {
    id: number;

    invoiceNumber: number;

    customerName: string;

    declaredTotal: number;

    detailsTotal: number;

    difference: number;
};