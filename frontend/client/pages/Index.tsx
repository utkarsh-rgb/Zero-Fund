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
  },
  {
    icon: Users,
    title: "Verified Profiles",
    description: "KYC verified entrepreneurs and developers",
    color: "green-500",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Connect with talent worldwide",
    color: "purple-500",
  },
  {
    icon: TrendingUp,
    title: "Growth Focused",
    description: "Build scalable tech startups",
    color: "orange-500",
  },
  {
    icon: Zap,
    title: "Fast Matching",
    description: "AI-powered project recommendations",
    color: "yellow-500",
  },
  {
    icon: Award,
    title: "Success Proven",
    description: "Track record of successful launches",
    color: "blue-500",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Built by entrepreneurs for entrepreneurs",
    color: "red-500",
  },
  {
    icon: Target,
    title: "Goal Oriented",
    description: "Milestone-based development approach",
    color: "indigo-500",
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
    <div className="min-h-screen bg-gradient-to-br from-white via-softgray to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-navy">Zero Fund Venture</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-navy transition-colors"
              >
                How it Works
              </a>
              <a
                href="#trust"
                className="text-gray-600 hover:text-navy transition-colors"
              >
                Trust & Safety
              </a>

              {userType ? (
                <div
                  onClick={() => {
                    window.location.href = userType === "developer" ? "/developer-dashboard" : "/entrepreneur-dashboard";
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-skyblue to-navy rounded-lg flex items-center justify-center text-white font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm ml-2"
                  title={userType === "developer" ? "Developer Dashboard" : "Entrepreneur Dashboard"}
                >
                  {userType === "developer" ? "D" : "E"}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-skyblue text-white px-6 py-2 rounded-lg hover:bg-navy transition-all duration-300 font-semibold transform hover:scale-105"
                >
                  Sign In
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
              <a
                href="#how-it-works"
                className="block px-4 py-2 text-gray-600 hover:text-navy hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a
                href="#trust"
                className="block px-4 py-2 text-gray-600 hover:text-navy hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trust & Safety
              </a>

              <div className="px-4 pt-3 border-t border-gray-200 space-y-3">
                {userType ? (
                  <Link
                    to={userType === "developer" ? "/developer-dashboard" : "/entrepreneur-dashboard"}
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-skyblue to-navy text-white rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-semibold">
                      {userType === "developer" ? "Developer Dashboard" : "Entrepreneur Dashboard"}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors shadow-sm font-semibold"
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Hero Quote Cards */}
          <div className="mb-12 relative">
            <div className="min-h-[280px] flex items-center justify-center">
              <div
                className={`relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 transition-all duration-500 transform max-w-4xl w-full ${
                  isQuoteAnimating
                    ? "opacity-0 scale-95 rotate-1"
                    : "opacity-100 scale-100 rotate-0"
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentQuote.gradient} opacity-5 rounded-3xl`}
                ></div>

                {/* Quote Content */}
                <div className="relative z-10 text-center">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-4 leading-tight">
                    "{currentQuote.text}"
                  </h1>
                  <p
                    className={`text-xl md:text-2xl font-semibold ${currentQuote.accentColor} mb-6`}
                  >
                    {currentQuote.subtitle}
                  </p>

                  {/* Quote indicator dots */}
                  <div className="flex justify-center space-x-3">
                    {HERO_QUOTES.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                          index === currentQuoteIndex
                            ? `bg-gradient-to-r ${currentQuote.gradient} scale-125`
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        onClick={() => setCurrentQuoteIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-skyblue/20 to-purple-500/20 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full"></div>
                <div className="absolute top-1/2 right-8 w-6 h-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect entrepreneurs with talented developers to build tech
            startups through equity collaboration, not upfront payments.
          </p>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
            {/* Entrepreneur Card */}
            <Link
              to="/entrepreneur-signup"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:scale-105 hover:-translate-y-2"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-skyblue to-navy rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-3 group-hover:text-skyblue transition-colors">
                  I'm an Entrepreneur
                </h3>
                <p className="text-gray-600 mb-6">
                  I have a startup idea and need talented developers to bring it
                  to life
                </p>
              </div>
              <div className="flex items-center justify-center text-skyblue group-hover:translate-x-2 transition-transform duration-300">
                <span className="font-semibold mr-2">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            </Link>

            {/* Developer Card */}
            <Link
              to="/developer-signup"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:scale-105 hover:-translate-y-2"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-navy to-skyblue rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:-rotate-6">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-3 group-hover:text-skyblue transition-colors">
                  I'm a Developer
                </h3>
                <p className="text-gray-600 mb-6">
                  I want to work on exciting startups and earn equity for my
                  contributions
                </p>
              </div>
              <div className="flex items-center justify-center text-skyblue group-hover:translate-x-2 transition-transform duration-300">
                <span className="font-semibold mr-2">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Animated Trust Indicator */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-skyblue/5 to-purple-500/5 opacity-50"></div>
            <div className="relative z-10">
              <div
                className={`transition-all duration-500 transform ${
                  isCardAnimating
                    ? "opacity-0 scale-90 rotate-12"
                    : "opacity-100 scale-100 rotate-0"
                }`}
              >
                <div
                  className={`w-16 h-16 bg-${currentCard.color}/10 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <CurrentIcon
                    className={`w-8 h-8 text-${currentCard.color}`}
                  />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">
                  {currentCard.title}
                </h3>
                <p className="text-gray-600">{currentCard.description}</p>
              </div>

              {/* Enhanced Indicator dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {TRUST_CARDS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === currentCardIndex
                        ? `bg-${currentCard.color} w-8 scale-125`
                        : "bg-gray-300 w-2 hover:w-4"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy mb-4">
              How Zero Fund Venture Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, transparent process that protects both entrepreneurs and
              developers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Post or Browse Ideas",
                description:
                  "Entrepreneurs post startup ideas. Developers browse and find projects that match their skills.",
              },
              {
                number: "2",
                title: "Collaborate & Contract",
                description:
                  "Chat, negotiate terms, and auto-generate legal contracts with built-in equity agreements.",
              },
              {
                number: "3",
                title: "Build & Earn",
                description:
                  "Track contributions, complete milestones, and earn equity in the next big startup.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-skyblue/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-skyblue/20 transition-all duration-300 group-hover:scale-110">
                  <span className="text-2xl font-bold text-skyblue">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-skyblue transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-navy mb-6">
              Built on Trust
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform creates a secure ecosystem where innovation thrives,
              partnerships flourish, and every collaboration contributes to
              positive economic and technological impact
            </p>
          </div>

          {/* Security & Trust Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Legal Protection */}
            <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-skyblue/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-skyblue/20 transition-colors duration-300 group-hover:scale-110">
                <Shield className="w-8 h-8 text-skyblue" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-skyblue transition-colors">
                Legal Protection
              </h3>
              <p className="text-gray-600 mb-4">
                Auto-generated smart contracts with comprehensive IP protection,
                clear equity terms, and built-in dispute resolution mechanisms.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Legally binding contracts
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  IP ownership clarity
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Dispute mediation
                </li>
              </ul>
            </div>

            {/* Verified Identity */}
            <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300 group-hover:scale-110">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-green-600 transition-colors">
                Verified Identity
              </h3>
              <p className="text-gray-600 mb-4">
                Multi-level verification including KYC compliance, portfolio
                validation, and skill assessment to ensure authentic, qualified
                participants.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  KYC verification
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Portfolio review
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Skill validation
                </li>
              </ul>
            </div>

            {/* Secure Platform */}
            <div className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-skyblue/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-purple-600 transition-colors">
                Secure Platform
              </h3>
              <p className="text-gray-600 mb-4">
                Enterprise-grade security with end-to-end encryption, secure
                data storage, and regular security audits to protect sensitive
                information.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  256-bit encryption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Secure data storage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Regular audits
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-skyblue rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Zero Fund Venture</span>
            </div>
            <div className="text-sm text-gray-300">
              © 2024 Zero Fund Venture. Building the future of startup
              collaboration.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
