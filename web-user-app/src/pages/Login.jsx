import { useState, useRef } from "react";
import { GoogleLogin , useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import auth_bg from "../assets/auth_bg.png";
import { useAuth } from "../context/AuthContext";
import { API } from "../config/api.js";

function Login() {
    const navigate = useNavigate();

    //const googleBtnRef = useRef(null);

    const {
        login,
    } = useAuth();


    const handlePhoneLogin = () => {
        console.log("Phone Login Clicked");
    };
    const handleEmailLogin = () => {
        console.log("Email Login Clicked");
    };
    const handleSignup = () => {
        console.log("Signup Clicked");
    };

    return (
        <div className="min-h-screen bg-[#eef1f7]">
            <div className="min-h-screen flex items-center justify-center lg:p-8">

                {/* MAIN CONTAINER */}
                <div className="
                    w-full
                    min-h-screen

                    lg:min-h-[90vh]
                    lg:max-w-7xl
                    lg:grid
                    lg:grid-cols-2

                    bg-[#f7f8fb]

                    lg:rounded-[40px]
                    lg:overflow-hidden
                    lg:shadow-[0_20px_80px_rgba(0,0,0,0.08)]
                ">

                    {/* DESKTOP LEFT SECTION */}
                    <div className="
                        hidden
                        lg:flex
                        relative
                        overflow-hidden
                    ">

                        {/* BG */}
                        <img
                            src={auth_bg}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#18206f]/90 via-[#232b9c]/80 to-[#0f172a]/80"></div>

                        {/* CONTENT */}
                        <div className="
                            relative
                            z-10
                            flex
                            flex-col
                            justify-between
                            h-full
                            p-14
                            text-white
                        ">

                            {/* TOP */}
                            <div>

                                <div className="flex items-center gap-4">

                                    <div className="
                                        w-16
                                        h-16
                                        rounded-[22px]
                                        bg-white/15
                                        backdrop-blur-md
                                        border
                                        border-white/20
                                        flex
                                        items-center
                                        justify-center
                                    ">
                                        <span className="material-symbols-outlined text-[38px]">
                                            handyman
                                        </span>
                                    </div>

                                    <div>
                                        <h1 className="
                                            text-4xl
                                            font-black
                                            tracking-[-1px]
                                        ">
                                            QuickKarigar
                                        </h1>

                                        <p className="text-white/70 mt-1">
                                            Smart Local Worker Finder
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* CENTER */}
                            <div className="max-w-xl">

                                <div className="
                                    inline-flex
                                    items-center
                                    gap-3
                                    px-5
                                    py-3
                                    rounded-full
                                    bg-white/10
                                    border
                                    border-white/20
                                    backdrop-blur-md
                                    mb-8
                                ">

                                    <span className="
                                        w-3
                                        h-3
                                        rounded-full
                                        bg-green-400
                                    "></span>

                                    Trusted by Local Communities

                                </div>

                                <h2 className="
                                    text-6xl
                                    leading-[1.05]
                                    font-black
                                    tracking-[-2px]
                                ">
                                    Reliable home services at your doorstep.
                                </h2>

                                <p className="
                                    mt-8
                                    text-xl
                                    leading-relaxed
                                    text-white/75
                                    max-w-lg
                                ">
                                    Find trusted electricians, plumbers,
                                    carpenters, tutors and skilled workers
                                    instantly near you.
                                </p>

                                {/* STATS */}
                                <div className="flex gap-16 mt-14">

                                    <div>
                                        <h3 className="text-5xl font-black">
                                            10K+
                                        </h3>

                                        <p className="mt-2 text-white/60">
                                            Workers
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-5xl font-black">
                                            24/7
                                        </h3>

                                        <p className="mt-2 text-white/60">
                                            Support
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-5xl font-black">
                                            4.9★
                                        </h3>

                                        <p className="mt-2 text-white/60">
                                            Ratings
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* FOOTER */}
                            <div className="flex gap-8 text-white/60">

                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">
                                        verified_user
                                    </span>

                                    Secure
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">
                                        bolt
                                    </span>

                                    Fast
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">
                                        verified
                                    </span>

                                    Verified
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT LOGIN SECTION */}
                    <div className="
                        relative
                        flex
                        flex-col
                        justify-center

                        min-h-screen

                        lg:min-h-0
                        px-6
                        py-8

                        sm:px-8

                        lg:px-20
                        lg:bg-[#f8f9fc]
                    ">

                        {/* MOBILE HERO */}
                        <div className="lg:hidden">

                            <div className="
                                relative
                                h-[250px]
                                sm:h-[300px]

                                -mx-6
                                -mt-8

                                overflow-hidden
                            ">

                                <img
                                    src={auth_bg}
                                    alt="Background"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-white/55"></div>

                                <div className="
                                    relative
                                    z-10
                                    h-full
                                    flex
                                    flex-col
                                    justify-end

                                    px-6
                                    pb-7

                                    sm:px-7
                                    sm:pb-10
                                ">

                                    <div className="flex items-center gap-4">

                                        <div className="
                                            w-[54px]
                                            h-[54px]
                                            rounded-[16px]
                                            bg-white
                                            shadow-sm
                                            flex
                                            items-center
                                            justify-center
                                        ">
                                            <span className="material-symbols-outlined text-[30px] text-[#1d2394]">
                                                handyman
                                            </span>
                                        </div>

                                        <h1 className="
                                            text-[28px]
                                            sm:text-[34px]
                                            font-extrabold
                                            tracking-[-1px]
                                            text-[#1d2394]
                                        ">
                                            QuickKarigar
                                        </h1>

                                    </div>

                                    <p className="
                                        mt-4
                                        text-[18px]
                                        sm:text-[22px]
                                        leading-[1.25]
                                        font-medium
                                        text-[#4b4b52]
                                        max-w-[260px]
                                    ">
                                        Reliable home maintenance at your doorstep.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* LOGIN CARD */}
                        <div className="
                            relative

                            lg:max-w-md
                            lg:w-full
                            lg:mx-auto

                            bg-[#f7f7f9]

                            rounded-t-[28px]

                            lg:rounded-[32px]

                            px-6
                            pt-7
                            pb-8

                            sm:px-7
                            sm:pt-9
                            sm:pb-12
                        ">

                            <h2 className="
                                text-[28px]
                                sm:text-[34px]
                                leading-none
                                font-extrabold
                                tracking-[-1px]
                                text-[#07102b]
                            ">
                                Welcome back
                            </h2>

                            <p className="
                                mt-3
                                text-[16px]
                                sm:text-[18px]
                                leading-[1.45]
                                text-[#8a8a95]
                                font-medium
                            ">
                                Please sign in to continue your journey.
                            </p>

                            {/* BUTTONS */}
                            <div className="mt-8 space-y-5">


                                {/* GOOGLE */}
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        try {
                                            const response = await fetch(API.GOOGLE_LOGIN, {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ token: credentialResponse.credential }), // ✅ This IS the id_token
                                            });

                                            const data = await response.json();
                                            if (data.success) {
                                                login(data.token, data.user);
                                                navigate("/");
                                            } else {
                                                console.error("Login failed:", data.message);
                                            }
                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }}
                                    onError={() => console.log("Google Login Failed")}
                                />
                                {/*<div*/}
                                {/*    ref={googleBtnRef}*/}
                                {/*    className="absolute opacity-0 pointer-events-none"*/}
                                {/*>*/}
                                {/*    */}
                                {/*</div>*/}
                                {/*<button*/}
                                {/*        onClick={() =>*/}
                                {/*             googleBtnRef.current?.querySelector("div[role='button']")?.click()*/}
                                {/*        }*/}
                                {/*        className="*/}
                                {/*        w-full*/}
                                {/*        h-[62px]*/}
                                {/*        sm:h-[74px]*/}

                                {/*        rounded-[20px]*/}

                                {/*        border*/}
                                {/*        border-[#dddddf]*/}
                                {/*        bg-white*/}

                                {/*        flex*/}
                                {/*        items-center*/}
                                {/*        justify-center*/}
                                {/*        gap-4*/}

                                {/*        text-[16px]*/}
                                {/*        sm:text-[17px]*/}

                                {/*        font-medium*/}
                                {/*        text-[#202124]*/}

                                {/*        hover:bg-[#fafafa]*/}
                                {/*        transition*/}
                                {/*    ">*/}
                                {/*        <img*/}
                                {/*            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"*/}
                                {/*            alt="Google"*/}
                                {/*            className="w-6 h-6"*/}
                                {/*        />*/}

                                {/*        Continue with Google*/}
                                {/*    </button>*/}



                                {/* DIVIDER */}
                                <div className="flex items-center gap-4">

                                    <div className="h-[1px] flex-1 bg-[#d9d9dc]"></div>

                                    <span className="
                                        text-[14px]
                                        text-[#9a9aa2]
                                        font-medium
                                    ">
                                        OR
                                    </span>

                                    <div className="h-[1px] flex-1 bg-[#d9d9dc]"></div>

                                </div>

                                {/* PHONE */}
                                <button
                                    onClick={handlePhoneLogin}
                                    className="
                                    w-full
                                    h-[62px]
                                    sm:h-[74px]

                                    rounded-[20px]

                                    bg-[#232b9c]
                                    hover:bg-[#1b2287]

                                    flex
                                    items-center
                                    justify-center
                                    gap-4

                                    text-white
                                    text-[16px]
                                    sm:text-[17px]

                                    font-medium

                                    shadow-lg
                                    shadow-indigo-900/10

                                    transition
                                ">

                                    <span className="material-symbols-outlined text-[24px]">
                                        smartphone
                                    </span>

                                    Login with Phone

                                </button>

                                {/* EMAIL */}
                                <button
                                    onClick={handleEmailLogin}
                                    className="
                                    w-full
                                    h-[62px]
                                    sm:h-[74px]

                                    rounded-[20px]

                                    bg-[#ececef]
                                    hover:bg-[#e4e4e8]

                                    flex
                                    items-center
                                    justify-center
                                    gap-4

                                    text-[#232b9c]
                                    text-[16px]
                                    sm:text-[17px]

                                    font-medium
                                    transition
                                ">

                                    <span className="material-symbols-outlined text-[22px]">
                                        mail
                                    </span>

                                    Login with Email

                                </button>

                            </div>

                            {/* SIGNUP */}
                            <div className="mt-10 text-center">

                                <p className="
                                    text-[16px]
                                    sm:text-[18px]
                                    text-[#4d4d56]
                                    font-medium
                                ">
                                    New to QuickKarigar?

                                    <a
                                        href="#"
                                        className="
                                            ml-2
                                            text-[#232b9c]
                                            font-bold
                                        "
                                    >
                                        Sign Up
                                    </a>

                                </p>

                            </div>

                            {/* MOBILE FOOTER */}
                            <div className="
                                mt-10
                                flex
                                justify-center
                                gap-10
                                lg:hidden
                            ">

                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-[28px] text-[#232323]">
                                        verified_user
                                    </span>

                                    <span className="mt-2 text-[11px] text-[#2f2f2f]">
                                        SECURE
                                    </span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-[28px] text-[#232323]">
                                        history
                                    </span>

                                    <span className="mt-2 text-[11px] text-[#2f2f2f]">
                                        QUICK
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;