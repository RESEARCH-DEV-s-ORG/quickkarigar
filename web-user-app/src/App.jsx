import { useState } from 'react'
import './App.css'
import {Link, Route, Routes} from "react-router-dom";
import HomePage from "./pages/Home";
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ProtectedRoute from "./routes/ProtectedRoute";
import BookingPage from "./pages/Booking.jsx";
import MessagesPage from "./pages/Messages.jsx";
import ProfilePage from "./pages/Profile.jsx";
import ServicesPage from "./pages/Services.jsx";
import WorkerDetails from "./pages/WorkerDetails.jsx";
import WorkersPage from "./pages/Workers.jsx";
import BookingDetailsPage from "./pages/BookingDetailsPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ExpertsPage from "./pages/Experts.jsx";



function App() {
  return (
      <div>
          {/*<nav style={{ padding: '20px', display: 'flex', gap: '10px' }}>*/}
          {/*    <Link to="/">Home</Link>*/}
          {/*    <Link to="/about">About</Link>*/}
          {/*</nav>*/}
          <Routes>
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
              <Route path="/bookings" element={<ProtectedRoute><BookingPage/></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><MessagesPage/></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute><ServicesPage/></ProtectedRoute>} />
              <Route path="/worker/:id" element={<ProtectedRoute><WorkerDetails /></ProtectedRoute>}/>
              <Route path="/workers" element={<ProtectedRoute><WorkersPage /></ProtectedRoute>}/>
              <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetailsPage /></ProtectedRoute>}/>
              <Route path="/chat/:chatId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/experts" element={<ProtectedRoute><ExpertsPage /></ProtectedRoute>}/>
              <Route path="/login" element={<Login/>} />
              <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
  )
}

export default App
