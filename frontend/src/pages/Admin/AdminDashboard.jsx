import React, { useState } from "react";
import StoreDashboard from "./StoreDashboard";
import ItemsDashboard from "./ItemsDashboard";
import Logo from "../../assets/inarawan-logo.png";
import {
  Home,
  ShoppingCart,
  Box,
  Settings,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stores");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "stores":
        return <StoreDashboard />;
      case "orders":
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl">Orders Dashboard</p>
              <p className="text-sm mt-2">Coming soon...</p>
            </div>
          </div>
        );
      case "products":
        return <ItemsDashboard />;
      case "settings":
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Settings className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl">Settings Dashboard</p>
              <p className="text-sm mt-2">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return <StoreDashboard />;
    }
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Sidebar with glass effect */}
      <aside
        className={`${sidebarWidth} bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out shadow-2xl`}
      >
        {/* Header with logo and toggle */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Inarawan
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto">
              <img src={Logo} alt="logo" className="h-8 w-8 object-contain" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-amber-400 hover:text-amber-300 transition-all p-1 rounded-lg hover:bg-white/10"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "stores", label: "Stores", icon: Home },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "products", label: "Products", icon: Box },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20"
                  : "text-gray-300 hover:bg-white/10 hover:text-amber-400"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon size={18} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
              {!isCollapsed && activeTab === item.id && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-black/30"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer with exit button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate("/")}
            className={`group flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-white/10 transition-all duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Exit to portal" : ""}
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="font-medium">Exit to portal</span>}
          </button>
        </div>

        {/* Copyright */}
        <div className="p-4 border-t border-white/10 text-center">
          {!isCollapsed ? (
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Inarawan
            </p>
          ) : (
            <p className="text-xs text-gray-500">©</p>
          )}
        </div>
      </aside>

      {/* Main content area with subtle gradient background */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-black via-gray-900 to-black">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;