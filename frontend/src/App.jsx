import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// components
import Layout from './components/Layout/Layout';      // 👈 import the new layout
import ProtectedRoutes from './components/ProtectedRoutes';

// pages
import Login from './pages/Login/Login';
import Homepage from './pages/Home/Homepage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StoreFinder from './pages/Home/StoreFinder';
import MenuPage from './pages/Menu/MenuPage';
import CartPage from './pages/Cart/CartPage';
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PaymentCancelled from "./pages/Payment/PaymentCancelled";
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
        {/* Public routes with navbar + footer */}
        <Route path="/" element={<Layout><Homepage /></Layout>} />
        <Route path="/menu" element={<Layout><MenuPage /></Layout>} />
        <Route path="/stores" element={<Layout><StoreFinder /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />

        {/* Protected routes (authenticated) with navbar + footer */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoutes>
              <Layout><CheckoutPage /></Layout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <Layout><MyOrders /></Layout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoutes>
              <Layout><OrderDetails /></Layout>
            </ProtectedRoutes>
          }
        />

        {/* Admin dashboard – no footer (keeps its own layout) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes>
              <AdminDashboard />
            </ProtectedRoutes>
          }
        />

        {/* Minimal pages – no navbar, no footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />
      </Routes>
    </>
  );
};

export default App;