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
    StarsIcon,
    Star,
} from "lucide-react";

import {useEffect, useState} from "react";

import DashboardLayout from "../components/DashboardNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function BookingDetailsPage({ worker }) {
    const navigate = useNavigate();

    const { state } = useLocation();
    const { user } = useAuth();

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");
    const [feedbackSubmitted, setFeedbackSubmitted] =
        useState(false);
    const booking = state?.booking;

    useEffect(() => {
        if (
            booking?.status !==
            "completed"
        ) return;

        const savedReview =
            localStorage.getItem(
                `booking_review_${booking.id}`
            );

        if (savedReview) {
            const data =
                JSON.parse(savedReview);
            setRating(data.rating);
            setReview(data.review);
            setFeedbackSubmitted(true);

        }

    }, [booking]);

    const callWorker = () => {
        localStorage.setItem(
            `last_call_${booking.id}`,
            JSON.stringify({
                workerId: booking.worker.id,
                workerName: booking.worker.name,
                time: new Date().toISOString(),
            })
        );

        alert(`Calling ${booking.worker.name}`);
    };
    const chatWorker = () => {
        const chats =
            JSON.parse(
                localStorage.getItem("chat_history")
            ) || [];

        chats.push({
            bookingId: booking.id,
            workerId: booking.worker.id,
            workerName: booking.worker.name,
            createdAt: new Date().toISOString(),
        });

        localStorage.setItem(
            "chat_history",
            JSON.stringify(chats)
        );

        navigate(`/chat/${2}`, {
            state: {
                booking,
            },
        });
    };
    const rescheduleBooking = () => {
        const bookings =
            JSON.parse(
                localStorage.getItem("bookings")
            ) || [];

        const updated = bookings.map((item) =>
            item.id === booking.id
                ? {
                    ...item,
                    rescheduled: true,
                    updatedAt:
                        new Date().toISOString(),
                }
                : item
        );

        localStorage.setItem(
            "bookings",
            JSON.stringify(updated)
        );

        alert("Booking rescheduled");
    };
    const cancelBooking = () => {
        const confirmCancel =
            window.confirm(
                "Are you sure you want to cancel this booking?"
            );

        if (!confirmCancel) return;

        const bookings =
            JSON.parse(
                localStorage.getItem("bookings")
            ) || [];

        const updated = bookings.map((item) =>
            item.id === booking.id
                ? {
                    ...item,
                    status: "cancelled",
                    cancelledAt:
                        new Date().toISOString(),
                }
                : item
        );

        localStorage.setItem(
            "bookings",
            JSON.stringify(updated)
        );

        alert("Booking cancelled");

        navigate("/bookings");
    };
    const submitFeedback = () => {
        if (!rating) {
            alert(
                "Please select a rating"
            );
            return;
        }
        const data = {
            rating,
            review,
            submittedAt:
                new Date().toISOString(),
        };
        localStorage.setItem(
            `booking_review_${booking.id}`,
            JSON.stringify(data)
        );
        setFeedbackSubmitted(true);
    };
    const removeReview = () => {
        localStorage.removeItem(
            `booking_review_${booking.id}`
        );
        setRating(0);
        setReview("");
        setFeedbackSubmitted(false);
    };
    const contactSupport = () => {
        const tickets =
            JSON.parse(
                localStorage.getItem(
                    "support_tickets"
                )
            ) || [];

        tickets.push({
            id: Date.now(),
            bookingId: booking.id,
            workerName:
            booking.worker.name,
            status: "open",
            createdAt:
                new Date().toISOString(),
        });

        localStorage.setItem(
            "support_tickets",
            JSON.stringify(tickets)
        );

        alert(
            "Support ticket created successfully"
        );
    };

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

                        {
                            booking.status ===
                            "completed" && (

                                <div
                                    className="
        bg-white
        border
        border-slate-200
        rounded-3xl
        p-5
    "
                                >

                                    <h3
                                        className="
            text-lg
            font-bold
            mb-4
        "
                                    >
                                        Rate Your Experience
                                    </h3>

                                    <div
                                        className="
            flex
            justify-center
            gap-2
        "
                                    >

                                        {[1,2,3,4,5].map(star => (

                                            <button
                                                key={star}
                                                disabled={
                                                    feedbackSubmitted
                                                }
                                                onClick={() =>
                                                    setRating(star)
                                                }
                                                onMouseEnter={() =>
                                                    setHoverRating(star)
                                                }
                                                onMouseLeave={() =>
                                                    setHoverRating(0)
                                                }
                                            >

                                                <Star
                                                    size={32}
                                                    fill={
                                                        star <=
                                                        (
                                                            hoverRating ||
                                                            rating
                                                        )
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                    className={
                                                        star <=
                                                        (
                                                            hoverRating ||
                                                            rating
                                                        )
                                                            ? "text-amber-400"
                                                            : "text-slate-300"
                                                    }
                                                />

                                            </button>

                                        ))}

                                    </div>

                                    <textarea
                                        value={review}
                                        disabled={
                                            feedbackSubmitted
                                        }
                                        onChange={(e) =>
                                            setReview(
                                                e.target.value
                                            )
                                        }
                                        placeholder="
            Share your experience...
        "
                                        className="
            mt-4
            w-full
            h-28
            rounded-2xl
            border
            border-slate-200
            p-4
            resize-none
            outline-none
        "
                                    />

                                    {
                                        feedbackSubmitted ? (

                                            <>
                                                <div
                                                    className="
                        mt-4
                        bg-green-50
                        text-green-700
                        rounded-xl
                        p-3
                        text-center
                        font-medium
                    "
                                                >
                                                    Thank you for your feedback ❤️
                                                </div>

                                                <button
                                                    onClick={
                                                        removeReview
                                                    }
                                                    className="
                        mt-3
                        w-full
                        h-11
                        rounded-xl
                        border
                        border-red-200
                        text-red-600
                        font-medium
                    "
                                                >
                                                    Delete Review
                                                </button>
                                            </>

                                        ) : (

                                            <button
                                                onClick={
                                                    submitFeedback
                                                }
                                                className="
                    mt-4
                    w-full
                    h-12
                    rounded-xl
                    bg-indigo-700
                    text-white
                    font-medium
                "
                                            >
                                                Submit Review
                                            </button>

                                        )
                                    }

                                </div>

                            )}

                        {/* Actions */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-5">

                            <div className="grid grid-cols-2 gap-3">

                                <button
                                    onClick={callWorker}
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
                                    onClick={chatWorker}
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
                                onClick={rescheduleBooking}
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
                                onClick={cancelBooking}
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
                                onClick={contactSupport}
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
                                Contact Supportsc
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}