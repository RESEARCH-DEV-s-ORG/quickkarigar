import { Search } from "lucide-react";
import {
    Zap,
    Wrench,
    PenTool,
    Paintbrush2,
    GraduationCap,
    BrushCleaning
} from "lucide-react";


import {
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "../context/AuthContext";
import {DashboardLayout} from "../components/DashboardNav.jsx";
import HeaderUI from "../components/HeaderUI.jsx";
import {useEffect, useState} from "react";
import ServicesGrid from "../components/ServicesGrid.jsx";
import TopRatedWorkers from "../components/TopRatedWorkers.jsx";

function HomePage() {
    const [searchValue, setSearchValue] = useState("");
    const [selectedService, setSelectedService] =
        useState(null);
    const handleSearch = () => {
        console.log(searchValue);
    }
    const [address, setAddress] = useState("Getting location...");

    const [locationLoading, setLocationLoading] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat =
                    position.coords.latitude;
                const lon =
                    position.coords.longitude;
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
                );
                const data =
                    await res.json();
                setAddress(
                    data.display_name
                );
            }
        );
    }, []);

    const [showLocationSheet, setShowLocationSheet] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth();

    const services = [
        {
            id: 1,
            title: "Electrician",
            experts: 48,
            icon: Zap,
        },
        {
            id: 2,
            title: "Plumber",
            icon: Wrench,
        },
        {
            id: 3,
            title: "Carpenter",
            icon: PenTool,
        },
        {
            id: 4,
            title: "Tutor",
            icon: GraduationCap,
        },
        {
            id: 5,
            title: "Cleaning",
            icon: BrushCleaning,
        },
        {
            id: 6,
            title: "Painter",
            icon: Paintbrush2,
        },
    ];
    const topWorkers = [
        {
            id: 1,
            name: "Rahul Sharma",
            service: "MASTER ELECTRICIAN",
            rating: 4.9,
            distance: "1.2 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 2,
            name: "Vikram Singh",
            service: "EMERGENCY PLUMBING",
            rating: 4.8,
            distance: "2.5 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/44.jpg"
        },
        {
            id: 3,
            name: "Amit Kumar",
            service: "FURNITURE EXPERT",
            rating: 5.0,
            distance: "0.8 km",
            available: false,
            image: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        {
            id: 4,
            name: "Sanjay Patel",
            service: "HOUSE PAINTING",
            rating: 4.7,
            distance: "3.1 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
            id: 5,
            name: "Arjun Das",
            service: "HOME CLEANING",
            rating: 4.8,
            distance: "1.5 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/52.jpg"
        }
    ];

    return (
        <DashboardLayout user={user}>
            <HeaderUI
                location={address}
                notificationCount={5}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                handleSearch={handleSearch}
                onLocationClick={() => {
                    setShowLocationSheet(true);
                }}
                onNotification={() => {
                    navigate("/notifications");
                }}
            />

            <div className="py-3 px-4">
                <section className="lg:hidden py-3">
                    <h1 className="text-[22px] font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                        Find the perfect <span className="text-indigo-700">artisan</span> for your home.
                    </h1>
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={searchValue}
                            onChange={(e) =>
                                setSearchValue(e.target.value)
                            }
                            type="text"
                            placeholder="Search for plumbers, tutors..."
                            className="
                                w-full
                                h-12
                                pl-11
                                pr-4
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                text-[14px]
                                text-slate-900
                                placeholder:text-slate-400
                                outline-none
                                focus:border-indigo-300
                                focus:ring-0
                                transition-colors
                            "
                        />
                    </div>
                </section>
                <ServicesGrid
                    services={services}
                    onSelectService={(service) => {
                        setSelectedService(service);
                        console.log(service);
                    }}
                    onViewAll={() => {
                        navigate("/services");
                    }}
                />
                <TopRatedWorkers
                    data={topWorkers}
                    onBookNow={(worker) => {
                        navigate(`/worker/${worker.id}`, {
                            state: {
                                worker,
                            },
                        });
                    }}
                    onViewAll={(worker) => {
                        navigate("/experts", {
                            state: {
                                service: {
                                    id: worker.id,
                                    title: worker.service,
                                    // experts: worker.service,
                                    description: worker.description,
                                    popular: worker.popular,
                                },
                            },
                        });
                    }}
                />
            </div>
        </DashboardLayout>
    );
}

export default HomePage;