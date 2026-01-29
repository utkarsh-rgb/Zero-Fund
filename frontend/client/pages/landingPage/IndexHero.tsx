import { useState, useEffect } from "react";

export default function IndexHero() {

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount/refresh
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-4 relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
  {/* Main Content Container */}
  <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex flex-col items-center justify-center px-6 md:px-12">

    {/* Animated Background Orbs */}
    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-[120px] opacity-20 animate-float" />
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-[120px] opacity-20 animate-float-delayed" />

    {/* Headline */}
    <div
      className={` max-w-5xl mx-auto text-center mb-6 md:mb-8 transition-all duration-1000 delay-200 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <h1 className=" text-4xl pt-6 sm:pt-2 sm:text-6xl md:text-7xl lg:text-[70px] font-bold text-black leading-[1.1] mb-4">
        Build startups together
      </h1>

      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600 tracking-wide">
        No capital. Just <span className="text-black font-semibold">equity</span>.
      </h3>
    </div>

    {/* Description */}
    <p
      className={`mt-4 md:mt-6 text-center text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-10 md:mb-14 leading-relaxed transition-all duration-1000 delay-400 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      Zero Fund Venture is the equity collaboration platform for modern startups.
      Connect, contract, and build together – no upfront capital required.
    </p>

    {/* CTA */}
    <div
      className={`max-w-xl mx-auto mt-4 md:mt-6 mb-10 md:mb-14 transition-all duration-1000 delay-600 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <button
        type="button"
        onClick={() => (window.location.href = "/login")}
        className="px-10 py-4 bg-black text-white rounded-lg text-lg font-medium
                   hover:bg-gray-900 transition-all hover:scale-105 active:scale-95"
      >
        Join Us
      </button>
    </div>

    {/* Social Proof */}
    <div
      className={`mx-4 mt-2 md:mt-4 flex items-center justify-center gap-3 mb-12 md:mb-16 transition-all duration-1000 delay-800 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex -space-x-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white animate-bounce-slow" />
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white animate-bounce-slow animation-delay-100" />
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 border-2 border-white animate-bounce-slow animation-delay-200" />
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white animate-bounce-slow animation-delay-300" />
      </div>

      <span className="text-sm font-medium text-gray-900">
        1000+ already joined
      </span>
    </div>
  </div>
</section>

  );
}
