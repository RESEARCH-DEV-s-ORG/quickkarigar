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
import {DashboardLayout} from "../components/DashboardNav.jsx";
function ProfilePage() {

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
        <DashboardLayout user={user}>
            <div className="p-6">
                <h2>Hello {user.fullName}</h2>
                <img src={user.profilePicture}  alt={""}/>
                <h2>{user.email}</h2>
                <h2 onClick={handleLogout}>Logout</h2>
            </div>
        </DashboardLayout>
    );
}

export default ProfilePage;