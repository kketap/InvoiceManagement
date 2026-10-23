import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    ReceiptText,
} from "lucide-react";

import type {
    LucideIcon,
} from "lucide-react";

import type {
    InvoiceListItem,
    PaymentStatus,
} from "../../types/invoice";

type Props = {
    invoices:
    InvoiceListItem[];

    selectedPaymentStatus?:
    PaymentStatus;

    onSelectPaymentStatus?: (
        status:
            PaymentStatus | null
    ) => void;
};

export default function InvoiceStatsRow({
    invoices,
    selectedPaymentStatus,
    onSelectPaymentStatus,
}: Props) {
    const total =
        invoices.length;

    const paid =
        invoices.filter(
            (invoice) =>
                invoice.paymentStatus ===
                "Paid"
        ).length;

    const pending =
        invoices.filter(
            (invoice) =>
                invoice.paymentStatus ===
                "Pending"
        ).length;

    const overdue =
        invoices.filter(
            (invoice) =>
                invoice.paymentStatus ===
                "Overdue"
        ).length;

    const getPercentage = (
        value: number
    ) => {
        if (
            total === 0
        ) {
            return 0;
        }

        return Math.round(
            (
                value /
                total
            ) *
            100
        );
    };

    return (
        <section
            className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        >
            <InvoiceStatCard
                title="Total de facturas"
                value={
                    total
                }
                description="Facturas activas y consistentes."
                icon={
                    ReceiptText
                }
                onClick={
                    onSelectPaymentStatus
                        ? () =>
                            onSelectPaymentStatus(
                                null
                            )
                        : undefined
                }
            />

            <InvoiceStatCard
                title="Pagadas"
                value={
                    paid
                }
                description={
                    `${getPercentage(
                        paid
                    )}% del total`
                }
                icon={
                    CheckCircle2
                }
                selected={
                    selectedPaymentStatus ===
                    "Paid"
                }
                onClick={
                    onSelectPaymentStatus
                        ? () =>
                            onSelectPaymentStatus(
                                "Paid"
                            )
                        : undefined
                }
            />

            <InvoiceStatCard
                title="Pendientes"
                value={
                    pending
                }
                description={
                    `${getPercentage(
                        pending
                    )}% del total`
                }
                icon={
                    Clock3
                }
                selected={
                    selectedPaymentStatus ===
                    "Pending"
                }
                onClick={
                    onSelectPaymentStatus
                        ? () =>
                            onSelectPaymentStatus(
                                "Pending"
                            )
                        : undefined
                }
            />

            <InvoiceStatCard
                title="Vencidas"
                value={
                    overdue
                }
                description={
                    `${getPercentage(
                        overdue
                    )}% del total`
                }
                icon={
                    AlertTriangle
                }
                selected={
                    selectedPaymentStatus ===
                    "Overdue"
                }
                onClick={
                    onSelectPaymentStatus
                        ? () =>
                            onSelectPaymentStatus(
                                "Overdue"
                            )
                        : undefined
                }
            />
        </section>
    );
}

type InvoiceStatCardProps = {
    title: string;

    value: number;

    description: string;

    icon: LucideIcon;

    selected?: boolean;

    onClick?: () => void;
};

function InvoiceStatCard({
    title,
    value,
    description,
    icon: Icon,
    selected = false,
    onClick,
}: InvoiceStatCardProps) {
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