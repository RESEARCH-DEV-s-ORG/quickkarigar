import { useLocation } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import DashboardLayout from "../components/DashboardNav.jsx";

export default function WorkerDetails() {
    const { state } = useLocation();
    const worker = state?.worker;
    if (!worker) {
        return (
            <div className="p-6">
                Worker not found
            </div>
        );
    }

    const {user} = useAuth();

    return (
        <DashboardLayout user={user}>
            <div className="p-6">
                <img
                    src={worker.image}
                    alt={worker.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                />
                <h1 className="text-2xl font-bold mt-4">
                    {worker.name}
                </h1>
                <p className="text-indigo-700 font-medium">
                    {worker.service}
                </p>
                <p className="mt-2">
                    ⭐ {worker.rating}
                </p>
                <p>
                    📍 {worker.distance}
                </p>
            </div>
        </DashboardLayout>
    );
}