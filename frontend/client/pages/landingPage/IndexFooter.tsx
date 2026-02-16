import { Linkedin, Twitter, Mail, Github } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://bd.zerofundventure.com" : "http://localhost:5000");

export default function IndexFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "exists">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    setStatus("loading");
    try {
      const res = await axios.post(`${API_BASE}/newsletter/subscribe`, { email: email.trim() });
      setStatus("success");
      setMessage(res.data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setStatus("exists");
        setMessage("You're already subscribed!");
      } else {
        setStatus("error");
        setMessage(err.response?.data?.message || "Failed to subscribe. Try again.");
      }
    }
  };
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br to-navy rounded-xl flex items-center justify-center shadow-sm">
              <img
                src="/zerofundlogo.svg"
                alt="Zero Fund Venture Logo"
                className="w-full h-full p-1 object-contain"
              />
            </div>
              <span className="text-lg font-semibold">Zero Fund Venture</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Empowering startups to build, collaborate, and succeed without
              traditional funding barriers.
            </p>
            <div className="flex justify-center md:justify-start space-x-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300"
              >
                <Twitter className="w-4 h-4 text-gray-700" />
              </a>
              <a
                href="https://www.linkedin.com/company/zerofundventure/"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300"
              >
                <Linkedin className="w-4 h-4 text-gray-700" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300"
              >
                <Github className="w-4 h-4 text-gray-700" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all duration-300"
              >
                <Mail className="w-4 h-4 text-gray-700" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-black mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                >
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-black mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-black mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get the latest updates on startup trends and collaboration tips.
            </p>
            <div className="flex flex-col space-y-2 max-w-xs mx-auto md:mx-0">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={handleSubscribe}
                disabled={status === "loading"}
                className="px-4 py-2.5 bg-black text-white hover:bg-gray-800 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
              {status !== "idle" && status !== "loading" && (
                <p className={`text-xs ${status === "success" ? "text-green-600" : status === "exists" ? "text-yellow-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              © 2026 Zero Fund Venture. Building the future of startup
              collaboration.
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-black transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-black transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-black transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}