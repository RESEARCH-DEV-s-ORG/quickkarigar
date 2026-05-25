import { useState } from 'react'
import './App.css'
import {Link, Route, Routes} from "react-router-dom";
import Login from './pages/Login'
import NotFound from './pages/NotFound'


function App() {
  return (
      <div>
          {/*<nav style={{ padding: '20px', display: 'flex', gap: '10px' }}>*/}
          {/*    <Link to="/">Home</Link>*/}
          {/*    <Link to="/about">About</Link>*/}
          {/*</nav>*/}
          <Routes>
              <Route path="/" element={<Login/>} />
              <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
  )
}

export default App
