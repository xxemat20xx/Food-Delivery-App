import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

//components
import Navbar from './components/Navbar';

// protect
import ProtectedRoutes from './components/ProtectedRoutes';

// pages
import Login from './pages/Login';
import Homepage from './pages/Homepage';

// store
import { useAuthStore } from './store/useAuthStore';


const App = () => {
  const { checkAuth } = useAuthStore()
  useEffect(() => {
    checkAuth();
  },[checkAuth])

  return (
   <Routes>
      <Route 
      path="/"
      element={
           <Navbar>
            <Homepage />
           </Navbar>
      }
      />
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/homepage"
        element={
          <ProtectedRoutes>
            <h1>Home</h1>
          </ProtectedRoutes>
        }
      />
   </Routes>
  )
}

export default App