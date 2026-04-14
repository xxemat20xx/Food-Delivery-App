import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, Shield, LogIn, MapPin, ShoppingCart } from "lucide-react";

import Logo from "../../assets/inarawan-logo.png";
import LoginModal from "../../pages/Login/Login";

const Navbar = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const { items } = useCartStore(); // ✅ CART STORE
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const [loginOpen, setLoginOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = () => {
    setLoginOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-3 sm:px-12">

          {/* Logo */}
          <div
            className="flex items-center text-lg font-semibold text-white tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
            <span className="ml-3 text-sm md:text-lg font-semibold text-white tracking-wide">
              Inarawan Coffee
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">

            <button
              className="text-white/70 hover:text-white transition duration-200 flex items-center gap-2"
              onClick={() => navigate("/stores")}
            >
              <MapPin /> Find Store
            </button>

            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-white/70 hover:text-white transition duration-200"
              >
                {item.name}
              </button>
            ))}
            {/* CART BUTTON ✅ */}
            <button
              onClick={() => navigate("/cart")}
              className="relative text-white/70 hover:text-white transition flex items-center gap-2"
            >
              <ShoppingCart />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            {(user?.role === "admin" || user?.role === "staff") && (
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="flex items-center text-white gap-2"
              >
                <Shield size={18} />
                Admin Portal
              </button>
            )}

            {!user ? (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition"
              >
                <LogIn size={18} />
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden px-6 pb-4 ${mobileOpen ? "block" : "hidden"}`}>
          <div className="flex flex-col gap-4">

            <button
              onClick={() => {
                navigate("/stores");
                setMobileOpen(false);
              }}
              className="text-white/70 hover:text-white flex items-center gap-2"
            >
              <MapPin /> Find Store
            </button>

            {/* CART MOBILE */}
            <button
              onClick={() => {
                navigate("/cart");
                setMobileOpen(false);
              }}
              className="text-white/70 hover:text-white flex items-center gap-2"
            >
              <ShoppingCart />
              Cart {cartCount > 0 && `(${cartCount})`}
            </button>

          </div>
        </div>
      </nav>

      <main className="p-12 mt-12 md:mt-16 min-h-screen bg-[var(--color-dark)]">
        {children}
      </main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;