import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

//components
import Navbar from './components/Layout/Navbar';

// protect
import ProtectedRoutes from './components/ProtectedRoutes';

// pages
import Login from './pages/Login/Login';
import Homepage from './pages/Home/Homepage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StoreFinder from './pages/Home/StoreFinder';
import MenuPage from './pages/MenuPage';

// store
import { useAuthStore } from './store/useAuthStore';

// toaster
import { ToastContainer, Bounce } from 'react-toastify';


const App = () => {
  const { checkAuth } = useAuthStore()
  useEffect(() => {
    checkAuth();
  },[checkAuth])

  return (
    <>
      <ToastContainer
      position="bottom-right"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
      />
    <Routes>
      <Route path="/login" element={<Login />} />
            <Route 
      path="/"
      element={
           <Navbar>
            <Homepage />
           </Navbar>
      }
      />
            <Route
        path="/menu"
        element={
          <Navbar>
            <MenuPage />
          </Navbar>
        }
      />
      <Route
        path="/stores"
        element={
          <Navbar>
            <StoreFinder />
          </Navbar>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <AdminDashboard />
          </ProtectedRoutes>
        }
      />

   </Routes>

    </>
   
  )
}

export default App