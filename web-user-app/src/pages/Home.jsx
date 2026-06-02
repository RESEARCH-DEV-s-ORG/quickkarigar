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

        // ELECTRICIANS
        {
            id: 1,
            category: "Electrician",
            name: "Rahul Sharma",
            service: "MASTER ELECTRICIAN",
            rating: 4.9,
            distance: "1.2 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 2,
            category: "Electrician",
            name: "Sourabh Das",
            service: "WIRING SPECIALIST",
            rating: 4.8,
            distance: "2.1 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
            id: 3,
            category: "Electrician",
            name: "Rakesh Roy",
            service: "HOME ELECTRICAL REPAIR",
            rating: 4.7,
            distance: "0.9 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/18.jpg"
        },
        {
            id: 4,
            category: "Electrician",
            name: "Ankit Verma",
            service: "FAN & LIGHT EXPERT",
            rating: 4.9,
            distance: "1.8 km",
            available: false,
            image: "https://randomuser.me/api/portraits/men/42.jpg"
        },
        {
            id: 5,
            category: "Electrician",
            name: "Debjit Paul",
            service: "INDUSTRIAL ELECTRICIAN",
            rating: 4.6,
            distance: "3.0 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/55.jpg"
        },

        // PLUMBERS
        {
            id: 6,
            category: "Plumber",
            name: "Vikram Singh",
            service: "EMERGENCY PLUMBING",
            rating: 4.8,
            distance: "2.5 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/44.jpg"
        },
        {
            id: 7,
            category: "Plumber",
            name: "Aman Yadav",
            service: "PIPE REPAIR EXPERT",
            rating: 4.9,
            distance: "1.3 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/24.jpg"
        },
        {
            id: 8,
            category: "Plumber",
            name: "Rohit Shaw",
            service: "BATHROOM FITTING",
            rating: 4.7,
            distance: "0.7 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/61.jpg"
        },
        {
            id: 9,
            category: "Plumber",
            name: "Subham Ghosh",
            service: "WATER LINE SPECIALIST",
            rating: 4.8,
            distance: "2.0 km",
            available: false,
            image: "https://randomuser.me/api/portraits/men/74.jpg"
        },
        {
            id: 10,
            category: "Plumber",
            name: "Pritam Das",
            service: "TANK CLEANING",
            rating: 4.6,
            distance: "3.5 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/68.jpg"
        },

        // CARPENTERS
        {
            id: 11,
            category: "Carpenter",
            name: "Amit Kumar",
            service: "FURNITURE EXPERT",
            rating: 5.0,
            distance: "0.8 km",
            available: false,
            image: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        {
            id: 12,
            category: "Carpenter",
            name: "Rajib Mondal",
            service: "WOODWORK SPECIALIST",
            rating: 4.8,
            distance: "1.9 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/11.jpg"
        },
        {
            id: 13,
            category: "Carpenter",
            name: "Bikash Roy",
            service: "DOOR & WINDOW REPAIR",
            rating: 4.7,
            distance: "2.4 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/12.jpg"
        },
        {
            id: 14,
            category: "Carpenter",
            name: "Kunal Dey",
            service: "MODULAR FURNITURE",
            rating: 4.9,
            distance: "1.0 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/13.jpg"
        },
        {
            id: 15,
            category: "Carpenter",
            name: "Arindam Das",
            service: "CUSTOM WOODWORK",
            rating: 4.6,
            distance: "2.7 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/14.jpg"
        },

        // TUTORS
        {
            id: 16,
            category: "Tutor",
            name: "Priya Sen",
            service: "MATH TUTOR",
            rating: 4.9,
            distance: "1.1 km",
            available: true,
            image: "https://randomuser.me/api/portraits/women/21.jpg"
        },
        {
            id: 17,
            category: "Tutor",
            name: "Ananya Roy",
            service: "SCIENCE TEACHER",
            rating: 4.8,
            distance: "1.5 km",
            available: true,
            image: "https://randomuser.me/api/portraits/women/22.jpg"
        },
        {
            id: 18,
            category: "Tutor",
            name: "Riya Das",
            service: "ENGLISH TUTOR",
            rating: 4.7,
            distance: "2.2 km",
            available: true,
            image: "https://randomuser.me/api/portraits/women/23.jpg"
        },
        {
            id: 19,
            category: "Tutor",
            name: "Sneha Ghosh",
            service: "COMPUTER SCIENCE",
            rating: 5.0,
            distance: "0.6 km",
            available: false,
            image: "https://randomuser.me/api/portraits/women/24.jpg"
        },
        {
            id: 20,
            category: "Tutor",
            name: "Puja Saha",
            service: "PHYSICS TEACHER",
            rating: 4.8,
            distance: "3.0 km",
            available: true,
            image: "https://randomuser.me/api/portraits/women/25.jpg"
        },

        // CLEANING
        {
            id: 21,
            category: "Cleaning",
            name: "Arjun Das",
            service: "HOME CLEANING",
            rating: 4.8,
            distance: "1.5 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/52.jpg"
        },
        {
            id: 22,
            category: "Cleaning",
            name: "Bapi Sardar",
            service: "SOFA CLEANING",
            rating: 4.9,
            distance: "0.8 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/53.jpg"
        },
        {
            id: 23,
            category: "Cleaning",
            name: "Suman Halder",
            service: "DEEP CLEANING",
            rating: 4.7,
            distance: "2.3 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/54.jpg"
        },
        {
            id: 24,
            category: "Cleaning",
            name: "Kaushik Dey",
            service: "OFFICE CLEANING",
            rating: 4.8,
            distance: "1.6 km",
            available: false,
            image: "https://randomuser.me/api/portraits/men/56.jpg"
        },
        {
            id: 25,
            category: "Cleaning",
            name: "Ratan Pal",
            service: "KITCHEN CLEANING",
            rating: 4.6,
            distance: "2.8 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/57.jpg"
        },

        // PAINTERS
        {
            id: 26,
            category: "Painter",
            name: "Sanjay Patel",
            service: "HOUSE PAINTING",
            rating: 4.7,
            distance: "3.1 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
            id: 27,
            category: "Painter",
            name: "Manoj Kumar",
            service: "INTERIOR PAINTING",
            rating: 4.9,
            distance: "1.4 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/58.jpg"
        },
        {
            id: 28,
            category: "Painter",
            name: "Ashok Das",
            service: "WALL DESIGNER",
            rating: 4.8,
            distance: "2.2 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/59.jpg"
        },
        {
            id: 29,
            category: "Painter",
            name: "Ranjit Roy",
            service: "EXTERIOR PAINTING",
            rating: 4.6,
            distance: "2.7 km",
            available: false,
            image: "https://randomuser.me/api/portraits/men/60.jpg"
        },
        {
            id: 30,
            category: "Painter",
            name: "Bikram Sen",
            service: "TEXTURE PAINT EXPERT",
            rating: 4.9,
            distance: "1.0 km",
            available: true,
            image: "https://randomuser.me/api/portraits/men/62.jpg"
        }

    ];

    const [searchValue, setSearchValue] = useState("");
    const [selectedService, setSelectedService] =
        useState(null);
    const handleSearch = () => {
        console.log(searchValue);
    }

    const filteredWorkers = selectedService
        ? topWorkers
            .filter(
                (worker) =>
                    worker.category === selectedService.title
            )
            .slice(0, 6)
        : topWorkers.slice(0, 6);


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
                    data={filteredWorkers}
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