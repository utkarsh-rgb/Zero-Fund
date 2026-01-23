
import { Linkedin, Twitter, Mail, Github, ArrowRight } from "lucide-react";
export default function(){
    return (
        <>
        
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-6 py-6 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <img
                    src="/zerofundlogo.svg"
                    alt="Zero Fund Venture Logo"
                    className="w-full h-full p-1.5 object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Zero Fund Venture</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Empowering startups to build, collaborate, and succeed without
                traditional funding barriers.
              </p>
              <div className="flex justify-center md:justify-start space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Features
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Pricing
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Case Studies
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Reviews
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      About
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Careers
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Blog
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      Contact
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest updates on startup trends and collaboration tips.
              </p>
              <div className="flex flex-col space-y-2 max-w-xs mx-auto md:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-400">
                © 2026 Zero Fund Venture. Building the future of startup
                collaboration.
              </div>
              <div className="flex space-x-6 text-sm">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
        </>
    )
}