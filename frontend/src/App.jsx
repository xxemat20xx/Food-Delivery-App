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
import MenuPage from './pages/Menu/MenuPage';
import CartPage from './pages/Cart/CartPage';
import PaymentSuccess from "./pages/Payment/PaymentSuccess"
import PaymentCancelled from "./pages/Payment/PaymentCancelled"
import CheckoutPage from './pages/Checkout/CheckoutPage';
import MyOrders from './pages/Orders/MyOrders';
import OrderDetails from "./pages/Orders/OrderDetails";

// store
import { useAuthStore } from './store/useAuthStore';

// toaster
import { ToastContainer, Bounce } from 'react-toastify';

     

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navbar><Homepage /></Navbar>} />
        <Route path="/menu" element={<Navbar><MenuPage /></Navbar>} />
        <Route path="/stores" element={<Navbar><StoreFinder /></Navbar>} />
        <Route path="/cart" element={<Navbar><CartPage /></Navbar>} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />

        {/* 🔒 Protected routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoutes>
              <CheckoutPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <MyOrders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoutes>
              <OrderDetails />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
};

export default App