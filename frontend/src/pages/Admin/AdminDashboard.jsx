import React, { useState } from "react";
import StoreDashboard from "./StoreDashboard";
import ItemsDashboard from "./ItemsDashboard";

import { Home, ShoppingCart, Box, Settings, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stores");
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

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-black text-amber-500 flex flex-col">
        <div className="text-2xl font-bold p-6 border-b border-gray-800">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("stores")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "stores" ? "bg-amber-500 text-black" : "hover:bg-gray-800"
            }`}
          >
            <Home size={18} /> Stores
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "orders" ? "bg-amber-500 text-black" : "hover:bg-gray-800"
            }`}
          >
            <ShoppingCart size={18} /> Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "products" ? "bg-amber-500 text-black" : "hover:bg-gray-800"
            }`}
          >
            <Box size={18} /> Products
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === "settings" ? "bg-amber-500 text-black" : "hover:bg-gray-800"
            }`}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>
                <div className="p-6 border-gray-800 text-sm text-gray-400">
          <button className="hover:text-amber-500 transition-colors duration-200 cursor-pointer"
          onClick={() => navigate("/")}>
            <div className="flex items-center">
              <ChevronLeft />
              Exit to portal
              </div>
              </button>
        </div>
        <div className="p-6 border-t border-gray-800 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} MyCompany
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;