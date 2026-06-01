import { useState } from "react";




export default function ServicesGrid({
                                         services,
                                         onSelectService,
                                         onViewAll,
                                     }) {
    const [selectedId, setSelectedId] = useState(1);

    const selectedService =
        services.find(
            (item) => item.id === selectedId
        );

    const remainingServices =
        services.filter(
            (item) => item.id !== selectedId
        );

    const handleSelect = (service) => {
        setSelectedId(service.id);

        if (onSelectService) {
            onSelectService(service);
        }
    };

    const SelectedIcon =
        selectedService.icon;

    return (
        <section className="w-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-slate-900">
                    Services
                </h2>

                <button
                    onClick={onViewAll}
                    className="text-[13px] text-indigo-800 font-medium">
                    View All
                </button>
            </div>

            {/* MOBILE */}
            <div className="lg:hidden">

                <div className="grid grid-cols-2 gap-3">

                    {/* BIG CARD */}
                    <button
                        onClick={() =>
                            handleSelect(selectedService)
                        }
                        className="
                            row-span-2
                            min-h-[155px]
                            rounded-3xl
                            bg-indigo-800
                            p-4
                            flex
                            flex-col
                            justify-between
                            text-left
                        "
                    >
                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-white/10
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <SelectedIcon
                                size={18}
                                className="text-white"
                            />
                        </div>

                        <div>
                            <h3 className="text-white text-[15px] font-semibold">
                                {selectedService.title}
                            </h3>

                            {selectedService.experts && (
                                <p className="text-[11px] text-white/70">
                                    {selectedService.experts} Experts
                                </p>
                            )}
                        </div>
                    </button>

                    {/* RIGHT SIDE */}
                    {remainingServices
                        .slice(0, 2)
                        .map((service) => {
                            const Icon =
                                service.icon;

                            return (
                                <button
                                    key={service.id}
                                    onClick={() =>
                                        handleSelect(service)
                                    }
                                    className="
                                        h-[76px]
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-3
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <div
                                        className="
                                            w-10
                                            h-10
                                            rounded-xl
                                            bg-slate-100
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                        "
                                    >
                                        <Icon
                                            size={18}
                                            className="text-indigo-700"
                                        />
                                    </div>

                                    <span className="text-[13px] font-medium text-slate-900 truncate">
                                        {service.title}
                                    </span>
                                </button>
                            );
                        })}
                </div>

                {/* BOTTOM SERVICES */}
                <div className="flex gap-3 mt-3">

                    {remainingServices
                        .slice(2)
                        .map((service) => {
                            const Icon =
                                service.icon;

                            return (
                                <button
                                    key={service.id}
                                    onClick={() =>
                                        handleSelect(service)
                                    }
                                    className="
                                        flex-1
                                        h-[76px]
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        gap-1
                                    "
                                >
                                    <div
                                        className="
                                            w-9
                                            h-9
                                            rounded-xl
                                            bg-slate-100
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <Icon
                                            size={16}
                                            className="text-indigo-700"
                                        />
                                    </div>

                                    <span className="text-[11px] font-medium text-slate-900">
                                        {service.title}
                                    </span>
                                </button>
                            );
                        })}
                </div>

            </div>

            {/* DESKTOP */}
            <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-4">

                {services.map((service) => {

                    const Icon =
                        service.icon;

                    const active =
                        selectedId === service.id;

                    return (
                        <button
                            key={service.id}
                            onClick={() =>
                                handleSelect(service)
                            }
                            className={`
                                h-[96px]
                                rounded-2xl
                                border
                                px-4
                                flex
                                items-center
                                gap-4
                                transition-all
                                ${
                                active
                                    ? "border-indigo-300 bg-indigo-50"
                                    : "border-slate-200 bg-white hover:bg-slate-50"
                            }
                            `}
                        >
                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-xl
                                    bg-slate-100
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <Icon
                                    size={20}
                                    className="text-indigo-700"
                                />
                            </div>

                            <div className="text-left">
                                <p className="text-[15px] font-semibold text-slate-900">
                                    {service.title}
                                </p>

                                {service.experts && (
                                    <p className="text-[11px] text-slate-500">
                                        {service.experts} Experts
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}