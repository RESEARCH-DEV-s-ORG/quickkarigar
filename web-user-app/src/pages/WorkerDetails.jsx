// src/pages/WorkerDetails.jsx

import {
    Star,
    MapPin,
    ShieldCheck,
    Clock,
    Phone,
    MessageCircle,
    CheckCircle2
} from "lucide-react";

import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import DashboardLayout from "../components/DashboardNav.jsx";

export default function WorkerDetails() {

    const { state } = useLocation();

    const worker = state?.worker;

    const { user } = useAuth();

    if (!worker) {
        return (
            <div className="p-6">
                Worker not found
            </div>
        );
    }

    return (
        <DashboardLayout user={user}>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">

                <div className="grid lg:grid-cols-[1fr_360px] gap-6">

                    {/* LEFT */}
                    <div>

                        {/* HERO */}
                        <section
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-3xl
                                p-5
                                lg:p-8
                            "
                        >
                            <div className="flex flex-col lg:flex-row gap-5">

                                <img
                                    src={worker.image}
                                    alt={worker.name}
                                    className="
                                        w-28
                                        h-28
                                        lg:w-36
                                        lg:h-36
                                        rounded-3xl
                                        object-cover
                                    "
                                />

                                <div className="flex-1">

                                    <div className="flex items-center gap-2 mb-2">

                                        <h1
                                            className="
                                                text-[26px]
                                                lg:text-[34px]
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            {worker.name}
                                        </h1>

                                        {worker.available && (
                                            <CheckCircle2
                                                size={22}
                                                className="text-green-600"
                                            />
                                        )}

                                    </div>

                                    <p
                                        className="
                                            text-indigo-700
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-[12px]
                                        "
                                    >
                                        {worker.service}
                                    </p>

                                    <div className="flex flex-wrap gap-4 mt-4">

                                        <div className="flex items-center gap-1">

                                            <Star
                                                size={16}
                                                fill="currentColor"
                                                className="text-amber-500"
                                            />

                                            <span className="font-semibold">
                                                {worker.rating}
                                            </span>

                                            <span className="text-slate-500">
                                                (124 reviews)
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-1 text-slate-600">

                                            <MapPin size={15} />

                                            <span>
                                                {worker.distance}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">

                                        <span
                                            className="
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-green-50
                                                text-green-700
                                                text-sm
                                                font-medium
                                            "
                                        >
                                            Available Now
                                        </span>

                                        <span
                                            className="
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-indigo-50
                                                text-indigo-700
                                                text-sm
                                                font-medium
                                            "
                                        >
                                            Verified Worker
                                        </span>

                                    </div>

                                </div>

                            </div>
                        </section>

                        {/* STATS */}
                        <section
                            className="
                                grid
                                grid-cols-3
                                gap-3
                                mt-4
                            "
                        >

                            <div className="bg-white border rounded-2xl p-4 text-center">
                                <h3 className="text-xl font-bold">
                                    324
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Jobs Done
                                </p>
                            </div>

                            <div className="bg-white border rounded-2xl p-4 text-center">
                                <h3 className="text-xl font-bold">
                                    5+
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Years
                                </p>
                            </div>

                            <div className="bg-white border rounded-2xl p-4 text-center">
                                <h3 className="text-xl font-bold">
                                    98%
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Success
                                </p>
                            </div>

                        </section>

                        {/* ABOUT */}
                        <section
                            className="
                                mt-4
                                bg-white
                                border
                                rounded-3xl
                                p-5
                            "
                        >
                            <h2 className="text-lg font-bold mb-3">
                                About
                            </h2>

                            <p className="text-slate-600 leading-7">
                                Experienced professional specializing in
                                residential and commercial projects.
                                Fast response time, verified identity and
                                highly rated by customers.
                            </p>
                        </section>

                        {/* SERVICES */}
                        <section
                            className="
                                mt-4
                                bg-white
                                border
                                rounded-3xl
                                p-5
                            "
                        >
                            <h2 className="text-lg font-bold mb-4">
                                Services Offered
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-3">

                                {[
                                    "Installation",
                                    "Repair",
                                    "Maintenance",
                                    "Emergency Service"
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <ShieldCheck
                                            size={16}
                                            className="text-indigo-600"
                                        />

                                        <span>
                                            {item}
                                        </span>
                                    </div>
                                ))}

                            </div>
                        </section>

                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside
                        className="
                            lg:sticky
                            lg:top-24
                            h-fit
                        "
                    >

                        <div
                            className="
                                bg-white
                                border
                                rounded-3xl
                                p-6
                            "
                        >

                            <h3 className="text-lg font-bold">
                                Book Service
                            </h3>

                            <div className="mt-5 space-y-4">

                                <div className="flex items-center gap-3">

                                    <Clock
                                        size={18}
                                        className="text-indigo-600"
                                    />

                                    <span>
                                        Response within 15 min
                                    </span>

                                </div>

                                <div className="flex items-center gap-3">

                                    <ShieldCheck
                                        size={18}
                                        className="text-green-600"
                                    />

                                    <span>
                                        Verified Professional
                                    </span>

                                </div>

                            </div>

                            <button
                                className="
                                    mt-6
                                    w-full
                                    h-12
                                    rounded-xl
                                    bg-indigo-700
                                    text-white
                                    font-semibold
                                "
                            >
                                Book Now
                            </button>

                            <button
                                className="
                                    mt-3
                                    w-full
                                    h-12
                                    rounded-xl
                                    border
                                    border-slate-200
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                            >
                                <MessageCircle size={18} />
                                Chat
                            </button>

                            <button
                                className="
                                    mt-3
                                    w-full
                                    h-12
                                    rounded-xl
                                    border
                                    border-slate-200
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                            >
                                <Phone size={18} />
                                Call
                            </button>

                        </div>

                    </aside>

                </div>

            </div>

        </DashboardLayout>
    );
}