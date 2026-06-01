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
              <Route path="/login" element={<Login/>} />
              <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
  )
}

export default App
