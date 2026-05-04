import React, { useState } from "react";
import StoreDashboard from "./StoreDashboard";
import ItemsDashboard from "./ItemsDashboard";
import Logo from "../../assets/logo2.png";
import {
  Home,
  ShoppingCart,
  Box,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderMonitoringDashboard from "./OrderMonitoringDashboard";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stores");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "stores":
        return <StoreDashboard />;
      case "orders":
        return <OrderMonitoringDashboard />;
      case "products":
        return <ItemsDashboard />;
      case "settings":
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl font-light">Settings Dashboard</p>
              <p className="text-sm mt-2 text-gray-500">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return <StoreDashboard />;
    }
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar - modern dark glass with subtle gradient */}
      <aside
        className={`${sidebarWidth} bg-gray-950/90 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-all duration-500 ease-in-out shadow-2xl relative`}
      >
        {/* Background glow behind logo when collapsed */}
        {isCollapsed && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-500/10 blur-3xl rounded-full mt-6"></div>
        )}

        {/* Header */}
        <div className={`flex items-center p-4 border-b border-white/5 ${isCollapsed ? "flex-col gap-4" : ""}`}>
          {/* Logo & title */}
          <div
            className={`flex items-center cursor-pointer group ${isCollapsed ? "flex-col gap-2" : "gap-3 flex-1"}`}
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="logo"
              className={`object-contain transition-all duration-500 ${
                isCollapsed
                  ? "h-14 w-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.7)] group-hover:scale-110"
                  : "h-8 w-auto drop-shadow-[0_0_10px_rgba(251,191,36,0.4)] group-hover:scale-105"
              }`}
            />
            {!isCollapsed && (
              <span className="text-xl font-semibold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Brew Ha Ha
              </span>
            )}
          </div>
          
          {/* Toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-amber-400/70 hover:text-amber-300 transition-all p-1.5 rounded-lg hover:bg-white/5 ml-auto"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 ${isCollapsed ? "px-2" : "px-3"} space-y-1`}>
          {[
            { id: "stores", label: "Stores", icon: Home },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "products", label: "Products", icon: Box },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex items-center gap-3 w-full rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 text-black font-medium"
                    : "text-gray-400 hover:text-amber-300 hover:bg-white/5"
                } ${isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3"}`}
                title={isCollapsed ? item.label : ""}
              >
                {/* Active indicator - modern glowing dot */}
                {isActive && !isCollapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-300 rounded-r-full"></span>
                )}
                <item.icon size={18} className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                {!isCollapsed && <span>{item.label}</span>}
                {/* Subtle gradient background on hover for inactive */}
                {!isActive && !isCollapsed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-amber-500/5 group-hover:to-transparent rounded-2xl transition-all duration-500"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-white/5 ${isCollapsed ? "flex flex-col items-center gap-4" : ""}`}>
          <button
            onClick={() => navigate("/")}
            className={`group flex items-center gap-3 w-full rounded-xl transition-all duration-300 text-gray-400 hover:text-amber-300 hover:bg-white/5 ${
              isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3"
            }`}
            title={isCollapsed ? "Exit to portal" : ""}
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span>Exit to portal</span>}
          </button>
          {!isCollapsed ? (
            <p className="text-xs text-gray-600 mt-2 text-center">&copy; {new Date().getFullYear()} Brew Ha Ha</p>
          ) : (
            <p className="text-xs text-gray-600">©</p>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-950 via-black to-gray-950">
        <div className="h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;