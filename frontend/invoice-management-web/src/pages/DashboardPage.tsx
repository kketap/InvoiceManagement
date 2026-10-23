import {
    Alert,
    Button,
    Empty,
    Select,
    Spin,
    Table,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    AlertTriangle,
    BarChart3,
    CheckCircle2,
    CircleDollarSign,
    DatabaseBackup,
    Eye,
    FileText,
    FileWarning,
    ReceiptText,
    RefreshCcw,
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
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    getInvoices,
} from "../api/invoices";

import {
    getInconsistentInvoicesReport,
    getOverdueInvoicesReport,
} from "../api/reports";

import type {
    InvoiceListItem,
} from "../types/invoice";

import type {
    InconsistentInvoiceReportItem,
    OverdueInvoiceReportItem,
} from "../types/report";

function formatCurrency(
    value: number
) {
    return new Intl.NumberFormat(
        "es-CL",
        {
            style:
                "currency",

            currency:
                "CLP",

            maximumFractionDigits:
                0,
        }
    ).format(
        value
    );
}

function formatDate(
    value: string
) {
    return new Intl.DateTimeFormat(
        "es-CL"
    ).format(
        new Date(
            value
        )
    );
}

function dateTimestamp(
    value: string
) {
    return new Date(
        value
    ).getTime();
}

const MONTHS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
];

type FinancialYear =
    number |
    "all";

type FinancialChartItem = {
    label: string;
    invoices: number;
    amount: number;
};

export default function DashboardPage() {
    const navigate =
        useNavigate();

    const [
        invoices,
        setInvoices,
    ] =
        useState<
            InvoiceListItem[]
        >([]);

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
        loading,
        setLoading,
    ] =
        useState(
            true
        );

    const [
        error,
        setError,
    ] =
        useState<
            string | null
        >(
            null
        );

    /*
     * "all" significa que el resumen
     * financiero considera todos los años.
     */
    const [
        selectedYear,
        setSelectedYear,
    ] =
        useState<
            FinancialYear
        >(
            "all"
        );

    const loadDashboard =
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
                        invoiceData,
                        overdueData,
                        inconsistentData,
                    ] =
                        await Promise.all([
                            getInvoices(),

                            getOverdueInvoicesReport(),

                            getInconsistentInvoicesReport(),
                        ]);

                    setInvoices(
                        invoiceData
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
                        "No fue posible cargar el dashboard."
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
        loadDashboard();
    }, [
        loadDashboard,
    ]);

    /*
     * Años realmente existentes
     * dentro de las facturas activas.
     */
    const availableYears =
        useMemo(() => {
            const years =
                invoices
                    .map(
                        (
                            invoice
                        ) =>
                            new Date(
                                invoice.invoiceDate
                            ).getFullYear()
                    )
                    .filter(
                        (
                            year,
                            index,
                            array
                        ) =>
                            array.indexOf(
                                year
                            ) ===
                            index
                    )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            b -
                            a
                    );

            return years;
        }, [
            invoices,
        ]);

    /*
     * ==================================================
     * MÉTRICAS OPERATIVAS GENERALES
     * ==================================================
     *
     * Estas NO dependen del selector de año.
     * Representan el estado general actual del sistema.
     */

    const activeTotal =
        invoices.length;

    const paidInvoices =
        invoices.filter(
            (
                invoice
            ) =>
                invoice.paymentStatus ===
                "Paid"
        );

    const pendingInvoices =
        invoices.filter(
            (
                invoice
            ) =>
                invoice.paymentStatus ===
                "Pending"
        );

    const overdueActiveInvoices =
        invoices.filter(
            (
                invoice
            ) =>
                invoice.paymentStatus ===
                "Overdue"
        );

    /*
     * ==================================================
     * FACTURAS DEL RESUMEN FINANCIERO
     * ==================================================
     *
     * Este arreglo sí depende del selector.
     *
     * Todos los años:
     *     usa todas las facturas activas.
     *
     * Año específico:
     *     usa solo las facturas de dicho año.
     */

    const financialInvoices =
        useMemo(() => {
            if (
                selectedYear ===
                "all"
            ) {
                return invoices;
            }

            return invoices.filter(
                (
                    invoice
                ) => {
                    const date =
                        new Date(
                            invoice.invoiceDate
                        );

                    return (
                        date.getFullYear() ===
                        selectedYear
                    );
                }
            );
        }, [
            invoices,
            selectedYear,
        ]);

    /*
     * ==================================================
     * MÉTRICAS FINANCIERAS FILTRADAS
     * ==================================================
     */

    const totalAmount =
        useMemo(
            () =>
                financialInvoices.reduce(
                    (
                        accumulator,
                        invoice
                    ) =>
                        accumulator +
                        invoice.totalAmount,
                    0
                ),
            [
                financialInvoices,
            ]
        );

    const totalPendingAmount =
        useMemo(
            () =>
                financialInvoices.reduce(
                    (
                        accumulator,
                        invoice
                    ) =>
                        accumulator +
                        invoice.pendingAmount,
                    0
                ),
            [
                financialInvoices,
            ]
        );

    const totalPaidAmount =
        useMemo(
            () =>
                financialInvoices
                    .filter(
                        (
                            invoice
                        ) =>
                            invoice.paymentStatus ===
                            "Paid"
                    )
                    .reduce(
                        (
                            accumulator,
                            invoice
                        ) =>
                            accumulator +
                            invoice.totalAmount,
                        0
                    ),
            [
                financialInvoices,
            ]
        );

    /*
     * ==================================================
     * GRÁFICO GENERAL DE ESTADOS
     * ==================================================
     *
     * Este gráfico sigue siendo global,
     * independiente del selector financiero.
     */

    const paymentChartData =
        useMemo(
            () => [
                {
                    name:
                        "Pagadas",

                    value:
                        paidInvoices.length,

                    key:
                        "paid",
                },

                {
                    name:
                        "Pendientes",

                    value:
                        pendingInvoices.length,

                    key:
                        "pending",
                },

                {
                    name:
                        "Vencidas",

                    value:
                        overdueActiveInvoices.length,

                    key:
                        "overdue",
                },
            ],
            [
                paidInvoices.length,
                pendingInvoices.length,
                overdueActiveInvoices.length,
            ]
        );

    /*
     * ==================================================
     * FACTURAS QUE REQUIEREN ATENCIÓN
     * ==================================================
     */

    const attentionInvoices =
        useMemo(() => {
            return [
                ...overdueInvoices,
            ]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.daysOverdue -
                        a.daysOverdue
                )
                .slice(
                    0,
                    8
                );
        }, [
            overdueInvoices,
        ]);

    const attentionColumns:
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
                        { sensitivity: "base" }
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
                    value:
                        number
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
                    130,

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
                    value:
                        string
                ) =>
                    formatDate(
                        value
                    ),
            },

            {
                title:
                    "Días",

                dataIndex:
                    "daysOverdue",

                key:
                    "daysOverdue",

                width:
                    90,

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
                    value:
                        number
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
                title:
                    "",

                key:
                    "actions",

                width:
                    55,

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

    /*
     * ==================================================
     * FACTURAS POR MES
     * ==================================================
     *
     * Solo se utiliza cuando se selecciona
     * un año específico.
     */

    const monthlyInvoices =
        useMemo<
            FinancialChartItem[]
        >(() => {
            const months:
                FinancialChartItem[] =
                MONTHS.map(
                    (
                        month
                    ) => ({
                        label:
                            month,

                        invoices:
                            0,

                        amount:
                            0,
                    })
                );

            if (
                selectedYear ===
                "all"
            ) {
                return months;
            }

            financialInvoices.forEach(
                (
                    invoice
                ) => {
                    const date =
                        new Date(
                            invoice.invoiceDate
                        );

                    const monthIndex =
                        date.getMonth();

                    months[
                        monthIndex
                    ].invoices +=
                        1;

                    months[
                        monthIndex
                    ].amount +=
                        invoice.totalAmount;
                }
            );

            return months;
        }, [
            financialInvoices,
            selectedYear,
        ]);

    const yearlyInvoices =
        useMemo<
            FinancialChartItem[]
        >(() => {
            return availableYears
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) =>
                        a -
                        b
                )
                .map(
                    (
                        year
                    ) => {
                        const yearInvoices =
                            invoices.filter(
                                (
                                    invoice
                                ) =>
                                    new Date(
                                        invoice.invoiceDate
                                    ).getFullYear() ===
                                    year
                            );

                        const amount =
                            yearInvoices.reduce(
                                (
                                    accumulator,
                                    invoice
                                ) =>
                                    accumulator +
                                    invoice.totalAmount,
                                0
                            );

                        return {
                            label:
                                year.toString(),

                            invoices:
                                yearInvoices.length,

                            amount,
                        };
                    }
                );
        }, [
            invoices,
            availableYears,
        ]);

    const financialChartData:
        FinancialChartItem[] =
        selectedYear ===
            "all"
            ? yearlyInvoices
            : monthlyInvoices;

    if (
        loading
    ) {
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
                    description="Cargando dashboard..."
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
                    {/* =====================================
                        HEADER
                    ====================================== */}

                    <section
                        className="
                            flex
                            flex-col
                            gap-4
                            lg:flex-row
                            lg:items-start
                            lg:justify-between
                        "
                    >
                        <div>
                            <h1
                                className="
                                    text-2xl
                                    font-semibold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                Dashboard
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Resumen general del estado
                                operativo y financiero del
                                sistema de facturas.
                            </p>
                        </div>

                        <Button
                            icon={
                                <RefreshCcw
                                    size={
                                        15
                                    }
                                />
                            }
                            loading={
                                loading
                            }
                            onClick={
                                loadDashboard
                            }
                        >
                            Actualizar
                        </Button>
                    </section>

                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            title="No fue posible cargar el dashboard"
                            description={
                                error
                            }
                        />
                    )}

                    {/* =====================================
                        KPIS OPERATIVOS
                    ====================================== */}

                    <section
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >
                        <DashboardKpiCard
                            title="Facturas activas"
                            value={
                                activeTotal
                            }
                            description="Facturas consistentes disponibles en el sistema."
                            icon={
                                ReceiptText
                            }
                        />

                        <DashboardKpiCard
                            title="Pagadas"
                            value={
                                paidInvoices.length
                            }
                            description="Facturas activas con pago registrado."
                            icon={
                                CheckCircle2
                            }
                        />

                        <DashboardKpiCard
                            title="Vencidas"
                            value={
                                overdueActiveInvoices.length
                            }
                            description="Facturas activas fuera de plazo."
                            icon={
                                AlertTriangle
                            }
                            warning={
                                overdueActiveInvoices.length >
                                0
                            }
                        />

                        <DashboardKpiCard
                            title="Inconsistentes"
                            value={
                                inconsistentInvoices.length
                            }
                            description="Registros excluidos del sistema activo."
                            icon={
                                FileWarning
                            }
                            warning={
                                inconsistentInvoices.length >
                                0
                            }
                        />
                    </section>

                    {/* =====================================
                        RESUMEN FINANCIERO + ESTADO DE PAGO
                    ====================================== */}

                    <section
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            xl:grid-cols-12
                        "
                    >
                        {/* =================================
                            RESUMEN FINANCIERO
                        ================================== */}

                        <div
                            className="
                                xl:col-span-7
                            "
                        >
                            <div
                                className="
                                    h-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                    shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        sm:items-start
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
                                            Resumen financiero
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            {selectedYear ===
                                                "all"
                                                ? "Montos calculados sobre todas las facturas activas y consistentes."
                                                : `Montos calculados sobre las facturas activas y consistentes de ${selectedYear}.`}
                                        </p>
                                    </div>

                                    {availableYears.length >
                                        0 && (
                                            <Select<
                                                FinancialYear
                                            >
                                                value={
                                                    selectedYear
                                                }
                                                onChange={
                                                    setSelectedYear
                                                }
                                                options={[
                                                    {
                                                        label:
                                                            "Todos los años",

                                                        value:
                                                            "all",
                                                    },

                                                    ...availableYears.map(
                                                        (
                                                            year
                                                        ) => ({
                                                            label:
                                                                year.toString(),

                                                            value:
                                                                year,
                                                        })
                                                    ),
                                                ]}
                                                className="
                                                w-full
                                                sm:w-[170px]
                                            "
                                            />
                                        )}
                                </div>

                                {/* =========================
                                    MÉTRICAS FINANCIERAS
                                ========================== */}

                                <div
                                    className="
                                        mt-5
                                        grid
                                        grid-cols-1
                                        gap-4
                                        sm:grid-cols-3
                                    "
                                >
                                    <FinancialMetric
                                        title="Total facturado"
                                        value={
                                            formatCurrency(
                                                totalAmount
                                            )
                                        }
                                        icon={
                                            CircleDollarSign
                                        }
                                    />

                                    <FinancialMetric
                                        title="Total pagado"
                                        value={
                                            formatCurrency(
                                                totalPaidAmount
                                            )
                                        }
                                        icon={
                                            CheckCircle2
                                        }
                                    />

                                    <FinancialMetric
                                        title="Saldo pendiente"
                                        value={
                                            formatCurrency(
                                                totalPendingAmount
                                            )
                                        }
                                        icon={
                                            AlertTriangle
                                        }
                                    />
                                </div>

                                {/* =========================
                                    GRÁFICO FINANCIERO
                                ========================== */}

                                <div
                                    className="
                                        mt-6
                                        border-t
                                        border-slate-100
                                        pt-5
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-2
                                            sm:flex-row
                                            sm:items-end
                                            sm:justify-between
                                        "
                                    >
                                        <div>
                                            <h3
                                                className="
                                                    text-sm
                                                    font-semibold
                                                    text-slate-800
                                                "
                                            >
                                                {selectedYear ===
                                                    "all"
                                                    ? "Facturas por año"
                                                    : "Facturas por mes"}
                                            </h3>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >
                                                {selectedYear ===
                                                    "all"
                                                    ? "Cantidad de facturas activas y consistentes registradas por año."
                                                    : `Cantidad de facturas activas y consistentes emitidas durante ${selectedYear}.`}
                                            </p>
                                        </div>

                                        <p
                                            className="
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            <span
                                                className="
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    financialInvoices.length
                                                }
                                            </span>

                                            {" "}

                                            factura
                                            {financialInvoices.length ===
                                                1
                                                ? ""
                                                : "s"}

                                            {" · "}

                                            <span
                                                className="
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    formatCurrency(
                                                        totalAmount
                                                    )
                                                }
                                            </span>
                                        </p>
                                    </div>

                                    {financialChartData.length >
                                        0 ? (
                                        <div
                                            className="
                                                mt-5
                                                h-[300px]
                                                w-full
                                            "
                                        >
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={
                                                        financialChartData
                                                    }
                                                    margin={{
                                                        top:
                                                            10,

                                                        right:
                                                            10,

                                                        left:
                                                            -20,

                                                        bottom:
                                                            0,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        vertical={
                                                            false
                                                        }
                                                        stroke="#e2e8f0"
                                                    />

                                                    <XAxis
                                                        dataKey="label"
                                                        axisLine={
                                                            false
                                                        }
                                                        tickLine={
                                                            false
                                                        }
                                                        tick={{
                                                            fontSize:
                                                                11,

                                                            fill:
                                                                "#94a3b8",
                                                        }}
                                                    />

                                                    <YAxis
                                                        allowDecimals={
                                                            false
                                                        }
                                                        axisLine={
                                                            false
                                                        }
                                                        tickLine={
                                                            false
                                                        }
                                                        tick={{
                                                            fontSize:
                                                                11,

                                                            fill:
                                                                "#94a3b8",
                                                        }}
                                                    />

                                                    <Tooltip
                                                        cursor={{
                                                            fill:
                                                                "rgba(15, 95, 122, 0.04)",
                                                        }}
                                                        formatter={(
                                                            value,
                                                            name,
                                                        ) => {
                                                            if (
                                                                name ===
                                                                "invoices"
                                                            ) {
                                                                const numericValue =
                                                                    Number(
                                                                        value
                                                                    );

                                                                return [
                                                                    `${numericValue} factura${numericValue ===
                                                                        1
                                                                        ? ""
                                                                        : "s"
                                                                    }`,

                                                                    "Cantidad",
                                                                ];
                                                            }

                                                            return [
                                                                value,

                                                                name,
                                                            ];
                                                        }}
                                                        labelFormatter={(
                                                            label
                                                        ) =>
                                                            selectedYear ===
                                                                "all"
                                                                ? `Año ${label}`
                                                                : `${label} ${selectedYear}`
                                                        }
                                                    />

                                                    <Bar
                                                        dataKey="invoices"
                                                        fill="#0f5f7a"
                                                        radius={[
                                                            5,
                                                            5,
                                                            0,
                                                            0,
                                                        ]}
                                                        maxBarSize={
                                                            42
                                                        }
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div
                                            className="
                                                flex
                                                min-h-[300px]
                                                items-center
                                                justify-center
                                            "
                                        >
                                            <Empty
                                                description="No existen facturas para el período seleccionado."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* =================================
                            DISTRIBUCIÓN DE PAGOS
                        ================================== */}

                        <div
                            className="
                                xl:col-span-5
                            "
                        >
                            <div
                                className="
                                    h-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                    shadow-[0_1px_2px_rgba(15,23,42,0.03)]
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
                                        Distribución por estado de pago
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Distribución de las
                                        facturas activas.
                                    </p>
                                </div>

                                <div
                                    className="
                                        mt-3
                                        grid
                                        grid-cols-1
                                        gap-4
                                        md:grid-cols-[1fr_160px]
                                        md:items-center
                                    "
                                >
                                    <div
                                        className="
                                            h-[250px]
                                            min-w-0
                                        "
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={
                                                        paymentChartData
                                                    }
                                                    dataKey="value"
                                                    nameKey="name"
                                                    innerRadius={
                                                        62
                                                    }
                                                    outerRadius={
                                                        92
                                                    }
                                                    paddingAngle={
                                                        3
                                                    }
                                                    stroke="none"
                                                >
                                                    {paymentChartData.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <Cell
                                                                key={
                                                                    item.key
                                                                }
                                                                fill={
                                                                    [
                                                                        "#16a34a",
                                                                        "#d97706",
                                                                        "#e11d48",
                                                                    ][
                                                                    index
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>

                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div
                                        className="
                                            space-y-3
                                        "
                                    >
                                        <ChartLegendItem
                                            label="Pagadas"
                                            value={
                                                paidInvoices.length
                                            }
                                            dotClassName="bg-green-600"
                                        />

                                        <ChartLegendItem
                                            label="Pendientes"
                                            value={
                                                pendingInvoices.length
                                            }
                                            dotClassName="bg-amber-600"
                                        />

                                        <ChartLegendItem
                                            label="Vencidas"
                                            value={
                                                overdueActiveInvoices.length
                                            }
                                            dotClassName="bg-rose-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================
                        ATENCIÓN + ALERTAS
                    ====================================== */}

                    <section
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            xl:grid-cols-12
                        "
                    >
                        <div
                            className="
                                xl:col-span-8
                            "
                        >
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
                                        gap-4
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
                                            Facturas que requieren atención
                                        </h2>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            "
                                        >
                                            Facturas con más días
                                            de atraso y sin pago.
                                        </p>
                                    </div>

                                    <Button
                                        type="link"
                                        onClick={() =>
                                            navigate(
                                                "/reports"
                                            )
                                        }
                                    >
                                        Ver reportes
                                    </Button>
                                </div>

                                {attentionInvoices.length >
                                    0 ? (
                                    <Table
                                        rowKey="id"
                                        size="small"
                                        columns={
                                            attentionColumns
                                        }
                                        dataSource={
                                            attentionInvoices
                                        }
                                        pagination={
                                            false
                                        }
                                        scroll={{
                                            x:
                                                780,
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
                                            description="No existen facturas críticas."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <aside
                            className="
                                space-y-5
                                xl:col-span-4
                            "
                        >
                            {/* =============================
                                ALERTAS
                            ============================== */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                    shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                                "
                            >
                                <h2
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    Alertas
                                </h2>

                                <div
                                    className="
                                        mt-4
                                        space-y-3
                                    "
                                >
                                    <AlertItem
                                        title="Vencidas +30 días"
                                        value={
                                            overdueInvoices.length
                                        }
                                        description="Facturas sin pago ni notas de crédito."
                                        warning={
                                            overdueInvoices.length >
                                            0
                                        }
                                    />

                                    <AlertItem
                                        title="Inconsistentes"
                                        value={
                                            inconsistentInvoices.length
                                        }
                                        description="Facturas excluidas del sistema activo."
                                        warning={
                                            inconsistentInvoices.length >
                                            0
                                        }
                                    />

                                    <AlertItem
                                        title="Pendientes"
                                        value={
                                            pendingInvoices.length
                                        }
                                        description="Facturas aún dentro del plazo de pago."
                                    />
                                </div>
                            </div>

                            {/* =============================
                                ACCESOS RÁPIDOS
                            ============================== */}

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-5
                                    shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                                "
                            >
                                <h2
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-900
                                    "
                                >
                                    Accesos rápidos
                                </h2>

                                <div
                                    className="
                                        mt-4
                                        grid
                                        grid-cols-1
                                        gap-2
                                    "
                                >
                                    <QuickAccessButton
                                        title="Gestionar facturas"
                                        description="Consulta, filtra y revisa el detalle."
                                        icon={
                                            FileText
                                        }
                                        onClick={() =>
                                            navigate(
                                                "/invoices"
                                            )
                                        }
                                    />

                                    <QuickAccessButton
                                        title="Ver reportes"
                                        description="Consulta vencidas e inconsistencias."
                                        icon={
                                            BarChart3
                                        }
                                        onClick={() =>
                                            navigate(
                                                "/reports"
                                            )
                                        }
                                    />

                                    <QuickAccessButton
                                        title="Importar datos"
                                        description="Procesa nuevamente el archivo JSON."
                                        icon={
                                            DatabaseBackup
                                        }
                                        onClick={() =>
                                            navigate(
                                                "/import"
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    );
}

/*
 * ==========================================================
 * KPI CARD
 * ==========================================================
 */

type DashboardKpiCardProps = {
    title:
    string;

    value:
    number |
    string;

    description:
    string;

    icon:
    typeof ReceiptText;

    warning?:
    boolean;
};

function DashboardKpiCard({
    title,
    value,
    description,
    icon:
    Icon,
    warning =
    false,
}: DashboardKpiCardProps) {
    return (
        <article
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
                        className={`
                            mt-2
                            text-2xl
                            font-semibold
                            tracking-tight

                            ${warning
                                ? "text-rose-600"
                                : "text-slate-900"
                            }
                        `}
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

                        ${warning
                            ? `
                                    bg-rose-50
                                    text-rose-600
                                  `
                            : `
                                    bg-slate-50
                                    text-[#0f5f7a]
                                  `
                        }
                    `}
                >
                    <Icon
                        size={
                            18
                        }
                    />
                </div>
            </div>
        </article>
    );
}

/*
 * ==========================================================
 * FINANCIAL METRIC
 * ==========================================================
 */

type FinancialMetricProps = {
    title:
    string;

    value:
    string;

    icon:
    typeof CircleDollarSign;
};

function FinancialMetric({
    title,
    value,
    icon:
    Icon,
}: FinancialMetricProps) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-100
                bg-slate-50/70
                p-4
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >
                <Icon
                    size={
                        15
                    }
                    className="
                        text-[#0f5f7a]
                    "
                />

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
            </div>

            <p
                className="
                    mt-3
                    text-lg
                    font-semibold
                    tracking-tight
                    text-slate-900
                "
            >
                {value}
            </p>
        </div>
    );
}

/*
 * ==========================================================
 * CHART LEGEND
 * ==========================================================
 */

type ChartLegendItemProps = {
    label:
    string;

    value:
    number;

    dotClassName:
    string;
};

function ChartLegendItem({
    label,
    value,
    dotClassName,
}: ChartLegendItemProps) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-4
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-2
                "
            >
                <span
                    className={`
                        h-2.5
                        w-2.5
                        rounded-full
                        ${dotClassName}
                    `}
                />

                <span
                    className="
                        text-xs
                        text-slate-500
                    "
                >
                    {label}
                </span>
            </div>

            <span
                className="
                    text-xs
                    font-semibold
                    text-slate-800
                "
            >
                {value}
            </span>
        </div>
    );
}

/*
 * ==========================================================
 * ALERT ITEM
 * ==========================================================
 */

type AlertItemProps = {
    title:
    string;

    value:
    number;

    description:
    string;

    warning?:
    boolean;
};

function AlertItem({
    title,
    value,
    description,
    warning =
    false,
}: AlertItemProps) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-100
                bg-slate-50/60
                p-3
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <p
                    className="
                        text-xs
                        font-semibold
                        text-slate-700
                    "
                >
                    {title}
                </p>

                <span
                    className={`
                        text-sm
                        font-semibold

                        ${warning
                            ? "text-rose-600"
                            : "text-slate-800"
                        }
                    `}
                >
                    {value}
                </span>
            </div>

            <p
                className="
                    mt-1
                    text-[11px]
                    leading-5
                    text-slate-400
                "
            >
                {description}
            </p>
        </div>
    );
}

/*
 * ==========================================================
 * QUICK ACCESS
 * ==========================================================
 */

type QuickAccessButtonProps = {
    title:
    string;

    description:
    string;

    icon:
    typeof FileText;

    onClick:
    () =>
        void;
};

function QuickAccessButton({
    title,
    description,
    icon:
    Icon,
    onClick,
}: QuickAccessButtonProps) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className="
                flex
                w-full
                items-center
                gap-3
                rounded-lg
                border
                border-slate-100
                bg-slate-50/60
                px-3
                py-3
                text-left
                transition
                hover:border-slate-200
                hover:bg-slate-100
            "
        >
            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-[#0f5f7a]
                    shadow-sm
                "
            >
                <Icon
                    size={
                        16
                    }
                />
            </div>

            <div>
                <p
                    className="
                        text-xs
                        font-semibold
                        text-slate-800
                    "
                >
                    {title}
                </p>

                <p
                    className="
                        mt-0.5
                        text-[11px]
                        text-slate-400
                    "
                >
                    {description}
                </p>
            </div>
        </button>
    );
}