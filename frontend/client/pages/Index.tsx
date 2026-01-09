import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  Code,
  Lightbulb,
  Shield,
  Globe,
  Star,
  TrendingUp,
  Zap,
  Award,
  Heart,
  Target,
  CheckCircle,
  Lock,
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  Sparkles,
  Rocket,
} from "lucide-react";

const HERO_QUOTES = [
  {
    text: "From Idea To Execution",
    subtitle: "Transform your vision into reality",
    gradient: "from-navy to-skyblue",
    accentColor: "text-skyblue",
  },
  {
    text: "Now You Don't Need Money To Launch Your Startup",
    subtitle: "Build with equity, not capital",
    gradient: "from-green-600 to-emerald-500",
    accentColor: "text-green-500",
  },
  {
    text: "Skills Are The New Currency",
    subtitle: "Trade talent for ownership",
    gradient: "from-purple-600 to-violet-500",
    accentColor: "text-purple-500",
  },
  {
    text: "Code Your Way To Co-Ownership",
    subtitle: "Every line of code earns equity",
    gradient: "from-orange-600 to-amber-500",
    accentColor: "text-orange-500",
  },
];

const TRUST_CARDS = [
  {
    icon: Shield,
    title: "Secure Contracts",
    description: "Legal protection for all collaborations",
    color: "skyblue",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    title: "Verified Profiles",
    description: "KYC verified entrepreneurs and developers",
    color: "green-500",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Connect with talent worldwide",
    color: "purple-500",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Growth Focused",
    description: "Build scalable tech startups",
    color: "orange-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Zap,
    title: "Fast Matching",
    description: "AI-powered project recommendations",
    color: "yellow-500",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    icon: Award,
    title: "Success Proven",
    description: "Track record of successful launches",
    color: "blue-500",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Built by entrepreneurs for entrepreneurs",
    color: "red-500",
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    icon: Target,
    title: "Goal Oriented",
    description: "Milestone-based development approach",
    color: "indigo-500",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
];

export default function Index() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isQuoteAnimating, setIsQuoteAnimating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardAnimating, setIsCardAnimating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setIsQuoteAnimating(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % HERO_QUOTES.length);
        setIsQuoteAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    const cardInterval = setInterval(() => {
      setIsCardAnimating(true);
      setTimeout(() => {
        setCurrentCardIndex((prev) => (prev + 1) % TRUST_CARDS.length);
        setIsCardAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(cardInterval);
  }, []);

  const currentQuote = HERO_QUOTES[currentQuoteIndex];
  const currentCard = TRUST_CARDS[currentCardIndex];
  const CurrentIcon = currentCard.icon;

  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userType = userData?.userType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white scroll-smooth">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md fixed w-full top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
           <div className="flex items-center space-x-3">
  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br to-navy rounded-xl flex items-center justify-center shadow-sm">
    <img
      src="/zerofundlogo.svg"
      alt="Zero Fund Venture Logo"
      className="w-full h-full p-1 object-contain"
    />
  </div>

  <span className="text-base sm:text-lg md:text-xl font-bold text-navy truncate">
    Zero Fund Venture
  </span>
</div>


            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <a
                href="#how-it-works"
                className="text-sm lg:text-base text-gray-600 hover:text-navy transition-colors font-medium"
              >
                How it Works
              </a>
              <a
                href="#trust"
                className="text-sm lg:text-base text-gray-600 hover:text-navy transition-colors font-medium"
              >
                Trust & Safety
              </a>

              {userType ? (
                <div
                  onClick={() => {
                    window.location.href =
                      userType === "developer"
                        ? "/developer-dashboard"
                        : "/entrepreneur-dashboard";
                  }}
                  className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105"
                  title={
                    userType === "developer"
                      ? "Developer Dashboard"
                      : "Entrepreneur Dashboard"
                  }
                >
                  {userType === "developer" ? "D" : "E"}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-skyblue to-navy text-white px-4 lg:px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm lg:text-base transform hover:scale-105"
                >
                  Sign In
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
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
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2 animate-in slide-in-from-top duration-200">
              <a
                href="#how-it-works"
                className="block px-4 py-3 text-gray-700 hover:text-navy hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a
                href="#trust"
                className="block px-4 py-3 text-gray-700 hover:text-navy hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trust & Safety
              </a>

              <div className="px-2 pt-2 border-t border-gray-200 space-y-2">
                {userType ? (
                  <Link
                    to={
                      userType === "developer"
                        ? "/developer-dashboard"
                        : "/entrepreneur-dashboard"
                    }
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-skyblue to-navy text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-semibold">
                      {userType === "developer"
                        ? "Developer Dashboard"
                        : "Entrepreneur Dashboard"}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-skyblue to-navy text-white rounded-lg hover:shadow-lg transition-all shadow-md font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Hero Quote Cards */}
          <div className="mb-8 sm:mb-12 relative">
            <div className="min-h-[240px] sm:min-h-[280px] md:min-h-[320px] flex items-center justify-center">
              <div
                className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-100 transition-all duration-500 transform w-full ${
                  isQuoteAnimating
                    ? "opacity-0 scale-95 rotate-1"
                    : "opacity-100 scale-100 rotate-0"
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentQuote.gradient} opacity-5 rounded-2xl sm:rounded-3xl`}
                ></div>

                {/* Quote Content */}
                <div className="relative z-10 text-center">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-navy mb-3 sm:mb-4 leading-tight px-2">
                    "{currentQuote.text}"
                  </h1>
                  <p
                    className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold ${currentQuote.accentColor} mb-4 sm:mb-6 px-2`}
                  >
                    {currentQuote.subtitle}
                  </p>

                  {/* Quote indicator dots */}
                  <div className="flex justify-center space-x-2 sm:space-x-3">
                    {HERO_QUOTES.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-skyblue ${
                          index === currentQuoteIndex
                            ? `bg-gradient-to-r ${currentQuote.gradient} scale-125`
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        onClick={() => setCurrentQuoteIndex(index)}
                        aria-label={`Quote ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Decorative elements - hidden on small screens */}
                <div className="hidden sm:block absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-skyblue/20 to-purple-500/20 rounded-full"></div>
                <div className="hidden sm:block absolute bottom-4 right-4 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full"></div>
                <div className="hidden md:block absolute top-1/2 right-8 w-6 h-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Connect entrepreneurs with talented developers to build tech
            startups through equity collaboration, not upfront payments.
          </p>

          {/* Role Selection Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto mb-10 sm:mb-16">
            {/* Entrepreneur Card */}
            <Link
              to="/entrepreneur-signup"
              className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:scale-105 hover:-translate-y-2"
            >
              <div className="mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6 shadow-md">
                  <Lightbulb className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-2 sm:mb-3 group-hover:text-skyblue transition-colors">
                  I'm an Entrepreneur
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  I have a startup idea and need talented developers to bring it
                  to life
                </p>
              </div>
              <div className="flex items-center justify-center text-skyblue group-hover:translate-x-2 transition-transform duration-300">
                <span className="font-semibold mr-2 text-sm sm:text-base">
                  Get Started
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            {/* Developer Card */}
            <Link
              to="/developer-signup"
              className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:scale-105 hover:-translate-y-2"
            >
              <div className="mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-navy to-skyblue rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:-rotate-6 shadow-md">
                  <Code className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-navy mb-2 sm:mb-3 group-hover:text-skyblue transition-colors">
                  I'm a Developer
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  I want to work on exciting startups and earn equity for my
                  contributions
                </p>
              </div>
              <div className="flex items-center justify-center text-skyblue group-hover:translate-x-2 transition-transform duration-300">
                <span className="font-semibold mr-2 text-sm sm:text-base">
                  Get Started
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Animated Trust Indicator */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-skyblue/5 to-purple-500/5 opacity-50"></div>
            <div className="relative z-10">
              <div
                className={`transition-all duration-500 transform ${
                  isCardAnimating
                    ? "opacity-0 scale-90"
                    : "opacity-100 scale-100"
                }`}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${currentCard.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}
                >
                  <CurrentIcon className={`w-7 h-7 sm:w-8 sm:h-8 ${currentCard.iconColor}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-navy mb-2">
                  {currentCard.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {currentCard.description}
                </p>
              </div>

              {/* Enhanced Indicator dots */}
              <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-4 sm:mt-6">
                {TRUST_CARDS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                      index === currentCardIndex
                        ? `${currentCard.bgColor} w-6 sm:w-8 scale-125`
                        : "bg-gray-300 w-1.5 sm:w-2"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-3 sm:mb-4">
              How Zero Fund Venture Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              A simple, transparent process that protects both entrepreneurs and
              developers
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                number: "1",
                icon: Sparkles,
                title: "Post or Browse Ideas",
                description:
                  "Entrepreneurs post startup ideas. Developers browse and find projects that match their skills.",
              },
              {
                number: "2",
                icon: Users,
                title: "Collaborate & Contract",
                description:
                  "Chat, negotiate terms, and auto-generate legal contracts with built-in equity agreements.",
              },
              {
                number: "3",
                icon: Rocket,
                title: "Build & Earn",
                description:
                  "Track contributions, complete milestones, and earn equity in the next big startup.",
              },
            ].map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className="text-center group bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:-translate-y-2"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-skyblue/10 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-skyblue/20 transition-all duration-300 group-hover:scale-110 shadow-md">
                    <span className="text-xl sm:text-2xl font-bold text-skyblue">
                      {step.number}
                    </span>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <StepIcon className="w-8 h-8 sm:w-10 sm:h-10 text-skyblue mx-auto" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-navy mb-2 sm:mb-3 group-hover:text-skyblue transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4 sm:mb-6">
              Built on Trust
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Our platform creates a secure ecosystem where innovation thrives,
              partnerships flourish, and every collaboration contributes to
              positive economic and technological impact
            </p>
          </div>

          {/* Security & Trust Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-16">
            {/* Legal Protection */}
            <div className="group bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-skyblue/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-skyblue/20 transition-colors duration-300 group-hover:scale-110 shadow-md">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-skyblue" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy mb-3 sm:mb-4 group-hover:text-skyblue transition-colors">
                Legal Protection
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Auto-generated smart contracts with comprehensive IP protection,
                clear equity terms, and built-in dispute resolution mechanisms.
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Legally binding contracts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>IP ownership clarity</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Dispute mediation</span>
                </li>
              </ul>
            </div>

            {/* Verified Identity */}
            <div className="group bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-500/30 transform hover:-translate-y-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-200 transition-colors duration-300 group-hover:scale-110 shadow-md">
                <Star className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy mb-3 sm:mb-4 group-hover:text-green-600 transition-colors">
                Verified Identity
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Multi-level verification including KYC compliance, portfolio
                validation, and skill assessment to ensure authentic, qualified
                participants.
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>KYC verification</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Portfolio review</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Skill validation</span>
                </li>
              </ul>
            </div>

            {/* Secure Platform */}
            <div className="group bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-500/30 transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110 shadow-md">
                <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy mb-3 sm:mb-4 group-hover:text-purple-600 transition-colors">
                Secure Platform
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Enterprise-grade security with end-to-end encryption, secure
                data storage, and regular security audits to protect sensitive
                information.
              </p>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>256-bit encryption</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Secure data storage</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Regular audits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-skyblue rounded-lg flex items-center justify-center shadow-md">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">
                Zero Fund Venture
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-300 text-center sm:text-right">
              © 2024 Zero Fund Venture. Building the future of startup
              collaboration.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
