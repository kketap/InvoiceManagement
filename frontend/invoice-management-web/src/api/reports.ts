import {
    apiRequest,
} from "./client";

import type {
    InconsistentInvoiceReportItem,
    OverdueInvoiceReportItem,
    PaymentSummaryReport,
} from "../types/report";

export async function getPaymentSummaryReport() {
    return apiRequest<
        PaymentSummaryReport
    >(
        "/reports/payment-summary"
    );
}

export async function getOverdueInvoicesReport() {
    return apiRequest<
        OverdueInvoiceReportItem[]
    >(
        "/reports/overdue"
    );
}

export async function getInconsistentInvoicesReport() {
    return apiRequest<
        InconsistentInvoiceReportItem[]
    >(
        "/reports/inconsistent"
    );
}