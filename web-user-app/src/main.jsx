import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/fonts.css";
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import  { AuthProvider } from "./context/AuthContext.jsx";
import {SocketProvider} from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider
            clientId="257200938816-ebtmmdq5anofnqclv4iullh81vnf5mpi.apps.googleusercontent.com"
        >
            <AuthProvider>
                <SocketProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </SocketProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>
);