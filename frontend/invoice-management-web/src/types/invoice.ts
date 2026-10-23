export type InvoiceStatus =
    | "Issued"
    | "Partial"
    | "Cancelled";

export type PaymentStatus =
    | "Pending"
    | "Overdue"
    | "Paid";

export type InvoiceListItem = {
    id: number;
    invoiceNumber: number;
    invoiceDate: string;
    customerName: string;
    customerRun: string;
    totalAmount: number;
    pendingAmount: number;
    invoiceStatus: InvoiceStatus;
    paymentStatus: PaymentStatus;
    paymentDueDate: string;
};

export type InvoiceFilters = {
    invoiceNumber?: number;
    invoiceStatus?: InvoiceStatus;
    paymentStatus?: PaymentStatus;
};

export type CreditNote = {
    id: number;
    creditNoteNumber: number;
    creditNoteDate: string;
    amount: number;
};

export type CreateCreditNotePayload = {
    creditNoteNumber: number;
    amount: number;
};

export type Customer = {
    id: number;
    run: string;
    name: string;
    email: string;
};

export type InvoiceProduct = {
    id: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
};

export type InvoicePayment = {
    paymentMethod: string | null;
    paymentDate: string | null;
};

export type InvoiceDetail = {
    id: number;
    invoiceNumber: number;
    invoiceDate: string;

    totalAmount: number;
    creditNotesTotal: number;
    pendingAmount: number;

    daysToDue: number;
    paymentDueDate: string;

    invoiceStatus: InvoiceStatus;
    paymentStatus: PaymentStatus;

    isConsistent: boolean;

    customer: Customer;

    details: InvoiceProduct[];

    payment: InvoicePayment | null;

    creditNotes: CreditNote[];
};