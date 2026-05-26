import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    useAuth,
} from "../context/AuthContext";

function ProtectedRoute({
                            children,
                        }) {

    const {
        user,
        loading,
    } = useAuth();

    const location =
        useLocation();

    /*
        SHOW LOADER
        WHILE AUTH CHECKING
    */

    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-50
            ">

                <div className="
                    w-14
                    h-14

                    rounded-full

                    border-4
                    border-indigo-200
                    border-t-indigo-700

                    animate-spin
                " />

            </div>

        );

    }

    /*
        USER NOT LOGGED IN
        REDIRECT TO LOGIN
    */

    if (!user) {

        return (

            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />

        );

    }

    /*
        USER AUTHENTICATED
    */

    return children;

}

export default ProtectedRoute;