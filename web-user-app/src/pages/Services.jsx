import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    Zap,
    Wrench,
    PenTool,
    GraduationCap,
    Paintbrush2,
    BrushCleaning,
    ArrowRight,
    Star,
} from "lucide-react";

import DashboardLayout from "../components/DashboardNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ServicesPage() {
    const navigate = useNavigate();

    const { user } = useAuth();

    const [search, setSearch] = useState("");

    const services = [
        {
            id: 1,
            title: "Electrician",
            icon: Zap,
            experts: 124,
            popular: true,
            description:
                "Wiring, fan installation, switch repair and more.",
        },
        {
            id: 2,
            title: "Plumber",
            icon: Wrench,
            experts: 98,
            popular: true,
            description:
                "Pipe leakage, bathroom fitting, water tank repair.",
        },
        {
            id: 3,
            title: "Carpenter",
            icon: PenTool,
            experts: 75,
            description:
                "Furniture repair, modular fitting and woodwork.",
        },
        {
            id: 4,
            title: "Tutor",
            icon: GraduationCap,
            experts: 64,
            description:
                "Home tutors for school and college students.",
        },
        {
            id: 5,
            title: "Cleaning",
            icon: BrushCleaning,
            experts: 88,
            description:
                "Deep home cleaning and sanitation services.",
        },
        {
            id: 6,
            title: "Painter",
            icon: Paintbrush2,
            experts: 42,
            description:
                "Interior and exterior painting experts.",
        },
    ];

    const filteredServices = services.filter(
        (service) =>
            service.title
                .toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-24">

                {/* Header */}
                <div className="pt-4 md:pt-8">

                    <h1 className="text-[28px] md:text-[38px] font-bold tracking-tight text-slate-900">
                        All Services
                    </h1>

                    <p className="mt-2 text-slate-500 text-sm md:text-base">
                        Discover trusted artisans and service experts near you.
                    </p>

                </div>

                {/* Search */}
                <div className="relative mt-6">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search services..."
                        className="
                            w-full
                            h-12
                            pl-11
                            pr-4
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            text-sm
                            outline-none
                            focus:border-indigo-300
                        "
                    />
                </div>

                {/* Stats */}
                <div className="mt-5 flex items-center justify-between">

                    <div>
                        <h3 className="font-semibold text-slate-900">
                            {filteredServices.length} Services
                        </h3>

                        <p className="text-sm text-slate-500">
                            Available near your location
                        </p>
                    </div>

                </div>

                {/* Services Grid */}
                <div
                    className="
                        mt-6
                        grid
                        grid-cols-2
                        md:grid-cols-3
                        xl:grid-cols-4
                        gap-4
                    "
                >
                    {filteredServices.map((service) => {
                        const Icon = service.icon;

                        return (
                            <button
                                key={service.id}
                                onClick={() =>
                                    navigate("/experts", {
                                        state: {
                                            service: {
                                                id: service.id,
                                                title: service.title,
                                                experts: service.experts,
                                                description: service.description,
                                                popular: service.popular,
                                            },
                                        },
                                    })
                                }
                                className="
                                    group
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-3xl
                                    p-4
                                    text-left
                                    hover:border-indigo-300
                                    hover:shadow-lg
                                    transition-all
                                "
                            >
                                <div className="flex items-start justify-between">

                                    <div
                                        className="
                                            w-12
                                            h-12
                                            rounded-2xl
                                            bg-indigo-50
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <Icon
                                            size={22}
                                            className="text-indigo-700"
                                        />
                                    </div>

                                    {service.popular && (
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-1
                                                px-2
                                                py-1
                                                rounded-full
                                                bg-amber-50
                                                text-amber-700
                                                text-[10px]
                                                font-semibold
                                            "
                                        >
                                            <Star
                                                size={10}
                                                fill="currentColor"
                                            />
                                            Popular
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4">

                                    <h3
                                        className="
                                            text-base
                                            md:text-lg
                                            font-semibold
                                            text-slate-900
                                        "
                                    >
                                        {service.title}
                                    </h3>

                                    <p
                                        className="
                                            mt-2
                                            text-xs
                                            md:text-sm
                                            text-slate-500
                                            line-clamp-2
                                        "
                                    >
                                        {service.description}
                                    </p>

                                    <div className="mt-4">

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                text-slate-500
                                            "
                                        >
                                            {service.experts} Experts Available
                                        </p>

                                    </div>

                                    <div
                                        className="
                                            mt-4
                                            flex
                                            items-center
                                            justify-between
                                            text-indigo-700
                                            font-medium
                                            text-sm
                                        "
                                    >
                                        <span>
                                            View Experts
                                        </span>

                                        <ArrowRight
                                            size={16}
                                            className="
                                                group-hover:translate-x-1
                                                transition
                                            "
                                        />
                                    </div>

                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredServices.length === 0 && (
                    <div className="py-20 text-center">

                        <h3 className="text-xl font-semibold">
                            No services found
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Try searching with a different keyword.
                        </p>

                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}