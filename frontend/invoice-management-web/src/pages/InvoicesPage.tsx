import {
    Alert,
    Empty,
    Spin,
} from "antd";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getInvoices,
} from "../api/invoices";

import CreateCreditNoteModal
    from "../components/invoices/CreateCreditNoteModal";

import InvoiceFiltersCard
    from "../components/invoices/InvoiceFiltersCard";

import InvoiceHeader
    from "../components/invoices/InvoiceHeader";

import InvoiceStatsRow
    from "../components/invoices/InvoiceStatsRow";

import InvoiceTableCard
    from "../components/invoices/InvoiceTableCard";

import type {
    InvoiceFilters,
    InvoiceListItem,
} from "../types/invoice";

export default function InvoicesPage() {
    const [
        allInvoices,
        setAllInvoices,
    ] =
        useState<InvoiceListItem[]>(
            []
        );

    const [
        invoices,
        setInvoices,
    ] =
        useState<InvoiceListItem[]>(
            []
        );

    const [
        filters,
        setFilters,
    ] =
        useState<InvoiceFilters>(
            {}
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );

    const [
        creditNoteModalOpen,
        setCreditNoteModalOpen,
    ] =
        useState(false);

    const loadAllInvoices =
        useCallback(
            async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const data =
                        await getInvoices();

                    setAllInvoices(
                        data
                    );

                    setInvoices(
                        data
                    );
                } catch (
                error: any
                ) {
                    console.error(
                        error
                    );

                    setError(
                        error?.message ??
                        "No fue posible cargar las facturas."
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            },
            []
        );

    const loadFilteredInvoices =
        useCallback(
            async (
                currentFilters:
                    InvoiceFilters
            ) => {
                try {
                    setLoading(
                        true
                    );

                    setError(
                        null
                    );

                    const data =
                        await getInvoices(
                            currentFilters
                        );

                    setInvoices(
                        data
                    );
                } catch (
                error: any
                ) {
                    console.error(
                        error
                    );

                    setError(
                        error?.message ??
                        "No fue posible filtrar las facturas."
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            },
            []
        );

    useEffect(() => {
        loadAllInvoices();
    }, [loadAllInvoices]);

    function handleSearch() {
        if (
            Object.keys(filters)
                .length === 0
        ) {
            setInvoices(
                allInvoices
            );

            return;
        }

        loadFilteredInvoices(
            filters
        );
    }

    function handleReset() {
        setFilters(
            {}
        );

        setInvoices(
            allInvoices
        );
    }

    async function handleRefresh() {
        try {
            setLoading(true);
            setError(null);

            const globalData =
                await getInvoices();

            setAllInvoices(
                globalData
            );

            const hasFilters =
                Object.keys(
                    filters
                ).length > 0;

            if (hasFilters) {
                const filteredData =
                    await getInvoices(
                        filters
                    );

                setInvoices(
                    filteredData
                );
            } else {
                setInvoices(
                    globalData
                );
            }
        } catch (
        error: any
        ) {
            console.error(
                error
            );

            setError(
                error?.message ??
                "No fue posible actualizar las facturas."
            );
        } finally {
            setLoading(
                false
            );
        }
    }

    async function handleCreditNoteCreated() {
        await handleRefresh();
    }

    const hasFilters =
        Object.keys(filters)
            .length > 0;

    return (
        <div
            className="
        min-h-screen
        bg-[#f8fafc]
      "
        >
            <main
                className="
          mx-auto
          w-full
          max-w-[1600px]
          px-4
          py-7
          sm:px-6
          lg:px-8
        "
            >
                <div
                    className="
            space-y-6
          "
                >
                    <InvoiceHeader
                        onRefresh={
                            handleRefresh
                        }
                        onCreateCreditNote={() =>
                            setCreditNoteModalOpen(
                                true
                            )
                        }
                        loading={
                            loading
                        }
                    />

                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            message="No fue posible cargar las facturas"
                            description={
                                error
                            }
                        />
                    )}

                    {loading &&
                        allInvoices.length ===
                        0 ? (
                        <div
                            className="
                flex
                min-h-80
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
              "
                        >
                            <Spin
                                size="large"
                                tip="Cargando facturas..."
                            />
                        </div>
                    ) : allInvoices.length ===
                        0 ? (
                        <div
                            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                py-16
              "
                        >
                            <Empty
                                description="No hay facturas disponibles."
                            />
                        </div>
                    ) : (
                        <>
                            <InvoiceStatsRow
                                invoices={
                                    allInvoices
                                }
                            />

                            <InvoiceFiltersCard
                                filters={
                                    filters
                                }
                                loading={
                                    loading
                                }
                                onChange={
                                    setFilters
                                }
                                onSearch={
                                    handleSearch
                                }
                                onReset={
                                    handleReset
                                }
                            />

                            {invoices.length >
                                0 ||
                                !hasFilters ? (
                                <InvoiceTableCard
                                    invoices={
                                        invoices
                                    }
                                    loading={
                                        loading
                                    }
                                />
                            ) : (
                                <div
                                    className="
            flex
            min-h-[360px]
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
        "
                                >
                                    <Empty
                                        description="No existen facturas que coincidan con los filtros."
                                    />
                                </div>
                            )}

                            <CreateCreditNoteModal
                                open={
                                    creditNoteModalOpen
                                }
                                invoices={
                                    allInvoices
                                }
                                onClose={() =>
                                    setCreditNoteModalOpen(
                                        false
                                    )
                                }
                                onCreated={
                                    handleCreditNoteCreated
                                }
                            />

                        </>
                    )}
                </div>
            </main>
        </div>
    );
}