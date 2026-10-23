import {
    apiRequest,
} from "./client";

import type {
    CreateCreditNotePayload,
    CreditNote,
    InvoiceDetail,
    InvoiceFilters,
    InvoiceListItem,
} from "../types/invoice";

export async function getInvoices(
    filters: InvoiceFilters = {}
) {
    const params =
        new URLSearchParams();

    if (
        filters.invoiceNumber !==
        undefined
    ) {
        params.set(
            "invoiceNumber",
            String(
                filters.invoiceNumber
            )
        );
    }

    if (
        filters.invoiceStatus
    ) {
        params.set(
            "invoiceStatus",
            filters.invoiceStatus
        );
    }

    if (
        filters.paymentStatus
    ) {
        params.set(
            "paymentStatus",
            filters.paymentStatus
        );
    }

    const query =
        params.toString();

    return apiRequest<
        InvoiceListItem[]
    >(
        `/invoices${query
            ? `?${query}`
            : ""
        }`
    );
}

export async function createCreditNote(
    invoiceId: number,
    payload: CreateCreditNotePayload
) {
    return apiRequest<CreditNote>(
        `/invoices/${invoiceId}/credit-notes`,
        {
            method: "POST",

            body:
                JSON.stringify(
                    payload
                ),
        }
    );
}

export async function getInvoiceById(
    id: number
) {
    return apiRequest<InvoiceDetail>(
        `/invoices/${id}`
    );
}