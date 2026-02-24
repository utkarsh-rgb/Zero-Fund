import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function IndexHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userType = userData?.userType;

  return (
    <header className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
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
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="relative px-3 py-2 rounded-3xl text-[15px] text-gray-900 transition-all
             hover:bg-black hover:text-white"
            >
              Features
            </a>

            <a
              href="#trust"
              className="relative px-3 py-2 rounded-3xl text-[15px] text-gray-900 transition-all
             hover:bg-black hover:text-white"
            >
              Trust & Safety
            </a>
            <a
              href="#how-it-works"
              className="relative px-3 py-2 rounded-3xl text-[15px] text-gray-900 transition-all
             hover:bg-black hover:text-white"
            >
              Contact Us
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {userType ? (
              <button
                onClick={() => {
                  window.location.href =
                    userType === "developer"
                      ? "/developer-dashboard"
                      : "/entrepreneur-dashboard";
                }}
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium text-sm"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-900"
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
          <div className="md:hidden border-t border-gray-100 py-4 bg-white">
            <nav className="space-y-1">
              <a
                href="#how-it-works"
                className="block px-4 py-3 text-gray-900 hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#trust"
                className="block px-4 py-3 text-gray-900 hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Career
              </a>
              <a
                href="#about"
                className="block px-4 py-3 text-gray-900 hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact us
              </a>
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-100 px-2 space-y-2">
              {userType ? (
                <button
                  onClick={() => {
                    window.location.href =
                      userType === "developer"
                        ? "/developer-dashboard"
                        : "/entrepreneur-dashboard";
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      window.location.href = "/login";
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold"
                  >
                    Sign in
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
