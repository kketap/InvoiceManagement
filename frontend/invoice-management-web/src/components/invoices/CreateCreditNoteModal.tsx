import {
    Button,
    InputNumber,
    Modal,
    Select,
    message,
} from "antd";

import {
    Save,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    createCreditNote,
} from "../../api/invoices";

import type {
    InvoiceListItem,
} from "../../types/invoice";

type Props = {
    open: boolean;

    invoices: InvoiceListItem[];

    onClose: () => void;

    onCreated: () => void;
};

function formatCurrency(
    value: number
) {
    return new Intl.NumberFormat(
        "es-CL",
        {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
        }
    ).format(value);
}

export default function CreateCreditNoteModal({
    open,
    invoices,
    onClose,
    onCreated,
}: Props) {
    const [
        selectedInvoiceId,
        setSelectedInvoiceId,
    ] =
        useState<number>();

    const [
        creditNoteNumber,
        setCreditNoteNumber,
    ] =
        useState<number>();

    const [
        amount,
        setAmount,
    ] =
        useState<number>();

    const [
        loading,
        setLoading,
    ] =
        useState(false);

    const [
        messageApi,
        contextHolder,
    ] =
        message.useMessage();

    const selectableInvoices =
        useMemo(
            () =>
                invoices.filter(
                    (invoice) =>
                        invoice.pendingAmount > 0
                ),
            [invoices]
        );

    const selectedInvoice =
        selectableInvoices.find(
            (invoice) =>
                invoice.id ===
                selectedInvoiceId
        );

    function resetForm() {
        setSelectedInvoiceId(
            undefined
        );

        setCreditNoteNumber(
            undefined
        );

        setAmount(
            undefined
        );
    }

    function handleClose() {
        if (loading) {
            return;
        }

        resetForm();

        onClose();
    }

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    async function handleSubmit() {
        if (
            selectedInvoiceId === undefined ||
            creditNoteNumber === undefined ||
            amount === undefined
        ) {
            messageApi.warning(
                "Completa todos los campos."
            );

            return;
        }

        if (amount <= 0) {
            messageApi.warning(
                "El monto debe ser mayor que cero."
            );

            return;
        }

        if (
            selectedInvoice &&
            amount >
            selectedInvoice.pendingAmount
        ) {
            messageApi.warning(
                "El monto no puede superar el saldo pendiente."
            );

            return;
        }

        try {
            setLoading(true);

            await createCreditNote(
                selectedInvoiceId,
                {
                    creditNoteNumber,
                    amount,
                }
            );

            messageApi.success(
                "Nota de crédito creada correctamente."
            );

            resetForm();

            onClose();

            await onCreated();
        } catch (
        error: any
        ) {
            messageApi.error(
                error?.message ??
                "No fue posible crear la nota de crédito."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {contextHolder}

            <Modal
                open={open}
                title={
                    <div>
                        <h2
                            className="
                                text-base
                                font-semibold
                                text-slate-900
                            "
                        >
                            Nueva nota de crédito
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                font-normal
                                text-slate-400
                            "
                        >
                            Registra una nota de crédito
                            sobre una factura con saldo
                            pendiente.
                        </p>
                    </div>
                }
                onCancel={
                    handleClose
                }
                footer={null}
                destroyOnHidden
                width={560}
                centered
                maskClosable={
                    !loading
                }
                closable={
                    !loading
                }
            >
                <div
                    className="
                        mt-5
                        space-y-5
                    "
                >
                    <div>
                        <label
                            className="
                                mb-1.5
                                block
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Factura
                        </label>

                        <Select
                            className="w-full"
                            showSearch
                            allowClear
                            placeholder="Seleccionar factura"
                            value={
                                selectedInvoiceId
                            }
                            optionFilterProp="label"
                            options={
                                selectableInvoices.map(
                                    (
                                        invoice
                                    ) => ({
                                        value:
                                            invoice.id,

                                        label:
                                            `#${invoice.invoiceNumber} · ${invoice.customerName}`,
                                    })
                                )
                            }
                            onChange={
                                setSelectedInvoiceId
                            }
                        />
                    </div>

                    {selectedInvoice && (
                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                            "
                        >
                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-slate-100
                                    bg-slate-50
                                    px-4
                                    py-3
                                "
                            >
                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-400
                                    "
                                >
                                    Factura
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    #
                                    {
                                        selectedInvoice.invoiceNumber
                                    }
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    {
                                        selectedInvoice.customerName
                                    }
                                </p>
                            </div>

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-slate-100
                                    bg-slate-50
                                    px-4
                                    py-3
                                "
                            >
                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-400
                                    "
                                >
                                    Saldo pendiente
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-lg
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    {
                                        formatCurrency(
                                            selectedInvoice.pendingAmount
                                        )
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                        "
                    >
                        <div>
                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                "
                            >
                                N° nota de crédito
                            </label>

                            <InputNumber
                                className="w-full"
                                min={1}
                                placeholder="Ej: 10001"
                                value={
                                    creditNoteNumber
                                }
                                onChange={(
                                    value
                                ) =>
                                    setCreditNoteNumber(
                                        value ??
                                        undefined
                                    )
                                }
                            />
                        </div>

                        <div>
                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                "
                            >
                                Monto
                            </label>

                            <InputNumber
                                className="w-full"
                                min={1}
                                max={
                                    selectedInvoice
                                        ?.pendingAmount
                                }
                                placeholder="$ 0"
                                value={
                                    amount
                                }
                                formatter={(
                                    value
                                ) =>
                                    `$ ${value ?? ""}`
                                }
                                parser={(
                                    value
                                ) =>
                                    Number(
                                        value
                                            ?.replace(
                                                /\$\s?|(\.*)/g,
                                                ""
                                            ) ??
                                        "0"
                                    )
                                }
                                onChange={(
                                    value
                                ) =>
                                    setAmount(
                                        value ??
                                        undefined
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div
                        className="
                            flex
                            justify-end
                            gap-2
                            border-t
                            border-slate-100
                            pt-4
                        "
                    >
                        <Button
                            disabled={
                                loading
                            }
                            onClick={
                                handleClose
                            }
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="primary"
                            loading={
                                loading
                            }
                            disabled={
                                !selectedInvoice
                            }
                            icon={
                                <Save
                                    size={15}
                                />
                            }
                            onClick={
                                handleSubmit
                            }
                        >
                            Guardar nota
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}