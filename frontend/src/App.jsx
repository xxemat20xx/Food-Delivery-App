import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

//components
import Navbar from './components/Navbar';

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
           <Navbar>
            <h1 className='my-8 p-6'>Dashboard</h1>
           </Navbar>
        </ProtectedRoutes>
      }
      />

   </Routes>
  )
}

export default App