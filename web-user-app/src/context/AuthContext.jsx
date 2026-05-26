// src/context/AuthContext.jsx

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const AuthContext =
    createContext(null);

export const AuthProvider = ({
                                 children,
                             }) => {

    const [user, setUser] =
        useState(null);

    const [token, setToken] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    // LOAD FROM STORAGE
    useEffect(() => {
        const storedToken =
            localStorage.getItem("token");
        const storedUser =
            localStorage.getItem("user");

        if (storedToken && storedUser) {

            setToken(storedToken);

            setUser(
                JSON.parse(storedUser)
            );

        }

        setLoading(false);

    }, []);

    // LOGIN
    const login = (
        jwtToken,
        userData
    ) => {

        localStorage.setItem(
            "token",
            jwtToken
        );

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setToken(jwtToken);

        setUser(userData);

    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        setToken(null);
        setUser(null);

    };

    // AUTH STATE
    const isAuthenticated =
        !!token;

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated,
        }),
        [
            user,
            token,
            loading,
        ]
    );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context =
        useContext(AuthContext);
    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }
    return context;
};