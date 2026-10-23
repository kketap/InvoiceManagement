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

function dateTimestamp(
    value: string
) {
    return new Date(
        value
    ).getTime();
}

type Props = {
    invoices:
    InvoiceListItem[];

    loading?:
    boolean;
};

export default function InvoiceTableCard({
    invoices,
    loading = false,
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
        setCurrentPage(
            1
        );
    }, [
        invoices,
    ]);

    const columns:
        ColumnsType<InvoiceListItem> =
        [
            {
                title: "N°",
                dataIndex: "invoiceNumber",
                key: "invoiceNumber",
                width: 90,

                sorter: (
                    a,
                    b
                ) =>
                    a.invoiceNumber -
                    b.invoiceNumber,

                sortDirections: [
                    "ascend",
                    "descend",
                ],
            },

            {
                title: "Cliente",
                key: "customer",
                minWidth: 190,

                sorter: (
                    a,
                    b
                ) =>
                    a.customerName.localeCompare(
                        b.customerName,
                        "es",
                        {
                            sensitivity: "base",
                        }
                    ),

                sortDirections: [
                    "ascend",
                    "descend",
                ],

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
                dataIndex: "invoiceDate",
                key: "invoiceDate",
                width: 120,

                sorter: (
                    a,
                    b
                ) =>
                    dateTimestamp(
                        a.invoiceDate
                    ) -
                    dateTimestamp(
                        b.invoiceDate
                    ),

                sortDirections: [
                    "ascend",
                    "descend",
                ],

                render: (
                    value: string
                ) =>
                    formatDate(
                        value
                    ),
            },

            {
                title: "Vencimiento",
                dataIndex: "paymentDueDate",
                key: "paymentDueDate",
                width: 130,

                sorter: (
                    a,
                    b
                ) =>
                    dateTimestamp(
                        a.paymentDueDate
                    ) -
                    dateTimestamp(
                        b.paymentDueDate
                    ),

                sortDirections: [
                    "ascend",
                    "descend",
                ],

                render: (
                    value: string
                ) =>
                    formatDate(
                        value
                    ),
            },

            {
                title: "Total",
                dataIndex: "totalAmount",
                key: "totalAmount",
                width: 130,
                align: "right",

                sorter: (
                    a,
                    b
                ) =>
                    a.totalAmount -
                    b.totalAmount,

                sortDirections: [
                    "ascend",
                    "descend",
                ],

                render: (
                    value: number
                ) =>
                    formatCurrency(
                        value
                    ),
            },

            {
                title: "Saldo",
                dataIndex: "pendingAmount",
                key: "pendingAmount",
                width: 130,
                align: "right",

                sorter: (
                    a,
                    b
                ) =>
                    a.pendingAmount -
                    b.pendingAmount,

                sortDirections: [
                    "ascend",
                    "descend",
                ],

                render: (
                    value: number
                ) =>
                    formatCurrency(
                        value
                    ),
            },

            {
                title: "Estado",
                dataIndex: "invoiceStatus",
                key: "invoiceStatus",
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
                dataIndex: "paymentStatus",
                key: "paymentStatus",
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
        <section
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
                    border-b
                    border-slate-100
                    px-5
                    py-4
                "
            >
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
                    Listado de facturas activas y consistentes.
                </p>
            </div>

            <Table
                rowKey="id"
                size="small"
                loading={
                    loading
                }
                columns={
                    columns
                }
                dataSource={
                    invoices
                }
                pagination={{
                    current:
                        currentPage,

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
                    x: 1120,
                }}
            />
        </section>
    );
}
