import {
    Tag,
} from "antd";

import type {
    InvoiceStatus,
    PaymentStatus,
} from "../../types/invoice";

type Props = {
    type:
    | "invoice"
    | "payment";

    value:
    | InvoiceStatus
    | PaymentStatus;
};

const invoiceLabels: Record<
    InvoiceStatus,
    string
> = {
    Issued: "Emitida",
    Partial: "Parcial",
    Cancelled: "Cancelada",
};

const paymentLabels: Record<
    PaymentStatus,
    string
> = {
    Pending: "Pendiente",
    Overdue: "Vencida",
    Paid: "Pagada",
};

export default function InvoiceStatusTag({
    type,
    value,
}: Props) {
    if (type === "invoice") {
        const status =
            value as InvoiceStatus;

        const color =
            status === "Issued"
                ? "blue"
                : status === "Partial"
                    ? "gold"
                    : "red";

        return (
            <Tag
                color={color}
                className="
          rounded-md
          px-2
          py-0.5
          text-[11px]
          font-medium
        "
            >
                {invoiceLabels[status]}
            </Tag>
        );
    }

    const status =
        value as PaymentStatus;

    const color =
        status === "Paid"
            ? "green"
            : status === "Pending"
                ? "gold"
                : "volcano";

    return (
        <Tag
            color={color}
            className="
        rounded-md
        px-2
        py-0.5
        text-[11px]
        font-medium
      "
        >
            {paymentLabels[status]}
        </Tag>
    );
}