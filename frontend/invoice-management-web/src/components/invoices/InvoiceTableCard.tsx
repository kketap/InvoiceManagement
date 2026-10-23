import {
    Button,
    Table,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    Eye,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    InvoiceListItem,
} from "../../types/invoice";

import InvoiceStatusTag
    from "./InvoiceStatusTag";

type Props = {
    invoices: InvoiceListItem[];
    loading?: boolean;
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

function formatDate(
    value: string
) {
    return new Intl.DateTimeFormat(
        "es-CL"
    ).format(
        new Date(value)
    );
}

export default function InvoiceTableCard({
    invoices,
    loading,
}: Props) {
    const navigate =
        useNavigate();

    const [
        currentPage,
        setCurrentPage,
    ] =
        useState(1);

    const [
        pageSize,
        setPageSize,
    ] =
        useState(10);

    useEffect(() => {
        setCurrentPage(1);
    }, [invoices]);

    const columns:
        ColumnsType<InvoiceListItem> =
        [
            {
                title: "N°",
                dataIndex:
                    "invoiceNumber",
                key:
                    "invoiceNumber",
                width: 70,

                sorter: (
                    a,
                    b
                ) =>
                    a.invoiceNumber -
                    b.invoiceNumber,
            },

            {
                title: "Cliente",
                key: "customer",
                width: 230,

                render: (
                    _,
                    invoice
                ) => (
                    <div>
                        <p
                            className="
                                font-medium
                                text-slate-800
                            "
                        >
                            {
                                invoice.customerName
                            }
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                text-slate-400
                            "
                        >
                            {
                                invoice.customerRun
                            }
                        </p>
                    </div>
                ),
            },

            {
                title: "Emisión",
                dataIndex:
                    "invoiceDate",
                key:
                    "invoiceDate",
                width: 115,

                render: (
                    value: string
                ) =>
                    formatDate(
                        value
                    ),
            },

            {
                title:
                    "Vencimiento",

                dataIndex:
                    "paymentDueDate",

                key:
                    "paymentDueDate",

                width: 120,

                render: (
                    value: string
                ) =>
                    formatDate(
                        value
                    ),
            },

            {
                title: "Total",

                dataIndex:
                    "totalAmount",

                key:
                    "totalAmount",

                align: "right",

                width: 125,

                render: (
                    value: number
                ) => (
                    <span
                        className="
                            font-medium
                            text-slate-800
                        "
                    >
                        {
                            formatCurrency(
                                value
                            )
                        }
                    </span>
                ),
            },

            {
                title: "Saldo",

                dataIndex:
                    "pendingAmount",

                key:
                    "pendingAmount",

                align: "right",

                width: 125,

                render: (
                    value: number
                ) =>
                    formatCurrency(
                        value
                    ),
            },

            {
                title: "Estado",

                dataIndex:
                    "invoiceStatus",

                key:
                    "invoiceStatus",

                width: 110,

                render: (
                    value
                ) => (
                    <InvoiceStatusTag
                        type="invoice"
                        value={
                            value
                        }
                    />
                ),
            },

            {
                title: "Pago",

                dataIndex:
                    "paymentStatus",

                key:
                    "paymentStatus",

                width: 110,

                render: (
                    value
                ) => (
                    <InvoiceStatusTag
                        type="payment"
                        value={
                            value
                        }
                    />
                ),
            },

            {
                title: "",

                key: "actions",

                width: 60,

                fixed: "right",

                render: (
                    _,
                    invoice
                ) => (
                    <Button
                        type="text"
                        title="Ver detalle"
                        icon={
                            <Eye
                                size={16}
                            />
                        }
                        onClick={() =>
                            navigate(
                                `/invoices/${invoice.id}`
                            )
                        }
                    />
                ),
            },
        ];

    return (
        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    px-5
                    py-4
                "
            >
                <div>
                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Facturas
                    </h2>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                        "
                    >
                        Consulta y revisa
                        el estado actual
                        de las facturas.
                    </p>
                </div>

                <span
                    className="
                        rounded-md
                        bg-slate-100
                        px-2
                        py-1
                        text-[10px]
                        font-medium
                        text-slate-500
                    "
                >
                    {invoices.length}
                    {" "}
                    registros
                </span>
            </div>

            <Table
                rowKey="id"
                size="small"
                columns={
                    columns
                }
                dataSource={
                    invoices
                }
                loading={
                    loading
                }
                pagination={{
                    current:
                        currentPage,

                    pageSize:
                        pageSize,

                    total:
                        invoices.length,

                    showSizeChanger:
                        true,

                    showQuickJumper:
                        false,

                    pageSizeOptions: [
                        10,
                        20,
                        50,
                    ],

                    showTotal: (
                        total,
                        range
                    ) =>
                        `${range[0]}-${range[1]} de ${total} facturas`,

                    onChange: (
                        page,
                        newPageSize
                    ) => {
                        if (
                            newPageSize !==
                            pageSize
                        ) {
                            setPageSize(
                                newPageSize
                            );

                            setCurrentPage(
                                1
                            );

                            return;
                        }

                        setCurrentPage(
                            page
                        );
                    },

                    position: [
                        "bottomRight",
                    ],
                }}
                scroll={{
                    x: 1180,
                }}
            />
        </div>
    );
}