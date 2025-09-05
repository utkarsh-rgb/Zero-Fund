// layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Code,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";

const Layout: React.FC = () => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const developerId = userData.id;
  const userType = userData.userType;
  const entrepreneurId = userData.id;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-skyblue to-navy rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                  <Code className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-navy">Zero Fund</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-px h-6 bg-gray-300"></div>
                <span className="text-sm text-gray-600">
                  {userType === "developer" ? "Developer Dashboard" : "Entrepreneur Dashboard"}
                </span>
              </div>
            </div>

            {/* Right side - Actions and profile */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Desktop actions */}
              <div className="hidden md:flex items-center space-x-2">
                {/* Notifications */}
                <Link
                  to={`/notifications/${developerId}`}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Link>

                {/* Settings */}
                <Link
                  to={userType === "developer" ? `/settings/${developerId}` : `/settings/${entrepreneurId}`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>

              {/* Profile Avatar */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm ml-2">
                {userType === "developer" ? "D" : "E"}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-3">
                <div className="text-sm text-gray-600 px-2">
                  {userType === "developer" ? "Developer Dashboard" : "Entrepreneur Dashboard"}
                </div>
                
                <Link
                  to={`/notifications/${developerId}`}
                  className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-auto"></span>
                </Link>

                <Link
                  to={userType === "developer" ? `/settings/${developerId}` : `/settings/${entrepreneurId}`}
                  className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;