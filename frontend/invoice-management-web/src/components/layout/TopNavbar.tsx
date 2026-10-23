import {
    Bell,
    BookOpen,
    ChartNoAxesColumnIncreasing,
    FileText,
    ReceiptText,
    Settings,
    Users,
} from "lucide-react";

import {
    NavLink,
} from "react-router-dom";

const navigation = [
    {
        label: "Facturas",
        to: "/invoices",
        icon: FileText,
    },
    {
        label: "Reportes",
        to: "/reports",
        icon: ChartNoAxesColumnIncreasing,
    },
];

export default function TopNavbar() {
    return (
        <header
            className="
        sticky
        top-0
        z-40
        border-b
        border-slate-200
        bg-white/95
        backdrop-blur
      "
        >
            <div
                className="
          mx-auto
          flex
          min-h-16
          max-w-[1600px]
          items-center
          justify-between
          gap-6
          px-4
          sm:px-6
          lg:px-8
        "
            >
                <div
                    className="
            flex
            min-w-0
            items-center
            gap-8
          "
                >
                    <NavLink
                        to="/invoices"
                        className="
              flex
              shrink-0
              items-center
              gap-3
              text-slate-900
              no-underline
            "
                    >
                    </NavLink>

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
                                icon: Icon,
                            }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({
                                        isActive,
                                    }) =>
                                        [
                                            "relative flex items-center gap-2 px-4 text-xs font-medium transition-colors",
                                            isActive
                                                ? "text-[#0f5f7a]"
                                                : "text-slate-500 hover:text-slate-900",
                                        ].join(" ")
                                    }
                                >
                                    {({
                                        isActive,
                                    }) => (
                                        <>
                                            <Icon
                                                size={15}
                                                strokeWidth={1.9}
                                            />

                                            <span>
                                                {label}
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

                <div
                    className="
            flex
            shrink-0
            items-center
            gap-3
          "
                >
                    <button
                        type="button"
                        className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
            "
                        title="Notificaciones"
                    >
                        <Bell
                            size={17}
                        />
                    </button>

                    <div
                        className="
              h-6
              w-px
              bg-slate-200
            "
                    />

                    <div
                        className="
              flex
              items-center
              gap-2.5
            "
                    >
                        <div
                            className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-[#0f5f7a]
                text-[11px]
                font-semibold
                text-white
              "
                        >
                            AU
                        </div>

                        <div
                            className="
                hidden
                text-left
                md:block
              "
                        >
                            <p
                                className="
                  text-xs
                  font-semibold
                  text-slate-700
                "
                            >
                                Admin Usuario
                            </p>

                            <p
                                className="
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
        </header>
    );
}