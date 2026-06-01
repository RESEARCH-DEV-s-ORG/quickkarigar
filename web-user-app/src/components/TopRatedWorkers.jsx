import {
    Star,
    Navigation
} from "lucide-react";

export default function TopRatedWorkers({
                                            data = [],
                                            onBookNow,
                                            onViewAll,
                                        }) {
    return (
        <section className="mt-8">

            {/* Header */}
            <div className="flex items-end justify-between mb-4">
                <div>
                    <h2 className="text-[20px] font-semibold text-slate-900">
                        Top Rated Nearby
                    </h2>

                    <p className="text-[12px] text-slate-500 mt-0.5">
                        Vetted artisans with consistent quality
                    </p>
                </div>

                <button
                    onClick={onViewAll}
                    className="text-[13px] text-indigo-800 font-medium">
                    View All
                </button>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-3">

                {data.map((worker) => (
                    <div
                        key={worker.id}
                        className={`
                            bg-white
                            border
                            border-slate-200
                            rounded-2xl
                            px-3
                            py-3
                            flex
                            items-center
                            gap-3
                            ${
                            !worker.available
                                ? "opacity-60"
                                : ""
                        }
                        `}
                    >

                        {/* Avatar */}
                        <div className="relative shrink-0">

                            <img
                                src={worker.image}
                                alt={worker.name}
                                className="
                                    w-16
                                    h-16
                                    rounded-2xl
                                    object-cover
                                "
                            />

                            {worker.available && (
                                <span
                                    className="
                                        absolute
                                        -top-1
                                        -right-1
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-green-500
                                        border-2
                                        border-white
                                    "
                                />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">

                            <div className="flex justify-between items-start gap-2">

                                <div className="min-w-0">

                                    <h3 className="text-[16px] font-semibold truncate">
                                        {worker.name}
                                    </h3>

                                    <p className="text-[10px] tracking-wider font-semibold text-indigo-700 truncate">
                                        {worker.service}
                                    </p>
                                </div>

                                <div className="
                                    px-2
                                    py-1
                                    rounded-full
                                    bg-slate-100
                                    flex
                                    items-center
                                    gap-1
                                ">
                                    <Star
                                        size={11}
                                        fill="currentColor"
                                        className="text-amber-500"
                                    />

                                    <span className="text-[12px] font-semibold">
                                        {worker.rating}
                                    </span>
                                </div>

                            </div>

                            <div className="flex items-center justify-between mt-2">

                                <div>

                                    <div className="flex items-center gap-1 text-slate-500">
                                        <Navigation size={12} />
                                        <span className="text-[12px]">
                                            {worker.distance}
                                        </span>
                                    </div>

                                    <p
                                        className={`
                                            text-[12px]
                                            font-medium
                                            mt-0.5
                                            ${
                                            worker.available
                                                ? "text-green-600"
                                                : "text-slate-500"
                                        }
                                        `}
                                    >
                                        {worker.available
                                            ? "Available"
                                            : "Offline"}
                                    </p>

                                </div>

                                <button
                                    disabled={!worker.available}
                                    onClick={() =>
                                        onBookNow?.(worker)
                                    }
                                    className={`
                                        h-9
                                        px-4
                                        rounded-xl
                                        text-[12px]
                                        font-semibold
                                        whitespace-nowrap
                                        ${
                                        worker.available
                                            ? "bg-indigo-700 text-white"
                                            : "bg-slate-200 text-slate-500"
                                    }
                                    `}
                                >
                                    {worker.available
                                        ? "BOOK NOW"
                                        : "NOTIFY"}
                                </button>

                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* Desktop */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-5">

                {data.map((worker) => (
                    <div
                        key={worker.id}
                        className={`
                            bg-white
                            border
                            border-slate-200
                            rounded-3xl
                            p-5
                            hover:shadow-sm
                            transition
                            ${
                            !worker.available
                                ? "opacity-60"
                                : ""
                        }
                        `}
                    >
                        <div className="flex gap-4">

                            <div className="relative">

                                <img
                                    src={worker.image}
                                    alt={worker.name}
                                    className="
                                        w-20
                                        h-20
                                        rounded-2xl
                                        object-cover
                                    "
                                />

                                {worker.available && (
                                    <span
                                        className="
                                            absolute
                                            -top-1
                                            -right-1
                                            w-3
                                            h-3
                                            rounded-full
                                            bg-green-500
                                            border-2
                                            border-white
                                        "
                                    />
                                )}
                            </div>

                            <div className="flex-1">

                                <div className="flex justify-between">

                                    <div>

                                        <h3 className="text-lg font-semibold">
                                            {worker.name}
                                        </h3>

                                        <p className="text-xs tracking-wider text-indigo-700 font-semibold">
                                            {worker.service}
                                        </p>

                                    </div>

                                    <div className="
                                        h-8
                                        px-3
                                        rounded-full
                                        bg-slate-100
                                        flex
                                        items-center
                                        gap-1
                                    ">
                                        <Star
                                            size={13}
                                            fill="currentColor"
                                            className="text-amber-500"
                                        />

                                        <span className="font-semibold text-sm">
                                            {worker.rating}
                                        </span>
                                    </div>

                                </div>

                                <div className="mt-4 flex items-center justify-between">

                                    <div>
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <Navigation size={13} />
                                            <span className="text-sm">
                                                {worker.distance}
                                            </span>
                                        </div>

                                        <p
                                            className={`text-sm mt-1 ${
                                                worker.available
                                                    ? "text-green-600"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {worker.available
                                                ? "Available"
                                                : "Offline"}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            onBookNow?.(worker)
                                        }
                                        disabled={!worker.available}
                                        className={`
                                            h-11
                                            px-5
                                            rounded-xl
                                            text-sm
                                            font-semibold
                                            ${
                                            worker.available
                                                ? "bg-indigo-700 text-white"
                                                : "bg-slate-200 text-slate-500"
                                        }
                                        `}
                                    >
                                        {worker.available
                                            ? "BOOK NOW"
                                            : "NOTIFY ME"}
                                    </button>

                                </div>

                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}