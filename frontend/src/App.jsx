import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// protect
import ProtectedRoutes from './components/ProtectedRoutes';

// pages
import Login from './pages/Login';

// store
import { useAuthStore } from './store/useAuthStore';

const App = () => {
  const { checkAuth } = useAuthStore()
  useEffect(() => {
    checkAuth();
  },[checkAuth])

  return (
   <Routes>
     
      <Route path="/login" element={<Login />} />


      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <h1>Home</h1>
          </ProtectedRoutes>
        }
      />
      
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