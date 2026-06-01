import {
    User,
    CalendarDays,
    MapPin,
    Bell,
    CreditCard,
    ShieldCheck,
    HelpCircle,
    ChevronRight,
    LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const handleLogout = () => {
        logout();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    };

    const menuItems = [
        {
            title: "My Bookings",
            icon: CalendarDays,
            route: "/bookings",
        },
        {
            title: "Saved Addresses",
            icon: MapPin,
            route: "/addresses",
        },
        {
            title: "Payments",
            icon: CreditCard,
            route: "/payments",
        },
        {
            title: "Notifications",
            icon: Bell,
            route: "/notifications",
        },
        {
            title: "Privacy & Security",
            icon: ShieldCheck,
            route: "/security",
        },
        {
            title: "Help & Support",
            icon: HelpCircle,
            route: "/support",
        },
    ];

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
                            text-[28px]
                            md:text-[36px]
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        Profile
                    </h1>

                    <p
                        className="
                            mt-1
                            text-slate-500
                        "
                    >
                        Manage your account settings.
                    </p>

                </div>

                {/* Mobile */}

                <div className="lg:hidden mt-6">

                    <div
                        className="
                            bg-white
                            border
                            border-slate-200
                            rounded-3xl
                            p-5
                        "
                    >

                        <div className="flex flex-col items-center text-center">

                            <img
                                src={
                                    user?.profilePicture ||
                                    "https://ui-avatars.com/api/?name=User"
                                }
                                alt=""
                                className="
                                    w-24
                                    h-24
                                    rounded-full
                                    object-cover
                                    border-4
                                    border-indigo-50
                                "
                            />

                            <h2
                                className="
                                    mt-4
                                    text-xl
                                    font-bold
                                "
                            >
                                {user?.fullName}
                            </h2>

                            <p
                                className="
                                    text-slate-500
                                    text-sm
                                "
                            >
                                {user?.email}
                            </p>

                            <span
                                className="
                                    mt-3
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-green-50
                                    text-green-700
                                    text-xs
                                    font-semibold
                                "
                            >
                                Verified Customer
                            </span>

                        </div>

                    </div>

                    {/* Stats */}

                    <div
                        className="
                            grid
                            grid-cols-3
                            gap-3
                            mt-4
                        "
                    >
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                            <p className="text-xl font-bold">12</p>
                            <p className="text-xs text-slate-500">
                                Bookings
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                            <p className="text-xl font-bold">3</p>
                            <p className="text-xs text-slate-500">
                                Active
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                            <p className="text-xl font-bold">4.9</p>
                            <p className="text-xs text-slate-500">
                                Rating
                            </p>
                        </div>
                    </div>

                    {/* Menu */}

                    <div className="mt-5 space-y-3">

                        {menuItems.map((item) => {

                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.title}
                                    onClick={() =>
                                        navigate(item.route)
                                    }
                                    className="
                                        w-full
                                        bg-white
                                        border
                                        border-slate-200
                                        rounded-2xl
                                        px-4
                                        h-14
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <div className="flex items-center gap-3">

                                        <Icon size={20} />

                                        <span className="font-medium">
                                            {item.title}
                                        </span>

                                    </div>

                                    <ChevronRight size={18} />

                                </button>
                            );
                        })}

                    </div>

                </div>

                {/* Desktop */}

                <div
                    className="
                        hidden
                        lg:grid
                        grid-cols-[350px_1fr]
                        gap-6
                        mt-8
                    "
                >

                    {/* Left */}

                    <div
                        className="
                            bg-white
                            border
                            border-slate-200
                            rounded-3xl
                            p-6
                        "
                    >

                        <div className="text-center">

                            <img
                                src={
                                    user?.profilePicture ||
                                    "https://ui-avatars.com/api/?name=User"
                                }
                                alt=""
                                className="
                                    w-32
                                    h-32
                                    rounded-full
                                    object-cover
                                    mx-auto
                                    border-4
                                    border-indigo-50
                                "
                            />

                            <h2
                                className="
                                    mt-4
                                    text-2xl
                                    font-bold
                                "
                            >
                                {user?.fullName}
                            </h2>

                            <p className="text-slate-500">
                                {user?.email}
                            </p>

                            <button
                                className="
                                    mt-4
                                    px-4
                                    py-2
                                    rounded-xl
                                    bg-indigo-700
                                    text-white
                                    text-sm
                                "
                            >
                                Edit Profile
                            </button>

                        </div>

                    </div>

                    {/* Right */}

                    <div
                        className="
                            bg-white
                            border
                            border-slate-200
                            rounded-3xl
                            p-6
                        "
                    >

                        <h3
                            className="
                                text-xl
                                font-bold
                                mb-5
                            "
                        >
                            Account Settings
                        </h3>

                        <div className="space-y-3">

                            {menuItems.map((item) => {

                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.title}
                                        onClick={() =>
                                            navigate(item.route)
                                        }
                                        className="
                                            w-full
                                            h-16
                                            px-5
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            flex
                                            items-center
                                            justify-between
                                            hover:bg-slate-50
                                        "
                                    >
                                        <div className="flex items-center gap-4">

                                            <Icon size={22} />

                                            <span className="font-medium">
                                                {item.title}
                                            </span>

                                        </div>

                                        <ChevronRight size={18} />

                                    </button>
                                );
                            })}

                        </div>

                    </div>

                </div>

                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="
                        mt-8
                        w-full
                        h-14
                        rounded-2xl
                        bg-red-50
                        text-red-600
                        font-semibold
                        flex
                        items-center
                        justify-center
                        gap-2
                    "
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </DashboardLayout>
    );
}