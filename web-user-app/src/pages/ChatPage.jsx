// src/pages/ChatPage.jsx

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    Send,
    Phone,
    MoreVertical,
    Check,
    CheckCheck,
} from "lucide-react";

import DashboardLayout from "../components/DashboardNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";

export default function ChatPage() {
    const { chatId } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();

    const { socket } = useSocket();

    const [message, setMessage] =
        useState("");

    const [typingUser, setTypingUser] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const bottomRef =
        useRef(null);

    const roomId = chatId;

    // Dummy worker
    const worker = {
        name: "Rahul Sharma",
        service: "Master Electrician",
        image:
            "https://randomuser.me/api/portraits/men/32.jpg",
        online: true,
    };

    // Join Room
    useEffect(() => {
        if (!socket || !roomId) return;

        socket.emit(
            "join_room",
            roomId
        );

        socket.on(
            "room_joined",
            data => {
                console.log(
                    "Joined Room:",
                    data.roomId
                );
            }
        );

        socket.on(
            "receive_message",
            data => {
                if (!data.success)
                    return;

                setMessages(prev => [
                    ...prev,
                    data.message,
                ]);
            }
        );

        socket.on(
            "user_typing",
            ({ userId }) => {
                setTypingUser(
                    userId
                );

                setTimeout(() => {
                    setTypingUser(
                        null
                    );
                }, 1500);
            }
        );

        return () => {
            socket.off(
                "room_joined"
            );
            socket.off(
                "receive_message"
            );
            socket.off(
                "user_typing"
            );
        };
    }, [
        socket,
        roomId,
    ]);

    // Auto Scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView(
            {
                behavior:
                    "smooth",
            }
        );
    }, [messages]);

    const sendMessage =
        () => {
            if (
                !message.trim()
            )
                return;

            socket?.emit(
                "send_message",
                {
                    roomId,
                    sender:
                        user?._id ||
                        user?.id,
                    text: message,
                    timestamp:
                        Date.now(),
                }
            );

            setMessage("");
        };

    const handleTyping =
        value => {
            setMessage(value);

            socket?.emit(
                "typing",
                {
                    roomId,
                    userId:
                        user?._id ||
                        user?.id,
                }
            );
        };

    return (
        <DashboardLayout
            user={user}
        >
            <div
                className="
                    h-[calc(100vh-64px)]
                    flex
                    flex-col
                    bg-slate-50
                "
            >
                {/* Header */}

                <div
                    className="
                        bg-white
                        border-b
                        border-slate-200
                        px-4
                        md:px-6
                        h-16
                        mt-4
                        flex
                        items-center
                        justify-between
                        shrink-0
                    "
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                navigate(
                                    -1
                                )
                            }
                        >
                            <ArrowLeft
                                size={
                                    22
                                }
                            />
                        </button>

                        <div className="relative">
                            <img
                                src={
                                    worker.image
                                }
                                alt=""
                                className="
                                    w-11
                                    h-11
                                    rounded-full
                                    object-cover
                                "
                            />

                            {worker.online && (
                                <span
                                    className="
                                        absolute
                                        bottom-0
                                        right-0
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-green-500
                                        border-2
                                        border-white
                                    "
                                />
                            )}
                        </div>

                        <div>
                            <h2
                                className="
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                {
                                    worker.name
                                }
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {
                                    worker.service
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="
                                w-10
                                h-10
                                rounded-xl
                                bg-slate-100
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Phone
                                size={
                                    18
                                }
                            />
                        </button>

                        {/*<button*/}
                        {/*    className="*/}
                        {/*        w-10*/}
                        {/*        h-10*/}
                        {/*        rounded-xl*/}
                        {/*        bg-slate-100*/}
                        {/*        flex*/}
                        {/*        items-center*/}
                        {/*        justify-center*/}
                        {/*    "*/}
                        {/*>*/}
                        {/*    <MoreVertical*/}
                        {/*        size={*/}
                        {/*            18*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*</button>*/}
                    </div>
                </div>

                {/* Messages */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-4
                        md:px-6
                        py-4
                        space-y-3
                    "
                >
                    {messages.length ===
                        0 && (
                            <div
                                className="
                                h-full
                                flex
                                items-center
                                justify-center
                            "
                            >
                                <div
                                    className="
                                    text-center
                                "
                                >
                                    <h3
                                        className="
                                        text-lg
                                        font-semibold
                                    "
                                    >
                                        Start
                                        Conversation
                                    </h3>

                                    <p
                                        className="
                                        text-sm
                                        text-slate-500
                                        mt-1
                                    "
                                    >
                                        Ask
                                        anything
                                        about
                                        your
                                        service.
                                    </p>
                                </div>
                            </div>
                        )}

                    {messages.map(
                        (
                            msg,
                            index
                        ) => {
                            const isMe =
                                msg.sender ===
                                (user?._id ||
                                    user?.id);

                            return (
                                <div
                                    key={
                                        index
                                    }
                                    className={`flex ${
                                        isMe
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`
                                            max-w-[85%]
                                            md:max-w-[60%]
                                            px-4
                                            py-3
                                            rounded-2xl
                                            shadow-sm
                                            ${
                                            isMe
                                                ? "bg-indigo-700 text-white rounded-br-md"
                                                : "bg-white border border-slate-200 rounded-bl-md"
                                        }
                                        `}
                                    >
                                        <p
                                            className="
                                                text-sm
                                                break-words
                                            "
                                        >
                                            {
                                                msg.text
                                            }
                                        </p>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-end
                                                gap-1
                                                mt-1
                                            "
                                        >
                                            <span
                                                className="
                                                    text-[10px]
                                                    opacity-70
                                                "
                                            >
                                                {new Date(
                                                    msg.timestamp
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </span>

                                            {isMe && (
                                                <CheckCheck
                                                    size={
                                                        12
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}

                    {typingUser &&
                        typingUser !==
                        (user?._id ||
                            user?.id) && (
                            <div
                                className="
                                    text-xs
                                    text-slate-500
                                    italic
                                    px-2
                                "
                            >
                                Typing...
                            </div>
                        )}

                    <div
                        ref={
                            bottomRef
                        }
                    />
                </div>

                {/* Input */}

                <div
                    className="
                        bg-white
                        border-t
                        border-slate-200
                        p-3
                        shrink-0
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <input
                            value={
                                message
                            }
                            onChange={e =>
                                handleTyping(
                                    e
                                        .target
                                        .value
                                )
                            }
                            onKeyDown={e => {
                                if (
                                    e.key ===
                                    "Enter"
                                ) {
                                    sendMessage();
                                }
                            }}
                            placeholder="Type your message..."
                            className="
                                flex-1
                                h-12
                                px-4
                                rounded-xl
                                border
                                border-slate-200
                                focus:border-indigo-500
                                outline-none
                            "
                        />

                        <button
                            onClick={
                                sendMessage
                            }
                            className="
                                w-12
                                h-12
                                rounded-xl
                                bg-indigo-700
                                text-white
                                flex
                                items-center
                                justify-center
                                hover:bg-indigo-800
                            "
                        >
                            <Send
                                size={
                                    18
                                }
                            />
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}