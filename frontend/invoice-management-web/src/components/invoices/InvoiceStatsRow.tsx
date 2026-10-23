import {
    BadgeDollarSign,
    CircleAlert,
    Clock3,
    Files,
} from "lucide-react";

import KpiCard
    from "../shared/KpiCard";

import type {
    InvoiceListItem,
} from "../../types/invoice";

type Props = {
    invoices: InvoiceListItem[];
};

export default function InvoiceStatsRow({
    invoices,
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

    function percentage(
        value: number
    ) {
        if (total === 0) {
            return "0%";
        }

        return `${(
            (value / total) *
            100
        ).toFixed(1)}%`;
    }

    return (
        <section
            className="
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        xl:grid-cols-4
      "
        >
            <KpiCard
                title="Total de facturas"
                value={total}
                description="Facturas activas"
                footnote="Registros disponibles"
                icon={Files}
                tone="blue"
            />

            <KpiCard
                title="Pagadas"
                value={paid}
                description="Con pago registrado"
                footnote={`${percentage(
                    paid
                )} del total`}
                icon={BadgeDollarSign}
                tone="green"
            />

            <KpiCard
                title="Pendientes"
                value={pending}
                description="Dentro de plazo"
                footnote={`${percentage(
                    pending
                )} del total`}
                icon={Clock3}
                tone="amber"
            />

            <KpiCard
                title="Vencidas"
                value={overdue}
                description="Pago fuera de plazo"
                footnote={`${percentage(
                    overdue
                )} del total`}
                icon={CircleAlert}
                tone="orange"
            />
        </section>
    );
}