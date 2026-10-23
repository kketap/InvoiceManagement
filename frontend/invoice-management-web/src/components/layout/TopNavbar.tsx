import {
    Bell,
    ChartNoAxesColumnIncreasing,
    DatabaseBackup,
    FileText,
    LayoutDashboard,
    Menu,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    NavLink,
    useLocation,
} from "react-router-dom";

const navigation = [
    {
        label:
            "Dashboard",

        to:
            "/dashboard",

        icon:
            LayoutDashboard,
    },

    {
        label:
            "Facturas",

        to:
            "/invoices",

        icon:
            FileText,
    },

    {
        label:
            "Reportes",

        to:
            "/reports",

        icon:
            ChartNoAxesColumnIncreasing,
    },

    {
        label:
            "Importar datos",

        to:
            "/import",

        icon:
            DatabaseBackup,
    },
];

export default function TopNavbar() {
    const location =
        useLocation();

    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] =
        useState(
            false
        );

    /*
     * Cierra automáticamente el menú
     * cada vez que cambia la ruta.
     */
    useEffect(() => {
        setMobileMenuOpen(
            false
        );
    }, [
        location.pathname,
    ]);

    return (
        <header
            className="
                sticky
                top-0
                z-40
                w-full
                border-b
                border-slate-200
                bg-white/95
                backdrop-blur
            "
        >
            {/* =====================================
                BARRA PRINCIPAL
            ====================================== */}

            <div
                className="
                    mx-auto
                    flex
                    min-h-16
                    w-full
                    max-w-[1600px]
                    items-center
                    justify-between
                    gap-2
                    px-3
                    sm:gap-4
                    sm:px-4
                    md:px-6
                    lg:px-8
                "
            >
                {/* =================================
                    IZQUIERDA
                ================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                        xl:gap-8
                    "
                >
                    {/* =============================
                        MENÚ MÓVIL
                    ============================== */}

                    <button
                        type="button"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            text-slate-600
                            transition
                            hover:bg-slate-50
                            hover:text-slate-900
                            xl:hidden
                        "
                        title={
                            mobileMenuOpen
                                ? "Cerrar menú"
                                : "Abrir menú"
                        }
                        aria-label={
                            mobileMenuOpen
                                ? "Cerrar menú de navegación"
                                : "Abrir menú de navegación"
                        }
                        aria-expanded={
                            mobileMenuOpen
                        }
                        onClick={() =>
                            setMobileMenuOpen(
                                (
                                    current
                                ) =>
                                    !current
                            )
                        }
                    >
                        {mobileMenuOpen ? (
                            <X
                                size={
                                    19
                                }
                            />
                        ) : (
                            <Menu
                                size={
                                    19
                                }
                            />
                        )}
                    </button>

                    {/* =============================
                        MARCA
                    ============================== */}

                    <NavLink
                        to="/dashboard"
                        className="
                            flex
                            min-w-0
                            shrink-0
                            items-center
                            gap-2.5
                            text-slate-900
                            no-underline
                        "
                    >

                    </NavLink>

                    {/* =============================
                        NAVEGACIÓN DESKTOP
                    ============================== */}

                    <nav
                        className="
                            hidden
                            h-16
                            items-stretch
                            xl:flex
                        "
                    >
                        {navigation.map(
                            ({
                                label,
                                to,
                                icon:
                                Icon,
                            }) => (
                                <NavLink
                                    key={
                                        to
                                    }
                                    to={
                                        to
                                    }
                                    className={({
                                        isActive,
                                    }) =>
                                        [
                                            `
                                                relative
                                                flex
                                                items-center
                                                gap-2
                                                px-4
                                                text-xs
                                                font-medium
                                                transition-colors
                                            `,

                                            isActive
                                                ? "text-[#0f5f7a]"
                                                : `
                                                    text-slate-500
                                                    hover:text-slate-900
                                                  `,
                                        ].join(
                                            " "
                                        )
                                    }
                                >
                                    {({
                                        isActive,
                                    }) => (
                                        <>
                                            <Icon
                                                size={
                                                    15
                                                }
                                                strokeWidth={
                                                    1.9
                                                }
                                            />

                                            <span
                                                className="
                                                    whitespace-nowrap
                                                "
                                            >
                                                {
                                                    label
                                                }
                                            </span>

                                            {isActive && (
                                                <span
                                                    className="
                                                        absolute
                                                        inset-x-3
                                                        bottom-0
                                                        h-0.5
                                                        rounded-full
                                                        bg-[#0f5f7a]
                                                    "
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            )
                        )}
                    </nav>
                </div>

                {/* =================================
                    DERECHA
                ================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-1.5
                        sm:gap-3
                    "
                >
                    {/* =============================
                        NOTIFICACIONES
                    ============================== */}

                    <button
                        type="button"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-slate-500
                            transition
                            hover:bg-slate-100
                            hover:text-slate-800
                        "
                        title="Notificaciones"
                        aria-label="Notificaciones"
                    >
                        <Bell
                            size={
                                17
                            }
                        />
                    </button>

                    {/* =============================
                        DIVISOR
                    ============================== */}

                    <div
                        className="
                            hidden
                            h-6
                            w-px
                            bg-slate-200
                            sm:block
                        "
                    />

                    {/* =============================
                        USUARIO
                    ============================== */}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2.5
                        "
                    >
                        <div
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#0f5f7a]
                                text-[11px]
                                font-semibold
                                text-white
                            "
                            title="Admin Usuario"
                        >
                            AU
                        </div>

                        <div
                            className="
                                hidden
                                min-w-0
                                text-left
                                md:block
                            "
                        >
                            <p
                                className="
                                    max-w-[140px]
                                    truncate
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Admin Usuario
                            </p>

                            <p
                                className="
                                    max-w-[140px]
                                    truncate
                                    text-[10px]
                                    text-slate-400
                                "
                            >
                                Administrador
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================
                MENÚ MÓVIL / TABLET
            ====================================== */}

            {mobileMenuOpen && (
                <div
                    className="
                        border-t
                        border-slate-100
                        bg-white
                        xl:hidden
                    "
                >
                    <nav
                        className="
                            mx-auto
                            w-full
                            max-w-[1600px]
                            space-y-1
                            px-3
                            py-3
                            sm:px-4
                            md:px-6
                            lg:px-8
                        "
                    >
                        {navigation.map(
                            ({
                                label,
                                to,
                                icon:
                                Icon,
                            }) => (
                                <NavLink
                                    key={
                                        to
                                    }
                                    to={
                                        to
                                    }
                                    className={({
                                        isActive,
                                    }) =>
                                        [
                                            `
                                                flex
                                                w-full
                                                items-center
                                                gap-3
                                                rounded-lg
                                                px-3
                                                py-3
                                                text-sm
                                                font-medium
                                                transition-colors
                                            `,

                                            isActive
                                                ? `
                                                    bg-[#0f5f7a]/10
                                                    text-[#0f5f7a]
                                                  `
                                                : `
                                                    text-slate-600
                                                    hover:bg-slate-50
                                                    hover:text-slate-900
                                                  `,
                                        ].join(
                                            " "
                                        )
                                    }
                                >
                                    <Icon
                                        size={
                                            18
                                        }
                                        strokeWidth={
                                            1.9
                                        }
                                    />

                                    <span>
                                        {
                                            label
                                        }
                                    </span>
                                </NavLink>
                            )
                        )}
                    </nav>

                    {/* =============================
                        INFORMACIÓN DE USUARIO MÓVIL
                    ============================== */}

                    <div
                        className="
                            border-t
                            border-slate-100
                            px-3
                            py-3
                            sm:px-4
                            md:hidden
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-lg
                                bg-slate-50
                                px-3
                                py-3
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
                                    rounded-full
                                    bg-[#0f5f7a]
                                    text-xs
                                    font-semibold
                                    text-white
                                "
                            >
                                AU
                            </div>

                            <div
                                className="
                                    min-w-0
                                "
                            >
                                <p
                                    className="
                                        truncate
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    Admin Usuario
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        truncate
                                        text-[10px]
                                        text-slate-400
                                    "
                                >
                                    Administrador
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}