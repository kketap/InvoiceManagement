export type InvoiceImportResult = {
    processed: number;
    created: number;
    skipped: number;
    inconsistent: number;
};