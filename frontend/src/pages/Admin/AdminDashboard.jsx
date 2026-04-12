import React, { useState } from "react";
import StoreDashboard from "./StoreDashboard";
import ItemsDashboard from "./ItemsDashboard";
import Logo from "../../assets/inarawan-logo.png"
import {
  Home,
  ShoppingCart,
  Box,
  Settings,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stores");
  const [isCollapsed, setIsCollapsed] = useState(false); // 👈 sidebar collapse state
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case "stores":
        return <StoreDashboard />;
      case "orders":
        return <div className="p-6 text-white">Orders Dashboard (Coming Soon)</div>;
      case "products":
        return <ItemsDashboard />;
      case "settings":
        return <div className="p-6 text-white">Settings Dashboard (Coming Soon)</div>;
      default:
        return <StoreDashboard />;
    }
  };

  // Dynamic sidebar width
  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${sidebarWidth} bg-black text-amber-500 flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Header with toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!isCollapsed && (
            <div className="text-2xl font-bold">Admin Panel</div>
          )}
          {isCollapsed && (
            <div className="font-bold mx-auto">
              <img src={Logo} alt="logo.png" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-amber-500 hover:text-amber-400 transition-colors ml-auto"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("stores")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "stores"
                ? "bg-amber-500 text-black"
                : "hover:bg-gray-800"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? "Stores" : ""}
          >
            <Home size={18} />
            {!isCollapsed && <span>Stores</span>}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "orders"
                ? "bg-amber-500 text-black"
                : "hover:bg-gray-800"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? "Orders" : ""}
          >
            <ShoppingCart size={18} />
            {!isCollapsed && <span>Orders</span>}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "products"
                ? "bg-amber-500 text-black"
                : "hover:bg-gray-800"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? "Products" : ""}
          >
            <Box size={18} />
            {!isCollapsed && <span>Products</span>}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "settings"
                ? "bg-amber-500 text-black"
                : "hover:bg-gray-800"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings size={18} />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </nav>

        {/* Exit button */}
        <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
          <button
            className="hover:text-amber-500 transition-colors duration-200 cursor-pointer w-full"
            onClick={() => navigate("/")}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}>
              <ChevronLeft size={18} />
              {!isCollapsed && <span className="ml-2">Exit to portal</span>}
            </div>
          </button>
        </div>

        {/* Copyright - hide text when collapsed, show only icon or nothing */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-800 text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} MyCompany
          </div>
        )}
        {isCollapsed && (
          <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
            ©
          </div>
        )}
      </div>

      {/* Main Content - automatically takes remaining width */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;