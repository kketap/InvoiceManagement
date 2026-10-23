import {
    FilePlus2,
    UploadCloud,
} from "lucide-react";

import {
    Button,
} from "antd";

type Props = {
    onRefresh?: () => void;

    onCreateCreditNote?: () => void;

    loading?: boolean;
};

export default function InvoiceHeader({
    onRefresh,
    onCreateCreditNote,
    loading,
}: Props) {
    return (
        <section
            className="
        flex
        flex-col
        gap-5
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
            sm:text-[28px]
          "
                >
                    Gestión de facturas
                </h1>

                <p
                    className="
            mt-1.5
            max-w-xl
            text-sm
            leading-5
            text-slate-500
          "
                >
                    Control y seguimiento de facturas,
                    cobros, notas de crédito y estados
                    de pago.
                </p>
            </div>

            <div
                className="
          flex
          flex-col
          gap-2
          sm:flex-row
        "
            >
                <Button
                    icon={
                        <UploadCloud
                            size={16}
                        />
                    }
                    onClick={onRefresh}
                    loading={loading}
                >
                    Actualizar datos
                </Button>

                <Button
                    type="primary"
                    icon={
                        <FilePlus2
                            size={16}
                        />
                    }
                    onClick={
                        onCreateCreditNote
                    }
                >
                    Nueva nota de crédito
                </Button>
            </div>
        </section>
    );
}