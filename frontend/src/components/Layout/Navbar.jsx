import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  LogOut,
  Shield,
  LogIn,
  MapPin,
  ShoppingCart,
  Coffee,
  ClipboardList,
} from "lucide-react";
import Logo from "../../assets/logo2.png";
import LoginModal from "../../pages/Login/Login";

const Navbar = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isCheckingAuth } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Added icons to nav items
  const navItems = [
    { name: "Menu", path: "/menu", icon: Coffee },
    { name: "Orders", path: "/orders", icon: ClipboardList },
  ];

  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) navigate("/");
  };
  const handleLogin = () => {
    setLoginOpen(true);
  };

  // Skeleton loader for auth buttons
  const AuthButton = () => {
    if (isCheckingAuth) {
      return (
        <div className="w-20 h-9 bg-gray-700 rounded-lg animate-pulse"></div>
      );
    }
    if (!user) {
      return (
        <button
          onClick={handleLogin}
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded-lg font-medium transition flex items-center gap-2"
        >
          <LogIn size={16} />
          Login
        </button>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg transition flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900 shadow-lg border-b border-amber-500/20"
            : "bg-black border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          {/* Logo – now with subtle glow on hover */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="Logo"
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]"
            />
            <div>
              <span className="text-lg font-bold text-white transition-colors group-hover:text-amber-300">
                Brew Ha Ha Coffee
              </span>
              <span className="hidden sm:inline-block text-xs text-gray-400 ml-2">
                Since 2020
              </span>
            </div>
          </div>

          {/* Desktop Menu – all items now have icons */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/stores")}
              className="text-gray-200 hover:text-amber-400 transition flex items-center gap-1.5"
            >
              <MapPin size={16} />
              <span>Find Store</span>
            </button>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="text-gray-200 hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}

            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-200 hover:text-amber-400 transition flex items-center gap-1.5"
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>

            {(user?.role === "admin" || user?.role === "staff") && (
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="flex items-center gap-1.5 text-gray-200 hover:text-amber-400 transition"
              >
                <Shield size={16} />
                <span>Admin</span>
              </button>
            )}

            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu – icons included for consistency */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "border-t border-gray-800" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 space-y-3 bg-gray-900">
            <button
              onClick={() => {
                navigate("/stores");
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 text-gray-200 hover:text-amber-400 w-full py-2"
            >
              <MapPin size={18} /> Find Store
            </button>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 text-gray-200 hover:text-amber-400 w-full py-2"
                >
                  <Icon size={18} /> {item.name}
                </button>
              );
            })}

            <button
              onClick={() => {
                navigate("/cart");
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 text-gray-200 hover:text-amber-400 w-full py-2"
            >
              <ShoppingCart size={18} /> Cart{" "}
              {cartCount > 0 && `(${cartCount})`}
            </button>

            {(user?.role === "admin" || user?.role === "staff") && (
              <button
                onClick={() => {
                  navigate("/admin-dashboard");
                  setMobileOpen(false);
                }}
                className="flex items-center gap-3 text-gray-200 hover:text-amber-400 w-full py-2"
              >
                <Shield size={18} /> Admin Portal
              </button>
            )}

            {isCheckingAuth ? (
              <div className="w-full h-10 bg-gray-700 rounded-lg animate-pulse"></div>
            ) : !user ? (
              <button
                onClick={() => {
                  setLoginOpen(true);
                  setMobileOpen(false);
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-medium py-2 rounded-lg flex items-center justify-center gap-2 mt-2"
              >
                <LogIn size={16} /> Login
              </button>
            ) : (
              <>
                <p className="text-sm text-gray-400 text-center pt-2">
                  Logged in as{" "}
                  <span className="text-amber-400">{user.name}</span>
                </p>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;