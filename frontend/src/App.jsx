import React from 'react'
import { Routes, Route } from 'react-router-dom';

// protect
import ProtectedRoutes from './components/ProtectedRoutes';

// pages
import Login from './pages/Login';

const App = () => {
  return (
   <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/login" element={<Login />} />

      <Route 
      path="/dashboard"
      element={
        <ProtectedRoutes>
           <h1>Dashboard</h1>
        </ProtectedRoutes>
      }
      />
   </Routes>
  )
}

export default App