import type {
    LucideIcon,
} from "lucide-react";

type Props = {
    title: string;

    value:
    | string
    | number;

    description?: string;

    icon: LucideIcon;

    tone?:
    | "blue"
    | "green"
    | "amber"
    | "orange";

    footnote?: string;
};

const toneClasses = {
    blue: {
        iconBg:
            "bg-sky-50",

        iconText:
            "text-sky-600",

        footnote:
            "text-sky-600",
    },

    green: {
        iconBg:
            "bg-emerald-50",

        iconText:
            "text-emerald-600",

        footnote:
            "text-emerald-600",
    },

    amber: {
        iconBg:
            "bg-amber-50",

        iconText:
            "text-amber-600",

        footnote:
            "text-amber-600",
    },

    orange: {
        iconBg:
            "bg-orange-50",

        iconText:
            "text-orange-600",

        footnote:
            "text-orange-600",
    },
};

export default function KpiCard({
    title,
    value,
    description,
    icon: Icon,
    tone = "blue",
    footnote,
}: Props) {
    const classes =
        toneClasses[tone];

    return (
        <article
            className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-[0_1px_2px_rgba(15,23,42,0.03)]
        transition
        hover:border-slate-300
        hover:shadow-[0_4px_14px_rgba(15,23,42,0.05)]
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
                <div
                    className="
            min-w-0
          "
                >
                    <p
                        className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.04em]
              text-slate-500
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

                    {description && (
                        <p
                            className="
                mt-1
                text-xs
                text-slate-400
              "
                        >
                            {description}
                        </p>
                    )}
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
            ${classes.iconBg}
            ${classes.iconText}
          `}
                >
                    <Icon
                        size={18}
                        strokeWidth={1.8}
                    />
                </div>
            </div>

            {footnote && (
                <p
                    className={`
            mt-4
            text-[10px]
            font-medium
            ${classes.footnote}
          `}
                >
                    {footnote}
                </p>
            )}
        </article>
    );
}