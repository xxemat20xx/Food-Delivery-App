import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, Shield, LogIn, MapPin } from "lucide-react";

import Logo from "../../assets/inarawan-logo.png"

import LoginModal from "../../pages/Login/Login";

const Navbar = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Get user state
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { name: "Menu", path: "/#menu" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  const [loginOpen, setLoginOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ Empty login handler
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
            onClick={() => {
              navigate("/")
              setMobileOpen(false);
            }}
          >
            <img src={Logo} alt="Logo" className="h-10 w-auto" />
            <span className="ml-3 text-sm md:text-lg font-semibold text-white tracking-wide">
              Inarawan Coffee
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button className="text-white/70 hover:text-white transition duration-200 flex items-center gap-2"
            onClick={() => navigate("/stores")}>
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

            {(user?.role === "admin" || user?.role === "staff") && (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-white gap-2"
              >
                <Shield size={18} />
                Admin Portal
              </button>
            )}

            {/* ✅ Conditional Auth Button */}
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
        <div
          className={`md:hidden px-6 pb-4 transition-all duration-300 ${
            mobileOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={`${item.path}`}
                onClick={() => setMobileOpen(false)}
                className="text-white/70 hover:text-white transition"
              >
                {item.name}
              </a>
            ))}
            <button className="text-white/70 hover:text-white transition duration-200 flex items-center gap-2"
            onClick={() => {
              navigate("/stores")
              setMobileOpen(false)
            }}>
              <MapPin /> Find Store
            </button>

            {(user?.role === "admin" || user?.role === "staff") && (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-white gap-2"
              >
                <Shield size={18} />
                Admin Portal
              </button>
            )}

            {/* ✅ Conditional Auth Button (Mobile) */}
            {!user ? (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition w-fit"
              >
                <LogIn size={18} />
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition w-fit"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="p-12 mt-12 md:mt-16 bg-black text-slate-100 min-h-screen">
        {children}
      </main>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;