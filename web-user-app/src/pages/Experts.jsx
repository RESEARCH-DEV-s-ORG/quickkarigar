import { useLocation, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Star,
    MapPin,
    ShieldCheck,
    Clock3,
    ChevronRight,
} from "lucide-react";

import DashboardLayout from "../components/DashboardNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ExpertsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { state } = useLocation();
    const service = state?.service;
    const experts = [
        {
            id: 1,
            name: "Rahul Sharma",
            rating: 4.9,
            jobs: 248,
            experience: "5 Years",
            distance: "1.2 km",
            image:
                "https://randomuser.me/api/portraits/men/32.jpg",
            available: true,
        },
        {
            id: 2,
            name: "Amit Kumar",
            rating: 4.8,
            jobs: 187,
            experience: "4 Years",
            distance: "2.4 km",
            image:
                "https://randomuser.me/api/portraits/men/44.jpg",
            available: true,
        },
        {
            id: 3,
            name: "Vikram Singh",
            rating: 5.0,
            jobs: 320,
            experience: "7 Years",
            distance: "0.8 km",
            image:
                "https://randomuser.me/api/portraits/men/51.jpg",
            available: false,
        },
        {
            id: 4,
            name: "Arjun Das",
            rating: 4.7,
            jobs: 150,
            experience: "3 Years",
            distance: "3.1 km",
            image:
                "https://randomuser.me/api/portraits/men/65.jpg",
            available: true,
        },
    ];

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-24">

                {/* Header */}
                <div className="pt-4 md:pt-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="
                            flex
                            items-center
                            gap-2
                            text-slate-600
                            mb-4
                        "
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <h1
                        className="
                            text-[28px]
                            md:text-[40px]
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        {service?.title || "Experts"}
                    </h1>

                    <p
                        className="
                            mt-2
                            text-slate-500
                            text-sm
                            md:text-base
                        "
                    >
                        Verified professionals available near you.
                    </p>

                </div>

                {/* Mobile List */}
                <div className="lg:hidden mt-6 space-y-4">

                    {experts.map((expert) => (
                        <div
                            key={expert.id}
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-3xl
                                p-4
                            "
                        >
                            <div className="flex gap-4">

                                <div className="relative">
                                    <img
                                        src={expert.image}
                                        alt=""
                                        className="
                                            w-20
                                            h-20
                                            rounded-2xl
                                            object-cover
                                        "
                                    />

                                    <div
                                        className={`
                                            absolute
                                            bottom-1
                                            right-1
                                            w-3
                                            h-3
                                            rounded-full
                                            border-2
                                            border-white
                                            ${
                                            expert.available
                                                ? "bg-green-500"
                                                : "bg-slate-400"
                                        }
                                        `}
                                    />
                                </div>

                                <div className="flex-1">

                                    <div className="flex justify-between">

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                {expert.name}
                                            </h3>

                                            <p className="text-indigo-700 text-xs font-medium">
                                                {service?.title}
                                            </p>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-1
                                                bg-amber-50
                                                px-2
                                                py-1
                                                rounded-full
                                                text-amber-700
                                                text-xs
                                                font-semibold
                                            "
                                        >
                                            <Star
                                                size={12}
                                                fill="currentColor"
                                            />
                                            {expert.rating}
                                        </div>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            gap-3
                                            mt-3
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        <span>
                                            {expert.jobs} Jobs
                                        </span>

                                        <span>
                                            {expert.experience}
                                        </span>

                                        <span>
                                            {expert.distance}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/worker-details",
                                                {
                                                    state: {
                                                        worker: {
                                                            ...expert,
                                                            service:
                                                            service?.title,
                                                        },
                                                    },
                                                }
                                            )
                                        }
                                        className="
                                            mt-4
                                            w-full
                                            h-11
                                            rounded-xl
                                            bg-indigo-700
                                            text-white
                                            text-sm
                                            font-medium
                                        "
                                    >
                                        View Profile
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Grid */}
                <div
                    className="
                        hidden
                        lg:grid
                        grid-cols-2
                        xl:grid-cols-3
                        gap-6
                        mt-8
                    "
                >
                    {experts.map((expert) => (
                        <div
                            key={expert.id}
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-3xl
                                overflow-hidden
                                hover:shadow-xl
                                transition
                            "
                        >
                            <img
                                src={expert.image}
                                alt=""
                                className="
                                    w-full
                                    h-60
                                    object-cover
                                "
                            />

                            <div className="p-5">

                                <div className="flex justify-between">

                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {expert.name}
                                        </h3>

                                        <p className="text-indigo-700 text-sm">
                                            {service?.title}
                                        </p>
                                    </div>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            bg-amber-50
                                            px-3
                                            py-1.5
                                            rounded-full
                                            text-amber-700
                                            text-sm
                                            font-semibold
                                            h-fit
                                        "
                                    >
                                        <Star
                                            size={14}
                                            fill="currentColor"
                                        />
                                        {expert.rating}
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3 text-sm">

                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={16} />
                                        {expert.jobs} Completed Jobs
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock3 size={16} />
                                        {expert.experience}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {expert.distance}
                                    </div>

                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/worker-details",
                                            {
                                                state: {
                                                    worker: {
                                                        ...expert,
                                                        service:
                                                        service?.title,
                                                    },
                                                },
                                            }
                                        )
                                    }
                                    className="
                                        mt-5
                                        w-full
                                        h-12
                                        rounded-xl
                                        bg-indigo-700
                                        text-white
                                        font-medium
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >
                                    View Profile
                                    <ChevronRight size={18} />
                                </button>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
}