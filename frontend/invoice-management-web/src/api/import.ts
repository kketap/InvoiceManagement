import {
    apiRequest,
} from "./client";

import type {
    InvoiceImportResult,
} from "../types/import";

export async function importInvoices() {
    return apiRequest<
        InvoiceImportResult
    >(
        "/import/invoices",
        {
            method: "POST",
        }
    );
}