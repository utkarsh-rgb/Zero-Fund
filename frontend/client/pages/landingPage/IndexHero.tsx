import { useState, useEffect } from "react";

export default function IndexHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Main Content Container - pure white, no gradient */}
      <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex flex-col items-center justify-center px-6 md:px-12">

        <div
          className={`max-w-3xl mx-auto text-center mb-4 md:mb-6 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 leading-tight tracking-tight">
            Build startups together
          </h1>

          <p className="mt-3 text-base sm:text-lg font-medium text-gray-500">
            No capital. Just <span className="text-gray-950">equity</span>.
          </p>
        </div>

        {/* Divider */}
        <div
          className={`w-10 h-px bg-gray-300 mx-auto mb-5 md:mb-7 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
        />

        {/* Description */}
        <p
          className={`text-center text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          Zero Fund Venture is the equity collaboration platform for modern
          startups. Connect, contract, and build together — no upfront capital
          required.
        </p>

        {/* CTA Button */}
        <div
          className={`transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="px-8 py-2.5 bg-gray-950 text-white rounded-md text-sm font-medium
                       hover:bg-gray-800 transition-colors duration-200"
          >
            Join Us
          </button>
        </div>

        {/* Social Proof */}
        <div
          className={`mt-10 md:mt-12 flex items-center justify-center gap-3 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          {/* Avatar Stack - solid flat colors, no gradients */}
          <div className="flex -space-x-2.5">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt=""
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://i.pravatar.cc/150?img=44"
              alt=""
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <img
              src="https://i.pravatar.cc/150?img=49"
              alt=""
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">+97</span>
            </div>
          </div>

          {/* Divider dot */}
          <span className="w-1 h-1 rounded-full bg-gray-300" />

          <span className="text-xs font-medium text-gray-500">
            1,000+ founders already joined
          </span>
        </div>
      </div>
    </section>
  );
}