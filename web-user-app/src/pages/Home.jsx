// src/pages/Home.jsx

import {
    Search,
    MapPin,
    Star,
    Home,
    CalendarDays,
    MessageCircle,
    User,
    Bell,
    LogOut,
    Zap,
    Wrench,
    Paintbrush,
    GraduationCap,
    BrushCleaning,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "../context/AuthContext";

function HomePage() {

    const navigate =
        useNavigate();

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
    return (
        <>
            <h2>Hello {user.fullName}</h2>
            <img src={user.profilePicture}  alt={""}/>
            <h2>{user.email}</h2>
            <h2 onClick={handleLogout}>Logout</h2>
        </>
    );
}

export default HomePage;