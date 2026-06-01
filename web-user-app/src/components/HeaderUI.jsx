import { useState } from "react";
import {
    Search,
    MapPin,
    Bell
} from "lucide-react";

export default function HeaderUI({
                                             location = "Civil Lines, Jaipur",
                                             notificationCount = 3,
                                             searchValue,
                                             setSearchValue,
                                             handleSearch,
                                             onLocationClick,
                                             onNotification
                                         }) {



    return (
        <>
            {/* MOBILE */}
            <div className="lg:hidden sticky top-0 z-50 ">
                <header className="bg-white border-b border-slate-100">
                    <div className="h-16 px-4 flex items-center justify-between">
                        {/* Location */}
                        <button
                            onClick={onLocationClick}
                            className="flex items-center gap-2 flex-1 min-w-0 text-left"
                        >
                            <MapPin
                                size={20}
                                className="text-indigo-700 flex-shrink-0"
                            />

                            <div className="min-w-0">
                                <p className="text-[9px] uppercase tracking-wider text-slate-500">
                                    Your Location
                                </p>

                                <p className="text-sm font-medium text-slate-900 truncate">
                                    {location}
                                </p>
                            </div>
                        </button>

                        {/* Logo */}
                        <div className="px-3">
                            <p className="text-[16px] font-medium tracking-tight text-indigo-800">
                                QuickKarigar
                            </p>
                        </div>

                        {/* Search */}
                        {/*<button*/}
                        {/*    onClick={handleSearch}*/}
                        {/*    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100"*/}
                        {/*>*/}
                        {/*    <Search*/}
                        {/*        size={20}*/}
                        {/*        className="text-slate-700"*/}
                        {/*    />*/}
                        {/*</button>*/}
                    </div>
                </header>
            </div>


            {/* DESKTOP */}
            <header className="hidden lg:flex h-[72px] px-6 bg-white border-b border-slate-200 items-center gap-4">

                {/* Search */}
                <div className="flex-1 max-w-3xl relative">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={searchValue}
                        onChange={(e) =>
                            setSearchValue(e.target.value)
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleSearch()
                        }
                        placeholder="Search artisans, services..."
                        className="
                            w-full
                            h-11
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            pl-11
                            pr-4
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-indigo-100
                        "
                    />
                </div>

                {/* Location */}
                <button
                    onClick={onLocationClick}
                    className="h-11 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 flex items-center gap-2 transition"
                >
                    <MapPin
                        size={16}
                        className="text-indigo-600"
                    />

                    <span className="text-sm text-indigo-700 font-medium">
                        {location}
                    </span>
                </button>

                {/* Notification */}
                <button
                    onClick={onNotification}
                    className="
                        relative
                        w-11
                        h-11
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        hover:bg-slate-100
                        flex
                        items-center
                        justify-center
                    "
                >
                    <Bell size={18} />

                    {notificationCount > 0 && (
                        <span
                            className="
                                absolute
                                -top-1
                                -right-1
                                min-w-[18px]
                                h-[18px]
                                px-1
                                rounded-full
                                bg-red-500
                                text-white
                                text-[10px]
                                font-semibold
                                flex
                                items-center
                                justify-center
                            "
                        >
                            {notificationCount > 99
                                ? "99+"
                                : notificationCount}
                        </span>
                    )}
                </button>
            </header>
        </>
    );
}