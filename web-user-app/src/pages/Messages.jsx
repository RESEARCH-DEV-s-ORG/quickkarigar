// src/pages/MessagesPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    MessageCircle,
    CheckCheck,
} from "lucide-react";

import DashboardLayout from "../components/DashboardNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function MessagesPage() {
    const navigate = useNavigate();

    const { user } = useAuth();

    const [search, setSearch] =
        useState("");

    const chats = [
        {
            id: 1,
            name: "Rahul Sharma",
            service: "Electrician",
            image:
                "https://randomuser.me/api/portraits/men/32.jpg",
            online: true,
            unread: 2,
            lastMessage:
                "I will arrive around 10 AM.",
            time: "2m",
        },
        {
            id: 2,
            name: "Vikram Singh",
            service: "Plumber",
            image:
                "https://randomuser.me/api/portraits/men/44.jpg",
            online: false,
            unread: 0,
            lastMessage:
                "Location received. Thank you.",
            time: "1h",
        },
        {
            id: 3,
            name: "Amit Kumar",
            service: "Carpenter",
            image:
                "https://randomuser.me/api/portraits/men/18.jpg",
            online: true,
            unread: 1,
            lastMessage:
                "Can you share a photo?",
            time: "5m",
        },
    ];

    const filteredChats =
        chats.filter(chat =>
            chat.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
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
                            text-[28px]
                            md:text-[36px]
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        Messages
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                        "
                    >
                        Chat with artisans and
                        track service updates
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
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search conversations"
                        className="
                            w-full
                            h-12
                            pl-11
                            pr-4
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            text-sm
                            outline-none
                            focus:border-indigo-300
                        "
                    />
                </div>

                {/* Empty State */}

                {filteredChats.length ===
                    0 && (
                        <div
                            className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            py-24
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
                                <MessageCircle
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
                                text-slate-900
                            "
                            >
                                No conversations
                            </h2>

                            <p
                                className="
                                mt-2
                                text-sm
                                text-slate-500
                                text-center
                            "
                            >
                                Your chats with
                                artisans will appear
                                here.
                            </p>
                        </div>
                    )}

                {/* Chat List */}

                <div className="mt-5 space-y-3">
                    {filteredChats.map(
                        (chat) => (
                            <button
                                key={chat.id}
                                onClick={() =>
                                    navigate(
                                        `/chat/${chat.id}`,
                                        {
                                            state:
                                                {
                                                    chat,
                                                },
                                        }
                                    )
                                }
                                className="
                                    w-full
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-2xl
                                    p-4
                                    flex
                                    items-center
                                    gap-4
                                    hover:border-indigo-200
                                    transition-all
                                "
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            chat.image
                                        }
                                        alt=""
                                        className="
                                            w-14
                                            h-14
                                            rounded-full
                                            object-cover
                                        "
                                    />

                                    {chat.online && (
                                        <span
                                            className="
                                                absolute
                                                bottom-0
                                                right-0
                                                w-3.5
                                                h-3.5
                                                rounded-full
                                                bg-green-500
                                                border-2
                                                border-white
                                            "
                                        />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 text-left">
                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-2
                                        "
                                    >
                                        <h3
                                            className="
                                                font-semibold
                                                truncate
                                                text-slate-900
                                            "
                                        >
                                            {
                                                chat.name
                                            }
                                        </h3>

                                        <span
                                            className="
                                                text-xs
                                                text-slate-400
                                                shrink-0
                                            "
                                        >
                                            {
                                                chat.time
                                            }
                                        </span>
                                    </div>

                                    <p
                                        className="
                                            text-[11px]
                                            font-medium
                                            text-indigo-700
                                            uppercase
                                            tracking-wide
                                            mt-0.5
                                        "
                                    >
                                        {
                                            chat.service
                                        }
                                    </p>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            mt-1
                                        "
                                    >
                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                                truncate
                                                pr-3
                                            "
                                        >
                                            {
                                                chat.lastMessage
                                            }
                                        </p>

                                        {chat.unread >
                                        0 ? (
                                            <span
                                                className="
                                                    w-5
                                                    h-5
                                                    rounded-full
                                                    bg-indigo-700
                                                    text-white
                                                    text-[11px]
                                                    font-semibold
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                "
                                            >
                                                {
                                                    chat.unread
                                                }
                                            </span>
                                        ) : (
                                            <CheckCheck
                                                size={
                                                    16
                                                }
                                                className="
                                                    text-green-500
                                                    shrink-0
                                                "
                                            />
                                        )}
                                    </div>
                                </div>
                            </button>
                        )
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}