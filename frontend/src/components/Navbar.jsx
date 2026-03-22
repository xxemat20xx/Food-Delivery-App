import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, Shield } from "lucide-react";

import Logo from "../assets/inarawan-logo.png";

const Navbar = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { name: "Menu", targetId: "menu" },
    { name: "About", targetId: "about" },
    { name: "Contact", targetId: "contact" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-3 sm:px-12">
          
          {/* Logo */}
          <div className="flex items-center text-lg font-semibold text-white tracking-wide cursor-pointer" id="home">
            <div>
                <img src={Logo} alt="Logo" className="h-10 w-auto" />
            </div>
            <span className="ml-3 text-sm md:text-lg font-semibold text-white tracking-wide">Inarawan Coffee</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={`#${item.targetId}`}
                className="text-white/70 hover:text-white transition duration-200"
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-white gap-2"
            >
              <Shield size={18} />
              Admin Portal
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
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
                href={`#${item.targetId}`}
                onClick={() => setMobileOpen(false)}
                className="text-white/70 hover:text-white transition"
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-white gap-2"
            >
              Admin Portal
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition w-fit"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Better spacing approach */}
      <main className="p-12 mt-12 md:mt-16 bg-black text-slate-100 min-h-screen">
        {children}
      </main>
    </>
  );
};

export default Navbar;