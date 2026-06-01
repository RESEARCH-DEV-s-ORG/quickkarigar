import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { io } from "socket.io-client";

import API from "../config/api.js";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

export function SocketProvider({
                                   children,
                               }) {
    const {
        token,
        user,
        isAuthenticated,
    } = useAuth();

    const [socket, setSocket] =
        useState(null);

    useEffect(() => {
        if (
            !isAuthenticated ||
            !token
        ) {
            return;
        }

        const socketInstance = io(
            API.SOCKET_BASE_URL,
            {
                transports: ["websocket"],

                auth: {
                    token,
                    userId: user?._id,
                },
            }
        );

        socketInstance.on(
            "connect",
            () => {
                console.log(
                    "Socket Connected:",
                    socketInstance.id
                );
            }
        );

        socketInstance.on(
            "disconnect",
            () => {
                console.log(
                    "Socket Disconnected"
                );
            }
        );

        socketInstance.on(
            "connect_error",
            (error) => {
                console.error(
                    error.message
                );
            }
        );

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };

    }, [
        token,
        user,
        isAuthenticated,
    ]);

    return (
        <SocketContext.Provider
            value={{ socket }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context =
        useContext(SocketContext);
    if (!context) {
        throw new Error(
            "useSocket must be used inside SocketProvider"
        );
    }
    return context;
}