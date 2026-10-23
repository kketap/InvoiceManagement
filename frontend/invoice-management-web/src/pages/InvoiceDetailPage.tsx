import {
    Alert,
    Button,
    Card,
    Descriptions,
    Empty,
    Spin,
    Table,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    ArrowLeft,
    CalendarDays,
    CircleDollarSign,
    FileText,
    ReceiptText,
    UserRound,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getInvoiceById,
} from "../api/invoices";

import InvoiceStatusTag
    from "../components/invoices/InvoiceStatusTag";

import type {
    CreditNote,
    InvoiceDetail,
    InvoiceProduct,
} from "../types/invoice";

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
    value: string | null | undefined
) {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "es-CL"
    ).format(
        new Date(value)
    );
}

export default function InvoiceDetailPage() {
    const navigate =
        useNavigate();

    const {
        id,
    } =
        useParams();

    const [
        invoice,
        setInvoice,
    ] =
        useState<InvoiceDetail | null>(
            null
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

    const loadInvoice =
        useCallback(
            async () => {
                const invoiceId =
                    Number(id);

                if (
                    !Number.isInteger(
                        invoiceId
                    ) ||
                    invoiceId <= 0
                ) {
                    setError(
                        "El identificador de la factura no es válido."
                    );

                    setLoading(
                        false
                    );

                    return;
                }

                try {
                    setLoading(
                        true
                    );

                    setError(
                        null
                    );

                    const data =
                        await getInvoiceById(
                            invoiceId
                        );

                    setInvoice(
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
                        "No fue posible cargar la factura."
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            },
            [id]
        );

    useEffect(() => {
        loadInvoice();
    }, [loadInvoice]);

    const productColumns:
        ColumnsType<InvoiceProduct> =
        [
            {
                title:
                    "Producto",
                dataIndex:
                    "productName",
                key:
                    "productName",
            },

            {
                title:
                    "Precio unitario",
                dataIndex:
                    "unitPrice",
                key:
                    "unitPrice",
                align:
                    "right",

                render: (
                    value: number
                ) =>
                    formatCurrency(
                        value
                    ),
            },

            {
                title:
                    "Cantidad",
                dataIndex:
                    "quantity",
                key:
                    "quantity",
                align:
                    "center",
                width:
                    100,
            },

            {
                title:
                    "Subtotal",
                dataIndex:
                    "subtotal",
                key:
                    "subtotal",
                align:
                    "right",

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
        ];

    const creditNoteColumns:
        ColumnsType<CreditNote> =
        [
            {
                title:
                    "N° nota",
                dataIndex:
                    "creditNoteNumber",
                key:
                    "creditNoteNumber",
            },

            {
                title:
                    "Fecha",
                dataIndex:
                    "creditNoteDate",
                key:
                    "creditNoteDate",

                render: (
                    value: string
                ) =>
                    formatDate(
                        value
                    ),
            },

            {
                title:
                    "Monto",
                dataIndex:
                    "amount",
                key:
                    "amount",
                align:
                    "right",

                render: (
                    value: number
                ) =>
                    formatCurrency(
                        value
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
                "
            >
                <Spin
                    size="large"
                    tip="Cargando factura..."
                />
            </div>
        );
    }

    if (
        error ||
        !invoice
    ) {
        return (
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
                <Button
                    icon={
                        <ArrowLeft
                            size={16}
                        />
                    }
                    onClick={() =>
                        navigate(
                            "/invoices"
                        )
                    }
                >
                    Volver
                </Button>

                <Alert
                    className="mt-5"
                    type="error"
                    showIcon
                    message="No fue posible cargar la factura"
                    description={
                        error ??
                        "Factura no encontrada."
                    }
                />
            </main>
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
                            <Button
                                type="text"
                                className="
                                    -ml-3
                                    mb-2
                                "
                                icon={
                                    <ArrowLeft
                                        size={16}
                                    />
                                }
                                onClick={() =>
                                    navigate(
                                        "/invoices"
                                    )
                                }
                            >
                                Volver a facturas
                            </Button>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#0f5f7a]
                                        text-white
                                    "
                                >
                                    <FileText
                                        size={20}
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            text-2xl
                                            font-semibold
                                            tracking-tight
                                            text-slate-900
                                        "
                                    >
                                        Factura #
                                        {
                                            invoice.invoiceNumber
                                        }
                                    </h1>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-500
                                        "
                                    >
                                        Detalle completo de la factura,
                                        sus productos, pagos y notas de crédito.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            <InvoiceStatusTag
                                type="invoice"
                                value={
                                    invoice.invoiceStatus
                                }
                            />

                            <InvoiceStatusTag
                                type="payment"
                                value={
                                    invoice.paymentStatus
                                }
                            />
                        </div>
                    </section>

                    <section
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >
                        <SummaryCard
                            title="Total factura"
                            value={
                                formatCurrency(
                                    invoice.totalAmount
                                )
                            }
                            icon={
                                CircleDollarSign
                            }
                        />

                        <SummaryCard
                            title="Notas de crédito"
                            value={
                                formatCurrency(
                                    invoice.creditNotesTotal
                                )
                            }
                            icon={
                                ReceiptText
                            }
                        />

                        <SummaryCard
                            title="Saldo pendiente"
                            value={
                                formatCurrency(
                                    invoice.pendingAmount
                                )
                            }
                            icon={
                                CircleDollarSign
                            }
                        />

                        <SummaryCard
                            title="Vencimiento"
                            value={
                                formatDate(
                                    invoice.paymentDueDate
                                )
                            }
                            icon={
                                CalendarDays
                            }
                        />
                    </section>

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
                                space-y-5
                                xl:col-span-8
                            "
                        >
                            <Card
                                title={
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <UserRound
                                            size={17}
                                            className="
                                                text-[#0f5f7a]
                                            "
                                        />

                                        <span>
                                            Cliente
                                        </span>
                                    </div>
                                }
                            >
                                <Descriptions
                                    column={{
                                        xs: 1,
                                        sm: 2,
                                    }}
                                    size="small"
                                >
                                    <Descriptions.Item
                                        label="Nombre"
                                    >
                                        {
                                            invoice.customer.name
                                        }
                                    </Descriptions.Item>

                                    <Descriptions.Item
                                        label="RUT"
                                    >
                                        {
                                            invoice.customer.run
                                        }
                                    </Descriptions.Item>

                                    <Descriptions.Item
                                        label="Correo"
                                        span={2}
                                    >
                                        {
                                            invoice.customer.email
                                        }
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <div
                                className="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
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
                                        Productos
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Detalle de productos asociados
                                        a la factura.
                                    </p>
                                </div>

                                <Table
                                    rowKey="id"
                                    size="small"
                                    columns={
                                        productColumns
                                    }
                                    dataSource={
                                        invoice.details
                                    }
                                    pagination={
                                        false
                                    }
                                    scroll={{
                                        x: 700,
                                    }}
                                />
                            </div>

                            <div
                                className="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
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
                                        Notas de crédito
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Historial de notas de crédito
                                        asociadas a esta factura.
                                    </p>
                                </div>

                                {invoice.creditNotes.length >
                                    0 ? (
                                    <Table
                                        rowKey="id"
                                        size="small"
                                        columns={
                                            creditNoteColumns
                                        }
                                        dataSource={
                                            invoice.creditNotes
                                        }
                                        pagination={
                                            false
                                        }
                                    />
                                ) : (
                                    <div
                                        className="
                                            px-6
                                            py-12
                                        "
                                    >
                                        <Empty
                                            image={
                                                Empty.PRESENTED_IMAGE_SIMPLE
                                            }
                                            description="Esta factura no tiene notas de crédito."
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
                            <Card
                                title="Información de factura"
                            >
                                <Descriptions
                                    column={1}
                                    size="small"
                                >
                                    <Descriptions.Item
                                        label="N° factura"
                                    >
                                        #
                                        {
                                            invoice.invoiceNumber
                                        }
                                    </Descriptions.Item>

                                    <Descriptions.Item
                                        label="Fecha emisión"
                                    >
                                        {
                                            formatDate(
                                                invoice.invoiceDate
                                            )
                                        }
                                    </Descriptions.Item>

                                    <Descriptions.Item
                                        label="Fecha vencimiento"
                                    >
                                        {
                                            formatDate(
                                                invoice.paymentDueDate
                                            )
                                        }
                                    </Descriptions.Item>

                                    <Descriptions.Item
                                        label="Días al vencimiento"
                                    >
                                        {
                                            invoice.daysToDue
                                        }
                                    </Descriptions.Item>

                                    <Descriptions.Item
                                        label="Consistente"
                                    >
                                        {
                                            invoice.isConsistent
                                                ? "Sí"
                                                : "No"
                                        }
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <Card
                                title="Información de pago"
                            >
                                {invoice.payment ? (
                                    <Descriptions
                                        column={1}
                                        size="small"
                                    >
                                        <Descriptions.Item
                                            label="Método"
                                        >
                                            {
                                                invoice.payment.paymentMethod ??
                                                "No informado"
                                            }
                                        </Descriptions.Item>

                                        <Descriptions.Item
                                            label="Fecha de pago"
                                        >
                                            {
                                                formatDate(
                                                    invoice.payment.paymentDate
                                                )
                                            }
                                        </Descriptions.Item>
                                    </Descriptions>
                                ) : (
                                    <Empty
                                        image={
                                            Empty.PRESENTED_IMAGE_SIMPLE
                                        }
                                        description="Sin información de pago."
                                    />
                                )}
                            </Card>
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    );
}

type SummaryCardProps = {
    title: string;
    value: string;
    icon:
    typeof FileText;
};

function SummaryCard({
    title,
    value,
    icon: Icon,
}: SummaryCardProps) {
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
                    items-center
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
                            text-xl
                            font-semibold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        {value}
                    </p>
                </div>

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-sky-50
                        text-[#0f5f7a]
                    "
                >
                    <Icon
                        size={18}
                    />
                </div>
            </div>
        </article>
    );
}