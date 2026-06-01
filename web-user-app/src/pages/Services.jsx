import {
    useNavigate,
} from "react-router-dom";
import HomePage from "./Home.jsx";
import DashboardLayout from "../components/DashboardNav.jsx";
import {useAuth} from "../context/AuthContext.jsx";


function ServicesPage() {

    const {
        user,
    } = useAuth();

    return (
        <DashboardLayout user={user}>
            <div className="p-6">
                <h2>Services page</h2>
            </div>
        </DashboardLayout>
    )
}

export default ServicesPage;