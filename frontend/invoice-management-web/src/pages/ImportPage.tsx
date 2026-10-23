import {
    Alert,
    Button,
    Modal,
    Spin,
} from "antd";

import {
    AlertTriangle,
    CheckCircle2,
    Database,
    FileJson,
    FilePlus2,
    RefreshCcw,
    Upload,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    importInvoices,
} from "../api/import";

import type {
    InvoiceImportResult,
} from "../types/import";

export default function ImportPage() {
    const [
        loading,
        setLoading,
    ] =
        useState(false);

    const [
        result,
        setResult,
    ] =
        useState<InvoiceImportResult | null>(
            null
        );

    const [
        error,
        setError,
    ] =
        useState<string | null>(
            null
        );

    const [
        confirmOpen,
        setConfirmOpen,
    ] =
        useState(false);

    async function handleImport() {
        try {
            setConfirmOpen(
                false
            );

            setLoading(
                true
            );

            setError(
                null
            );

            const data =
                await importInvoices();

            setResult(
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
                "No fue posible importar las facturas."
            );
        } finally {
            setLoading(
                false
            );
        }
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
                            Importar datos
                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Procesa el archivo JSON base
                            y registra las facturas en
                            el sistema.
                        </p>
                    </section>

                    {error && (
                        <Alert
                            type="error"
                            showIcon
                            title="No fue posible realizar la importación"
                            description={
                                error
                            }
                        />
                    )}

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
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                                "
                            >
                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-5
                                        sm:flex-row
                                        sm:items-start
                                        sm:justify-between
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-sky-50
                                                text-[#0f5f7a]
                                            "
                                        >
                                            <FileJson
                                                size={
                                                    22
                                                }
                                            />
                                        </div>

                                        <div>
                                            <h2
                                                className="
                                                    text-base
                                                    font-semibold
                                                    text-slate-900
                                                "
                                            >
                                                Archivo de facturas
                                            </h2>

                                            <p
                                                className="
                                                    mt-1
                                                    max-w-2xl
                                                    text-sm
                                                    leading-6
                                                    text-slate-500
                                                "
                                            >
                                                El sistema utiliza
                                                el archivo JSON base
                                                incluido en el backend.
                                                Durante la importación
                                                se validan las facturas,
                                                sus productos, pagos y
                                                notas de crédito.
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={
                                            loading
                                        }
                                        icon={
                                            <Upload
                                                size={
                                                    16
                                                }
                                            />
                                        }
                                        onClick={() =>
                                            setConfirmOpen(
                                                true
                                            )
                                        }
                                    >
                                        Importar facturas
                                    </Button>
                                </div>

                                <div
                                    className="
                                        mt-6
                                        grid
                                        grid-cols-1
                                        gap-3
                                        sm:grid-cols-3
                                    "
                                >
                                    <InfoBox
                                        title="Persistencia"
                                        description="Los datos se almacenan en SQLite mediante Entity Framework Core."
                                        icon={
                                            Database
                                        }
                                    />

                                    <InfoBox
                                        title="Validación"
                                        description="Se detectan automáticamente facturas con totales inconsistentes."
                                        icon={
                                            CheckCircle2
                                        }
                                    />

                                    <InfoBox
                                        title="Reimportación"
                                        description="Los registros existentes se omiten para evitar duplicados."
                                        icon={
                                            RefreshCcw
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <aside
                            className="
                                xl:col-span-4
                            "
                        >
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
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <AlertTriangle
                                        size={
                                            17
                                        }
                                        className="
                                            text-amber-500
                                        "
                                    />

                                    <h2
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-900
                                        "
                                    >
                                        Consideraciones
                                    </h2>
                                </div>

                                <div
                                    className="
                                        mt-4
                                        space-y-3
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    "
                                >
                                    <p>
                                        Las facturas inconsistentes
                                        permanecen almacenadas en la
                                        base de datos.
                                    </p>

                                    <p>
                                        No se incluyen en el sistema
                                        activo de facturas, pero sí
                                        aparecen en los reportes.
                                    </p>

                                    <p>
                                        Puedes ejecutar nuevamente
                                        la importación sin duplicar
                                        registros existentes.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </section>

                    {loading && (
                        <section
                            className="
                                flex
                                min-h-[260px]
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                            "
                        >
                            <Spin
                                size="large"
                                description="Procesando archivo JSON..."
                            />
                        </section>
                    )}

                    {!loading &&
                        result && (
                            <ImportResultSection
                                result={
                                    result
                                }
                            />
                        )}
                </div>
            </main>

            <Modal
                open={
                    confirmOpen
                }
                title="Confirmar importación"
                onCancel={() =>
                    setConfirmOpen(
                        false
                    )
                }
                footer={[
                    <Button
                        key="cancel"
                        disabled={
                            loading
                        }
                        onClick={() =>
                            setConfirmOpen(
                                false
                            )
                        }
                    >
                        Cancelar
                    </Button>,

                    <Button
                        key="import"
                        type="primary"
                        loading={
                            loading
                        }
                        icon={
                            <Upload
                                size={
                                    15
                                }
                            />
                        }
                        onClick={
                            handleImport
                        }
                    >
                        Importar
                    </Button>,
                ]}
            >
                <p
                    className="
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >
                    Se procesará el archivo JSON
                    configurado en el backend.
                    Los registros existentes serán
                    omitidos y no se crearán
                    duplicados.
                </p>
            </Modal>
        </div>
    );
}

type InfoBoxProps = {
    title: string;

    description: string;

    icon:
    typeof Database;
};

function InfoBox({
    title,
    description,
    icon: Icon,
}: InfoBoxProps) {
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
                    h-8
                    w-8
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

            <h3
                className="
                    mt-3
                    text-xs
                    font-semibold
                    text-slate-800
                "
            >
                {title}
            </h3>

            <p
                className="
                    mt-1
                    text-xs
                    leading-5
                    text-slate-400
                "
            >
                {description}
            </p>
        </div>
    );
}

type ImportResultSectionProps = {
    result:
    InvoiceImportResult;
};

function ImportResultSection({
    result,
}: ImportResultSectionProps) {
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
                    flex
                    items-center
                    gap-3
                    border-b
                    border-slate-100
                    px-5
                    py-4
                "
            >
                <div
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-50
                        text-emerald-600
                    "
                >
                    <CheckCircle2
                        size={
                            18
                        }
                    />
                </div>

                <div>
                    <h2
                        className="
                            text-sm
                            font-semibold
                            text-slate-900
                        "
                    >
                        Importación finalizada
                    </h2>

                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-slate-400
                        "
                    >
                        Resultado del último
                        proceso ejecutado.
                    </p>
                </div>
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    gap-px
                    bg-slate-100
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >
                <ImportMetric
                    title="Procesadas"
                    value={
                        result.processed
                    }
                    description="Registros encontrados en el archivo."
                    icon={
                        FileJson
                    }
                />

                <ImportMetric
                    title="Creadas"
                    value={
                        result.created
                    }
                    description="Facturas nuevas almacenadas."
                    icon={
                        FilePlus2
                    }
                />

                <ImportMetric
                    title="Omitidas"
                    value={
                        result.skipped
                    }
                    description="Registros que ya existían."
                    icon={
                        RefreshCcw
                    }
                />

                <ImportMetric
                    title="Inconsistentes"
                    value={
                        result.inconsistent
                    }
                    description="Facturas detectadas con diferencias."
                    icon={
                        AlertTriangle
                    }
                    warning={
                        result.inconsistent >
                        0
                    }
                />
            </div>

            {result.inconsistent >
                0 && (
                    <div
                        className="
                        border-t
                        border-amber-100
                        bg-amber-50/60
                        p-4
                    "
                    >
                        <Alert
                            type="warning"
                            showIcon
                            title={`${result.inconsistent} factura${result.inconsistent ===
                                    1
                                    ? ""
                                    : "s"
                                } inconsistente${result.inconsistent ===
                                    1
                                    ? ""
                                    : "s"
                                } detectada${result.inconsistent ===
                                    1
                                    ? ""
                                    : "s"
                                }`}
                            description="Los registros fueron almacenados, pero no forman parte del sistema activo. Puedes revisarlos desde el módulo de Reportes."
                        />
                    </div>
                )}
        </section>
    );
}

type ImportMetricProps = {
    title: string;

    value: number;

    description: string;

    icon:
    typeof FileJson;

    warning?: boolean;
};

function ImportMetric({
    title,
    value,
    description,
    icon: Icon,
    warning = false,
}: ImportMetricProps) {
    return (
        <article
            className="
                bg-white
                p-5
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
                                ? "text-amber-600"
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
                            leading-5
                            text-slate-400
                        "
                    >
                        {description}
                    </p>
                </div>

                <div
                    className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full

                        ${warning
                            ? `
                                    bg-amber-50
                                    text-amber-600
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
                            16
                        }
                    />
                </div>
            </div>
        </article>
    );
}