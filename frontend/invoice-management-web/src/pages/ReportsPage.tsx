import {
    Alert,
    Button,
    Empty,
    Spin,
    Table,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Eye,
    FileWarning,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    getInvoices,
} from "../api/invoices";

import {
    getInconsistentInvoicesReport,
    getOverdueInvoicesReport,
    getPaymentSummaryReport,
} from "../api/reports";

import InvoiceStatusTag
    from "../components/invoices/InvoiceStatusTag";

import type {
    InvoiceListItem,
    PaymentStatus,
} from "../types/invoice";

import type {
    InconsistentInvoiceReportItem,
    OverdueInvoiceReportItem,
    PaymentSummaryReport,
    PaymentStatusReportItem,
} from "../types/report";

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

function getPaymentStatusLabel(
    status: PaymentStatus
) {
    switch (status) {
        case "Paid":
            return "Pagadas";

        case "Pending":
            return "Pendientes";

        case "Overdue":
            return "Vencidas";

        default:
            return status;
    }
}

export default function ReportsPage() {
    const navigate =
        useNavigate();

    const [
        paymentSummary,
        setPaymentSummary,
    ] =
        useState<PaymentSummaryReport | null>(
            null
        );

    const [
        overdueInvoices,
        setOverdueInvoices,
    ] =
        useState<
            OverdueInvoiceReportItem[]
        >([]);

    const [
        inconsistentInvoices,
        setInconsistentInvoices,
    ] =
        useState<
            InconsistentInvoiceReportItem[]
        >([]);

    const [
        selectedPaymentStatus,
        setSelectedPaymentStatus,
    ] =
        useState<PaymentStatus | null>(
            null
        );

    const [
        paymentStatusInvoices,
        setPaymentStatusInvoices,
    ] =
        useState<
            InvoiceListItem[]
        >([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        loadingPaymentInvoices,
        setLoadingPaymentInvoices,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );

    const [
        paymentInvoicesError,
        setPaymentInvoicesError,
    ] =
        useState<string | null>(
            null
        );

    const [
        overdueCurrentPage,
        setOverdueCurrentPage,
    ] =
        useState(1);

    const [
        overduePageSize,
        setOverduePageSize,
    ] =
        useState(10);

    const [
        paymentCurrentPage,
        setPaymentCurrentPage,
    ] =
        useState(1);

    const [
        paymentPageSize,
        setPaymentPageSize,
    ] =
        useState(10);

    const loadReports =
        useCallback(
            async () => {
                try {
                    setLoading(
                        true
                    );

                    setError(
                        null
                    );

                    const [
                        paymentData,
                        overdueData,
                        inconsistentData,
                    ] =
                        await Promise.all([
                            getPaymentSummaryReport(),
                            getOverdueInvoicesReport(),
                            getInconsistentInvoicesReport(),
                        ]);

                    setPaymentSummary(
                        paymentData
                    );

                    setOverdueInvoices(
                        overdueData
                    );

                    setInconsistentInvoices(
                        inconsistentData
                    );
                } catch (
                error: any
                ) {
                    console.error(
                        error
                    );

                    setError(
                        error?.message ??
                        "No fue posible cargar los reportes."
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
        loadReports();
    }, [loadReports]);

    useEffect(() => {
        setOverdueCurrentPage(
            1
        );
    }, [
        overdueInvoices,
    ]);

    useEffect(() => {
        setPaymentCurrentPage(
            1
        );
    }, [
        paymentStatusInvoices,
    ]);

    async function handlePaymentStatusCardClick(
        status: PaymentStatus
    ) {
        /*
         * Si se vuelve a presionar la misma card,
         * cerramos el desglose.
         */
        if (
            selectedPaymentStatus ===
            status
        ) {
            setSelectedPaymentStatus(
                null
            );

            setPaymentStatusInvoices(
                []
            );

            setPaymentInvoicesError(
                null
            );

            return;
        }

        try {
            setSelectedPaymentStatus(
                status
            );

            setLoadingPaymentInvoices(
                true
            );

            setPaymentInvoicesError(
                null
            );

            const data =
                await getInvoices({
                    paymentStatus:
                        status,
                });

            setPaymentStatusInvoices(
                data
            );
        } catch (
        error: any
        ) {
            console.error(
                error
            );

            setPaymentStatusInvoices(
                []
            );

            setPaymentInvoicesError(
                error?.message ??
                "No fue posible cargar el desglose de facturas."
            );
        } finally {
            setLoadingPaymentInvoices(
                false
            );
        }
    }

    const paymentByStatus =
        useMemo(() => {
            const map =
                new Map<
                    string,
                    PaymentStatusReportItem
                >();

            paymentSummary?.statuses.forEach(
                (
                    item
                ) => {
                    map.set(
                        item.status,
                        item
                    );
                }
            );

            return map;
        }, [
            paymentSummary,
        ]);

    const paid =
        paymentByStatus.get(
            "Paid"
        );

    const pending =
        paymentByStatus.get(
            "Pending"
        );

    const overdue =
        paymentByStatus.get(
            "Overdue"
        );

    function getSelectedReportTotal() {
        if (
            !selectedPaymentStatus
        ) {
            return 0;
        }

        const item =
            paymentByStatus.get(
                selectedPaymentStatus
            );

        return item?.total ?? 0;
    }

    const selectedReportTotal =
        getSelectedReportTotal();

    const excludedInvoicesCount =
        Math.max(
            selectedReportTotal -
            paymentStatusInvoices.length,
            0
        );

    const paymentInvoiceColumns:
        ColumnsType<InvoiceListItem> =
        [
            {
                title:
                    "N° factura",

                dataIndex:
                    "invoiceNumber",

                key:
                    "invoiceNumber",

                width:
                    110,

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
                title:
                    "Cliente",

                key:
                    "customer",

                sorter: (
                    a,
                    b
                ) =>
                    a.customerName.localeCompare(
                        b.customerName,
                        "es",
                        {
                            sensitivity:
                                "base",
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
                title:
                    "Emisión",

                dataIndex:
                    "invoiceDate",

                key:
                    "invoiceDate",

                width:
                    120,

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
                title:
                    "Vencimiento",

                dataIndex:
                    "paymentDueDate",

                key:
                    "paymentDueDate",

                width:
                    125,

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
                title:
                    "Total",

                dataIndex:
                    "totalAmount",

                key:
                    "totalAmount",

                width:
                    130,

                align:
                    "right",

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
                title:
                    "Saldo",

                dataIndex:
                    "pendingAmount",

                key:
                    "pendingAmount",

                width:
                    130,

                align:
                    "right",

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
                title:
                    "Estado",

                dataIndex:
                    "invoiceStatus",

                key:
                    "invoiceStatus",

                width:
                    110,

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
                title:
                    "Pago",

                dataIndex:
                    "paymentStatus",

                key:
                    "paymentStatus",

                width:
                    110,

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

                key:
                    "actions",

                width:
                    60,

                fixed:
                    "right",

                render: (
                    _,
                    invoice
                ) => (
                    <Button
                        type="text"
                        title="Ver detalle"
                        icon={
                            <Eye
                                size={
                                    16
                                }
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

    const overdueColumns:
        ColumnsType<OverdueInvoiceReportItem> =
        [
            {
                title:
                    "N° factura",

                dataIndex:
                    "invoiceNumber",

                key:
                    "invoiceNumber",

                width:
                    110,

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
                title:
                    "Cliente",

                key:
                    "customer",

                sorter: (
                    a,
                    b
                ) =>
                    a.customerName.localeCompare(
                        b.customerName,
                        "es",
                        {
                            sensitivity:
                                "base",
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
                title:
                    "Total",

                dataIndex:
                    "totalAmount",

                key:
                    "totalAmount",

                align:
                    "right",

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
                title:
                    "Vencimiento",

                dataIndex:
                    "paymentDueDate",

                key:
                    "paymentDueDate",

                width:
                    135,

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
                title:
                    "Días vencida",

                dataIndex:
                    "daysOverdue",

                key:
                    "daysOverdue",

                width:
                    120,

                align:
                    "center",

                sorter: (
                    a,
                    b
                ) =>
                    a.daysOverdue -
                    b.daysOverdue,

                sortDirections: [
                    "ascend",
                    "descend",
                ],

                render: (
                    value: number
                ) => (
                    <span
                        className="
                            font-semibold
                            text-rose-600
                        "
                    >
                        {value}
                    </span>
                ),
            },

            {
                title: "",

                key:
                    "actions",

                width:
                    60,

                render: (
                    _,
                    invoice
                ) => (
                    <Button
                        type="text"
                        title="Ver detalle"
                        icon={
                            <Eye
                                size={
                                    16
                                }
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

    const inconsistentColumns:
        ColumnsType<InconsistentInvoiceReportItem> =
        [
            {
                title:
                    "N° factura",

                dataIndex:
                    "invoiceNumber",

                key:
                    "invoiceNumber",

                width:
                    110,

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
                title:
                    "Cliente",

                dataIndex:
                    "customerName",

                key:
                    "customerName",
            },

            {
                title:
                    "Total declarado",

                dataIndex:
                    "declaredTotal",

                key:
                    "declaredTotal",

                align:
                    "right",

                sorter: (
                    a,
                    b
                ) =>
                    a.declaredTotal -
                    b.declaredTotal,

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
                title:
                    "Total detalle",

                dataIndex:
                    "detailsTotal",

                key:
                    "detailsTotal",

                align:
                    "right",

                sorter: (
                    a,
                    b
                ) =>
                    a.detailsTotal -
                    b.detailsTotal,

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
                title:
                    "Diferencia",

                dataIndex:
                    "difference",

                key:
                    "difference",

                align:
                    "right",

                sorter: (
                    a,
                    b
                ) =>
                    a.difference -
                    b.difference,

                sortDirections: [
                    "ascend",
                    "descend",
                ],

                render: (
                    value: number
                ) => (
                    <span
                        className="
                            font-semibold
                            text-rose-600
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
        ];

    if (loading) {
        return (
            <div
                className="
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    bg-[#f8fafc]
                "
            >
                <Spin
                    size="large"
                    description="Cargando reportes..."
                />
            </div>
        );
    }

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
                    <section>
                        <h1
                            className="
                                text-2xl
                                font-semibold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            Reportes
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Resumen operativo,
                            facturas vencidas e
                            inconsistencias detectadas.
                        </p>
                    </section>

                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            title="No fue posible cargar los reportes"
                            description={
                                error
                            }
                        />
                    )}

                    <section
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >
                        <ReportKpiCard
                            title="Total procesadas"
                            value={
                                paymentSummary
                                    ?.totalInvoices ??
                                0
                            }
                            description="Total consideradas en el reporte. Incluye facturas consistentes e inconsistentes."
                            icon={
                                FileWarning
                            }
                        />

                        <ReportKpiCard
                            title="Pagadas"
                            value={
                                paid?.total ??
                                0
                            }
                            description={
                                `${paid?.percentage ?? 0}% del total procesado`
                            }
                            icon={
                                CheckCircle2
                            }
                            selected={
                                selectedPaymentStatus ===
                                "Paid"
                            }
                            onClick={() =>
                                handlePaymentStatusCardClick(
                                    "Paid"
                                )
                            }
                        />

                        <ReportKpiCard
                            title="Pendientes"
                            value={
                                pending?.total ??
                                0
                            }
                            description={
                                `${pending?.percentage ?? 0}% del total procesado`
                            }
                            icon={
                                Clock3
                            }
                            selected={
                                selectedPaymentStatus ===
                                "Pending"
                            }
                            onClick={() =>
                                handlePaymentStatusCardClick(
                                    "Pending"
                                )
                            }
                        />

                        <ReportKpiCard
                            title="Vencidas"
                            value={
                                overdue?.total ??
                                0
                            }
                            description={
                                `${overdue?.percentage ?? 0}% del total procesado`
                            }
                            icon={
                                AlertTriangle
                            }
                            selected={
                                selectedPaymentStatus ===
                                "Overdue"
                            }
                            onClick={() =>
                                handlePaymentStatusCardClick(
                                    "Overdue"
                                )
                            }
                        />
                    </section>

                    {selectedPaymentStatus && (
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
                                    flex
                                    flex-col
                                    gap-3
                                    border-b
                                    border-slate-100
                                    px-5
                                    py-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
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
                                        Desglose:
                                        {" "}
                                        {
                                            getPaymentStatusLabel(
                                                selectedPaymentStatus
                                            )
                                        }
                                    </h2>

                                    <p
                                        className="
            mt-1
            text-xs
            text-slate-400
        "
                                    >
                                        {
                                            paymentStatusInvoices.length
                                        }
                                        {" "}
                                        facturas activas y consistentes
                                        en este estado.
                                    </p>

                                    <p
                                        className="
        mt-1
        text-[11px]
        text-slate-400
    "
                                    >
                                        {
                                            paymentStatusInvoices.length
                                        }
                                        {" "}
                                        activas de
                                        {" "}
                                        {
                                            selectedReportTotal
                                        }
                                        {" "}
                                        procesadas.
                                    </p>
                                </div>

                                <Button
                                    onClick={() => {
                                        setSelectedPaymentStatus(
                                            null
                                        );

                                        setPaymentStatusInvoices(
                                            []
                                        );

                                        setPaymentInvoicesError(
                                            null
                                        );
                                    }}
                                >
                                    Cerrar desglose
                                </Button>
                            </div>

                            {!loadingPaymentInvoices &&
                                !paymentInvoicesError &&
                                excludedInvoicesCount >
                                0 && (
                                    <div
                                        className="
                border-b
                border-amber-100
                bg-amber-50/60
                px-5
                py-3
            "
                                    >
                                        <Alert
                                            type="warning"
                                            showIcon
                                            title={
                                                excludedInvoicesCount ===
                                                    1
                                                    ? "1 factura adicional fue excluida del sistema activo"
                                                    : `${excludedInvoicesCount} facturas adicionales fueron excluidas del sistema activo`
                                            }
                                            description={
                                                excludedInvoicesCount ===
                                                    1
                                                    ? "Esta factura está incluida en el total procesado del reporte, pero no aparece en el desglose porque presenta inconsistencias."
                                                    : "Estas facturas están incluidas en el total procesado del reporte, pero no aparecen en el desglose porque presentan inconsistencias."
                                            }
                                        />
                                    </div>
                                )}

                            {paymentInvoicesError && (
                                <div
                                    className="
                                        p-5
                                    "
                                >
                                    <Alert
                                        type="error"
                                        showIcon
                                        title="No fue posible cargar el desglose"
                                        description={
                                            paymentInvoicesError
                                        }
                                    />
                                </div>
                            )}

                            {!paymentInvoicesError &&
                                loadingPaymentInvoices ? (
                                <div
                                    className="
                                        flex
                                        min-h-[250px]
                                        items-center
                                        justify-center
                                    "
                                >
                                    <Spin
                                        description="Cargando facturas..."
                                    />
                                </div>
                            ) : !paymentInvoicesError &&
                                paymentStatusInvoices.length >
                                0 ? (
                                <Table
                                    rowKey="id"
                                    size="small"
                                    columns={
                                        paymentInvoiceColumns
                                    }
                                    dataSource={
                                        paymentStatusInvoices
                                    }
                                    pagination={{
                                        current:
                                            paymentCurrentPage,

                                        pageSize:
                                            paymentPageSize,

                                        total:
                                            paymentStatusInvoices.length,

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
                                                paymentPageSize
                                            ) {
                                                setPaymentPageSize(
                                                    newPageSize
                                                );

                                                setPaymentCurrentPage(
                                                    1
                                                );

                                                return;
                                            }

                                            setPaymentCurrentPage(
                                                page
                                            );
                                        },
                                    }}
                                    scroll={{
                                        x:
                                            1100,
                                    }}
                                />
                            ) : !paymentInvoicesError ? (
                                <div
                                    className="
                                        px-6
                                        py-12
                                    "
                                >
                                    <Empty
                                        description="No existen facturas para este estado."
                                    />
                                </div>
                            ) : null}
                        </section>
                    )}

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
                                Facturas vencidas
                                por más de 30 días
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Facturas consistentes,
                                sin pago y sin notas
                                de crédito.
                            </p>
                        </div>

                        {overdueInvoices.length >
                            0 ? (
                            <Table
                                rowKey="id"
                                size="small"
                                columns={
                                    overdueColumns
                                }
                                dataSource={
                                    overdueInvoices
                                }
                                pagination={{
                                    current:
                                        overdueCurrentPage,

                                    pageSize:
                                        overduePageSize,

                                    total:
                                        overdueInvoices.length,

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
                                            overduePageSize
                                        ) {
                                            setOverduePageSize(
                                                newPageSize
                                            );

                                            setOverdueCurrentPage(
                                                1
                                            );

                                            return;
                                        }

                                        setOverdueCurrentPage(
                                            page
                                        );
                                    },
                                }}
                                scroll={{
                                    x: 850,
                                }}
                            />
                        ) : (
                            <div
                                className="
                                    px-6
                                    py-12
                                "
                            >
                                <Empty
                                    description="No existen facturas vencidas para este reporte."
                                />
                            </div>
                        )}
                    </section>

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
                                Facturas inconsistentes
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Diferencias detectadas
                                entre el total declarado
                                y la suma de los detalles.
                            </p>
                        </div>

                        {inconsistentInvoices.length >
                            0 ? (
                            <Table
                                rowKey="id"
                                size="small"
                                columns={
                                    inconsistentColumns
                                }
                                dataSource={
                                    inconsistentInvoices
                                }
                                pagination={
                                    false
                                }
                                scroll={{
                                    x: 800,
                                }}
                            />
                        ) : (
                            <div
                                className="
                                    px-6
                                    py-12
                                "
                            >
                                <Empty
                                    description="No existen facturas inconsistentes."
                                />
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

type ReportKpiCardProps = {
    title: string;

    value:
    | string
    | number;

    description: string;

    icon:
    typeof FileWarning;

    selected?: boolean;

    onClick?: () => void;
};

function ReportKpiCard({
    title,
    value,
    description,
    icon: Icon,
    selected = false,
    onClick,
}: ReportKpiCardProps) {
    return (
        <article
            role={
                onClick
                    ? "button"
                    : undefined
            }
            tabIndex={
                onClick
                    ? 0
                    : undefined
            }
            onClick={
                onClick
            }
            onKeyDown={(
                event
            ) => {
                if (
                    !onClick
                ) {
                    return;
                }

                if (
                    event.key ===
                    "Enter" ||
                    event.key ===
                    " "
                ) {
                    event.preventDefault();

                    onClick();
                }
            }}
            className={`
                rounded-xl
                border
                bg-white
                p-4
                shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                transition-all
                duration-200

                ${selected
                    ? `
                            border-[#0f5f7a]
                            ring-2
                            ring-[#0f5f7a]/10
                          `
                    : `
                            border-slate-200
                          `
                }

                ${onClick
                    ? `
                            cursor-pointer
                            hover:-translate-y-0.5
                            hover:border-[#0f5f7a]/40
                            hover:shadow-md
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#0f5f7a]/20
                          `
                    : ""
                }
            `}
        >
            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div>
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-2
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        {value}
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-slate-400
                        "
                    >
                        {description}
                    </p>
                </div>

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full

                        ${selected
                            ? `
                                    bg-[#0f5f7a]
                                    text-white
                                  `
                            : `
                                    bg-slate-50
                                    text-[#0f5f7a]
                                  `
                        }
                    `}
                >
                    <Icon
                        size={18}
                    />
                </div>
            </div>
        </article>
    );
}