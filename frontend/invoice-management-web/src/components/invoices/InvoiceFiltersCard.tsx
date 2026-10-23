import {
    Button,
    InputNumber,
    Select,
} from "antd";

import {
    Filter,
    RotateCcw,
    Search,
} from "lucide-react";

import type {
    InvoiceFilters,
    InvoiceStatus,
    PaymentStatus,
} from "../../types/invoice";

type Props = {
    filters: InvoiceFilters;

    onChange: (
        filters: InvoiceFilters
    ) => void;

    onSearch: () => void;

    onReset: () => void;

    loading?: boolean;
};

export default function InvoiceFiltersCard({
    filters,
    onChange,
    onSearch,
    onReset,
    loading,
}: Props) {
    return (
        <section
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]
            "
        >
            <div
                className="
                    mb-4
                    flex
                    items-center
                    gap-2
                "
            >
                <Filter
                    size={16}
                    className="
                        text-[#0f5f7a]
                    "
                />

                <div>
                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Buscar facturas
                    </h2>

                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-slate-400
                        "
                    >
                        Filtra el listado
                        por número y estado.
                    </p>
                </div>
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-[180px_1fr_1fr_auto]
                    lg:items-end
                "
            >
                <div>
                    <label
                        className="
                            mb-1.5
                            block
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.05em]
                            text-slate-500
                        "
                    >
                        N° factura
                    </label>

                    <InputNumber
                        className="w-full"
                        min={1}
                        placeholder="Ej: 22"
                        value={
                            filters.invoiceNumber
                        }
                        onPressEnter={
                            onSearch
                        }
                        onChange={(
                            value
                        ) => {
                            const nextFilters = {
                                ...filters,
                            };

                            if (
                                value !== null
                            ) {
                                nextFilters.invoiceNumber =
                                    value;
                            } else {
                                delete nextFilters
                                    .invoiceNumber;
                            }

                            onChange(
                                nextFilters
                            );
                        }}
                    />
                </div>

                <div>
                    <label
                        className="
                            mb-1.5
                            block
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.05em]
                            text-slate-500
                        "
                    >
                        Estado factura
                    </label>

                    <Select
                        className="w-full"
                        allowClear
                        placeholder="Todos los estados"
                        value={
                            filters.invoiceStatus
                        }
                        options={[
                            {
                                value:
                                    "Issued",
                                label:
                                    "Emitida",
                            },
                            {
                                value:
                                    "Partial",
                                label:
                                    "Parcial",
                            },
                            {
                                value:
                                    "Cancelled",
                                label:
                                    "Cancelada",
                            },
                        ]}
                        onChange={(
                            value:
                                | InvoiceStatus
                                | undefined
                        ) => {
                            const nextFilters = {
                                ...filters,
                            };

                            if (
                                value
                            ) {
                                nextFilters.invoiceStatus =
                                    value;
                            } else {
                                delete nextFilters
                                    .invoiceStatus;
                            }

                            onChange(
                                nextFilters
                            );
                        }}
                    />
                </div>

                <div>
                    <label
                        className="
                            mb-1.5
                            block
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.05em]
                            text-slate-500
                        "
                    >
                        Estado pago
                    </label>

                    <Select
                        className="w-full"
                        allowClear
                        placeholder="Todos los estados"
                        value={
                            filters.paymentStatus
                        }
                        options={[
                            {
                                value:
                                    "Pending",
                                label:
                                    "Pendiente",
                            },
                            {
                                value:
                                    "Overdue",
                                label:
                                    "Vencida",
                            },
                            {
                                value:
                                    "Paid",
                                label:
                                    "Pagada",
                            },
                        ]}
                        onChange={(
                            value:
                                | PaymentStatus
                                | undefined
                        ) => {
                            const nextFilters = {
                                ...filters,
                            };

                            if (
                                value
                            ) {
                                nextFilters.paymentStatus =
                                    value;
                            } else {
                                delete nextFilters
                                    .paymentStatus;
                            }

                            onChange(
                                nextFilters
                            );
                        }}
                    />
                </div>

                <div
                    className="
                        flex
                        gap-2
                        sm:col-span-2
                        lg:col-span-1
                    "
                >
                    <Button
                        type="primary"
                        loading={
                            loading
                        }
                        icon={
                            <Search
                                size={15}
                            />
                        }
                        onClick={
                            onSearch
                        }
                    >
                        Buscar
                    </Button>

                    <Button
                        title="Limpiar filtros"
                        disabled={
                            loading
                        }
                        icon={
                            <RotateCcw
                                size={15}
                            />
                        }
                        onClick={
                            onReset
                        }
                    >
                        Limpiar
                    </Button>
                </div>
            </div>
        </section>
    );
}