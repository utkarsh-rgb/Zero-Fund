import { useState } from "react";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";

export default function IndexHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smulating userData check (replace with actual implementation)
  // const userData = null; // In real app: get from state/context
  // const userType = userData?.userType;

  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userType = userData?.userType;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br to-navy rounded-xl flex items-center justify-center shadow-sm">
              <img
                src="/zerofundlogo.svg"
                alt="Zero Fund Venture Logo"
                className="w-full h-full p-1 object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                Zero Fund Venture
              </span>
              <span className="text-xs text-slate-500 hidden sm:block">
                Equity Collaboration Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              href="#how-it-works"
              className="px-4 py-2 text-sm lg:text-base text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all font-medium"
            >
              How it Works
            </a>
            <a
              href="#trust"
              className="px-4 py-2 text-sm lg:text-base text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all font-medium"
            >
              Trust & Safety
            </a>

            <div className="ml-2 lg:ml-4 flex items-center gap-3">
              {userType ? (
                <button
                  onClick={() => {
                    window.location.href =
                      userType === "developer"
                        ? "/developer-dashboard"
                        : "/entrepreneur-dashboard";
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm lg:text-base group"
                  title={
                    userType === "developer"
                      ? "Developer Dashboard"
                      : "Entrepreneur Dashboard"
                  }
                >
                  <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline">Dashboard</span>
                  <span className="lg:hidden">
                    {userType === "developer" ? "Dev" : "Ent"}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="flex items-center gap-2 px-4 py-2 
             bg-gradient-to-r from-slate-700 to-slate-900 
             text-white rounded-lg 
             hover:shadow-lg transition-all 
             font-medium text-sm lg:text-base group"
                  >
                    <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden lg:inline">Sign In</span>
                    <span className="lg:hidden">Login</span>
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 animate-in slide-in-from-top duration-200">
            <nav className="space-y-1">
              <a
                href="#how-it-works"
                className="block px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a
                href="#trust"
                className="block px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trust & Safety
              </a>
              <a
                href="#features"
                className="block px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 px-2">
              {userType ? (
                <button
                  onClick={() => {
                    window.location.href =
                      userType === "developer"
                        ? "/developer-dashboard"
                        : "/entrepreneur-dashboard";
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>
                    {userType === "developer"
                      ? "Developer Dashboard"
                      : "Entrepreneur Dashboard"}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      window.location.href = "/login";
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all font-medium"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = "/signup";
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    <span>Get Started</span>
                    <span>→</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
