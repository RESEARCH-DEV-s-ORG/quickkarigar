import {useAuth} from "../context/AuthContext.jsx";
import DashboardLayout from "../components/DashboardNav.jsx";

export default function WorkersPage() {
    const {user} = useAuth();
    return (
        <DashboardLayout user={user}>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[20px] font-semibold text-slate-900">
                        All Services
                    </h2>
                </div>
            </div>
        </DashboardLayout>
    );
}