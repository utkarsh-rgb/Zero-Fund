import { useState, useEffect, useRef } from "react";
import demoVideo from "/demo.mp4";

/* ─── PREMIUM HERO — ENHANCED RESPONSIVE + LIGHT THEME ─── */
export default function IndexHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setShowTutorial(true);
  };

  const resumeVideo = () => {
    if (!videoRef.current) return;
    setShowTutorial(false);
    videoRef.current.play();
  };

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-blue-50/30 text-gray-900 overflow-hidden flex items-center pt-12 lg:pt-0">
      {/* Enhanced Premium Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1e40af 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Animated Gradient Glow Accents */}
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse"
        style={{ animationDuration: '4s' }} />
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-gradient-to-tl from-purple-100 to-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"
        style={{ animationDuration: '6s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 xl:gap-20 items-center">

          {/* ───── LEFT CONTENT ───── */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8">

            {/* Headline */}
            <div
              className={`transition-all duration-700 delay-100 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                Build startups{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 py-3 to-indigo-600 inline-block animate-gradient">
                  together
                </span>
              </h1>
            </div>

            {/* Animated Divider */}
            <div
              className={`w-16 sm:w-20 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700 delay-200 ${isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                }`}
              style={{ transformOrigin: 'left' }}
            />

            {/* Subtext */}
            <div
              className={`transition-all duration-700 delay-200 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              <p className="max-w-xl text-lg sm:text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
                Because great ideas shouldn't die due to lack of {" "}
                <span className="text-gray-900 font-bold relative">
                  Money
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-200/50 -z-10"></span>
                </span>
                .
              </p>
            </div>

            {/* Description */}
            <p
              className={`max-w-xl text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed transition-all duration-700 delay-300 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              Zero Fund Venture brings founders and developers together to create startups driven by skills, effort, and shared ownership—not funding
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-700 delay-400 ${isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              <button
                onClick={() => (window.location.href = "/login")}
                className="group relative px-6 py-2.5 text-xs sm:px-8 sm:py-3 sm:text-sm md:px-10 md:py-3.5 lg:px-12 lg:py-4 lg:text-base bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative z-10">Start Building</span>
              </button>
            </div>

           </div>

          {/* ───── RIGHT VIDEO ───── */}
          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">

            {/* Enhanced Floating Shadow with Animation */}
            <div className="absolute inset-0 translate-y-8 sm:translate-y-10 scale-95 bg-gradient-to-br from-blue-200 to-indigo-200 blur-3xl opacity-40 rounded-3xl animate-pulse"
              style={{ animationDuration: '3s' }} />

            <div
              className={`relative w-full max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden border-2 bg-black shadow-2xl hover:shadow-3xl transition-all duration-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              style={{ transitionDelay: '600ms' }}
            >
              {/* Subtle border glow effect */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <video
                ref={videoRef}
                src={demoVideo} 
                autoPlay
                muted
                loop
                playsInline
                onClick={handleVideoClick}
                className="w-full h-full object-cover cursor-pointer relative z-10"
              />

              {!showTutorial && (
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 bg-black/70 text-white text-[10px] sm:text-xs md:text-sm px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 rounded-lg backdrop-blur-md border border-white/10 flex items-center gap-1.5 sm:gap-2 hover:bg-black/80 transition-colors cursor-pointer shadow-lg">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  <span className="hidden sm:inline">Click video to see tutorial</span>
                  <span className="sm:hidden">Tap for tutorial</span>
                </div>
              )}

              {showTutorial && (
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 to-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 sm:p-6 md:p-10 text-center">
                  <div className="mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    How This Demo Works
                  </h3>

                  <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-md mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                    This demo shows how founders connect, create equity contracts,
                    and start building together without upfront capital.
                  </p>

                  <button
                    onClick={resumeVideo}
                    className="px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 bg-white text-black rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Resume Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}