import { useState, useEffect } from "react";

export default function IndexHero() {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount/refresh
    setIsVisible(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log("Email submitted:", email);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Main Content Container with border shadow */}
      <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex flex-col items-center justify-center px-6 md:px-12">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-[120px] opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-[120px] opacity-20 animate-float-delayed"></div>

        {/* Main Headline with fade-in animation */}
        <div
          className={`max-w-5xl mx-auto text-center transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl pt-6 sm:pt-2 sm:text-6xl md:text-7xl lg:text-[70px] font-bold text-black leading-[1.1] mb-4">
            Build startups together
          </h1>

          <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600 tracking-wide">
            No capital. Just equity.
          </h3>
        </div>

        {/* Description with delayed fade-in */}
        <p
          className={`text-center text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          Zero Fund Venture is the equity collaboration platform for modern
          startups. Connect, contract, and build together – no upfront capital
          required.
        </p>

        {/* Email Signup Form with Glow and scale animation */}
        <div
          className={`max-w-xl mx-auto mb-12 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <form onSubmit={handleSubmit} className="relative group">
            {/* Glowing background effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>

            {/* Form container */}
            <div>
              <button
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="px-8 py-3 bg-black text-white rounded-lg "
              >
                Join Us
              </button>
            </div>
          </form>
        </div>

        {/* Social Proof with staggered animation */}
        <div
          className={`flex items-center justify-center gap-3 mb-16 transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex -space-x-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white hover:scale-110 transition-transform animate-bounce-slow"></div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white hover:scale-110 transition-transform animate-bounce-slow animation-delay-100"></div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 border-2 border-white hover:scale-110 transition-transform animate-bounce-slow animation-delay-200"></div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white hover:scale-110 transition-transform animate-bounce-slow animation-delay-300"></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            1000+ already joined
          </span>
        </div>

        {/* Logo Showcase with fade-in */}
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
            <div className="flex items-center gap-2 hover:opacity-70 transition-all duration-300 hover:scale-110">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span className="text-gray-500 font-semibold text-base">
                prismic
              </span>
            </div>
            <div className="flex items-center gap-2 hover:opacity-70 transition-all duration-300 hover:scale-110">
              <span className="text-gray-500 font-semibold text-base">
                zendesk
              </span>
            </div>
            <div className="flex items-center gap-2 hover:opacity-70 transition-all duration-300 hover:scale-110">
              <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
              <span className="text-gray-500 font-semibold text-base">
                Jira Software
              </span>
            </div>
            <div className="flex items-center gap-2 hover:opacity-70 transition-all duration-300 hover:scale-110">
              <span className="text-gray-500 font-semibold text-base">
                HubSpot
              </span>
            </div>
            <div className="flex items-center gap-2 hover:opacity-70 transition-all duration-300 hover:scale-110">
              <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
              <span className="text-gray-500 font-semibold text-base">
                Dropbox
              </span>
            </div>
            <div className="flex items-center gap-2 hover:opacity-70 transition-all duration-300 hover:scale-110">
              <span className="text-gray-500 font-semibold text-base">
                hotjar
              </span>
            </div>
            <div className="flex items-center gap-2 hover:opacity-70 transition-all duration-300 hover:scale-110">
              <span className="text-gray-500 font-semibold text-base">
                dorik
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style suppressHydrationWarning>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(10px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .delay-200 {
          transition-delay: 0.2s;
        }

        .delay-400 {
          transition-delay: 0.4s;
        }

        .delay-600 {
          transition-delay: 0.6s;
        }

        .delay-800 {
          transition-delay: 0.8s;
        }

        .delay-1000 {
          transition-delay: 1s;
        }
      `}</style>
    </section>
  );
}
