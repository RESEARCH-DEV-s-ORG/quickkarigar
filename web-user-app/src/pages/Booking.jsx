// BookingPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock3,
    MapPin,
    ArrowRight,
    History,
    CalendarDays,
    Search,
} from "lucide-react";

import DashboardLayout from "../components/DashboardNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function BookingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] =
        useState("upcoming");

    const bookings = [
        {
            id: 1,
            worker: {
                name: "Rahul Sharma",
                service: "Electrician",
                image:
                    "https://randomuser.me/api/portraits/men/32.jpg",
            },
            date: "15 Jun 2026",
            time: "10:30 AM",
            address: "Salt Lake, Kolkata",
            status: "upcoming",
        },
        {
            id: 2,
            worker: {
                name: "Vikram Singh",
                service: "Plumber",
                image:
                    "https://randomuser.me/api/portraits/men/44.jpg",
            },
            date: "02 Jun 2026",
            time: "04:00 PM",
            address: "New Town, Kolkata",
            status: "completed",
        },
    ];

    const filtered =
        bookings.filter(
            booking =>
                activeTab === "upcoming"
                    ? booking.status === "upcoming"
                    : booking.status !== "upcoming"
        );

    return (
        <DashboardLayout user={user}>
            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-4
                    md:px-6
                    lg:px-8
                    pb-28
                "
            >
                {/* Header */}
                <div className="pt-4 md:pt-8">

                    <h1
                        className="
                            text-[26px]
                            md:text-[34px]
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        My Bookings
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            md:text-base
                            text-slate-500
                        "
                    >
                        Track your service requests and history.
                    </p>
                </div>

                {/* Tabs */}
                <div
                    className="
                        mt-6
                        bg-slate-100
                        rounded-2xl
                        p-1
                        flex
                    "
                >
                    <button
                        onClick={() =>
                            setActiveTab(
                                "upcoming"
                            )
                        }
                        className={`
                            flex-1
                            h-11
                            rounded-xl
                            text-sm
                            font-medium
                            transition
                            ${
                            activeTab ===
                            "upcoming"
                                ? "bg-white shadow text-slate-900"
                                : "text-slate-500"
                        }
                        `}
                    >
                        Upcoming
                    </button>

                    <button
                        onClick={() =>
                            setActiveTab(
                                "history"
                            )
                        }
                        className={`
                            flex-1
                            h-11
                            rounded-xl
                            text-sm
                            font-medium
                            transition
                            ${
                            activeTab ===
                            "history"
                                ? "bg-white shadow text-slate-900"
                                : "text-slate-500"
                        }
                        `}
                    >
                        History
                    </button>
                </div>

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div
                        className="
                            py-24
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                        "
                    >
                        <div
                            className="
                                w-20
                                h-20
                                rounded-full
                                bg-indigo-50
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <CalendarDays
                                size={34}
                                className="
                                    text-indigo-700
                                "
                            />
                        </div>

                        <h2
                            className="
                                mt-5
                                text-xl
                                font-semibold
                            "
                        >
                            No bookings found
                        </h2>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-slate-500
                                max-w-xs
                            "
                        >
                            Book trusted artisans
                            and your bookings
                            will appear here.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/services")
                            }
                            className="
                                mt-6
                                h-11
                                px-5
                                rounded-xl
                                bg-indigo-700
                                text-white
                                text-sm
                                font-medium
                            "
                        >
                            Explore Services
                        </button>
                    </div>
                )}

                {/* MOBILE */}
                <div
                    className="
                        lg:hidden
                        mt-6
                        space-y-4
                    "
                >
                    {filtered.map(
                        booking => (
                            <div
                                key={booking.id}
                                className="
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-2xl
                                    p-4
                                "
                            >
                                <div className="flex gap-3">

                                    <img
                                        src={
                                            booking
                                                .worker
                                                .image
                                        }
                                        alt=""
                                        className="
                                            w-14
                                            h-14
                                            rounded-xl
                                            object-cover
                                            shrink-0
                                        "
                                    />

                                    <div className="flex-1 min-w-0">

                                        <div className="flex justify-between">

                                            <div className="min-w-0">
                                                <h3
                                                    className="
                                                        font-semibold
                                                        truncate
                                                    "
                                                >
                                                    {
                                                        booking
                                                            .worker
                                                            .name
                                                    }
                                                </h3>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-indigo-700
                                                    "
                                                >
                                                    {
                                                        booking
                                                            .worker
                                                            .service
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={`
        inline-flex
        items-center
        gap-1.5
        px-2.5
        py-1
        rounded-full
        text-[11px]
        font-semibold
        capitalize
        ${
                                                    booking.status === "upcoming"
                                                        ? "bg-blue-50 text-blue-700"
                                                        : booking.status === "completed"
                                                            ? "bg-green-50 text-green-700"
                                                            : booking.status === "cancelled"
                                                                ? "bg-red-50 text-red-700"
                                                                : "bg-slate-100 text-slate-600"
                                                }
    `}
                                            >
                                            <span
                                                className={`
                                                    w-1.5
                                                    h-1.5
                                                    rounded-full
                                                    ${
                                                    booking.status === "upcoming"
                                                        ? "bg-blue-500"
                                                        : booking.status === "completed"
                                                            ? "bg-green-500"
                                                            : booking.status === "cancelled"
                                                                ? "bg-red-500"
                                                                : "bg-slate-400"
                                                }
                                                `}
                                            />

                                                                                        {booking.status}
                                        </span>
                                        </div>

                                        <div className="mt-3 space-y-1">

                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Calendar size={13} />
                                                {
                                                    booking.date
                                                }
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Clock3 size={13} />
                                                {
                                                    booking.time
                                                }
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <MapPin size={13} />
                                                {
                                                    booking.address
                                                }
                                            </div>

                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/bookings/${booking.id}`,
                                                    {
                                                        state: {
                                                            booking,
                                                        },
                                                    }
                                                )
                                            }
                                            className="
                                                mt-4
                                                w-full
                                                h-10
                                                rounded-xl
                                                bg-indigo-700
                                                text-white
                                                text-sm
                                                font-medium
                                            "
                                        >
                                            View Details
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* DESKTOP */}
                <div
                    className="
                        hidden
                        lg:grid
                        grid-cols-2
                        xl:grid-cols-3
                        gap-5
                        mt-8
                    "
                >
                    {filtered.map(
                        booking => (
                            <div
                                key={booking.id}
                                className="
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-3xl
                                    p-5
                                "
                            >
                                <img
                                    src={
                                        booking
                                            .worker
                                            .image
                                    }
                                    alt=""
                                    className="
                                        w-full
                                        h-52
                                        rounded-2xl
                                        object-cover
                                    "
                                />

                                <div className="mt-4">

                                    <h3
                                        className="
                                            text-lg
                                            font-semibold
                                        "
                                    >
                                        {
                                            booking
                                                .worker
                                                .name
                                        }
                                    </h3>

                                    <p
                                        className="
                                            text-indigo-700
                                            text-sm
                                        "
                                    >
                                        {
                                            booking
                                                .worker
                                                .service
                                        }
                                    </p>

                                    <div className="mt-4 space-y-2 text-sm text-slate-600">

                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            {
                                                booking.date
                                            }
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock3 size={16} />
                                            {
                                                booking.time
                                            }
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            {
                                                booking.address
                                            }
                                        </div>

                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/bookings/${booking.id}`,
                                                {
                                                    state: {
                                                        booking,
                                                    },
                                                }
                                            )
                                        }
                                        className="
                                            mt-5
                                            w-full
                                            h-11
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
                                        View Details
                                        <ArrowRight
                                            size={16}
                                        />
                                    </button>

                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}