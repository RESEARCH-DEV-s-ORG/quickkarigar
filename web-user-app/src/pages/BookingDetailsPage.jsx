import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    Calendar,
    Clock3,
    CheckCircle2,
    XCircle,
    MapPin,
    Phone,
    MessageCircle,
    StarsIcon
} from "lucide-react";

import DashboardLayout from "../components/DashboardNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function BookingDetailsPage() {
    const navigate = useNavigate();

    const { state } = useLocation();

    const { user } = useAuth();

    const booking = state?.booking;

    if (!booking) {
        return (
            <div className="p-6">
                Booking not found
            </div>
        );
    }

    const statusConfig = {
        upcoming: {
            icon: Clock3,
            className: "bg-blue-50 text-blue-700",
        },
        completed: {
            icon: CheckCircle2,
            className: "bg-green-50 text-green-700",
        },
        cancelled: {
            icon: XCircle,
            className: "bg-red-50 text-red-700",
        },
    };

    const status =
        statusConfig[
            booking.status
            ] || statusConfig.upcoming;

    const StatusIcon =
        status.icon;

    return (
        <DashboardLayout user={user}>
            <div className="max-w-6xl mx-auto px-4 md:px-6 pb-28">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="
                w-10
                h-10
                rounded-xl
                border
                border-slate-200
                flex
                items-center
                justify-center
            "
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-[24px] font-bold">
                            Booking Details
                        </h1>

                        <p className="text-sm text-slate-500">
                            Booking ID #BK102458
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_360px] gap-6">

                    {/* LEFT */}
                    <div className="space-y-5">

                        {/* Worker */}
                        {/* Worker */}
                        <div
                            className="
        bg-white
        border
        border-slate-200
        rounded-3xl
        p-4
        md:p-5
    "
                        >
                            <div className="flex gap-4">

                                {/* Worker Image */}
                                <img
                                    src={booking.worker.image}
                                    alt={booking.worker.name}
                                    className="
                w-20
                h-20
                md:w-24
                md:h-24
                rounded-2xl
                object-cover
                shrink-0
            "
                                />

                                {/* Worker Details */}
                                <div className="flex-1 min-w-0">

                                    {/* Name + Status */}
                                    <div
                                        className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                    gap-2
                "
                                    >
                                        <div className="min-w-0">

                                            <h2
                                                className="
                            text-lg
                            md:text-xl
                            font-bold
                            text-slate-900
                            truncate
                        "
                                            >
                                                {booking.worker.name}
                                            </h2>

                                            <p
                                                className="
                            text-sm
                            md:text-base
                            text-indigo-700
                            font-medium
                            truncate
                        "
                                            >
                                                {booking.worker.service}
                                            </p>

                                        </div>

                                        <span
                                            className={`
                        inline-flex
                        items-center
                        gap-1.5
                        px-3
                        py-1.5
                        rounded-full
                        text-[11px]
                        font-semibold
                        capitalize
                        whitespace-nowrap
                        shrink-0
                        self-start
                        ${status.className}
                    `}
                                        >
                    <StatusIcon size={13} />
                                            {booking.status}
                </span>
                                    </div>

                                    {/* Stats */}
                                    <div
                                        className="
                    flex
                    flex-wrap
                    gap-x-4
                    gap-y-2
                    mt-4
                    text-sm
                    text-slate-600
                "
                                    >
                                        <div
                                            className="
                        flex
                        items-center
                        gap-1
                        font-medium
                    "
                                        >
                                            ⭐
                                            <span>4.9</span>
                                        </div>

                                        <div>
                                            248 Jobs
                                        </div>

                                        <div>
                                            5 Years Exp.
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* Booking Info */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-5">

                            <h3 className="font-bold text-lg mb-4">
                                Booking Information
                            </h3>

                            <div className="space-y-4">

                                <div className="flex gap-3">
                                    <Calendar size={18}/>
                                    <div>
                                        <p className="font-medium">
                                            {booking.date}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Scheduled Date
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Clock3 size={18}/>
                                    <div>
                                        <p className="font-medium">
                                            {booking.time}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Time Slot
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <MapPin size={18}/>
                                    <div>
                                        <p className="font-medium">
                                            {booking.address}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Service Location
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Timeline */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-5">

                            <h3 className="font-bold text-lg mb-5">
                                Booking Progress
                            </h3>

                            <div className="space-y-5">

                                <div className="flex gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1" />
                                    <div>
                                        <p className="font-medium">
                                            Booking Confirmed
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            10 June, 09:30 AM
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-1" />
                                    <div>
                                        <p className="font-medium">
                                            Professional Assigned
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Awaiting Visit
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 opacity-40">
                                    <div className="w-3 h-3 bg-slate-300 rounded-full mt-1" />
                                    <div>
                                        <p className="font-medium">
                                            Service Completed
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="space-y-5">

                        {/* Price */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-5">

                            <h3 className="font-bold text-lg mb-4">
                                Payment Summary
                            </h3>

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span>Visiting Charge</span>
                                    <span>₹299</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Platform Fee</span>
                                    <span>₹49</span>
                                </div>

                                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹348</span>
                                </div>

                            </div>

                        </div>

                        {/* Actions */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-5">

                            <div className="grid grid-cols-2 gap-3">

                                <button
                                    className="
                            h-12
                            rounded-xl
                            bg-green-600
                            text-white
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-medium
                        "
                                >
                                    <Phone size={18}/>
                                    Call
                                </button>

                                <button
                                    className="
                            h-12
                            rounded-xl
                            bg-indigo-700
                            text-white
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-medium
                        "
                                >
                                    <MessageCircle size={18}/>
                                    Chat
                                </button>

                            </div>

                            <button
                                className="
                        mt-3
                        w-full
                        h-12
                        rounded-xl
                        border
                        border-slate-200
                        font-medium
                    "
                            >
                                Reschedule
                            </button>

                            <button
                                className="
                        mt-3
                        w-full
                        h-12
                        rounded-xl
                        bg-red-50
                        text-red-600
                        font-medium
                    "
                            >
                                Cancel Booking
                            </button>

                        </div>

                        {/* Support */}
                        <div className="bg-indigo-50 rounded-3xl p-5">

                            <h3 className="font-semibold">
                                Need Help?
                            </h3>

                            <p className="text-sm text-slate-600 mt-1">
                                Our support team is available 24×7.
                            </p>

                            <button
                                className="
                        mt-4
                        w-full
                        h-11
                        rounded-xl
                        bg-indigo-700
                        text-white
                        font-medium
                    "
                            >
                                Contact Support
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}